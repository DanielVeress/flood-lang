async function translate(request, sendResponse) {
  batches = request["batches"];
  translated_text_list = [];

  for (let i = 0; i < batches.length; i++) {
    const url = "https://api-free.deepl.com/v2/translate";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({}),
    });
    const batch = await response.json();
    batch.forEach((translated_text) => {
      translated_text_list.push(translated_text);
    });
  }
  sendResponse({ translated_text_list: translated_text_list });
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  translate(request, sendResponse);
  return true;
});
