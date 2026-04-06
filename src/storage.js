export const STORAGE_KEYS = {
  PERCENTAGE_SLIDER: "percentageSliderValue",
  TRANSLATION_SCOPE: "translationScopeValue",
  TARGET_LANG: "targetLangValue",
  TRANSLATION_METHOD: "translationMethodValue",
  VOCAB_LIST: "vocabList",
};

export async function get_storage() {
  return await browser.storage.local.get({
    percentageSliderValue: "10",
    translationScopeValue: "word",
    targetLangValue: "es",
    translationMethodValue: "google",
    vocabList: [],
  });
}

export async function set_storage(key, value) {
  await browser.storage.local.set({ [key]: value });
}
