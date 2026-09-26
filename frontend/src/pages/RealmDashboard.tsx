import React, { useState } from 'react';
import RPGHud from '../components/realm/RPGHud';
import ProfilePanel from '../components/realm/ProfilePanel';
import SideMenu from '../components/realm/SideMenu';
import RealmEnvironment from '../components/realm/RealmEnvironment';
import LocationNode from '../components/realm/LocationNode';

const locations = [
  { id: 'castle', name: 'Castle', subtitle: 'Jobs & Careers', top: '25%', left: '50%', icon: <span className="text-6xl">🏰</span>, bgClass: 'bg-[#e6d5b8]', sizeClass: 'w-28 h-28', route: '/castle' },
  { id: 'library', name: 'Library', subtitle: 'Resources & Scholarships', top: '35%', left: '25%', icon: <span className="text-4xl">🏛️</span>, bgClass: 'bg-[#fcf5e3]', route: '/library' },
  { id: 'pond', name: 'Pond', subtitle: 'Digital Journal', top: '55%', left: '20%', icon: <span className="text-4xl">💧</span>, bgClass: 'bg-blue-300', route: '/pond' },
  { id: 'garden', name: 'Garden', subtitle: 'Fitness & Wellness', top: '75%', left: '25%', icon: <span className="text-4xl">🌻</span>, bgClass: 'bg-green-600', route: '/garden' },
  { id: 'arena', name: 'Battle Arena', subtitle: 'Exam Preparation', top: '75%', left: '75%', icon: <span className="text-4xl">⚔️</span>, bgClass: 'bg-red-800', route: '/arena' },
  { id: 'treasure', name: 'Treasure Chest', subtitle: 'Finance Manager', top: '60%', left: '80%', icon: <span className="text-4xl">🏆</span>, bgClass: 'bg-yellow-500', route: '/treasure' },
  { id: 'wizard', name: 'Wizard', subtitle: 'AI Guidance', top: '35%', left: '75%', icon: <span className="text-4xl">🧙‍♂️</span>, bgClass: 'bg-indigo-900', route: '/wizard' },
  { id: 'pet', name: 'Pet', subtitle: 'Your Companion', top: '45%', left: '85%', icon: <span className="text-4xl">🐕</span>, bgClass: 'bg-orange-300', route: '/pet' },
];

const RealmDashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden select-none bg-[#5c8a4c] font-body">
      {/* Background Environment (Paths, Water, Trees, Signs) */}
      <RealmEnvironment />

      {/* UI Overlay */}
      <RPGHud />
      <ProfilePanel onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />

      {/* Central Player Character */}
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-4xl z-10 animate-bounce pointer-events-none" style={{ animationDuration: '2s' }}>
        🚶‍♂️
      </div>

      {/* Interactive Realm Locations */}
      <div className="absolute inset-0 z-20">
        {locations.map((loc) => (
          <LocationNode key={loc.id} {...loc} />
        ))}
      </div>

    </div>
  );
};

export default RealmDashboard;
