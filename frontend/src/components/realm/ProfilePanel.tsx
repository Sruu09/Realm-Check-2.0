import React from 'react';

interface ProfilePanelProps {
  onToggleMenu: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onToggleMenu }) => {
  return (
    <div className="absolute top-4 right-4 z-50 pointer-events-auto">
      <div 
        onClick={onToggleMenu}
        className="bg-[#1a1728] border-2 border-[#b58c5a] rounded-xl p-2 flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#2a2542] hover:border-[#d4c3a3] transition-all transform hover:-translate-y-1"
      >
        <div className="w-12 h-12 bg-[#2a2542] rounded-lg border-2 border-[#3d3356] flex items-center justify-center overflow-hidden">
           {/* Placeholder for avatar, using dicebear for pixel art vibe */}
           <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Explorer" alt="Avatar" className="w-16 h-16 object-cover" />
        </div>
        <div className="text-left pr-3">
          <div className="font-bold text-sm text-white drop-shadow-md">Explorer</div>
          <div className="text-[10px] text-gray-300">Level 12</div>
          <div className="text-[9px] text-yellow-500 font-bold mt-1 group-hover:underline">See Profile →</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
