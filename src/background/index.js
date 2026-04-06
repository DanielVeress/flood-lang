import { GOOGLE_API_KEY } from "../../config.js";
import { fetch_from_google, process_from_google } from "../background/fetch.js";
import { STORAGE_KEYS, get_storage } from "../storage.js";

async function translate(request, sendResponse) {
  let batches = request["batches"];
  let translated_text_list = [];

  let settings = await get_storage();
  let target_lang = settings[STORAGE_KEYS.TARGET_LANG];
  let translation_method = settings[STORAGE_KEYS.TRANSLATION_METHOD];

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
    return;
  }

  sendResponse({ translated_text_list: translated_text_list });
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  translate(request, sendResponse);
  return true;
});
