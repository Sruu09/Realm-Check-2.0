import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationProps {
  id: string;
  name: string;
  subtitle: string;
  top: string;
  left: string;
  icon: React.ReactNode;
  bgClass: string;
  sizeClass?: string;
  route: string;
}

const LocationNode: React.FC<LocationProps> = ({ name, subtitle, top, left, icon, bgClass, sizeClass = 'w-20 h-20 text-4xl', route }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
      style={{ top, left }}
      onClick={() => navigate(route)}
    >
      {/* Building Structure */}
      <div 
        className={`
          ${sizeClass} rounded-2xl flex items-center justify-center 
          shadow-[0_10px_0_rgba(0,0,0,0.3)] border-4 border-[#3d2f23] 
          transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-[0_20px_20px_rgba(0,0,0,0.4)]
          ${bgClass}
          relative
        `}
      >
        {/* Highlight ring on hover */}
        <div className="absolute inset-[-6px] rounded-2xl border-2 border-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDuration: '2s' }} />
        {icon}
      </div>

      {/* Floating Tooltip (Hidden by default, shown on hover) */}
      <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:-translate-y-2">
        <div className="bg-[#fcf5e3] text-[#4a3b2c] px-4 py-2 rounded-xl shadow-2xl border-2 border-[#b58c5a] flex flex-col items-center min-w-[140px] relative">
          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#fcf5e3] border-b-2 border-r-2 border-[#b58c5a] rotate-45" />
          <span className="font-bold text-sm tracking-wide">{name}</span>
          <span className="text-[9px] text-[#8c7457] font-bold uppercase mt-1 tracking-wider">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default LocationNode;
