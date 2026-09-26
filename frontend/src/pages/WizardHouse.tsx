import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const WizardHouse: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1b1c3a] p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      {/* Background simulating wizard study */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at center, #2d3063 0%, #1b1c3a 70%)'
      }} />

      {/* Back Button */}
      <button 
        onClick={() => navigate('/realm')}
        className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold"
      >
        <ChevronLeft /> Back to Realm
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#25274d] rounded-2xl border-8 border-[#15162c] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden h-[80vh]">
        
        {/* Header */}
        <div className="bg-[#e0cdad] border-b-8 border-[#7a5e3f] p-4 text-center relative shadow-md flex-shrink-0">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-12 h-12 bg-indigo-900 border-4 border-blue-400 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20">
            🧙‍♂️
          </div>
          <h1 className="font-pixel text-2xl text-[#4a3b2c] tracking-widest uppercase">Wizard's Tower</h1>
          <p className="text-xs font-bold text-[#8c7457] uppercase tracking-[0.2em] mt-1">Guidance & Advice</p>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex p-8 gap-8 relative z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          
          {/* Left Side: The Wizard */}
          <div className="w-1/2 flex flex-col items-center justify-center relative">
             <div className="bg-[#fcf5e3] border-4 border-[#b58c5a] p-4 rounded-xl shadow-xl max-w-sm mb-8 relative">
                <p className="font-bold text-[#4a3b2c] text-sm leading-relaxed text-center">
                  Every great journey begins with a single quest.<br/>What guidance do you seek?
                </p>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#fcf5e3] border-b-4 border-r-4 border-[#b58c5a] rotate-45" />
             </div>
             
             <div className="text-9xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
               🧙‍♂️
             </div>
          </div>

          {/* Right Side: Options */}
          <div className="w-1/2 flex flex-col gap-4 justify-center pr-10">
             {[
               { id: 1, icon: '📘', title: 'Learning Guidance' },
               { id: 2, icon: '📜', title: 'Career Guidance' },
               { id: 3, icon: '💡', title: 'Study Tips' },
               { id: 4, icon: '⚔️', title: 'Exam Preparation' },
               { id: 5, icon: '🌿', title: 'Productivity' }
             ].map(opt => (
                <button key={opt.id} className="bg-[#fcf5e3] border-4 border-[#b58c5a] hover:bg-white hover:-translate-y-1 transition-all rounded-xl p-4 flex items-center gap-4 shadow-lg group">
                   <span className="text-2xl filter drop-shadow-sm">{opt.icon}</span>
                   <span className="font-bold text-[#4a3b2c] group-hover:text-indigo-800 transition-colors">{opt.title}</span>
                </button>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WizardHouse;
