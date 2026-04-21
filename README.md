# FloodLang

**by Dániel Veress**

FloodLang is a browser extension that helps you learn a new language by quietly flooding the websites you already visit with vocabulary from your target language. Instead of translating whole pages or drilling flashcards, it replaces a configurable percentage of words inline — so you pick up vocabulary in context, passively, while browsing normally.

> **Status:** Early prototype · v0.1.1 · Firefox & Chromium

---

## How it works

1. You set a replacement percentage (e.g. 20%) and a target language in the popup.
2. On every page load, FloodLang randomly samples that share of words from the page text.
3. Sampled words are sent to Google Translate and swapped in-place, highlighted in red.
4. Hovering a translated word shows the original and saves the pair to your personal vocab list.
5. Open the popup to review saved pairs or clear the list.

---

## Features

- **Configurable replacement rate** — slider from 0 to 100%
- **Per-word hover-reveal** — see the original word on hover
- **Vocab list** — saved word pairs persist across sessions
- **Clear all** — wipe the vocab list from the popup

---

## Planned Features

### Translation & Language

- **Sentence-scoped translation** — translate full sentences instead of isolated words, preserving grammar and context
- **LLM-based translation backend** — use a language model (e.g. Claude, GPT-4) as an alternative to Google Translate for more natural, context-aware output
- **Custom API key input** — let users enter their own Google Translate or LLM API key directly in the popup, removing the need for a local `config.js`
- **Expanded language support** — expose all Google Translate–supported languages in the dropdown

### Vocabulary & Learning

- **Anki export** — export saved vocab as an Anki-compatible `.apkg` or CSV deck for spaced-repetition study outside the browser
- **Spaced repetition** — prioritize words the user has seen fewer times or hasn't hovered over recently
- **Click to reveal original** — toggle a word back to its original inline, not just on hover
- **Word difficulty scoring** — track exposures per word and reduce its replacement probability once it's been seen enough times

### UI & Customization

- **Highlight styles** — underline, background color, tooltip bubbles, or a subtle dashed border as alternatives to red text
- **Per-site enable/disable** — whitelist or blacklist domains so the extension only runs where you want it
- **Floating vocab panel** — a small persistent overlay showing recent word pairs without opening the popup
- **Keyboard shortcut to toggle** — enable/disable replacement on the current page without touching the popup

### Technical

- **MutationObserver support** — handle SPAs and infinite-scroll pages where content loads after the initial render
- **Source language detection display** — show users what language was detected on the page
- **Offline / local model support** — integrate a small local translation model for use without an API key

---

## Installation

FloodLang currently requires a **Google Translate API key** and works in both **Firefox** and **Chromium-based browsers** (Chrome, Edge, Brave, etc.).

1. Clone or download this repository.
2. Install dependencies and build the content script bundle:
   ```sh
   npm install
   npm run build
   ```
3. Create `config.js` in the project root:
   ```js
   export const GOOGLE_API_KEY = "your-key-here";
   ```
4. Load the extension:
   - **Firefox:** `about:debugging` → This Firefox → Load Temporary Add-on → select `manifest.json`
   - **Chrome/Chromium:** `chrome://extensions` → Developer mode → Load unpacked → select the project root

---

## Project structure

```
manifest.json
config.js                  Google Translate API key (gitignored)
src/
  storage.js               Storage key constants + get/set helpers
  content/
    index.js               Orchestrates DOM scan, word selection, batching, replacement
    dom.js                 TreeWalker-based text node collector
    vocab.js               Word sampling + vocab save logic
    replacer.js            DOM mutation — wraps translated words in <span>
    content.css            Styles for translated word spans
  background/
    index.js               Service worker — receives messages, calls translation API
    fetch.js               Google Translate fetch + response parser
  popup/
    index.js               Popup JS — loads/saves settings, renders vocab list
    popup.html             Popup UI (vocab list + settings views)
    css/main.css           Popup styles
```
