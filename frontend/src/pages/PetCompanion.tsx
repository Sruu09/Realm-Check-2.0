import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';

const PetCompanion: React.FC = () => {
  const navigate = useNavigate();
  const [petMessage, setPetMessage] = useState<string>("Loading your pet's thoughts... Woof!");
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPetGreeting = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/pet/message');
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setPetMessage(data.message);
          return;
        }
      }
      setPetMessage("Let's finish today's quests! Woof!");
    } catch {
      setPetMessage("Let's finish today's quests! Woof!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPetGreeting();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8081/api/pet/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setPetMessage(data.message);
          return;
        }
      }
      setPetMessage("Woof! I'm always happy to go on adventures with you!");
    } catch {
      setPetMessage("Woof! I'm always happy to go on adventures with you!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#453023] p-4 md:p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      {/* Woodland Clearing Ambient Texture */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#6e4c34 16%, transparent 16%),
            linear-gradient(45deg, #332218 25%, transparent 25%, transparent 75%, #332218 75%, #332218)
          `,
          backgroundSize: '32px 32px, 16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#fcf8ee] border-2 border-[#b59d79] px-3.5 py-2 rounded-xl shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-[#4a3520] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Companion Sanctuary Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#fbf6eb] rounded-2xl border-4 border-[#8c6b41] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden h-[88vh] mt-6">
        
        {/* Companion Header */}
        <div className="bg-[#483017] px-6 py-4 flex items-center justify-between border-b-4 border-[#32200e] relative flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#ea580c] border-2 border-[#fed7aa] rounded-xl flex items-center justify-center text-2xl shadow-inner">
              🐕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#fef9c3] tracking-wide uppercase">Pet Companion Den</h1>
                <span className="hidden sm:inline-block bg-[#9a3412] text-[#ffedd5] text-[9px] font-pixel px-2 py-0.5 rounded">LOYAL ALLY</span>
              </div>
              <p className="text-xs text-[#d7ba95] font-medium mt-0.5">Chat with your faithful adventurer pet for cheerful encouragement and companionship</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#fed7aa] font-pixel bg-[#32200e] px-3.5 py-1.5 rounded-lg border border-[#713f12]">
            <span>🐾 Heart Loyal</span>
          </div>
        </div>

        {/* Content Area: Habitat Stage + Chat Controls */}
        <div className="flex-grow flex flex-col justify-between p-6 md:p-8 relative z-10 bg-[#fcf8f2] overflow-hidden">
          
          {/* Woodland Habitat Meadow */}
          <div className="w-full flex-grow flex flex-col items-center justify-center relative bg-[#82996d] rounded-2xl border-4 border-[#5d734a] shadow-inner overflow-hidden p-6">
            {/* Soft Grass Pattern */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(#4d6139 20%, transparent 20%)',
                backgroundSize: '24px 24px'
              }} 
            />

            {/* Cozy Woodland Den Decor: Bedding, Food Bowl, Toys & Plants */}
            <div className="absolute bottom-6 flex items-center justify-center gap-12 z-10 pointer-events-none select-none">
              {/* Pet Bed Cushion */}
              <div className="w-24 h-10 bg-[#78350f] rounded-full border-2 border-[#92400e] shadow-md flex items-center justify-center">
                <div className="w-20 h-7 bg-[#b45309] rounded-full opacity-80" />
              </div>
              {/* Food & Water Bowls */}
              <div className="flex gap-2 -mt-2">
                <div className="w-8 h-5 bg-[#475569] rounded-b-lg border-t-2 border-[#cbd5e1] flex items-center justify-center text-[10px]">
                  🥩
                </div>
                <div className="w-8 h-5 bg-[#334155] rounded-b-lg border-t-2 border-[#38bdf8] flex items-center justify-center text-[10px]">
                  💧
                </div>
              </div>
            </div>

            {/* Floating Affection Hearts / Sparkles */}
            <div className="absolute bottom-32 flex gap-12 pointer-events-none animate-pulse">
              <span className="text-xl text-rose-400">💖</span>
              <span className="text-sm text-amber-300">✨</span>
            </div>

            {/* Expressive Speech Balloon */}
            <div className="bg-[#ffffff] border-2 border-[#8c7457] p-5 rounded-2xl shadow-xl max-w-md mb-48 relative z-20 animate-fade-in">
              <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#f0e4d0]">
                <div className="flex items-center gap-1.5 text-[#b45309] text-[11px] font-bold">
                  <Sparkles size={13} className="text-amber-500" />
                  <span className="font-pixel text-[10px]">Companion Thoughts</span>
                </div>
                <span className="text-[10px] text-[#78716c] font-semibold">Click pet to nudge</span>
              </div>
              <p className="font-semibold text-[#3d2f21] text-xs md:text-sm leading-relaxed text-center">
                &ldquo;{petMessage}&rdquo;
              </p>
              {/* Balloon tail */}
              <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[#8c7457] rotate-45" />
            </div>
            
            {/* The Pet Character with Idle Tail Wag & Bounce */}
            <div 
              onClick={fetchPetGreeting}
              title="Click your companion to hear a fresh bark!"
              className="absolute bottom-10 text-6xl md:text-7xl z-20 filter drop-shadow-[0_12px_10px_rgba(0,0,0,0.45)] cursor-pointer hover:scale-115 active:scale-95 transition-all select-none animate-bounce"
              style={{ animationDuration: '2.4s' }}
            >
              🐕
            </div>
          </div>

          {/* Quick Pet Interaction / Chat Form */}
          <div className="mt-4 pt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-bold text-[#8c7457] uppercase whitespace-nowrap">Say to Pet:</span>
              {[
                "Who's a good adventurer?",
                "How are my quests looking today?",
                "Give me a high paw for studying!",
                "Are you ready for the dungeon boss?"
              ].map((starter, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setInputMessage(starter)}
                  disabled={isLoading}
                  className="text-[11px] whitespace-nowrap bg-white hover:bg-[#fffbeb] border border-[#d6c7b2] text-[#4a3520] px-3 py-1 rounded-lg transition-colors shadow-2xs font-medium"
                >
                  {starter}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="w-full flex gap-2.5 relative z-30">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Talk to your companion (e.g. Let's study for exams together!)..."
                disabled={isLoading}
                className="flex-grow bg-white border-2 border-[#cbd5e1] rounded-xl px-4 py-3 text-xs md:text-sm text-[#1e293b] placeholder-[#94a3b8] font-semibold focus:outline-none focus:border-[#ea580c] shadow-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-[#c2410c] hover:bg-[#9a3412] text-white px-6 py-3 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50 text-xs md:text-sm uppercase tracking-wider flex-shrink-0"
              >
                <Send size={15} />
                <span>{isLoading ? 'Listening...' : 'Speak'}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PetCompanion;
