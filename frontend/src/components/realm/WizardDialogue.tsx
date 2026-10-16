import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserStats, type User as UserStats } from '../../services/UserService';

const WizardDialogue: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [command, setCommand] = useState('');
  const [currentFullMessage, setCurrentFullMessage] = useState(
    "Greetings, Explorer!\nWelcome back. Your journey towards a brighter you continues.\nWhat shall we explore today?"
  );
  const [stats, setStats] = useState<UserStats | null>(null);

  // Fetch logged‑in user stats once
  useEffect(() => {
    const storedId = Number(localStorage.getItem('userId') ?? '0');
    if (storedId) {
      getUserStats(storedId).then(setStats).catch(console.error);
    }
  }, []);

  // Typewriter effect for wizard messages
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

  const buildResponse = (cmd: string): string => {
    if (!stats) return 'Loading...';
    const { level, xp, savings, streak, xpForNextLevel } = stats as any;
    const xpNeeded = (xpForNextLevel ?? level * 100) - (xp ?? 0);
    switch (cmd) {
      case 'help':
        return "Available commands:\nstats, quests, daily, xp, level, savings, journal, study, exams, boss, streak, progress, status";
      case 'stats':
        return `Player Stats:\nLevel: ${level}\nXP: ${xp}/${xpForNextLevel ?? level * 100}\nSavings: ₹${savings}\nStreak: ${streak} days`;
      case 'status':
        return `Your current Realm status:\nLevel ${level} | XP ${xp}\n${streak} day streak\nSavings: ₹${savings}`;
      case 'quests':
        return "You currently have active quests. Complete them to gain XP!";
      case 'daily':
        return "Today's quests:\n- Study for 1 Hour\n- Practice DSA\n- Complete Assignment";
      case 'xp':
        return `You currently have ${xp} XP.\n${xpNeeded} XP required for the next level.`;
      case 'level':
        return `You are currently Level ${level}.\nKeep completing quests to level up!`;


      case 'savings':
        return `Current Savings: ₹${savings}`;
      case 'study':
        return "Study stats are not available in this version.";
      case 'exams':
        return "Exam schedule is not available in this version.";
      case 'boss':
        return "Boss information is not available in this version.";
      case 'streak':
        return `Current Streak: ${streak} days`;
      case 'progress':
        return `Overall Progress:\nLevel: ${level}\nXP: ${xp}\nSavings: ₹${savings}\nStreak: ${streak} days`;
      default:
        return `I do not understand the incantation '${cmd}'.\nType 'help' for a list of known commands.`;
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.toLowerCase().trim();
    setCommand('');
    setCurrentFullMessage(buildResponse(cmd));
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
