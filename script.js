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

    renderWordSelection({
      title: flow.step5.title,
      words,
      selectCount: flow.step5.selectCount,
      resultKey: flow.step5.resultKey,
      guideText: "과거의 긍정 단어와 지금 소중한 단어 중, 나를 지탱하는 단어 5개를 골라주세요."
    });
    return;
  }

  if (stepKey === "step6") {
    const words = [...answers.pastNegative, ...answers.currentHard];

    renderWordSelection({
      title: flow.step6.title,
      words,
      selectCount: flow.step6.selectCount,
      resultKey: flow.step6.resultKey,
      guideText: "과거의 부정 단어와 지금 힘든 단어 중, 아직 남아 있는 힘든 단어 5개를 골라주세요."
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
      title: flow.step8.title,
      words,
      selectCount: flow.step8.selectCount,
      resultKey: flow.step8.resultKey,
      guideText: "나를 지탱한 단어와 힘든 무게를 극복할 단어 중, 지금의 나에게 가장 중요한 최종 5개를 골라주세요."
    });
  }
}
