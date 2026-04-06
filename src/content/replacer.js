import { get_storage, set_storage, STORAGE_KEYS } from "../storage";
import { save_vocab } from "./vocab";

export function replace_word_fragments(translated_word_list, node_info) {
  const nodeMap = new Map();
  for (let i = 0; i < translated_word_list.length; i++) {
    const { node, wordIndex, allWords } = node_info[i];
    if (!nodeMap.has(node)) {
      nodeMap.set(node, { allWords, replacements: new Map() });
    }
    nodeMap.get(node).replacements.set(wordIndex, translated_word_list[i]);
  }

  nodeMap.forEach(({ allWords, replacements }, node) => {
    const fragment = document.createDocumentFragment();
    allWords.forEach((word, idx) => {
      if (replacements.has(idx)) {
        const span = document.createElement("span");
        span.textContent = replacements.get(idx);
        span.style.color = "red";
        span.dataset.original = word;
        span.title = word;
        span.addEventListener("mouseenter", async () => {
          const original_word = span.dataset.original;
          const translated_word = span.textContent;
          save_vocab(original_word, translated_word);
        });
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(word));
      }
      fragment.appendChild(document.createTextNode(" "));
    });
    node.parentNode.replaceChild(fragment, node);
  });
}
