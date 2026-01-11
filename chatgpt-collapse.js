// ==UserScript==
// @name         ChatGPT Ultra Lightweight Anti-Freeze for Long Chats
// @namespace    chatgpt-collapse
// @version      1.2
// @description  Freeze old ChatGPT messages into lightweight placeholders; dereference for max CPU/memory efficiency.
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // ---------- CONFIG ----------
  const VISIBLE_KEEP = 4; // number of latest messages to keep in DOM

  // ---------- STATE ----------
  let hiddenStore = []; // {content, metadata, placeholderElement}
  let observer = null;
  let debounceTimer = null;
  let enabled = true;

  // ---------- HELPERS ----------
  function pickFeedRoot() {
    return document.querySelector('[role="feed"]') || document.body;
  }

  function getTurns() {
    const selectors = [
      '[data-testid^="conversation-turn"]',
      'article[data-turn-id]',
      'article[data-turn]',
      'div[data-testid^="conversation-turn"]',
      'li[data-testid^="conversation-turn"]'
    ];
    try { return Array.from((pickFeedRoot() || document).querySelectorAll(selectors.join(','))); }
    catch (e) { return []; }
  }

  // ---------- DETACH & DEREFERENCE ----------
  function detachOldTurnsIfNeeded() {
    if (!enabled) return;
    const turns = getTurns();
    if (turns.length <= VISIBLE_KEEP) return;

    const needDetach = turns.length - VISIBLE_KEEP;
    for (let i = 0; i < needDetach; i++) {
      const el = turns[i];
      if (!el || !el.parentNode) continue;

      // create minimal placeholder
      const ph = document.createElement('div');
      ph.textContent = '[collapsed turn]';
      ph.style.cursor = 'pointer';
      ph.style.opacity = '0.6';
      ph.style.fontStyle = 'italic';
      ph.dataset.collapsedIndex = hiddenStore.length;
      ph.addEventListener('click', () => restoreTurn(ph.dataset.collapsedIndex));

      // store minimal info and metadata
      hiddenStore.push({
        content: el.innerHTML,
        metadata: {
          turnId: el.dataset.turnId || '',
          user: el.dataset.user || '',
          time: el.dataset.time || ''
        },
        placeholderElement: ph
      });

      // ---------- DEREFERENCE ----------
      // remove all listeners by cloning node (cheap way)
      const cleanEl = el.cloneNode(true);
      cleanEl.innerHTML = ''; // clear content to release references
      // replace in DOM
      el.parentNode.replaceChild(ph, el);
    }
  }

  // ---------- RESTORE ----------
  function restoreTurn(index) {
    const item = hiddenStore[index];
    if (!item) return;
    const node = document.createElement('div');
    node.innerHTML = item.content;
    node.dataset.turnId = item.metadata.turnId;
    const ph = item.placeholderElement;
    if (ph && ph.parentNode) {
      ph.parentNode.replaceChild(node, ph);
    }
    // dereference
    hiddenStore[index] = null;
  }

  // ---------- OBSERVER ----------
  function scheduleDetach() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      detachOldTurnsIfNeeded();
    }, 150);
  }

  function attachObserver() {
    const root = pickFeedRoot();
    if (!root) return;
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => scheduleDetach());
    observer.observe(root, { childList: true, subtree: true });
  }

  // ---------- UI TOGGLE ----------
  function ensureButton() {
    if (document.getElementById('detach-toggle-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'detach-toggle-btn';
    btn.textContent = enabled ? 'Collapse: ON' : 'Collapse: OFF';
    Object.assign(btn.style, {
      position: 'fixed', right: '10px', bottom: '10px', zIndex: 2147483647,
      padding: '6px 10px', borderRadius: '8px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer'
    });
    btn.addEventListener('click', () => {
      enabled = !enabled;
      btn.textContent = enabled ? 'Detach: ON' : 'Detach: OFF';
      if (!enabled) {
        // restore all
        hiddenStore.forEach((item, i) => { if (item) restoreTurn(i); });
        hiddenStore = [];
      } else {
        scheduleDetach();
      }
    });
    document.body.appendChild(btn);
  }

  // ---------- BOOT ----------
  function boot() {
    ensureButton();
    attachObserver();
    setTimeout(scheduleDetach, 500); // initial detach attempt
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') boot();
  else window.addEventListener('DOMContentLoaded', boot, { once: true });

})();
