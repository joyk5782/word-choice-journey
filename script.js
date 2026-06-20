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
    title: "1단계. 과거를 회상할 때 긍정적인 순간을 떠올리는 단어",
    guide: "과거를 떠올릴 때 긍정적인 순간과 연결되는 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "pastPositive"
  },
  step2: {
    label: "2단계",
    title: "2단계. 과거를 회상할 때 부정적인 순간을 떠올리는 단어",
    guide: "과거를 떠올릴 때 아직 무겁게 남아 있는 단어 5개를 골라주세요.",
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
    title: "4단계. 지금의 내가 힘들게 느껴지는 단어",
    guide: "지금의 내가 힘들게 느끼는 감정이나 상태에 가까운 단어 10개를 골라주세요.",
    selectCount: 10,
    resultKey: "currentHard"
  },
  step5: {
    label: "5단계",
    title: "5단계. 과거와 지금 나를 지탱하는 단어",
    guide: "과거의 긍정 단어와 지금 소중한 단어 중, 나를 지탱하는 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "supportingWords"
  },
  step6: {
    label: "6단계",
    title: "6단계. 남아 있는 힘든 단어",
    guide: "과거의 부정 단어와 지금 힘든 단어 중, 아직 남아 있는 힘든 단어 5개를 골라주세요.",
    selectCount: 5,
    resultKey: "remainingHardWords"
  },
  step7: {
    label: "7단계",
    title: "7단계. 힘든 무게를 극복할 단어",
    guide: "남아 있는 힘든 단어마다, 그 무게를 넘어서는 데 필요한 단어를 직접 적어주세요.",
    resultKey: "recoveryWords"
  },
  step8: {
    label: "8단계",
    title: "8단계. 최종 5개의 단어",
    guide: "나를 지탱한 단어와 극복을 위한 단어 중, 지금의 나에게 가장 중요한 최종 5개를 골라주세요.",
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
