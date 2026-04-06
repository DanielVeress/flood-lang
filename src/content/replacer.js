import { save_vocab } from "./vocab.js";

export function replace_word_fragments(translated_word_list, node_info) {
  const nodeMap = new Map();
  for (let i = 0; i < translated_word_list.length; i++) {
    const { node, tokenIndex, allTokens } = node_info[i];
    if (!nodeMap.has(node)) {
      nodeMap.set(node, { allTokens, replacements: new Map() });
    }
    nodeMap.get(node).replacements.set(tokenIndex, translated_word_list[i]);
  }

  nodeMap.forEach(({ allTokens, replacements }, node) => {
    const fragment = document.createDocumentFragment();
    allTokens.forEach((token, idx) => {
      if (replacements.has(idx)) {
        const span = document.createElement("span");
        span.classList.add("vocab-word");
        span.textContent = replacements.get(idx);
        span.dataset.original = token;
        span.title = token;
        span.addEventListener("mouseenter", () => {
          save_vocab(span.dataset.original, span.textContent);
        });
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(token));
      }
    });
    node.parentNode.replaceChild(fragment, node);
  });
}
