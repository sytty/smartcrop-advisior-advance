import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useTutorial } from '@/hooks/useTutorial.jsx';

const tutorialData = {
  'ai-advisor': [
    { title: 'Welcome to AI Advisor', content: 'This tool uses artificial intelligence to tell you exactly what to plant for maximum profit.' },
    { title: 'Smart Recommendations', content: 'Here you will see the top 3 crops recommended for your specific soil and weather conditions.' },
    { title: 'Why this crop?', content: 'Click the "Why?" button on any recommendation to see the simple math and logic behind the suggestion.' },
    { title: 'Learning Mode', content: 'Switch to Learning Mode to watch simple video tutorials about how to grow your new crops.' }
  ]
};

const TutorialModal = () => {
  const { isActive, currentStep, tutorialId, nextStep, prevStep, endTutorial } = useTutorial();

  if (!isActive || !tutorialId || !tutorialData[tutorialId]) return null;

  const steps = tutorialData[tutorialId];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={endTutorial} />
        
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="bg-[hsl(var(--brand-night))] border border-[#00d4ff]/50 shadow-[0_0_50px_rgba(0,212,255,0.2)] rounded-2xl w-full max-w-lg relative z-10 pointer-events-auto overflow-hidden"
        >
          <div className="h-2 bg-white/10 w-full">
            <div className="h-full bg-[#00d4ff] transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
          
          <div className="p-8">
            <button onClick={endTutorial} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8">
              <span className="text-[#00d4ff] font-bold text-sm uppercase tracking-wider mb-2 block">
                Step {currentStep + 1} of {steps.length}
              </span>
              <h2 className="text-3xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
              <p className="text-xl text-gray-300 leading-relaxed">{steps[currentStep].content}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button 
                onClick={endTutorial}
                className="text-gray-400 hover:text-white font-medium"
              >
                Skip Tutorial
              </button>
              
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button onClick={prevStep} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <button 
                  onClick={isLastStep ? endTutorial : nextStep} 
                  className="flex items-center px-6 py-3 rounded-xl bg-[#00d4ff] text-black font-bold hover:bg-[#00b3cc] transition-colors"
                >
                  {isLastStep ? (
                    <><CheckCircle2 className="w-5 h-5 mr-2" /> Finish</>
                  ) : (
                    <>Next <ChevronRight className="w-5 h-5 ml-2" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialModal;