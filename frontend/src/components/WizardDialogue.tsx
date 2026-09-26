import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WizardDialogue: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  
  const fullMessage = "Greetings, Explorer!\nWelcome back! Your journey towards a brighter you continues. What shall we explore today?";

  useEffect(() => {
    if (isOpen) {
      let i = 0;
      setMessage('');
      const interval = setInterval(() => {
        setMessage(prev => prev + fullMessage.charAt(i));
        i++;
        if (i >= fullMessage.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 pointer-events-auto"
        >
          <div className="bg-[#191e32] rounded-xl border-4 border-[#33415c] shadow-2xl p-6 relative flex gap-6">
            
            {/* Wizard Portrait - in image it's on the left, sticking out slightly. 
                Since we mask the background, we'll recreate a simple avatar box here */}
            <div className="w-24 h-24 bg-[#0b1021] border-2 border-[#33415c] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 -ml-2">
               <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=Wizard`} alt="Wizard" className="w-full h-full object-cover scale-150" />
            </div>

            {/* Dialogue */}
            <div className="flex-grow pt-1">
              <h3 className="font-bold text-blue-400 mb-2 text-sm tracking-wide">Wizard</h3>
              <p className="font-body text-gray-200 text-sm leading-relaxed whitespace-pre-line min-h-[60px]">
                {message}
                {message.length === fullMessage.length && <span className="animate-pulse ml-1">▼</span>}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WizardDialogue;
