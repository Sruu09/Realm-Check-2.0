import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationProps {
  id: string;
  name: string;
  subtitle: string;
  top: string;
  left: string;
  icon: React.ReactNode;
  route: string;
}

const LocationNode: React.FC<LocationProps> = ({ name, subtitle, top, left, icon, route }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer select-none"
      style={{ top, left }}
      onClick={() => navigate(route)}
    >
      <div className="relative flex flex-col items-center">
        {/* Directly Render the Dedicated Pixel-Art Building/Character Structure */}
        <div className="transform transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-105">
          {icon}
        </div>

        {/* Clean, Readable Parchment Stone Plaque Positioned Outside & Below Architectural Details */}
        <div className="mt-1 pointer-events-none">
          <div className="bg-[#faf6ee]/95 backdrop-blur-xs text-[#4a3f35] px-3.5 py-1 rounded-lg shadow-md border-2 border-[#b5a794] flex flex-col items-center min-w-[104px] whitespace-nowrap transition-all group-hover:border-[#3b82f6] group-hover:bg-white group-hover:shadow-lg">
            <span className="font-pixel text-[10px] tracking-wide text-[#2e261f] uppercase group-hover:text-[#1d4ed8] transition-colors">{name}</span>
            <span className="text-[9px] text-[#6b5c4d] font-semibold tracking-normal">{subtitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationNode;
