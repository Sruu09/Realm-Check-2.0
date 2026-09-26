import React, { useState } from 'react';
import { User, Award, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
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
          <div className="p-4 text-sm text-gray-200">
            <p><strong>Level:</strong> {profileStats.level}</p>
            <p><strong>XP:</strong> {profileStats.xp} / {profileStats.xpForNextLevel}</p>
            <p><strong>Streak:</strong> {profileStats.streak}</p>
            <p><strong>Health:</strong> {profileStats.health}</p>
            <p><strong>Gold:</strong> {profileStats.gold}</p>
            <p><strong>Total Savings:</strong> {profileStats.totalSavings}</p>
          </div>
        ) : (
          <p className="p-4 text-sm text-gray-400">Loading stats…</p>
        );
      case 'Achievements':
        return <p className="p-4 text-sm text-gray-400">Achievements will appear here soon.</p>;
      case 'Edit Profile':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Edit Profile</h3>
            <label className="block mb-1 text-gray-300">Username</label>
            <input className="w-full mb-2 p-1 rounded bg-[#2a2542] text-gray-200" placeholder="Username" />
            <label className="block mb-1 text-gray-300">Email</label>
            <input className="w-full mb-2 p-1 rounded bg-[#2a2542] text-gray-200" placeholder="email@example.com" />
            <button className="mt-2 px-3 py-1 bg-[#4a3b2c] text-[#e0cdad] rounded">Save (no‑op)</button>
          </div>
        );
      case 'Help':
        return (
          <div className="p-4 text-sm text-gray-400">
            <p>Help documentation will be placed here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity" 
          onClick={onToggle} 
        />
      )}

      {/* Menu Container */}
      <div 
        className={`fixed top-24 right-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Toggle Tab */}
        <button 
          onClick={onToggle}
          className="absolute -left-8 top-4 bg-[#1a1728] border-2 border-r-0 border-[#3d3356] text-gray-300 p-1.5 rounded-l-lg shadow-lg hover:text-white hover:bg-[#2a2542] transition-colors"
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Menu Content */}
        <div className="w-56 bg-[#1a1728] border-2 border-r-0 border-[#3d3356] rounded-l-2xl shadow-2xl p-3 h-auto mr-[-2px]">
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
                onClick={() => handleItemClick(item.label)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 text-sm font-bold hover:bg-[#2a2542] hover:text-white rounded-xl transition-all text-left group"
              >
                <span className="text-gray-500 group-hover:text-yellow-500 transition-colors">{item.icon}</span>
                {item.label}
              </button>
           ))}
            {selectedItem && (
              <div className="mt-4 border-t border-[#3d3356] pt-2">
                {renderPlaceholder()}
              </div>
            ) }
            
            <div className="pt-2 mt-2 border-t border-[#3d3356]">
              <button 
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 text-sm font-bold hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors group"
              >
                <span className="text-red-500/50 group-hover:text-red-400 transition-colors"><LogOut size={16} /></span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
