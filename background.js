import { GOOGLE_API_KEY } from "./config.js";

async function fetch_from_google(batch, target_lang) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      q: batch,
      target: target_lang,
    }),
  });
}

function process_from_google(response_json) {
  let translated_text_list = [];
  response_json["data"]["translations"].forEach((translation) => {
    translated_text_list.push(translation["translatedText"]);
  });
  return translated_text_list;
}

async function translate(request, sendResponse) {
  let batches = request["batches"];
  let translated_text_list = [];

  let settings = await browser.storage.local.get({
    targetLangValue: "es",
    translationMethodValue: "google",
  });
  let target_lang = settings.targetLangValue;
  let translation_method = settings.translationMethodValue;

  try {
    for (let i = 0; i < batches.length; i++) {
      switch (translation_method) {
        case "google":
          const response = await fetch_from_google(batches[i], target_lang);
          const response_json = await response.json();
          translated_text_list = [
            ...translated_text_list,
            ...process_from_google(response_json),
          ];
          break;
      }
    }
  } catch (error) {
    console.log(error);
    sendResponse({ translated_text_list: translated_text_list });
  }

  sendResponse({ translated_text_list: translated_text_list });
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  translate(request, sendResponse);
  return true;
});
