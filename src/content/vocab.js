import { get_storage, set_storage, STORAGE_KEYS } from "../storage";

export function create_word_list(node_list, proba) {
  let word_list = [];
  let node_info = [];

  node_list.forEach((node) => {
    const words = node.textContent.split(" ");
    words.forEach((word, idx) => {
      if (Math.random() < proba) {
        word_list.push(word);
        node_info.push({ node, wordIndex: idx, allWords: words });
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
