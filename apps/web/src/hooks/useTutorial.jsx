import React, { createContext, useContext, useState } from 'react';

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialId, setTutorialId] = useState(null);

  const startTutorial = (id) => {
    setTutorialId(id);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const endTutorial = () => {
    setIsActive(false);
    if (tutorialId) {
      localStorage.setItem(`tutorial_completed_${tutorialId}`, 'true');
    }
  };

  return (
    <TutorialContext.Provider value={{ isActive, currentStep, tutorialId, startTutorial, nextStep, prevStep, endTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);