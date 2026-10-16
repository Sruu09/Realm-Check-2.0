import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles, BookOpen, Briefcase, GraduationCap, Zap, RotateCcw, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'wizard';
  text: string;
  source?: 'OPENAI' | 'BUILTIN_GUIDANCE';
  fallbackReason?: string;
  timestamp: string;
}

type GuidanceCategory = 'STUDY' | 'CAREER' | 'EXAM' | 'PRODUCTIVITY';

const categoryInfo: Record<
  GuidanceCategory,
  {
    title: string;
    subtitle: string;
    icon: any;
    cardBg: string;
    cardBorder: string;
    prompts: string[];
  }
> = {
  STUDY: {
    title: 'Study & Learning',
    subtitle: 'Clear concepts & notes',
    icon: BookOpen,
    cardBg: 'bg-[#e8f1f5]',
    cardBorder: 'border-[#b6ced8]',
    prompts: [
      'Explain OOP principles with a gentle example.',
      'How does client-server communication work?',
      'Break down recursion into small, simple steps.'
    ]
  },
  CAREER: {
    title: 'Career Guidance',
    subtitle: 'Roadmaps & projects',
    icon: Briefcase,
    cardBg: 'bg-[#f4ebe1]',
    cardBorder: 'border-[#d6c3af]',
    prompts: [
      'How do I make my resume clear and focused?',
      'What should I build for my first portfolio project?',
      'Tips for technical and behavioral interviews.'
    ]
  },
  EXAM: {
    title: 'Exam Preparation',
    subtitle: 'Timetables & practice',
    icon: GraduationCap,
    cardBg: 'bg-[#f5e8ea]',
    cardBorder: 'border-[#ddbec3]',
    prompts: [
      'Draft a calm 2-week revision plan for my test.',
      'How do I practice spaced repetition effectively?',
      'Give me 3 practice questions on databases.'
    ]
  },
  PRODUCTIVITY: {
    title: 'Daily Focus',
    subtitle: 'Habits & small steps',
    icon: Zap,
    cardBg: 'bg-[#eaf1e7]',
    cardBorder: 'border-[#bfd4b8]',
    prompts: [
      'How do I slice an overwhelming task into small goals?',
      'What is a peaceful morning study routine?',
      'Help me overcome afternoon study hesitation.'
    ]
  }
};

const WizardHouse: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<GuidanceCategory>('STUDY');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'wizard',
      text: 'Hello, traveler! Welcome to my quiet study nook. Pull up a chair, brew a warm tea, and let me know what we can learn together today.',
      source: 'BUILTIN_GUIDANCE',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    setInputValue('');
    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyPayload = newMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('http://localhost:8081/api/wizard/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          message: query,
          history: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const wizardReply: ChatMessage = {
        id: `wiz-${Date.now()}`,
        sender: 'wizard',
        text: data.response || "I am reflecting on your question. Let us try once more together.",
        source: data.source || 'BUILTIN_GUIDANCE',
        fallbackReason: data.fallbackReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, wizardReply]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to the study study desk. Please check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'wizard',
        text: `Fresh parchment ready for ${categoryInfo[selectedCategory].title}! What would you like to explore?`,
        source: 'BUILTIN_GUIDANCE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1322] p-4 md:p-8 flex items-center justify-center relative font-body select-none overflow-hidden">
      
      {/* Deep Navy Midnight Sky & Star Field */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#818cf8 15%, transparent 16%),
            radial-gradient(#c084fc 12%, transparent 13%),
            radial-gradient(#fde047 10%, transparent 12%)
          `,
          backgroundSize: '48px 48px, 64px 64px, 80px 80px',
          backgroundPosition: '0 0, 24px 24px, 40px 10px'
        }} 
      />

      {/* Atmospheric Star Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#1e1b4b] rounded-full blur-[90px] opacity-60 pointer-events-none" />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 max-w-5xl mx-auto flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={() => navigate('/realm')}
          className="pointer-events-auto bg-[#182035] border-2 border-[#37476e] hover:border-[#6366f1] px-3.5 py-2 rounded-xl shadow-lg hover:bg-[#202b47] transition-all flex items-center gap-1.5 text-[#cbd5e1] font-semibold text-xs"
        >
          <ChevronLeft size={16} /> Back to Realm
        </button>

        <button 
          onClick={handleResetConversation}
          title="Clear notes and start anew"
          className="pointer-events-auto bg-[#182035] border-2 border-[#37476e] hover:border-[#6366f1] text-[#cbd5e1] hover:bg-[#202b47] px-3 py-2 rounded-xl shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCcw size={13} /> Reset Notes
        </button>
      </div>

      {/* Main Night Study Chamber Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#141b2d] rounded-2xl border-4 border-[#33416b] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden h-[88vh] mt-6">
        
        {/* Wizard Sanctum Header */}
        <div className="bg-[#1b253d] border-b-2 border-[#2c395c] px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#263559] border-2 border-[#4f649b] rounded-xl flex items-center justify-center text-2xl shadow-inner">
              🧙‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#e2e8f0] tracking-wide">Wizard's Study Sanctum</h1>
                <span className="hidden sm:inline-block bg-[#4338ca] text-[#e0e7ff] text-[9px] font-pixel px-2 py-0.5 rounded">AI MENTOR</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">Gentle guidance for studies, career planning, and mindful habits</p>
            </div>
          </div>

          {/* Mystic Pixel Study Accents */}
          <div className="hidden sm:flex items-center gap-3 text-lg opacity-90 text-[#a5b4fc]">
            <span title="Grimoire">📖</span>
            <span title="Candlelight">🕯️</span>
            <span title="Herbal Elixir">🧪</span>
            <span title="Starlight">✨</span>
          </div>
        </div>

        {/* 4 Guidance Category Cards */}
        <div className="bg-[#101726] p-3 border-b-2 border-[#24314f] grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-shrink-0">
          {(Object.keys(categoryInfo) as GuidanceCategory[]).map((cat) => {
            const info = categoryInfo[cat];
            const Icon = info.icon;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-2.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1e2942] border-[#818cf8] shadow-[0_0_12px_rgba(129,140,248,0.25)] -translate-y-0.5'
                    : 'bg-[#151e33] border-[#293554] opacity-75 hover:opacity-100 hover:border-[#43527a]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-pixel text-[10px] md:text-[11px] ${isSelected ? 'text-[#e0e7ff]' : 'text-[#cbd5e1]'}`}>
                    {info.title}
                  </span>
                  <Icon size={14} className={isSelected ? 'text-[#a5b4fc]' : 'text-[#64748b]'} />
                </div>
                <span className="text-[10px] text-[#94a3b8] font-medium leading-tight">{info.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Muted Night Study Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-[#111726] select-text custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#718096] font-semibold">
                <span>{msg.sender === 'user' ? 'Student' : 'Study Mentor'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.sender === 'wizard' && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      msg.source === 'OPENAI'
                        ? 'bg-[#1e293b] text-[#38bdf8] border border-[#0284c7]'
                        : 'bg-[#292218] text-[#fbbf24] border border-[#d97706]'
                    }`}
                  >
                    {msg.source === 'OPENAI' ? 'Live AI' : 'Archive Notes'}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] md:max-w-[75%] p-3.5 rounded-xl text-xs md:text-sm leading-relaxed border-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#1e2942] text-[#f1f5f9] border-[#38486f] rounded-br-none shadow-md'
                    : 'bg-[#1c2438] text-[#e2e8f0] border-[#2e3b5b] rounded-bl-none shadow-sm font-normal'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.fallbackReason && (
                  <div className="mt-2 pt-2 border-t border-[#293552] text-[10px] text-[#94a3b8] italic flex items-center gap-1">
                    <Sparkles size={11} className="text-[#a5b4fc]" /> Note: {msg.fallbackReason}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="bg-[#1c2438] border-2 border-[#2e3b5b] px-3.5 py-2 rounded-xl rounded-bl-none shadow-sm flex items-center gap-2 text-xs text-[#cbd5e1] font-medium">
                <Sparkles size={13} className="animate-spin text-[#818cf8]" />
                <span>The wizard is contemplating your question in starlight...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Calm Suggested Prompt Chips */}
        <div className="bg-[#18233a] px-4 py-2 border-t-2 border-[#2b3a5d] flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] font-semibold text-[#94a3b8] whitespace-nowrap">Suggested:</span>
          {categoryInfo[selectedCategory].prompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap bg-[#202d4a] hover:bg-[#28385c] border border-[#37476e] text-[#cbd5e1] hover:text-white px-3 py-1 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Error notification bar if failed */}
        {errorMessage && (
          <div className="bg-[#3e1f24] border-t border-[#6b2b34] text-[#fecaca] px-4 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="underline font-bold text-red-300 hover:text-white ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-[#141b2d] p-3 md:p-3.5 border-t-2 border-[#293554] flex gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about ${categoryInfo[selectedCategory].title.toLowerCase()}...`}
            disabled={isLoading}
            className="flex-grow bg-[#1b253d] border-2 border-[#334268] rounded-xl px-4 py-2 text-xs md:text-sm text-[#f1f5f9] placeholder-[#64748b] font-normal focus:outline-none focus:border-[#818cf8] shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#4f46e5] hover:bg-[#4338ca] active:scale-95 text-white px-4 md:px-5 py-2 rounded-xl font-semibold shadow-md flex items-center gap-1.5 text-xs md:text-sm transition-all disabled:opacity-40"
          >
            <Send size={14} />
            <span>Consult</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default WizardHouse;
