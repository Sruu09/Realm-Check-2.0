import React from 'react';

const RealmEnvironment: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#5c8a4c]">
      {/* Base Grass Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#4d7a3d 15%, transparent 15%), radial-gradient(#4d7a3d 15%, transparent 15%)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />

      {/* Pond Area (Left) */}
      <div className="absolute top-[45%] left-[5%] w-[35%] h-[35%] bg-[#4ea3d4] rounded-[100px] blur-sm opacity-80" />
      <div className="absolute top-[48%] left-[8%] w-[25%] h-[25%] bg-[#6bbdf0] rounded-[80px]" />
      
      {/* Waterfall/River (Bottom Right) */}
      <div className="absolute bottom-[-10%] right-0 w-[20%] h-[50%] bg-[#4ea3d4] rotate-12 blur-sm opacity-80" />
      <div className="absolute bottom-0 right-[2%] w-[15%] h-[40%] bg-[#6bbdf0] rotate-12" />

      {/* Main Stone Paths */}
      {/* Center Plaza */}
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border-[40px] border-[#a09c95]/80 bg-transparent" />
      
      {/* Vertical Path to Castle */}
      <div className="absolute top-[25%] left-[50%] transform -translate-x-1/2 w-[40px] h-[150px] bg-[#a09c95]/80" />
      
      {/* Vertical Path to Entrance */}
      <div className="absolute bottom-[5%] left-[50%] transform -translate-x-1/2 w-[60px] h-[200px] bg-[#a09c95]/80" />
      
      {/* Horizontal Paths */}
      <div className="absolute top-[50%] left-[25%] transform -translate-y-1/2 w-[200px] h-[40px] bg-[#a09c95]/80" />
      <div className="absolute top-[50%] right-[25%] transform -translate-y-1/2 w-[200px] h-[40px] bg-[#a09c95]/80" />

      {/* Diagonal Paths */}
      <div className="absolute top-[65%] left-[30%] transform rotate-[35deg] w-[40px] h-[120px] bg-[#a09c95]/80" />
      <div className="absolute top-[65%] right-[30%] transform -rotate-[35deg] w-[40px] h-[120px] bg-[#a09c95]/80" />
      <div className="absolute top-[35%] right-[30%] transform rotate-[35deg] w-[40px] h-[120px] bg-[#a09c95]/80" />
      <div className="absolute top-[35%] left-[30%] transform -rotate-[35deg] w-[40px] h-[120px] bg-[#a09c95]/80" />

      {/* Bridge over pond */}
      <div className="absolute top-[52%] left-[20%] transform -rotate-12 w-[100px] h-[30px] bg-[#694b37] border-y-4 border-[#4a3424] shadow-xl rounded-sm" />

      {/* Cleaner Environmental Props (CSS Shapes instead of massive emojis) */}
      {/* Simple Tree Representations */}
      <div className="absolute top-[15%] left-[20%] w-16 h-16 bg-green-700 rounded-full border-4 border-green-900 shadow-[0_8px_0_rgba(0,0,0,0.2)]" />
      <div className="absolute top-[20%] right-[15%] w-12 h-16 bg-green-800 rounded-t-full border-4 border-green-950 shadow-[0_8px_0_rgba(0,0,0,0.2)]" />
      <div className="absolute bottom-[20%] left-[10%] w-20 h-20 bg-green-600 rounded-full border-4 border-green-800 shadow-[0_8px_0_rgba(0,0,0,0.2)]" />
      <div className="absolute bottom-[30%] right-[20%] w-14 h-14 bg-green-700 rounded-full border-4 border-green-900 shadow-[0_8px_0_rgba(0,0,0,0.2)]" />

      {/* Banners/Signs - Cleaned up */}
      <div className="absolute top-[10%] left-[5%] bg-[#fcf5e3] p-4 border-4 border-[#b58c5a] rounded shadow-lg transform -rotate-1 w-56">
        <h1 className="font-pixel text-[#4a3b2c] text-sm leading-relaxed tracking-wider text-center">REALM CHECK</h1>
        <p className="text-[9px] font-bold text-[#8c7457] uppercase tracking-[0.1em] mt-2 text-center">A Brighter You</p>
      </div>

      <div className="absolute bottom-[10%] left-[5%] bg-[#a09c95] p-3 border-4 border-[#7a7771] rounded shadow-lg text-[#3d3b38] font-pixel text-[9px] w-40 text-center uppercase leading-loose">
        Discipline turns<br/>dreams into reality
      </div>
    </div>
  );
};

export default RealmEnvironment;
