import { STORAGE_KEYS, get_storage, set_storage } from "./storage.js";

const percentageSlider = document.getElementById("percentage-slider");
const percentageDisplay = document.getElementById("percentage-display");
const translationScope = document.getElementById("translation-scope");
const targetLang = document.getElementById("target-lang");
const translationMethod = document.getElementById("translation-method");
const vocabList = document.getElementById("vocab-list");
const clearVocabBtn = document.getElementById("clear-vocab");

// Load from storage, when clicked
const storage = await get_storage();
percentageSlider.value = storage[STORAGE_KEYS.PERCENTAGE_SLIDER];
percentageDisplay.textContent = `${percentageSlider.value}%`;
translationScope.value = storage[STORAGE_KEYS.TRANSLATION_SCOPE];
targetLang.value = storage[STORAGE_KEYS.TARGET_LANG];
translationMethod.value = storage[STORAGE_KEYS.TRANSLATION_METHOD];

function updateUI(textList) {
  vocabList.innerHTML = "";

  if (textList.length === 0) {
    vocabList.appendChild(document.createTextNode("No words saved yet!"));
  } else {
    textList.forEach((item) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = `${item.original} - ${item.translation}`;

      const delButton = document.createElement("button");
      delButton.textContent = "X";
      delButton.addEventListener("click", () => {
        const index = textList.indexOf(item);
        if (index > -1) {
          textList.splice(index, 1);
          browser.storage.local.set({ vocabList: textList });
          li.remove();
          updateUI(textList);
        }
      });

      li.appendChild(span);
      li.appendChild(delButton);
      vocabList.appendChild(li);
    });
  }
}

// Load vocab list
document.addEventListener("DOMContentLoaded", async () => {
  const storage = await get_storage();
  const textList = storage[STORAGE_KEYS.VOCAB_LIST];
  updateUI(textList);
});

// Listeners
percentageSlider.addEventListener("input", () => {
  percentageDisplay.textContent = `${percentageSlider.value}%`;
  set_storage(STORAGE_KEYS.PERCENTAGE_SLIDER, percentageSlider.value);
});
translationScope.addEventListener("change", () => {
  set_storage(STORAGE_KEYS.TRANSLATION_SCOPE, translationScope.value);
});
targetLang.addEventListener("change", () => {
  set_storage(STORAGE_KEYS.TARGET_LANG, targetLang.value);
});
translationMethod.addEventListener("change", () => {
  set_storage(STORAGE_KEYS.TRANSLATION_METHOD, translationMethod.value);
});
clearVocabBtn.addEventListener("click", () => {
  set_storage(STORAGE_KEYS.VOCAB_LIST, []);
  vocabList.innerHTML = "";

  updateUI([]);
});
