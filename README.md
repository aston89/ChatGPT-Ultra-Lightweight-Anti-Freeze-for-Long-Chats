# ChatGPT Ultra Lightweight Anti-Freeze for Long Chats

## Overview

This UserScript is designed for **extremely long ChatGPT conversations**, where standard chat interfaces start to lag, freeze, or consume excessive memory.  

Key benefits:

- Keeps only the last `N` messages in the active DOM.
- Freezes all previous messages in **ultra-lightweight placeholders**.
- Allows users to **restore individual messages on demand** by clicking.
- Minimizes **CPU and memory usage**, making chats with hundreds of messages smooth and responsive.

Ideal for **creative writing, long roleplay sessions, or extended chat threads**.

---

## Features

- **Ultra-lightweight message freezing:** Old turns are stored as placeholders with minimal content.
- **Click-to-restore:** Each placeholder can be clicked to restore the full message.
- **Customizable retention:** Control how many messages remain visible in the DOM.
- **Extreme scalability:** Handles 200+ messages without slowing down the browser.
- **Safe and minimal:** Avoids interfering with ChatGPT Web updates or internal scripts.

---

## Comparative Note

**Old Method ([Conservative Anti-Freeze](https://github.com/aston89/ChatGPT-Conservative-Anti-Freeze-for-Long-Chats)):**

- Detached messages were automatically restored when scrolling or reaching certain positions.
- Introduced additional DOM complexity and CPU/memory overhead.
- Could still lag with very long conversations (100+ messages).

**New Ultra-Lightweight Method (Freeze + Click Restore):**

- Detached messages remain collapsed until **explicitly clicked**.
- Minimizes memory usage and DOM interactions.
- Simpler, faster, and ideal for **extremely long conversations (200+ messages)**.

This approach prioritizes **performance and responsiveness** over automatic restoration.

---

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).  
2. Create a new script in your userscript manager.  
3. Copy and paste [the script from this repository](https://github.com/aston89/ChatGPT-Ultra-Lightweight-Anti-Freeze-for-Long-Chats/blob/main/chatgpt-collapse.js).  
4. Save and enable the script.  
5. Open ChatGPT Web and start chatting, old messages will automatically collapse once the limit is exceeded.
6. If you are using Firefox, [check this parameter tweak !](https://github.com/aston89/ChatGPT-Conservative-Anti-Freeze-for-Long-Chats/blob/main/firefox-tweak.md)

---

## Configuration

Inside the script, you can adjust:

```javascript
const VISIBLE_KEEP = 4; // Number of latest messages to keep visible in DOM
