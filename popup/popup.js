const toggleBtn = document.getElementById("toggle-view-btn");
const recentView = document.getElementById("recent-view");
const settingsView = document.getElementById("settings-view");
const percentageSlider = document.getElementById("percentage-slider");
const percentageDisplay = document.getElementById("percentage-display");
const translationScope = document.getElementById("translation-scope");
const targetLang = document.getElementById("target-lang");
const translationMethod = document.getElementById("translation-method");

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
