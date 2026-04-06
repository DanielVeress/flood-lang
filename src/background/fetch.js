import { GOOGLE_API_KEY } from "../../config.js";

export async function fetch_from_google(batch, target_lang) {
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

export function process_from_google(response_json) {
  let translated_text_list = [];
  response_json["data"]["translations"].forEach((translation) => {
    translated_text_list.push(translation["translatedText"]);
  });
  return translated_text_list;
}
