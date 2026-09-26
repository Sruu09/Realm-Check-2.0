import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PetCompanion: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#8c6742] p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      {/* Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at center, #a37e55 0%, #8c6742 70%)'
      }} />

      {/* Back Button */}
      <button 
        onClick={() => navigate('/realm')}
        className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold"
      >
        <ChevronLeft /> Back to Realm
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#a37e55] rounded-2xl border-8 border-[#593f26] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden h-[80vh]">
        
        {/* Header */}
        <div className="bg-[#e0cdad] border-b-8 border-[#7a5e3f] p-4 text-center relative shadow-md flex-shrink-0">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-12 h-12 bg-orange-300 border-4 border-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20">
            🐕
          </div>
          <h1 className="font-pixel text-2xl text-[#4a3b2c] tracking-widest uppercase">Pet Area</h1>
          <p className="text-xs font-bold text-[#8c7457] uppercase tracking-[0.2em] mt-1">Your Companion</p>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex p-8 gap-8 relative z-10">
          
          <div className="w-full flex flex-col items-center justify-center relative">
             {/* Doghouse */}
             <div className="absolute bottom-10 text-9xl z-0 filter drop-shadow-xl opacity-80">
               🏠
             </div>

             {/* Pet Chat */}
             <div className="bg-[#fcf5e3] border-4 border-[#b58c5a] p-4 rounded-xl shadow-xl max-w-sm mb-48 relative z-10 animate-bounce" style={{ animationDuration: '4s' }}>
                <p className="font-bold text-[#4a3b2c] text-sm leading-relaxed text-center">
                  "Let's finish today's quests! Woof!"
                </p>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#fcf5e3] border-b-4 border-r-4 border-[#b58c5a] rotate-45" />
             </div>
             
             {/* Pet */}
             <div className="absolute bottom-20 text-7xl z-20 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-110 transition-transform">
               🐕
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PetCompanion;
