import { save_vocab } from "./vocab.js";

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
        span.classList.add("vocab-word");
        span.textContent = replacements.get(idx);
        span.dataset.original = word;
        span.title = word;
        span.addEventListener("mouseenter", () => {
          save_vocab(span.dataset.original, span.textContent);
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
