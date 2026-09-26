import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RealmReady: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#81c784] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Environment */}
      <div className="absolute inset-0 pointer-events-none opacity-40" 
           style={{ 
             backgroundImage: 'radial-gradient(#66bb6a 15%, transparent 15%), radial-gradient(#66bb6a 15%, transparent 15%)', 
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0, 20px 20px'
           }} 
      />

      {/* Characters */}
      <div className="absolute bottom-10 left-20 animate-pulse text-8xl" style={{ animationDuration: '3s' }}>
        🧙‍♂️
      </div>
      <div className="absolute bottom-10 right-20 animate-bounce text-6xl" style={{ animationDuration: '2s' }}>
        🦉
      </div>
      <div className="absolute top-10 left-10 text-6xl opacity-30">☁️</div>
      <div className="absolute top-20 right-10 text-8xl opacity-30">☁️</div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="z-10 text-center max-w-lg"
      >
        <div className="bg-realm-parchment rounded-xl border-4 border-realm-brown shadow-2xl p-12 relative">
          {/* Confetti / Sparkles effect simulated with text */}
          <div className="absolute -top-10 -left-10 text-4xl animate-spin" style={{ animationDuration: '4s' }}>✨</div>
          <div className="absolute -top-10 -right-10 text-4xl animate-spin" style={{ animationDuration: '5s' }}>🌟</div>
          
          <h1 className="font-pixel text-3xl text-realm-brown mb-6 leading-relaxed">
            YOUR REALM IS<br/><span className="text-realm-purple">READY!</span>
          </h1>
          
          <p className="text-realm-brown font-bold text-lg mb-10 leading-relaxed">
            Based on your choices, we've prepared a personalized journey for you.
          </p>

          <button
            onClick={() => navigate('/realm')}
            className="w-full bg-realm-gold hover:bg-yellow-400 text-realm-brown font-pixel text-sm py-5 border-b-[6px] border-r-[6px] border-realm-brown active:border-0 active:mt-1.5 transition-all shadow-lg"
          >
            ENTER THE REALM →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RealmReady;
