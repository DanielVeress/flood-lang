console.log("FloodLang script is active!");

const ignored_nodes = ["SCRIPT", "NOSCRIPT", "STYLE", "CITE"];
const treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
);

function get_picked_word_indices(text, proba = 0.5) {
  const words = text.split(" ");
  var picked_words_indices = [];
  for (let i = 0; i < words.length; i++) {
    if (Math.random() < proba) {
      picked_words_indices.push(i);
    }
  }
  return picked_words_indices;
}

function modify_words(text, indices) {
  const words = text.split(" ");
  var fragment = document.createDocumentFragment();

  for (let i = 0; i < words.length; i++) {
    if (indices.includes(i)) {
      const span = document.createElement("span");
      span.textContent = words[i];
      span.style.color = "red";
      fragment.appendChild(span);
    } else {
      fragment.appendChild(document.createTextNode(words[i]));
    }
    fragment.appendChild(document.createTextNode(" "));
  }
  return fragment;
}

function map_web_page() {
  console.log("Mapping the page has started!");

  let text_node_list = [];
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    const text = node.textContent;

    // not empty and doesn't have an ignored parent node
    if (
      text.trim().length != 0 &&
      !ignored_nodes.includes(node.parentElement.nodeName)
    ) {
      text_node_list.push(node);
    }
  }

  console.log("Mapping the page has ended!");
  return text_node_list;
}

function flood_text(text_node_list) {
  console.log("Flooding the text has started!");

  for (let i = 0; i < text_node_list.length; i++) {
    const text = text_node_list[i].textContent;
    let indices = get_picked_word_indices(text);
    let fragment = modify_words(text, indices);
    text_node_list[i].parentNode.replaceChild(fragment, text_node_list[i]);
  }

  console.log("Flooding the text has ended!");
}

const text_node_list = map_web_page();
flood_text(text_node_list);
