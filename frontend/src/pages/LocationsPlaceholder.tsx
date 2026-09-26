import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaceholderLocation: React.FC<{ title: string; color: string }> = ({ title, color }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`min-h-screen ${color} flex flex-col items-center justify-center p-8`}>
      <div className="bg-[#fcf5e3] p-10 rounded-2xl border-4 border-[#b58c5a] shadow-2xl text-center max-w-2xl w-full relative">
        <h1 className="text-4xl font-bold text-[#4a3b2c] mb-6 tracking-wider">{title}</h1>
        <p className="text-[#8c7457] mb-10 text-lg">This location will be constructed in the upcoming phases!</p>
        <button 
          onClick={() => navigate('/realm')}
          className="bg-[#4a3b2c] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
        >
          Return to Realm
        </button>
      </div>
    </div>
  );
};

export const Pond = () => <PlaceholderLocation title="POND (Journal & Tasks)" color="bg-blue-300" />;
export const Wizard = () => <PlaceholderLocation title="WIZARD (AI Guidance)" color="bg-indigo-900/60" />;
export const Pet = () => <PlaceholderLocation title="PET (Companion)" color="bg-orange-300" />;
export const Treasure = () => <PlaceholderLocation title="TREASURE CHEST (Finance)" color="bg-yellow-500/60" />;
export const Garden = () => <PlaceholderLocation title="GARDEN (Fitness)" color="bg-green-300" />;
export const Arena = () => <PlaceholderLocation title="BATTLE ARENA (Exams)" color="bg-red-900/40" />;
