import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    title: "Question 1 — Current Stage",
    question: "What describes you right now?",
    options: ["School Student", "Undergraduate Student", "Postgraduate Student", "Working Professional", "Career Changer", "Other"]
  },
  {
    title: "Question 2 — Interests",
    question: "What are you interested in?",
    options: ["Technology", "Business", "Science", "Arts", "Design", "Finance", "Healthcare", "Research", "Other"],
    multiple: true
  },
  {
    title: "Question 3 — Goals",
    question: "What do you want to achieve?",
    options: ["Find a Career", "Find a Job", "Learn New Skills", "Prepare for Exams", "Find Scholarships", "Manage Finances", "Improve Fitness", "Personal Growth"],
    multiple: true
  },
  {
    title: "Question 4 — Skills",
    question: "Which skills do you possess?",
    options: ["Java", "Python", "SQL", "Communication", "Mathematics", "Research", "Writing"],
    multiple: true
  },
  {
    title: "Question 5 — Time",
    question: "How much time can you dedicate daily?",
    options: ["Less than 30 minutes", "30–60 minutes", "1–2 hours", "More than 2 hours"]
  }
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const handleSelect = (option: string) => {
    const isMultiple = steps[currentStep].multiple;
    if (isMultiple) {
      setAnswers(prev => {
        const current = (prev[currentStep] as string[]) || [];
        if (current.includes(option)) {
          return { ...prev, [currentStep]: current.filter(o => o !== option) };
        } else {
          return { ...prev, [currentStep]: [...current, option] };
        }
      });
    } else {
      setAnswers(prev => ({ ...prev, [currentStep]: option }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete setup
      navigate('/realm-ready');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: '#71a361',
        backgroundImage: 'radial-gradient(#5d8a4d 15%, transparent 15%), radial-gradient(#5d8a4d 15%, transparent 15%)',
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px'
      }}
    >

      <div className="z-10 w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2 text-realm-brown">
            {steps.map((_, idx) => (
              <React.Fragment key={idx}>
                <div className={`w-3 h-3 rounded-full border-2 border-realm-brown ${idx <= currentStep ? 'bg-realm-gold' : 'bg-transparent'}`} />
                {idx < steps.length - 1 && (
                  <div className={`h-1 w-8 ${idx < currentStep ? 'bg-realm-brown' : 'bg-realm-brown/30'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="font-pixel text-xs mt-2 text-realm-brown bg-white/50 px-3 py-1 rounded">
            {currentStep + 1} / {steps.length}
          </p>
        </div>

        {/* Scroll Container */}
        <div className="relative bg-[#fcf5e3] rounded-2xl border-4 border-[#b58c5a] shadow-2xl p-8 min-h-[400px] flex flex-col">
          {/* Decorative elements */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <span className="text-4xl">📜</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex flex-col"
            >
              <div className="text-center mb-8">
                <h2 className="font-pixel text-sm text-realm-purple mb-4">Royal Decree</h2>
                <h1 className="text-2xl font-bold text-realm-brown">{steps[currentStep].question}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {steps[currentStep].options.map(option => {
                  const isMultiple = steps[currentStep].multiple;
                  const currentAnswer = answers[currentStep];
                  const isSelected = isMultiple 
                    ? (currentAnswer as string[])?.includes(option)
                    : currentAnswer === option;

                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`
                        p-4 border border-[#d4c3a3] rounded-lg text-left font-bold transition-all shadow-sm
                        hover:-translate-y-1 hover:shadow-md
                        ${isSelected 
                          ? 'border-[#483c6c] bg-[#483c6c]/10 text-[#483c6c] shadow-[3px_3px_0px_#483c6c]' 
                          : 'bg-[#fdfaf0] text-[#4a3b2c] hover:border-[#483c6c]'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{isSelected ? '✨' : '🔮'}</span>
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 pt-4 flex justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`font-bold text-sm px-6 py-3 rounded-lg border border-[#d4c3a3] transition-all ${currentStep === 0 ? 'opacity-0 cursor-not-allowed' : 'bg-white text-[#4a3b2c] hover:bg-gray-50'}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="font-bold text-sm px-8 py-3 rounded-lg bg-[#483c6c] text-white hover:bg-[#382d56] transition-colors shadow-md flex-grow md:flex-grow-0"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next >'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
