function translate(words) {
  console.log(words);
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  translate(request);
  sendResponse("received");
});
