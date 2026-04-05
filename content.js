const ignored_nodes = ["SCRIPT", "NOSCRIPT", "STYLE", "CITE"];
const treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
);

function map_dom() {
  let node_list = [];

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    const text = node.textContent;

    const not_empty = text.trim().length != 0;
    const not_ignored = !ignored_nodes.includes(node.parentElement.nodeName);
    if (not_empty && not_ignored) {
      node_list.push(node);
    }
  }

  return node_list;
}

function create_word_list(node_list, proba) {
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

function batch_text(text_list, batch_size) {
  let batches = [];

  for (let i = 0; i < text_list.length; i += batch_size) {
    batches.push(text_list.slice(i, i + batch_size));
  }

  return batches;
}

function replace_word_fragments(translated_word_list, node_info) {
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
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(word));
      }
      fragment.appendChild(document.createTextNode(" "));
    });
    node.parentNode.replaceChild(fragment, node);
  });
}

function flood_text() {
  const type = "word";
  const proba = 0.1;
  const batch_size = 10;

  let nodes = map_dom();
  let text_list = [];
  let node_info = [];
  let batches = [];

  if (type == "word")
    [text_list, node_info] = create_word_list(nodes, proba);
  else if (type == "sentence")
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

      if (type == "word")
        replace_word_fragments(translated_text_list, node_info);
      else if (type == "sentence")
        // TODO
        console.log("NOT IMPLEMENTED");
    },
    (error) => {
      console.log("Error: " + error);
    },
  );
}

flood_text();
