import React, { useEffect, useState } from 'react';
import { getUserStats, type User as UserStats } from '../../services/UserService';

interface ProfilePanelProps {
  onToggleMenu: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onToggleMenu }) => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const storedId = Number(localStorage.getItem('userId') ?? '0');
    if (storedId) {
      getUserStats(storedId).then(setStats).catch(console.error);
    }
  }, []);

  return (
    <div className="pointer-events-auto">
      <div
        onClick={onToggleMenu}
        className="bg-[#2a1d13] border-2 border-[#8c7457] rounded-xl px-3 py-1.5 flex items-center gap-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#382618] hover:border-[#ca8a04] transition-all transform hover:-translate-y-0.5 text-[#fef3c7]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(0deg, #2a1d13, #2a1d13 16px, #22160d 17px, #22160d 18px)
          `
        }}
      >
        <div className="w-8 h-8 bg-[#1f140c] rounded-lg border border-[#694e33] flex items-center justify-center overflow-hidden shadow-inner">
          <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Explorer" alt="Avatar" className="w-10 h-10 object-cover" />
        </div>
        <div className="text-left pr-1">
          <div className="font-bold text-xs text-[#fef08a] font-pixel">Explorer</div>
          <div className="text-[9px] text-[#c7b49d] font-medium">Level {stats?.level ?? 1} • Chest ▾</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
