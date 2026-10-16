import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  category: 'quest' | 'finance' | 'fitness' | 'learning' | 'social';
  color: string;
  borderColor: string;
  unlockedBg: string;
}

const BADGES: Badge[] = [
  {
    id: 'first_quest',
    icon: '⚔️',
    title: 'First Quest',
    description: 'Completed your very first quest.',
    unlocked: true,
    category: 'quest',
    color: '#4a7c59',
    borderColor: '#7abc95',
    unlockedBg: '#e8f5ee',
  },
  {
    id: 'study_streak',
    icon: '🔥',
    title: 'Study Streak',
    description: 'Maintained a 3-day learning streak.',
    unlocked: true,
    category: 'learning',
    color: '#b85c38',
    borderColor: '#e89878',
    unlockedBg: '#fff0eb',
  },
  {
    id: 'knowledge_seeker',
    icon: '📚',
    title: 'Knowledge Seeker',
    description: 'Browsed the Library and found a course.',
    unlocked: true,
    category: 'learning',
    color: '#5a6fa8',
    borderColor: '#8aaae0',
    unlockedBg: '#eef2ff',
  },
  {
    id: 'saving_starter',
    icon: '💰',
    title: 'Saving Starter',
    description: 'Made your first deposit in the Treasure.',
    unlocked: true,
    category: 'finance',
    color: '#7a6a28',
    borderColor: '#c8b54c',
    unlockedBg: '#fffbea',
  },
  {
    id: 'garden_explorer',
    icon: '🌿',
    title: 'Garden Explorer',
    description: 'Logged your first workout in the Garden.',
    unlocked: false,
    category: 'fitness',
    color: '#3d7a54',
    borderColor: '#7abc95',
    unlockedBg: '#e8f5ee',
  },
  {
    id: 'exam_ready',
    icon: '📝',
    title: 'Exam Ready',
    description: 'Explored the Arena for exam preparation.',
    unlocked: false,
    category: 'learning',
    color: '#7a4a8a',
    borderColor: '#c090d8',
    unlockedBg: '#f5eeff',
  },
  {
    id: 'wizard_disciple',
    icon: '🧙',
    title: 'Wizard Disciple',
    description: 'Asked the Wizard for guidance.',
    unlocked: false,
    category: 'learning',
    color: '#3a5a8a',
    borderColor: '#7090c8',
    unlockedBg: '#eef2ff',
  },
  {
    id: 'pond_keeper',
    icon: '🪷',
    title: 'Pond Keeper',
    description: 'Wrote 5 journal entries at the Pond.',
    unlocked: false,
    category: 'social',
    color: '#4a7a8a',
    borderColor: '#70b0c8',
    unlockedBg: '#e8f5ff',
  },
  {
    id: 'realm_traveler',
    icon: '🗺️',
    title: 'Realm Traveler',
    description: 'Visited every location in the Realm.',
    unlocked: false,
    category: 'quest',
    color: '#7a4a28',
    borderColor: '#c07850',
    unlockedBg: '#fff5ee',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'quest', label: 'Quests', icon: '⚔️' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'fitness', label: 'Fitness', icon: '🌿' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'social', label: 'Social', icon: '🤝' },
];

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [badges] = useState<Badge[]>(BADGES);

  const filtered = activeCategory === 'all'
    ? badges
    : badges.filter(b => b.category === activeCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen bg-[#faf3e0] p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[#4a3b2c] hover:text-[#6b4c2c] transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-bold">Back</span>
        </button>
        <div className="flex-grow" />
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="font-pixel text-2xl text-[#4a3b2c] uppercase tracking-wider mb-1">🏆 Achievements</h1>
        <p className="text-sm text-[#8c7457] font-bold">
          {unlockedCount} / {totalCount} badges earned
        </p>
        {/* Progress bar */}
        <div className="mt-3 mx-auto max-w-xs bg-[#e0cdad] rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-[#7abc95] rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 ${
              activeCategory === cat.id
                ? 'bg-[#3d2516] text-white border-[#3d2516]'
                : 'bg-[#f0e6d2] text-[#4a3b2c] border-[#c7b293] hover:bg-[#e0cdad]'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Demo label */}
      <div className="text-center mb-4">
        <span className="inline-block bg-[#f5e8cc] border border-[#c7b293] text-[#8c7457] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Demo — badges reflect sample progress
        </span>
      </div>

      {/* Collectible Royal Medallions Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full pb-8">
        {filtered.map(badge => (
          <div
            key={badge.id}
            className={`relative rounded-2xl p-5 border-4 flex flex-col items-center text-center transition-all ${
              badge.unlocked
                ? 'bg-[#fffaf0] border-[#b89758] shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(184,151,88,0.3)] ring-2 ring-[#d4af37]/40'
                : 'bg-[#f4efe6] border-[#cfc3b0] opacity-60 grayscale'
            }`}
          >
            {/* Medallion Suspension Ribbon */}
            <div className="relative -mt-7 mb-3 flex flex-col items-center z-10">
              <div 
                className={`w-8 h-8 rounded-t-sm shadow-sm flex items-center justify-center border-t border-x ${
                  badge.unlocked ? 'bg-gradient-to-b from-[#b91c1c] to-[#991b1b] border-[#7f1d1d]' : 'bg-[#78716c] border-[#57534e]'
                }`}
              >
                <div className="w-1.5 h-full bg-[#fde047] opacity-60" />
              </div>
              <div 
                className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[8px]" 
                style={{ borderTopColor: badge.unlocked ? '#991b1b' : '#57534e' }}
              />
            </div>

            {/* Circular Layered Medallion Emblem */}
            <div className="relative mb-3 flex items-center justify-center">
              {/* Outer Golden/Bronze Laurel Bevel */}
              <div 
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 transition-transform duration-300 ${
                  badge.unlocked 
                    ? 'border-[#fef08a] bg-gradient-to-br from-[#facc15] via-[#ca8a04] to-[#854d0e] shadow-[0_0_16px_rgba(234,179,8,0.4)]' 
                    : 'border-[#d6d3d1] bg-gradient-to-br from-[#a8a29e] to-[#57534e]'
                }`}
              >
                {/* Inner Bezel Ring */}
                <div 
                  className={`w-15 h-15 rounded-full flex items-center justify-center border-2 ${
                    badge.unlocked ? 'bg-[#451a03] border-[#fef08a]' : 'bg-[#292524] border-[#a8a29e]'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow-md select-none transform hover:scale-115 transition-transform">
                    {badge.icon}
                  </span>
                </div>
              </div>
              {/* Star Badge Pin on Earned Medallions */}
              {badge.unlocked && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#fde047] border border-[#854d0e] rounded-full flex items-center justify-center text-[10px] shadow-sm font-bold text-[#854d0e]">
                  ★
                </div>
              )}
            </div>

            {/* Medallion Inscription Title */}
            <h3
              className="font-pixel text-xs uppercase tracking-wider mb-1"
              style={{ color: badge.unlocked ? '#3d2516' : '#78716c' }}
            >
              {badge.title}
            </h3>
            
            <p className="text-xs text-[#715c44] leading-relaxed mb-3 font-medium">
              {badge.description}
            </p>

            {/* Seal Status Pill */}
            {badge.unlocked ? (
              <span className="mt-auto inline-flex items-center gap-1 bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[10px] font-pixel px-3 py-1 rounded-full shadow-xs uppercase tracking-widest">
                <span>👑</span> Royal Medallion Earned
              </span>
            ) : (
              <span className="mt-auto inline-flex items-center gap-1 bg-[#e7e5e4] text-[#78716c] border border-[#d6d3d1] text-[10px] font-pixel px-3 py-1 rounded-full uppercase tracking-widest">
                <span>🔒</span> Sealed by the Realm
              </span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#8c7457] mt-8 font-bold">No badges in this category yet.</p>
      )}
    </div>
  );
};

export default Achievements;
