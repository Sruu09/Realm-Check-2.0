import React, { useState, useEffect } from 'react';
import { getPlayerStats, type User } from '../../services/UserService';

const RPGHud: React.FC = () => {
  const [stats, setStats] = useState<User | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      const userId = Number(localStorage.getItem('userId') ?? 0);
      if (userId) {
        getPlayerStats(userId).then(setStats).catch(console.error);
      }
    };
    fetchStats();
    
    window.addEventListener('player-stats-updated', fetchStats);
    return () => window.removeEventListener('player-stats-updated', fetchStats);
  }, []);

  const xpRequired = stats?.xpForNextLevel ?? (stats?.level ? stats.level * 100 : 100);
  const xpPercentage = stats ? Math.min(100, (stats.xp / xpRequired) * 100) : 0;

  return (
    <div className="flex items-center pointer-events-auto">
      {/* Medieval Dark Walnut Inventory-Style HUD Panel */}
      <div 
        className="bg-[#2a1d13] border-2 border-[#8c7457] rounded-xl px-4 py-2 flex items-center gap-5 shadow-[0_6px_16px_rgba(0,0,0,0.5)] text-[#fef3c7]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(0deg, #2a1d13, #2a1d13 16px, #22160d 17px, #22160d 18px)
          `
        }}
      >
        
        {/* Health */}
        <div className="flex items-center gap-2">
          <span className="text-base filter drop-shadow">❤️</span>
          <div className="flex flex-col">
            <div className="flex justify-between w-20">
              <span className="text-[9px] text-[#c7b49d] font-bold uppercase tracking-wider font-pixel">HP</span>
              <span className="text-[9px] text-[#fef08a] font-semibold">{stats?.health ?? 100}</span>
            </div>
            <div className="w-20 h-2 bg-[#170e08] rounded-full mt-0.5 overflow-hidden border border-[#543b25] shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, stats?.health ?? 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-[#543b25]" />

        {/* XP & Level */}
        <div className="flex items-center gap-2">
          <span className="text-base filter drop-shadow">⭐</span>
          <div className="flex flex-col">
            <div className="flex justify-between w-24">
              <span className="text-[9px] text-[#c7b49d] font-bold uppercase tracking-wider font-pixel">XP</span>
              <span className="text-[9px] text-[#facc15] font-bold">Lv. {stats?.level || 1}</span>
            </div>
            <div className="w-24 h-2 bg-[#170e08] rounded-full mt-0.5 overflow-hidden border border-[#543b25] shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 rounded-full" 
                style={{ width: `${xpPercentage}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-[#543b25]" />

        {/* Streak */}
        <div className="flex items-center gap-1.5">
          <span className="text-base filter drop-shadow">🔥</span>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#c7b49d] font-bold uppercase tracking-wider font-pixel">Streak</span>
            <span className="text-[10px] text-[#fb923c] font-bold">{stats?.streak || 0}d</span>
          </div>
        </div>

        <div className="w-px h-6 bg-[#543b25]" />

        {/* Savings */}
        <div className="flex items-center gap-1.5">
          <span className="text-base filter drop-shadow">🪙</span>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#c7b49d] font-bold uppercase tracking-wider font-pixel">Gold</span>
            <span className="text-[10px] text-[#4ade80] font-bold">₹{stats?.totalSavings ? stats.totalSavings.toLocaleString() : 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RPGHud;
