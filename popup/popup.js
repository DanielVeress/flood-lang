const toggleBtn = document.getElementById("toggle-view-btn");
const recentView = document.getElementById("recent-view");
const settingsView = document.getElementById("settings-view");
const percentageSlider = document.getElementById("percentage-slider");
const percentageDisplay = document.getElementById("percentage-display");
const translationScope = document.getElementById("translation-scope");
const targetLang = document.getElementById("target-lang");
const translationMethod = document.getElementById("translation-method");
const vocabList = document.getElementById("vocab-list");
const clearVocabBtn = document.getElementById("clear-vocab");

// Load from storage
browser.storage.local
  .get({
    percentageSliderValue: "10",
    translationScopeValue: "word",
    targetLangValue: "es",
    translationMethodValue: "google",
  })
  .then((result) => {
    percentageSlider.value = result.percentageSliderValue;
    percentageDisplay.textContent = `${percentageSlider.value}%`;
    translationScope.value = result.translationScopeValue;
    targetLang.value = result.targetLangValue;
    translationMethod.value = result.translationMethodValue;
  });

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
  const data = await browser.storage.local.get({ vocabList: [] });
  const textList = data.vocabList;

  updateUI(textList);
});

// Listeners
toggleBtn.addEventListener("click", () => {
  recentView.classList.toggle("hidden");
  settingsView.classList.toggle("hidden");
});
percentageSlider.addEventListener("input", () => {
  percentageDisplay.textContent = `${percentageSlider.value}%`;
  browser.storage.local.set({ percentageSliderValue: percentageSlider.value });
});
translationScope.addEventListener("change", () => {
  browser.storage.local.set({ translationScopeValue: translationScope.value });
});
targetLang.addEventListener("change", () => {
  browser.storage.local.set({ targetLangValue: targetLang.value });
});
translationMethod.addEventListener("change", () => {
  browser.storage.local.set({
    translationMethodValue: translationMethod.value,
  });
});
clearVocabBtn.addEventListener("click", () => {
  browser.storage.local.set({ vocabList: [] });
  vocabList.innerHTML = "";

  updateUI([]);
});
