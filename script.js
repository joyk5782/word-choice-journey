let currentStep = 0;
let currentSelection = [];
let recoverySelection = {};

const stepOrder = [
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
  "step8"
];

const answers = {
  pastPositive: [],
  pastNegative: [],
  currentPrecious: [],
  currentHard: [],
  supportingWords: [],
  remainingHardWords: [],
  recoveryWords: [],
  finalWords: []
};

const journeyLog = {
  stepTimes: {},
  deselectedWords: {},
  stepStartTime: null
};

const stepInfo = {
  step1: {
    label: "1단계",
    title: "1단계. 과거의 긍정적인 순간",
    guide: "과거의 긍정적인 순간을 떠올렸을 때 연상되는 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "pastPositive"
  },
  step2: {
    label: "2단계",
    title: "2단계. 과거의 부정적인 순간",
    guide: "과거의 부정적인 순간을 떠올렸을 때 연상되는 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "pastNegative"
  },
  step3: {
    label: "3단계",
    title: "3단계. 지금의 내가 소중하게 생각하는 단어",
    guide: "지금의 내가 소중하게 생각하는 단어 10개를 골라주세요.",
    selectCount: 10,
    resultKey: "currentPrecious"
  },
  step4: {
    label: "4단계",
    title: "4단계. 지금의 나를 힘들게 하는 단어",
    guide: "지금의 나를 힘들게 하는 단어 7개를 골라주세요.",
    selectCount: 7,
    resultKey: "currentHard"
  },
  step5: {
    label: "5단계",
    title: "5단계. 과거와 지금의 중요한 단어 중 나에게 남는 단어",
    guide: "앞에서 고른 '과거의 긍정적인 순간' 단어와 '지금의 내가 소중하게 생각하는 단어'를 함께 보며, 나에게 중요한 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "supportingWords"
  },
  step6: {
    label: "6단계",
    title: "6단계. 과거와 지금의 힘든 단어 중 마음에 남는 단어",
    guide: "앞에서 고른 '과거의 부정적인 순간' 단어와 '지금의 나를 힘들게 하는 단어'를 함께 보며, 특히 마음에 남는 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "remainingHardWords"
  },
  step7: {
    label: "7단계",
    title: "7단계. 힘든 단어 옆에 필요한 단어 적기",
    guide: "앞에서 고른 힘든 단어를 하나씩 보며, 그 마음을 덜어내거나 넘어서는 데 도움이 될 단어를 적어주세요.",
    resultKey: "recoveryWords"
  },
  step8: {
    label: "8단계",
    title: "8단계. 지금 나에게 남기고 싶은 최종 단어",
    guide: "여정의 마지막 단계입니다. 여정을 지나오면서 떠오르는, 나에게 가장 중요하게 남는 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "finalWords"
  }
};

const introScreen = document.getElementById("intro-screen");
const journeyScreen = document.getElementById("journey-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const stepLabel = document.getElementById("step-label");
const stepTitle = document.getElementById("step-title");
const guideText = document.getElementById("guide-text");
const wordArea = document.getElementById("word-area");
const counter = document.getElementById("counter");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const finalWordsArea = document.getElementById("final-words");
const resultSummary = document.getElementById("result-summary");
const copyPromptBtn = document.getElementById("copy-prompt-btn");
const restartBtn = document.getElementById("restart-btn");

startBtn.addEventListener("click", function () {
  resetJourney();
  introScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  journeyScreen.classList.add("active");
  renderStep();
});

prevBtn.addEventListener("click", function () {
  if (currentStep > 0) {
    saveStepTime();
    currentStep -= 1;
    renderStep();
  }
});

restartBtn.addEventListener("click", function () {
  resetJourney();
  resultScreen.classList.remove("active");
  journeyScreen.classList.remove("active");
  introScreen.classList.add("active");
});

copyPromptBtn.addEventListener("click", function () {
  copyPromptToClipboard();
});

function resetJourney() {
  currentStep = 0;
  currentSelection = [];
  recoverySelection = {};

  Object.keys(answers).forEach(function (key) {
    answers[key] = [];
  });

  journeyLog.stepTimes = {};
  journeyLog.deselectedWords = {};
  journeyLog.stepStartTime = null;

  nextBtn.textContent = "다음";
  nextBtn.disabled = true;
  copyPromptBtn.textContent = "AI 분석 프롬프트 복사하기";
}

function getCurrentStepKey() {
  return stepOrder[currentStep];
}

function getCurrentInfo() {
  return stepInfo[getCurrentStepKey()];
}

function getStepProgressText() {
  return String(currentStep + 1) + "단계 / " + String(stepOrder.length) + "단계";
}

function getStepProgressPercent() {
  const progress = ((currentStep + 1) / stepOrder.length) * 100;
  return String(progress) + "%";
}

function startStepTime() {
  journeyLog.stepStartTime = Date.now();
}

function saveStepTime() {
  const stepKey = getCurrentStepKey();

  if (!stepKey || !journeyLog.stepStartTime) {
    return;
  }

  if (!journeyLog.stepTimes[stepKey]) {
    journeyLog.stepTimes[stepKey] = 0;
  }

  journeyLog.stepTimes[stepKey] += Date.now() - journeyLog.stepStartTime;
  journeyLog.stepStartTime = Date.now();
}

function logDeselectedWord(word) {
  const stepKey = getCurrentStepKey();

  if (!journeyLog.deselectedWords[stepKey]) {
    journeyLog.deselectedWords[stepKey] = [];
  }

  journeyLog.deselectedWords[stepKey].push(word);
}

function renderStep() {
  const stepKey = getCurrentStepKey();
  const info = getCurrentInfo();

  currentSelection = [];

  if (stepLabel) {
    stepLabel.textContent = getStepProgressText();
  }

  journeyScreen.style.setProperty("--step-progress", getStepProgressPercent());
  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = currentStep === stepOrder.length - 1 ? "결과 보기" : "다음";
  nextBtn.disabled = true;

  startStepTime();

  if (stepKey === "step1" || stepKey === "step2" || stepKey === "step3" || stepKey === "step4") {
    renderWordSelection({
      title: getPoolTitle(stepKey),
      words: getPoolWords(stepKey),
      groups: getPoolGroups(stepKey),
      selectCount: getPoolSelectCount(stepKey),
      resultKey: info.resultKey,
      guideText: info.guide
    });
    return;
  }

  if (stepKey === "step5") {
    renderWordSelection({
      title: info.title,
      words: answers.pastPositive.concat(answers.currentPrecious),
      selectCount: info.selectCount,
      resultKey: info.resultKey,
      guideText: info.guide
    });
    return;
  }

  if (stepKey === "step6") {
    renderWordSelection({
      title: info.title,
      words: answers.pastNegative.concat(answers.currentHard),
      selectCount: info.selectCount,
      resultKey: info.resultKey,
      guideText: info.guide
    });
    return;
  }

  if (stepKey === "step7") {
    renderRecoveryStep();
    return;
  }

  if (stepKey === "step8") {
    renderWordSelection({
      title: info.title,
      words: answers.supportingWords.concat(answers.recoveryWords),
      selectCount: info.selectCount,
      resultKey: info.resultKey,
      guideText: info.guide
    });
  }
}

function getPoolTitle(stepKey) {
  const pools = getWordPools();

  if (pools && pools[stepKey] && pools[stepKey].title) {
    return pools[stepKey].title;
  }

  return stepInfo[stepKey].title;
}

function getPoolWords(stepKey) {
  const pools = getWordPools();

  if (pools && pools[stepKey] && Array.isArray(pools[stepKey].words)) {
    return pools[stepKey].words;
  }

  if (pools && pools[stepKey] && Array.isArray(pools[stepKey].groups)) {
    return pools[stepKey].groups.reduce(function (allWords, group) {
      if (!group || !Array.isArray(group.words)) {
        return allWords;
      }

      return allWords.concat(group.words);
    }, []);
  }

  return [];
}

function getPoolGroups(stepKey) {
  const pools = getWordPools();

  if (!pools || !pools[stepKey] || !Array.isArray(pools[stepKey].groups)) {
    return [];
  }

  return pools[stepKey].groups.filter(function (group) {
    return group && Array.isArray(group.words) && group.words.length > 0;
  });
}

function getPoolSelectCount(stepKey) {
  const pools = getWordPools();

  if (pools && pools[stepKey] && Number.isInteger(pools[stepKey].selectCount)) {
    return pools[stepKey].selectCount;
  }

  return stepInfo[stepKey].selectCount;
}

function getWordPools() {
  if (typeof wordPools === "undefined") {
    return null;
  }

  return wordPools;
}

function renderWordSelection(options) {
  const title = options.title;
  const words = options.words;
  const groups = Array.isArray(options.groups) ? options.groups : [];
  const selectCount = options.selectCount;
  const resultKey = options.resultKey;
  const guide = options.guideText;

  stepTitle.textContent = title;
  guideText.textContent = guide;
  wordArea.innerHTML = "";

  if (!Array.isArray(words) || words.length === 0) {
    wordArea.innerHTML = "<p>단어 목록을 불러오지 못했습니다. words.js를 확인해주세요.</p>";
    counter.textContent = "0 / " + selectCount;
    nextBtn.disabled = true;
    nextBtn.onclick = null;
    return;
  }

  const uniqueWords = Array.from(new Set(words));
  const uniqueWordSet = new Set(uniqueWords);

  function makeWordButton(word) {
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

    return button;
  }

  if (groups.length > 0) {
    groups.forEach(function (group) {
      const groupWords = group.words.filter(function (word) {
        return uniqueWordSet.has(word);
      });

      if (groupWords.length === 0) {
        return;
      }

      const groupBlock = document.createElement("div");
      const groupWordsArea = document.createElement("div");

      groupBlock.className = "word-group";
      groupWordsArea.className = "word-group-words";

      groupWords.forEach(function (word) {
        groupWordsArea.appendChild(makeWordButton(word));
      });

      groupBlock.appendChild(groupWordsArea);
      wordArea.appendChild(groupBlock);
    });
  } else {
    uniqueWords.forEach(function (word) {
      wordArea.appendChild(makeWordButton(word));
    });
  }

  updateCounter(selectCount);

  nextBtn.onclick = function () {
    saveStepTime();
    answers[resultKey] = currentSelection.slice();

    if (currentStep === stepOrder.length - 1) {
      renderResult();
      return;
    }

    currentStep += 1;
    renderStep();
  };
}

function renderRecoveryStep() {
  stepTitle.textContent = stepInfo.step7.title;
  guideText.textContent = stepInfo.step7.guide;
  wordArea.innerHTML = "";
  recoverySelection = {};

  if (!Array.isArray(answers.remainingHardWords) || answers.remainingHardWords.length === 0) {
    wordArea.innerHTML = "<p>6단계에서 선택한 단어가 없습니다. 이전 단계로 돌아가 확인해주세요.</p>";
    counter.textContent = "0 / 0";
    nextBtn.disabled = true;
    nextBtn.onclick = null;
    return;
  }

  answers.remainingHardWords.forEach(function (hardWord) {
    const block = document.createElement("div");
    const title = document.createElement("p");
    const input = document.createElement("input");

    block.className = "recovery-block";

    title.className = "recovery-title";
    title.textContent = "'" + hardWord + "' 옆에 적고 싶은 단어";

    input.type = "text";
    input.className = "recovery-input";
    input.placeholder = "예: 회복, 용기, 정리, 기회";
    input.value = recoverySelection[hardWord] || "";

    input.addEventListener("input", function () {
      const currentValue = input.value.trim();

      if (currentValue.length > 0) {
        recoverySelection[hardWord] = currentValue;
      } else {
        delete recoverySelection[hardWord];
      }

      updateRecoveryCounter();
    });

    block.appendChild(title);
    block.appendChild(input);
    wordArea.appendChild(block);
  });

  updateRecoveryCounter();

  nextBtn.onclick = function () {
    saveStepTime();

    answers.recoveryWords = answers.remainingHardWords.map(function (word) {
      return recoverySelection[word].trim();
    });

    currentStep += 1;
    renderStep();
  };
}

function updateCounter(selectCount) {
  counter.textContent = String(currentSelection.length) + " / " + String(selectCount);
  nextBtn.disabled = currentSelection.length !== selectCount;
}

function updateRecoveryCounter() {
  const selectedCount = answers.remainingHardWords.filter(function (word) {
    return recoverySelection[word] && recoverySelection[word].trim().length > 0;
  }).length;

  const totalCount = answers.remainingHardWords.length;

  counter.textContent = String(selectedCount) + " / " + String(totalCount);
  nextBtn.disabled = selectedCount !== totalCount;
}

function renderResult() {
  journeyScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalWordsArea.innerHTML = "";
  resultSummary.innerHTML = "";

  answers.finalWords.forEach(function (word) {
    const item = document.createElement("span");
    item.className = "final-word";
    item.textContent = word;
    finalWordsArea.appendChild(item);
  });

  getResultSummaries().forEach(function (summary) {
    const box = document.createElement("div");
    const title = document.createElement("h3");
    const text = document.createElement("p");

    box.className = "summary-box";
    title.textContent = summary.title;
    text.textContent = summary.text || "없음";

    box.appendChild(title);
    box.appendChild(text);
    resultSummary.appendChild(box);
  });
}

function getResultSummaries() {
  return [
    {
      title: stepInfo.step1.title,
      text: answers.pastPositive.join(", ")
    },
    {
      title: stepInfo.step2.title,
      text: answers.pastNegative.join(", ")
    },
    {
      title: stepInfo.step3.title,
      text: answers.currentPrecious.join(", ")
    },
    {
      title: stepInfo.step4.title,
      text: answers.currentHard.join(", ")
    },
    {
      title: stepInfo.step5.title,
      text: answers.supportingWords.join(", ")
    },
    {
      title: stepInfo.step6.title,
      text: answers.remainingHardWords.join(", ")
    },
    {
      title: stepInfo.step7.title,
      text: getRecoveryPairs().join(", ")
    },
    {
      title: stepInfo.step8.title,
      text: answers.finalWords.join(", ")
    }
  ];
}

function getRecoveryPairs() {
  return answers.remainingHardWords.map(function (word, index) {
    const recoveryWord = answers.recoveryWords[index] || "";
    return word + " -> " + recoveryWord;
  });
}

function formatTime(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return String(seconds) + "초";
  }

  return String(minutes) + "분 " + String(seconds) + "초";
}

function getTimeText(stepKey) {
  if (!journeyLog.stepTimes[stepKey]) {
    return "기록 없음";
  }

  return formatTime(journeyLog.stepTimes[stepKey]);
}

function getSelectedWordsByStep(stepKey) {
  const resultKey = stepInfo[stepKey].resultKey;

  if (stepKey === "step7") {
    return getRecoveryPairs();
  }

  return answers[resultKey] || [];
}

function getDeselectedWordsForPrompt(stepKey) {
  const selected = getSelectedWordsByStep(stepKey);
  const selectedSet = new Set(selected);
  const deselected = journeyLog.deselectedWords[stepKey] || [];

  return Array.from(new Set(deselected)).filter(function (word) {
    return !selectedSet.has(word);
  });
}

function getLongestStepText() {
  const entries = Object.keys(journeyLog.stepTimes).map(function (stepKey) {
    return [stepKey, journeyLog.stepTimes[stepKey]];
  });

  if (entries.length === 0) {
    return "기록 없음";
  }

  entries.sort(function (a, b) {
    return b[1] - a[1];
  });

  return stepInfo[entries[0][0]].title + " (" + formatTime(entries[0][1]) + ")";
}

function getAllDeselectedWordsForPrompt() {
  const selectedWords = [];

  stepOrder.forEach(function (stepKey) {
    getSelectedWordsByStep(stepKey).forEach(function (word) {
      selectedWords.push(word);
    });
  });

  const selectedSet = new Set(selectedWords);
  const allDeselected = [];

  Object.keys(journeyLog.deselectedWords).forEach(function (stepKey) {
    journeyLog.deselectedWords[stepKey].forEach(function (word) {
      allDeselected.push(word);
    });
  });

  return Array.from(new Set(allDeselected)).filter(function (word) {
    return !selectedSet.has(word);
  });
}

function makePrompt() {
  const processLines = [];

  stepOrder.forEach(function (stepKey) {
    const selected = getSelectedWordsByStep(stepKey);
    const deselected = getDeselectedWordsForPrompt(stepKey);

    processLines.push(
      [
        stepInfo[stepKey].title,
        "- 최종 선택 단어: " + toText(selected),
        "- 단계에서 걸린 시간: " + getTimeText(stepKey),
        "- 선택했다가 취소한 단어: " + toText(deselected)
      ].join("\n")
    );
  });

  const allDeselected = getAllDeselectedWordsForPrompt();

  return [
    "나는 '단어 선택 여정'을 통해 과거의 기억, 현재의 마음, 앞으로의 방향을 정리했습니다.",
    "",
    "아래 결과를 바탕으로 나를 분석해주세요.",
    "단순히 단어 뜻만 말하기보다, 선택 과정에서 드러난 고민과 정서적 흐름까지 함께 해석해주세요.",
    "",
    "[전체 선택 과정]",
    "",
    processLines.join("\n\n"),
    "",
    "[가장 오래 고민한 단계]",
    getLongestStepText(),
    "",
    "[전체 과정에서 선택했다가 취소한 단어]",
    toText(allDeselected),
    "",
    "[분석 요청]",
    "",
    "1. 과거의 긍정 단어와 부정 단어를 통해, 내가 어떤 기억을 힘으로 삼고 어떤 기억을 아직 무겁게 느끼는지 분석해주세요.",
    "2. 지금의 내가 소중하게 생각하는 단어와 힘들게 느끼는 단어를 비교해서, 현재 내 마음의 중심과 부담을 설명해주세요.",
    "3. 과거와 지금 나를 지탱하는 단어가 무엇을 의미하는지 분석해주세요.",
    "4. 남아 있는 힘든 단어와 그것을 극복할 단어의 연결을 해석해주세요.",
    "5. 최종 5개의 단어를 바탕으로, 앞으로 내가 어떤 방향으로 나아가고 싶어 하는지 정리해주세요.",
    "6. 오래 고민한 단계와 선택했다가 취소한 단어가 있다면, 그 단어들이 어떤 망설임이나 갈등을 보여주는지도 부드럽게 설명해주세요.",
    "",
    "말투는 단정적이기보다 조심스럽고 따뜻하게 해주세요."
  ].join("\n");
}

function toText(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "없음";
  }

  return items.join(", ");
}

function copyPromptToClipboard() {
  const prompt = makePrompt();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(prompt).then(function () {
      showCopySuccess();
    }).catch(function () {
      fallbackCopyPrompt(prompt);
    });
    return;
  }

  fallbackCopyPrompt(prompt);
}

function fallbackCopyPrompt(prompt) {
  const textarea = document.createElement("textarea");

  textarea.value = prompt;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    document.execCommand("copy");
    showCopySuccess();
  } catch (error) {
    alert("복사에 실패했습니다. 프롬프트를 직접 선택해서 복사해주세요.");
  }

  document.body.removeChild(textarea);
}

function showCopySuccess() {
  copyPromptBtn.textContent = "복사 완료";

  setTimeout(function () {
    copyPromptBtn.textContent = "AI 분석 프롬프트 복사하기";
  }, 1500);
}
