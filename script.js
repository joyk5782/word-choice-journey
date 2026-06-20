// script.js

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

startBtn.addEventListener("click", () => {
introScreen.classList.remove("active");
journeyScreen.classList.add("active");
resultScreen.classList.remove("active");

currentStep = 0;
renderStep();
});

prevBtn.addEventListener("click", () => {
if (currentStep > 0) {
saveStepTime();
currentStep -= 1;
renderStep();
}
});

restartBtn.addEventListener("click", () => {
currentStep = 0;
currentSelection = [];
recoverySelection = {};

Object.keys(answers).forEach((key) => {
answers[key] = [];
});

journeyLog.stepTimes = {};
journeyLog.deselectedWords = {};
journeyLog.stepStartTime = null;

resultScreen.classList.remove("active");
journeyScreen.classList.remove("active");
introScreen.classList.add("active");
});

copyPromptBtn.addEventListener("click", () => {
const prompt = makePrompt();

const textarea = document.createElement("textarea");
textarea.value = prompt;
textarea.setAttribute("readonly", "");
textarea.style.position = "fixed";
textarea.style.top = "-9999px";
textarea.style.left = "-9999px";

document.body.appendChild(textarea);
textarea.select();
textarea.setSelectionRange(0, textarea.value.length);

try {
document.execCommand("copy");
copyPromptBtn.textContent = "복사 완료";
} catch (error) {
alert("복사에 실패했습니다. 프롬프트를 직접 선택해서 복사해주세요.");
}

document.body.removeChild(textarea);

setTimeout(() => {
copyPromptBtn.textContent = "AI 프롬프트 복사하기";
}, 1500);
});

function getCurrentStepKey() {
return stepOrder[currentStep];
}

function startStepTime() {
journeyLog.stepStartTime = Date.now();
}

function saveStepTime() {
const stepKey = getCurrentStepKey();

if (!stepKey || !journeyLog.stepStartTime) {
return;
}

const elapsedMs = Date.now() - journeyLog.stepStartTime;

if (!journeyLog.stepTimes[stepKey]) {
journeyLog.stepTimes[stepKey] = 0;
}

journeyLog.stepTimes[stepKey] += elapsedMs;
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

currentSelection = [];

if (stepKey === "step7") {
recoverySelection = {};
}

if (stepLabel) {
stepLabel.textContent = `${currentStep + 1}단계`;
}

startStepTime();

if (stepKey === "step1") {
renderWordSelection({
title: wordPools.step1.title,
words: wordPools.step1.words,
selectCount: wordPools.step1.selectCount,
resultKey: flow.step1.resultKey,
guideText: "과거를 떠올릴 때 긍정적인 순간과 연결되는 단어 5개를 골라주세요."
});
return;
}

if (stepKey === "step2") {
renderWordSelection({
title: wordPools.step2.title,
words: wordPools.step2.words,
selectCount: wordPools.step2.selectCount,
resultKey: flow.step2.resultKey,
guideText: "과거를 떠올릴 때 아직 무겁게 남아 있는 단어 5개를 골라주세요."
});
return;
}

if (stepKey === "step3") {
renderWordSelection({
title: wordPools.step3.title,
words: wordPools.step3.words,
selectCount: wordPools.step3.selectCount,
resultKey: flow.step3.resultKey,
guideText: "지금의 내가 소중하게 생각하는 단어 10개를 골라주세요."
});
return;
}

if (stepKey === "step4") {
renderWordSelection({
title: wordPools.step4.title,
words: wordPools.step4.words,
selectCount: wordPools.step4.selectCount,
resultKey: flow.step4.resultKey,
guideText: "지금의 내가 힘들게 느끼는 단어 10개를 골라주세요."
});
return;
}

if (stepKey === "step5") {
const words = [...answers.pastPositive, ...answers.currentPrecious];

```
renderWordSelection({
  title: flow.step5.title,
  words,
  selectCount: flow.step5.selectCount,
  resultKey: flow.step5.resultKey,
  guideText: "과거의 긍정 단어와 지금 소중한 단어 중, 나를 지탱하는 단어 5개를 골라주세요."
});
return;
```

}

if (stepKey === "step6") {
const words = [...answers.pastNegative, ...answers.currentHard];

```
renderWordSelection({
  title: flow.step6.title,
  words,
  selectCount: flow.step6.selectCount,
  resultKey: flow.step6.resultKey,
  guideText: "과거의 부정 단어와 지금 힘든 단어 중, 아직 남아 있는 힘든 단어 5개를 골라주세요."
});
return;
```

}

if (stepKey === "step7") {
renderRecoveryStep();
return;
}

if (stepKey === "step8") {
const words = [...answers.supportingWords, ...answers.recoveryWords];

```
renderWordSelection({
  title: flow.step8.title,
  words,
  selectCount: flow.step8.selectCount,
  resultKey: flow.step8.resultKey,
  guideText: "나를 지탱한 단어와 힘든 무게를 극복할 단어 중, 지금의 나에게 가장 중요한 최종 5개를 골라주세요."
});
```

}
}

function renderWordSelection({ title, words, selectCount, resultKey, guideText: guide }) {
stepTitle.textContent = title;
guideText.textContent = guide;
wordArea.innerHTML = "";

const uniqueWords = [...new Set(words)];

uniqueWords.forEach((word) => {
const button = document.createElement("button");
button.type = "button";
button.className = "word-btn";
button.textContent = word;

```
button.addEventListener("click", () => {
  const alreadySelected = currentSelection.includes(word);

  if (alreadySelected) {
    currentSelection = currentSelection.filter((item) => item !== word);
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
```

});

updateCounter(selectCount);

prevBtn.disabled = currentStep === 0;
nextBtn.disabled = true;
nextBtn.textContent = currentStep === stepOrder.length - 1 ? "결과 보기" : "다음";

nextBtn.onclick = () => {
saveStepTime();

```
answers[resultKey] = [...currentSelection];

if (currentStep === stepOrder.length - 1) {
  renderResult();
} else {
  currentStep += 1;
  renderStep();
}
```

};
}

function renderRecoveryStep() {
stepTitle.textContent = flow.step7.title;
guideText.textContent = "남아 있는 힘든 단어마다, 그 무게를 넘어서는 데 필요한 단어를 직접 적어주세요.";
wordArea.innerHTML = "";

answers.remainingHardWords.forEach((hardWord) => {
const block = document.createElement("div");
block.className = "recovery-block";

```
const title = document.createElement("p");
title.className = "recovery-title";
title.textContent = hardWord + "을(를) 넘어설 단어를 입력하세요";

const input = document.createElement("input");
input.type = "text";
input.className = "recovery-input";
input.placeholder = "예: 회복, 용기, 정리, 휴식";
input.value = recoverySelection[hardWord] || "";

input.addEventListener("input", () => {
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
```

});

updateRecoveryCounter();

prevBtn.disabled = false;
nextBtn.disabled = true;
nextBtn.textContent = "다음";

nextBtn.onclick = () => {
saveStepTime();

```
answers.recoveryWords = answers.remainingHardWords.map((word) => recoverySelection[word]);

currentStep += 1;
renderStep();
```

};
}

function updateCounter(selectCount) {
counter.textContent = `${currentSelection.length} / ${selectCount}`;
nextBtn.disabled = currentSelection.length !== selectCount;
}

function updateRecoveryCounter() {
const selectedCount = answers.remainingHardWords.filter((word) => {
return recoverySelection[word] && recoverySelection[word].trim().length > 0;
}).length;

const totalCount = answers.remainingHardWords.length;

counter.textContent = `${selectedCount} / ${totalCount}`;
nextBtn.disabled = selectedCount !== totalCount;
}

function renderResult() {
journeyScreen.classList.remove("active");
resultScreen.classList.add("active");

finalWordsArea.innerHTML = "";
resultSummary.innerHTML = "";

answers.finalWords.forEach((word) => {
const item = document.createElement("span");
item.className = "final-word";
item.textContent = word;
finalWordsArea.appendChild(item);
});

const summaries = [
{
title: "1단계. 과거를 회상할 때 긍정적인 순간을 떠올리는 단어",
text: answers.pastPositive.join(", ")
},
{
title: "2단계. 과거를 회상할 때 부정적인 순간을 떠올리는 단어",
text: answers.pastNegative.join(", ")
},
{
title: "3단계. 지금의 내가 소중하게 생각하는 단어",
text: answers.currentPrecious.join(", ")
},
{
title: "4단계. 지금의 내가 힘들게 느껴지는 단어",
text: answers.currentHard.join(", ")
},
{
title: "5단계. 과거와 지금 나를 지탱하는 단어",
text: answers.supportingWords.join(", ")
},
{
title: "6단계. 남아 있는 힘든 단어",
text: answers.remainingHardWords.join(", ")
},
{
title: "7단계. 힘든 무게를 극복할 단어",
text: answers.remainingHardWords
.map((word, index) => `${word} → ${answers.recoveryWords[index]}`)
.join(", ")
}
];

summaries.forEach((summary) => {
const box = document.createElement("div");
box.className = "summary-box";

```
const title = document.createElement("h3");
title.textContent = summary.title;

const text = document.createElement("p");
text.textContent = summary.text;

box.appendChild(title);
box.appendChild(text);
resultSummary.appendChild(box);
```

});
}

function formatTime(ms) {
const totalSeconds = Math.round(ms / 1000);
const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;

if (minutes === 0) {
return `${seconds}초`;
}

return `${minutes}분 ${seconds}초`;
}

function getStepTitleByKey(stepKey) {
const titles = {
step1: "1단계. 과거를 회상할 때 긍정적인 순간을 떠올리는 단어",
step2: "2단계. 과거를 회상할 때 부정적인 순간을 떠올리는 단어",
step3: "3단계. 지금의 내가 소중하게 생각하는 단어",
step4: "4단계. 지금의 내가 힘들게 느껴지는 단어",
step5: "5단계. 과거와 지금 나를 지탱하는 단어",
step6: "6단계. 남아 있는 힘든 단어",
step7: "7단계. 힘든 무게를 극복할 단어",
step8: "8단계. 최종 5개의 단어"
};

return titles[stepKey] || stepKey;
}

function makePrompt() {
const recoveryPairs = answers.remainingHardWords.map((word, index) => {
return `${word} → ${answers.recoveryWords[index]}`;
});

const stepDescriptions = {
step1: {
title: "1단계. 과거를 회상할 때 긍정적인 순간을 떠올리는 단어",
selected: answers.pastPositive
},
step2: {
title: "2단계. 과거를 회상할 때 부정적인 순간을 떠올리는 단어",
selected: answers.pastNegative
},
step3: {
title: "3단계. 지금의 내가 소중하게 생각하는 단어",
selected: answers.currentPrecious
},
step4: {
title: "4단계. 지금의 내가 힘들게 느껴지는 단어",
selected: answers.currentHard
},
step5: {
title: "5단계. 과거와 지금 나를 지탱하는 단어",
selected: answers.supportingWords
},
step6: {
title: "6단계. 남아 있는 힘든 단어",
selected: answers.remainingHardWords
},
step7: {
title: "7단계. 힘든 무게를 극복할 단어",
selected: recoveryPairs
},
step8: {
title: "8단계. 최종 5개의 단어",
selected: answers.finalWords
}
};

const processLines = Object.entries(stepDescriptions)
.map(([stepKey, info]) => {
const timeText = journeyLog.stepTimes[stepKey]
? formatTime(journeyLog.stepTimes[stepKey])
: "기록 없음";

```
  const deselected = journeyLog.deselectedWords[stepKey] || [];

  const uniqueDeselected = [...new Set(deselected)].filter((word) => {
    return !info.selected.includes(word);
  });

  const deselectedText = uniqueDeselected.length > 0
    ? uniqueDeselected.join(", ")
    : "없음";

  return `
```

${info.title}

* 최종 선택한 단어: ${info.selected.join(", ")}
* 이 단계에서 걸린 시간: ${timeText}
* 선택했다가 취소한 단어: ${deselectedText}
  `.trim();
  })
  .join("\n\n");

  const longestStep = Object.entries(journeyLog.stepTimes)
  .sort((a, b) => b[1] - a[1])[0];

  const longestStepText = longestStep
  ? `${getStepTitleByKey(longestStep[0])} (${formatTime(longestStep[1])})`
  : "기록 없음";

  const allSelectedWords = Object.values(stepDescriptions)
  .flatMap((info) => info.selected);

  const allDeselectedWords = Object.values(journeyLog.deselectedWords).flat();

  const uniqueAllDeselectedWords = [...new Set(allDeselectedWords)].filter((word) => {
  return !allSelectedWords.includes(word);
  });

  return `
  나는 '단어 선택 여정'을 통해 과거의 기억, 현재의 마음, 앞으로의 방향을 정리했습니다.

아래 결과를 바탕으로 나를 분석해주세요.
단순히 단어 뜻만 풀이하지 말고, 선택 과정에서 드러난 고민의 흔적까지 함께 해석해주세요.

[전체 선택 과정]

${processLines}

[가장 오래 고민한 단계]
${longestStepText}

[전체 과정에서 선택했다가 취소한 단어]
${uniqueAllDeselectedWords.length > 0 ? uniqueAllDeselectedWords.join(", ") : "없음"}

[분석 요청]

1. 과거의 긍정 단어와 부정 단어를 통해, 내가 어떤 기억을 힘으로 삼고 어떤 기억을 아직 무겁게 느끼는지 분석해주세요.
2. 지금의 내가 소중하게 생각하는 단어와 힘들게 느끼는 단어를 비교해서, 현재 내 마음의 중심과 부담을 설명해주세요.
3. 과거와 지금 나를 지탱하는 단어가 무엇을 의미하는지 분석해주세요.
4. 남아 있는 힘든 단어와 그것을 극복할 단어의 연결을 해석해주세요.
5. 최종 5개의 단어를 바탕으로, 앞으로 내가 어떤 방향으로 나아가고 싶어 하는지 정리해주세요.
6. 오래 고민한 단계와 선택했다가 취소한 단어가 있다면, 그 단어들이 어떤 망설임이나 갈등을 보여주는지도 부드럽게 설명해주세요.

말투는 단정적이기보다 조심스럽고 따뜻하게 해주세요.
`.trim();
}
