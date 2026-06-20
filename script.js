const screens = {
  start: document.getElementById("start-screen"),
  journey: document.getElementById("journey-screen"),
  result: document.getElementById("result-screen")
};

const stepLabel = document.getElementById("step-label");
const stepTitle = document.getElementById("step-title");
const counter = document.getElementById("counter");
const guide = document.getElementById("guide");
const wordArea = document.getElementById("word-area");

const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const copyBtn = document.getElementById("copy-btn");
const restartBtn = document.getElementById("restart-btn");

const stepKeys = [
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
  "step8"
];

let currentStepIndex = 0;

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

let currentSelection = [];
let recoverySelection = {};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function getCurrentStepKey() {
  return stepKeys[currentStepIndex];
}

function getStepNumber() {
  return currentStepIndex + 1;
}

function setGuideText(text) {
  guide.textContent = text;
}

function renderStep() {
  const stepKey = getCurrentStepKey();
  const stepNumber = getStepNumber();

  currentSelection = [];
  recoverySelection = {};

  wordArea.innerHTML = "";
  nextBtn.disabled = true;
  backBtn.style.visibility = currentStepIndex === 0 ? "hidden" : "visible";

  stepLabel.textContent = `${stepNumber}단계`;

  if (stepKey === "step1") {
    renderWordSelection({
      title: wordPools.step1.title,
      words: wordPools.step1.words,
      selectCount: wordPools.step1.selectCount,
      resultKey: "pastPositive",
      guideText: "과거의 기억 중 따뜻하거나 좋았던 순간과 연결되는 단어를 5개 골라주세요."
    });
    return;
  }

  if (stepKey === "step2") {
    renderWordSelection({
      title: wordPools.step2.title,
      words: wordPools.step2.words,
      selectCount: wordPools.step2.selectCount,
      resultKey: "pastNegative",
      guideText: "과거를 떠올릴 때 아프거나 무겁게 남아 있는 단어를 5개 골라주세요."
    });
    return;
  }

  if (stepKey === "step3") {
    renderWordSelection({
      title: wordPools.step3.title,
      words: wordPools.step3.words,
      selectCount: wordPools.step3.selectCount,
      resultKey: "currentPrecious",
      guideText: "지금의 내가 중요하게 여기고, 지키고 싶은 단어를 10개 골라주세요."
    });
    return;
  }

  if (stepKey === "step4") {
    renderWordSelection({
      title: wordPools.step4.title,
      words: wordPools.step4.words,
      selectCount: wordPools.step4.selectCount,
      resultKey: "currentHard",
      guideText: "지금의 나에게 부담스럽거나 힘들게 느껴지는 단어를 10개 골라주세요."
    });
    return;
  }

  if (stepKey === "step5") {
    const words = [...answers.pastPositive, ...answers.currentPrecious];

    renderWordSelection({
      title: "5단계. 과거와 지금 나를 지탱하는 단어",
      words,
      selectCount: 5,
      resultKey: "supportingWords",
      guideText: "과거의 긍정과 현재의 소중함 중, 지금까지 나를 지탱해온 단어 5개를 골라주세요."
    });
    return;
  }

  if (stepKey === "step6") {
    const words = [...answers.pastNegative, ...answers.currentHard];

    renderWordSelection({
      title: "6단계. 남아 있는 힘든 단어",
      words,
      selectCount: 5,
      resultKey: "remainingHardWords",
      guideText: "과거와 현재의 힘듦 중, 아직 내 안에 크게 남아 있는 단어 5개를 골라주세요."
    });
    return;
  }

  if (stepKey === "step7") {
    renderRecoveryStep();
    return;
  }

  if (stepKey === "step8") {
    const words = [...answers.supportingWords, ...answers.recoveryWords];

    renderWordSelection({
      title: "8단계. 최종 5개의 단어",
      words,
      selectCount: 5,
      resultKey: "finalWords",
      guideText: "나를 지탱한 단어와 힘든 무게를 극복할 단어 중, 지금의 나에게 가장 중요한 최종 5개를 골라주세요."
    });
  }
}

function renderWordSelection({ title, words, selectCount, resultKey, guideText }) {
  stepTitle.textContent = title;
  setGuideText(guideText);
  updateCounter(0, selectCount);

  const uniqueWords = [...new Set(words)];

  uniqueWords.forEach((word) => {
    const button = document.createElement("button");
    button.className = "word-btn";
    button.textContent = word;

    button.addEventListener("click", () => {
      const alreadySelected = currentSelection.includes(word);

      if (alreadySelected) {
        currentSelection = currentSelection.filter((item) => item !== word);
        button.classList.remove("selected");
      } else {
        if (currentSelection.length >= selectCount) {
          return;
        }

        currentSelection.push(word);
        button.classList.add("selected");
      }

      updateCounter(currentSelection.length, selectCount);
      nextBtn.disabled = currentSelection.length !== selectCount;
    });

    wordArea.appendChild(button);
  });

  nextBtn.onclick = () => {
    answers[resultKey] = [...currentSelection];

    if (getCurrentStepKey() === "step8") {
      showResult();
      return;
    }

    currentStepIndex += 1;
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function renderRecoveryStep() {
  stepTitle.textContent = "7단계. 힘든 무게를 극복할 단어";
  setGuideText("남아 있는 힘든 단어마다, 그 무게를 넘어서는 데 필요한 단어를 하나씩 골라주세요.");
  updateCounter(0, answers.remainingHardWords.length);

  wordArea.innerHTML = "";

  answers.remainingHardWords.forEach((hardWord) => {
    const block = document.createElement("div");
    block.className = "recovery-block";

    const title = document.createElement("p");
    title.className = "recovery-title";
    title.textContent = `${hardWord}을/를 극복할 단어`;

    const options = document.createElement("div");
    options.className = "recovery-options";

    const candidates = recoveryMap[hardWord] || ["회복", "용기", "정리", "시작"];

    candidates.forEach((candidate) => {
      const button = document.createElement("button");
      button.className = "word-btn";
      button.textContent = candidate;

      button.addEventListener("click", () => {
        recoverySelection[hardWord] = candidate;

        options.querySelectorAll(".word-btn").forEach((btn) => {
          btn.classList.remove("selected");
        });

        button.classList.add("selected");

        const selectedCount = Object.keys(recoverySelection).length;
        updateCounter(selectedCount, answers.remainingHardWords.length);
        nextBtn.disabled = selectedCount !== answers.remainingHardWords.length;
      });

      options.appendChild(button);
    });

    block.appendChild(title);
    block.appendChild(options);
    wordArea.appendChild(block);
  });

  nextBtn.onclick = () => {
    answers.recoveryWords = answers.remainingHardWords.map((word) => recoverySelection[word]);

    currentStepIndex += 1;
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

function updateCounter(selected, total) {
  counter.textContent = `${selected} / ${total}`;
}

function showResult() {
  showScreen("result");

  const finalWordsEl = document.getElementById("final-words");
  const resultSummaryEl = document.getElementById("result-summary");

  finalWordsEl.innerHTML = "";
  resultSummaryEl.innerHTML = "";

  answers.finalWords.forEach((word) => {
    const span = document.createElement("span");
    span.className = "final-word";
    span.textContent = word;
    finalWordsEl.appendChild(span);
  });

  const recoveryPairs = answers.remainingHardWords.map((word, index) => {
    return `${word} → ${answers.recoveryWords[index]}`;
  });

  const sections = [
    {
      title: "1단계. 과거를 회상할 때 긍정적인 순간을 떠올리는 단어",
      words: answers.pastPositive
    },
    {
      title: "2단계. 과거를 회상할 때 부정적인 순간을 떠올리는 단어",
      words: answers.pastNegative
    },
    {
      title: "3단계. 지금의 내가 소중하게 생각하는 단어",
      words: answers.currentPrecious
    },
    {
      title: "4단계. 지금의 내가 힘들게 느껴지는 단어",
      words: answers.currentHard
    },
    {
      title: "5단계. 과거와 지금 나를 지탱하는 단어",
      words: answers.supportingWords
    },
    {
      title: "6단계. 남아 있는 힘든 단어",
      words: answers.remainingHardWords
    },
    {
      title: "7단계. 힘든 무게를 극복할 단어",
      words: recoveryPairs
    }
  ];

  sections.forEach((section) => {
    const box = document.createElement("div");
    box.className = "summary-box";

    const h3 = document.createElement("h3");
    h3.textContent = section.title;

    const p = document.createElement("p");
    p.textContent = section.words.join(", ");

    box.appendChild(h3);
    box.appendChild(p);
    resultSummaryEl.appendChild(box);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makePrompt() {
  const recoveryPairs = answers.remainingHardWords.map((word, index) => {
    return `${word} → ${answers.recoveryWords[index]}`;
  });

  return `
아래는 내가 단어 선택 여정을 통해 고른 결과입니다.

1단계. 과거를 회상할 때 긍정적인 순간을 떠올리는 단어
${answers.pastPositive.join(", ")}

2단계. 과거를 회상할 때 부정적인 순간을 떠올리는 단어
${answers.pastNegative.join(", ")}

3단계. 지금의 내가 소중하게 생각하는 단어
${answers.currentPrecious.join(", ")}

4단계. 지금의 내가 힘들게 느껴지는 단어
${answers.currentHard.join(", ")}

5단계. 과거와 지금 나를 지탱하는 단어
${answers.supportingWords.join(", ")}

6단계. 남아 있는 힘든 단어
${answers.remainingHardWords.join(", ")}

7단계. 힘든 무게를 극복할 단어
${recoveryPairs.join(", ")}

8단계. 최종 5개의 단어
${answers.finalWords.join(", ")}

이 결과를 바탕으로 나의 과거, 현재, 앞으로의 방향을 부드럽고 깊이 있게 분석해주세요.
`.trim();
}

startBtn.addEventListener("click", () => {
  currentStepIndex = 0;
  showScreen("journey");
  renderStep();
});

backBtn.addEventListener("click", () => {
  if (currentStepIndex === 0) {
    return;
  }

  currentStepIndex -= 1;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

copyBtn.addEventListener("click", async () => {
  const prompt = makePrompt();

  try {
    await navigator.clipboard.writeText(prompt);
    copyBtn.textContent = "복사 완료";
    setTimeout(() => {
      copyBtn.textContent = "AI 분석 프롬프트 복사하기";
    }, 1600);
  } catch (error) {
    alert("복사에 실패했습니다. 결과 내용을 직접 선택해서 복사해주세요.");
  }
});

restartBtn.addEventListener("click", () => {
  Object.keys(answers).forEach((key) => {
    answers[key] = [];
  });

  currentStepIndex = 0;
  showScreen("start");
});
