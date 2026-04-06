import { map_dom } from "./dom.js";
import { create_word_list } from "./vocab.js";
import { replace_word_fragments } from "./replacer.js";
import { STORAGE_KEYS, get_storage } from "../storage.js";

function batch_text(text_list, batch_size) {
  let batches = [];

  for (let i = 0; i < text_list.length; i += batch_size) {
    batches.push(text_list.slice(i, i + batch_size));
  }

  return batches;
}

async function flood_text() {
  const batch_size = 50;

  let nodes = map_dom();
  let text_list = [];
  let node_info = [];
  let batches = [];

  const storage = await get_storage();
  const proba = storage[STORAGE_KEYS.PERCENTAGE_SLIDER] / 100;
  const scope = storage[STORAGE_KEYS.TRANSLATION_SCOPE];

  if (scope == "word") [text_list, node_info] = create_word_list(nodes, proba);
  else if (scope == "sentence")
    // TODO
    console.log("NOT IMPLEMENTED");

  batches = batch_text(text_list, batch_size);

  let promise = browser.runtime.sendMessage({
    batches: batches,
  });

  // handle response
  promise.then(
    (response) => {
      let translated_text_list = response["translated_text_list"];

      if (scope == "word")
        replace_word_fragments(translated_text_list, node_info);
      else if (scope == "sentence")
        // TODO
        console.log("NOT IMPLEMENTED");
    },
    (error) => {
      console.log("Error: " + error);
    },
  );
}

flood_text();
