import { get_storage, set_storage, STORAGE_KEYS } from "../storage.js";

export function create_word_list(node_list, proba) {
  let word_list = [];
  let node_info = [];

  node_list.forEach((node) => {
    const tokens = node.textContent.split(/(\s+)/);

    tokens.forEach((token, idx) => {
      const isWordSlot = idx % 2 === 0;
      if (isWordSlot && token.length > 0 && Math.random() < proba) {
        word_list.push(token);
        node_info.push({ node, tokenIndex: idx, allTokens: tokens });
      }
    });
  });

  return [word_list, node_info];
}

export async function save_vocab(original_word, translated_word) {
  const newPair = { original_word, translated_word };
  const storage = await get_storage();
  const currentList = storage[STORAGE_KEYS.VOCAB_LIST];
  const isDuplicate = currentList.some(
    (item) => item.original_word === newPair.original_word,
  );
  if (!isDuplicate) {
    currentList.push(newPair);
    await set_storage(STORAGE_KEYS.VOCAB_LIST, currentList);
    console.log("Saved:", newPair);
  }
}
