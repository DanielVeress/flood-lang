import { GOOGLE_API_KEY } from "./config.js";

const ACTIVE_ENGINE = "google";
const TARGET_LANG = "sv";

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

  for (let i = 0; i < batches.length; i++) {
    switch (ACTIVE_ENGINE) {
      case "google":
        const response = await fetch_from_google(batches[i], TARGET_LANG);
        const response_json = await response.json();
        translated_text_list = [
          ...translated_text_list,
          ...process_from_google(response_json),
        ];
        break;
    }
  }

  sendResponse({ translated_text_list: translated_text_list });
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  translate(request, sendResponse);
  return true;
});
