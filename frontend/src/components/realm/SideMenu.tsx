import React, { useState } from 'react';
import { User, Award, Settings, HelpCircle, LogOut, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [profileStats, setProfileStats] = useState<any>(null);

  const handleItemClick = async (label: string) => {
    setSelectedItem(label);
    if (label === 'Profile') {
      try {
        const resp = await axios.get('/api/player/stats');
        setProfileStats(resp.data);
      } catch (e) {
        console.error('Failed to fetch player stats', e);
        setProfileStats(null);
      }
    } else if (label === 'Achievements') {
      navigate('/achievements');
    } else if (label === 'Settings') {
      navigate('/settings');
    } else if (label === 'Logout') {
      navigate('/login');
    }
  };

  const renderPlaceholder = () => {
    switch (selectedItem) {
      case 'Profile':
        return profileStats ? (
          <div className="p-3 text-xs text-[#524538] space-y-1">
            <p><strong>Level:</strong> {profileStats.level}</p>
            <p><strong>XP:</strong> {profileStats.xp} / {profileStats.xpForNextLevel}</p>
            <p><strong>Streak:</strong> {profileStats.streak} days</p>
            <p><strong>Health:</strong> {profileStats.health}</p>
            <p><strong>Total Savings:</strong> ₹{profileStats.totalSavings}</p>
          </div>
        ) : (
          <p className="p-3 text-xs text-[#8a7a69]">Loading stats…</p>
        );
      case 'Achievements':
        return <p className="p-3 text-xs text-[#8a7a69]">Achievements and trophies will appear here.</p>;
      case 'Edit Profile':
        return (
          <div className="p-3 text-xs text-[#524538] space-y-2">
            <label className="block text-[10px] font-bold uppercase text-[#7d6e5e]">Username</label>
            <input className="w-full p-1.5 rounded-lg border border-[#c9bfae] bg-white text-[#4a3f35]" placeholder="Username" />
            <button className="px-3 py-1 bg-[#7ba36a] text-white font-semibold rounded-lg text-xs">Save</button>
          </div>
        );
      case 'Help':
        return (
          <div className="p-3 text-xs text-[#524538]">
            <p>Explore the buildings to discover jobs, scholarships, journals, workouts, and AI mentors.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Soft Dim Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#3d332a]/20 backdrop-blur-[2px] z-40 transition-opacity" 
          onClick={onToggle} 
        />
      )}

      {/* Dark Walnut Medieval Wooden Inventory Cabinet */}
      <div 
        className={`fixed top-0 right-0 h-full w-68 bg-[#2d1e13] border-l-4 border-[#170e08] shadow-[0_0_40px_rgba(0,0,0,0.85)] z-50 transition-transform duration-300 ease-in-out flex flex-col font-body select-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(0deg, #2d1e13, #2d1e13 32px, #23160d 33px, #23160d 34px)
          `
        }}
      >
        {/* Cabinet Iron Header with Rivets */}
        <div className="p-4 border-b-4 border-[#170e08] flex items-center justify-between bg-[#1f140c] relative shadow-md">
          {/* Iron Corner Reinforcements */}
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#8c7457] border border-[#3d2714]" />
          <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-[#8c7457] border border-[#3d2714]" />

          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <h2 className="font-pixel text-xs text-[#fef3c7] tracking-wider uppercase drop-shadow-sm">Adventurer's Chest</h2>
          </div>

          <button 
            onClick={onToggle}
            className="p-1 text-[#c7b49d] hover:text-white rounded-lg hover:bg-[#3d2714] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inventory Navigation Plaques */}
        <div className="p-3.5 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          {[
            { icon: <User size={15} />, label: 'Profile' },
            { icon: <Award size={15} />, label: 'Achievements' },
            { icon: <User size={15} />, label: 'Edit Profile' },
            { icon: <Settings size={15} />, label: 'Settings' },
            { icon: <HelpCircle size={15} />, label: 'Help' },
          ].map((item, idx) => {
            const isSelected = selectedItem === item.label;
            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item.label)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left border-2 relative ${
                  isSelected
                    ? 'bg-[#4a3421] text-[#fef3c7] border-[#ca8a04] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),_0_0_10px_rgba(202,138,4,0.3)] font-bold'
                    : 'bg-[#3b2718] text-[#d6c7b2] border-[#22150a] hover:bg-[#452e1c] hover:border-[#634327] hover:text-white shadow-xs font-semibold'
                }`}
              >
                {/* Embedded Iron Rivet */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#8c7457] border border-[#22150a] absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75" />

                <span className={`${isSelected ? 'text-[#facc15]' : 'text-[#a89078]'}`}>
                  {item.icon}
                </span>
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}

          {selectedItem && (
            <div className="mt-3 border-2 border-[#543b25] p-2 bg-[#22150c] rounded-xl shadow-inner text-[#eedcc5]">
              {renderPlaceholder()}
            </div>
          )}
        </div>

        {/* Footer Logout Chest Latch */}
        <div className="p-3.5 border-t-4 border-[#170e08] bg-[#1f140c]">
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-[#fca5a5] hover:text-white text-xs font-pixel uppercase bg-[#3f191b] hover:bg-[#5c1c20] border-2 border-[#7f1d1d] rounded-xl transition-all shadow-md active:translate-y-0.5"
          >
            <LogOut size={14} />
            <span>Leave Realm</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
