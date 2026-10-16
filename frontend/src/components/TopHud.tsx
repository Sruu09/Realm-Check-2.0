import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Award, User, HelpCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserStats, type User as UserStats } from '../services/UserService';

const TopHud: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = Number(localStorage.getItem('userId') ?? 0);
    if (storedId) {
      getUserStats(storedId).then(setStats).catch(console.error);
    }
  }, []);

  const xpRequired = stats?.xpForNextLevel ?? (stats?.level ? stats.level * 100 : 100);
  const xpPercentage = stats ? Math.min(100, (stats.xp / xpRequired) * 100) : 0;

  return (
    <>
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-center pointer-events-none gap-4">
        {/* Left HUD (Stats) */}
        <div className="bg-[#24213a] border-2 border-[#3b3559] rounded-xl px-4 py-2 flex items-center gap-6 shadow-xl pointer-events-auto text-white">
          {/* Health */}
          <div className="flex items-center gap-2">
            <span className="text-pink-400 text-xl">❤️</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Health</span>
              <div className="w-24 h-2 bg-gray-700 rounded-full mt-1 relative overflow-hidden border border-gray-900">
                <div 
                  className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, stats?.health ?? 100))}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-center mt-0.5 font-pixel">{stats?.health ?? 100}/100</span>
            </div>
          </div>

          <div className="w-px h-8 bg-[#3b3559]"></div>

          {/* XP */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-2xl">⭐</span>
            <div className="flex flex-col">
              <div className="flex justify-between w-32">
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">XP</span>
                <span className="text-[10px] text-gray-300 font-bold tracking-wider">Lv. {stats?.level ?? 1}</span>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full mt-1 relative overflow-hidden border border-gray-900">
                <div
                  className="absolute top-0 left-0 h-full bg-yellow-400"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-center mt-0.5 font-pixel">
                {stats?.xp ?? 0}/{xpRequired}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-[#3b3559]"></div>

          {/* Streak */}
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-2xl">🔥</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Streak</span>
              <span className="text-[11px] text-orange-400 font-bold mt-1">{stats?.streak ?? 0} Days</span>
            </div>
          </div>
        </div>

        {/* Right HUD (Player Card) */}
        <div className="absolute top-0 right-0 pointer-events-auto">
          <div
            className="bg-[#24213a] border-2 border-yellow-600/50 rounded-xl p-2 flex items-center gap-3 shadow-xl cursor-pointer hover:bg-[#2f2b4a] transition-colors"
            onClick={() => setMenuOpen(true)}
          >
            <div className="w-10 h-10 bg-[#3b3559] rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=Explorer`} alt="Avatar" className="w-full h-full" />
            </div>
            <div className="text-left pr-2 text-white">
              <div className="font-bold text-sm">Explorer</div>
              <div className="text-[10px] text-gray-300">Level {stats?.level ?? 1}</div>
              <div className="text-[9px] text-blue-300 mt-1 hover:underline">See Profile →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 pointer-events-auto transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-20 right-4 w-64 bg-[#1e1b30] border-2 border-[#3b3559] rounded-xl shadow-2xl p-4 pointer-events-auto transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute -left-10 top-4 bg-[#1e1b30] border-2 border-[#3b3559] border-r-0 text-white p-2 rounded-l-xl hover:bg-[#2f2b4a]"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="space-y-1">
            {[
              { icon: <User size={16} />, label: 'Profile' },
              { icon: <Award size={16} />, label: 'Achievements' },
              { icon: <User size={16} />, label: 'Edit Profile' },
              { icon: <Settings size={16} />, label: 'Settings' },
              { icon: <HelpCircle size={16} />, label: 'Help' },
            ].map((item, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 text-sm font-bold hover:bg-[#2f2b4a] rounded-lg transition-all text-left"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 text-sm font-bold hover:bg-[#2f2b4a] rounded-lg transition-all text-left"
            >
              <User size={16} />
              Onboarding
            </button>
            <div className="pt-2 mt-2 border-t border-[#3b3559]">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-sm font-bold hover:bg-[#2f2b4a] rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHud;
