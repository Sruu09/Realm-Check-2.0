import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WizardDialogue: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [command, setCommand] = useState('');
  
  const [currentFullMessage, setCurrentFullMessage] = useState("Greetings, Explorer!\nWelcome back. Your journey towards a brighter you continues.\nWhat shall we explore today?");

  useEffect(() => {
    if (isOpen) {
      let i = 0;
      setMessage('');
      const interval = setInterval(() => {
        setMessage(prev => prev + currentFullMessage.charAt(i));
        i++;
        if (i >= currentFullMessage.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentFullMessage]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.toLowerCase().trim();
    setCommand('');

    const responses: Record<string, string> = {
      help: "Available commands:\nstats, quests, daily, xp, level, gold, savings, journal, mood, study, exams, boss, streak, progress, status",
      stats: "Player Stats:\nLevel: 12\nXP: 2450/5000\nGold: 250\nSavings: ₹12,500\nStreak: 15 days\nMood: Good",
      status: "Your current Realm status:\nLevel 12 | XP 2450\n3 active quests\n15 quests completed\nSavings: ₹12,500",
      quests: "You currently have 3 active quests.\nComplete them to gain XP and Gold!",
      daily: "Today's quests:\n- Study for 1 Hour\n- Practice DSA\n- Complete Assignment",
      xp: "You currently have 2450 XP.\n2550 XP required for the next level.",
      level: "You are currently Level 12.\nKeep completing quests to level up!",
      gold: "Current Gold: 250",
      savings: "Current Savings: ₹12,500",
      mood: "Current Mood: Good",
      study: "Total Study Time: 14 hours\nStudy XP Earned: 520 XP",
      exams: "Upcoming Exams:\n- DIVP (15 Oct 2026)",
      boss: "Current Boss:\nBook Demon (DIVP)\nPreparation: 40%",
      streak: "Current Streak: 15 days",
      progress: "Overall Progress:\nLevel: 12\nXP: 2450\nQuests Completed: 15\nStudy Hours: 14\nExams Completed: 2",
      commands: "Type 'help' to view all available Wizard commands."
    };

    if (responses[cmd]) {
      setCurrentFullMessage(responses[cmd]);
    } else {
      setCurrentFullMessage(`I do not understand the incantation '${cmd}'.\nType 'help' for a list of known commands.`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 pointer-events-auto z-50"
        >
          <div className="bg-[#1a233a] rounded-xl border-4 border-[#3a4a6b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 relative flex gap-6">
            
            <div className="w-20 h-20 bg-[#0d1326] border-2 border-[#3a4a6b] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 -mt-2 -ml-2 shadow-lg">
               <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=Wizard2`} alt="Wizard" className="w-full h-full object-cover scale-150" />
            </div>

            <div className="flex-grow pt-1 flex flex-col">
              <h3 className="font-bold text-blue-400 mb-2 text-sm tracking-widest uppercase text-shadow-sm flex justify-between">
                <span>Wizard</span>
                <span className="text-[9px] text-gray-500">Type a command...</span>
              </h3>
              
              <div className="font-body text-gray-200 text-sm leading-relaxed whitespace-pre-line min-h-[60px] flex-grow">
                {message}
                {message.length === currentFullMessage.length && <span className="animate-pulse ml-1 text-yellow-400">▼</span>}
              </div>

              {/* Command Input Area */}
              <form onSubmit={handleCommand} className="mt-3 border-t border-[#3a4a6b] pt-3 flex gap-2">
                <span className="text-gray-400 font-pixel text-xs mt-2">{'>'}</span>
                <input 
                  type="text" 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Ask me anything (try 'help')..."
                  className="flex-grow bg-transparent outline-none text-white font-pixel text-xs placeholder-gray-600"
                  autoFocus
                />
                <button type="submit" className="hidden">Send</button>
              </form>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-[#3a4a6b] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WizardDialogue;
