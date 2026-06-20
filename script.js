function renderWordSelection({ title, words, selectCount, resultKey, guideText: guide }) {
  stepTitle.textContent = title;
  guideText.textContent = guide;
  wordArea.innerHTML = "";

  if (!Array.isArray(words) || words.length === 0) {
    wordArea.innerHTML = "<p>단어 목록을 불러오지 못했습니다. words.js를 확인해주세요.</p>";
    counter.textContent = "0 / " + selectCount;
    nextBtn.disabled = true;
    return;
  }

  const uniqueWords = [...new Set(words)];

  uniqueWords.forEach(function (word) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "word-btn";
    button.textContent = word;

    button.addEventListener("click", function () {
      const alreadySelected = currentSelection.includes(word);

      if (alreadySelected) {
        currentSelection = currentSelection.filter(function (item) {
          return item !== word;
        });

        button.classList.remove("selected");
        logDeselectedWord(word);
      } else {
        if (currentSelection.length >= selectCount) {
          return;
        }

        currentSelection.push(word);
        button.classList.add("selected");
      }

      updateCounter(selectCount);
    });

    wordArea.appendChild(button);
  });

  updateCounter(selectCount);

  prevBtn.disabled = currentStep === 0;
  nextBtn.disabled = true;

  if (currentStep === stepOrder.length - 1) {
    nextBtn.textContent = "결과 보기";
  } else {
    nextBtn.textContent = "다음";
  }

  nextBtn.onclick = function () {
    saveStepTime();

    answers[resultKey] = [...currentSelection];

    if (currentStep === stepOrder.length - 1) {
      renderResult();
    } else {
      currentStep += 1;
      renderStep();
    }
  };
}
