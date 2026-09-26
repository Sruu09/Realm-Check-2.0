import React, { useState, useEffect } from 'react';
import { getUserStats, type User } from '../../services/UserService';

const RPGHud: React.FC = () => {
  const [stats, setStats] = useState<User | null>(null);

  useEffect(() => {
    // In Phase 5+, user ID will be fetched from the JWT context
    const fetchStats = () => getUserStats(1).then(setStats).catch(console.error);
    fetchStats();
    
    window.addEventListener('player-stats-updated', fetchStats);
    return () => window.removeEventListener('player-stats-updated', fetchStats);
  }, []);

  const xpRequired = stats ? stats.level * 100 : 100;
  const xpPercentage = stats ? Math.min(100, (stats.xp / xpRequired) * 100) : 0;

  return (
    <div className="absolute top-4 left-4 z-50 flex gap-4 pointer-events-auto">
      {/* HUD Container */}
      <div className="bg-[#1a1728] border-2 border-[#3d3356] rounded-xl px-4 py-2 flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Health (Static for now) */}
        <div className="flex items-center gap-2">
          <div className="text-red-400 text-xl drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">❤️</div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Health</span>
            <div className="w-24 h-2.5 bg-[#0f0d16] rounded-full mt-0.5 border border-[#3d3356] overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-600 to-red-400" />
            </div>
            <span className="text-[9px] text-gray-300 font-pixel mt-1">100/100</span>
          </div>
        </div>

        <div className="w-px h-8 bg-[#3d3356]" />

        {/* XP & Level from Backend */}
        <div className="flex items-center gap-2">
          <div className="text-yellow-400 text-2xl drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">⭐</div>
          <div className="flex flex-col">
            <div className="flex justify-between w-32 items-end">
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">XP</span>
              <span className="text-[10px] text-yellow-500 font-bold">Lv. {stats?.level || 1}</span>
            </div>
            <div className="w-32 h-2.5 bg-[#0f0d16] rounded-full mt-0.5 border border-[#3d3356] overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500" style={{ width: `${xpPercentage}%` }} />
            </div>
            <span className="text-[9px] text-gray-300 font-pixel mt-1">{stats?.xp || 0}/{xpRequired}</span>
          </div>
        </div>

        <div className="w-px h-8 bg-[#3d3356]" />

        {/* Streak from Backend */}
        <div className="flex items-center gap-2">
          <div className="text-orange-500 text-2xl drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">🔥</div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Streak</span>
            <span className="text-[11px] text-orange-400 font-bold mt-1">{stats?.streak || 0} Days</span>
          </div>
        </div>

        <div className="w-px h-8 bg-[#3d3356]" />

        {/* Gold from Backend */}
        <div className="flex items-center gap-2">
          <div className="text-yellow-500 text-2xl drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">🪙</div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Gold</span>
            <span className="text-[11px] text-yellow-500 font-bold mt-1">{stats?.gold || 0}</span>
          </div>
        </div>

        <div className="w-px h-8 bg-[#3d3356]" />

        {/* Savings from Backend */}
        <div className="flex items-center gap-2">
          <div className="text-green-400 text-2xl drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">💰</div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Savings</span>
            <span className="text-[11px] text-green-400 font-bold mt-1">₹{stats?.savings?.toLocaleString() || 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RPGHud;
