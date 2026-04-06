export function map_dom() {
  const ignored_nodes = ["SCRIPT", "NOSCRIPT", "STYLE", "CITE"];
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );
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
