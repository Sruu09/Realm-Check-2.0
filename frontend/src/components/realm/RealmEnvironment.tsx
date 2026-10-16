import React from 'react';

const RealmEnvironment: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-transparent">
          
      {/* 1. Rich Organic Grass Tile Texture with Pixel Flecks */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(#4d733e 15%, transparent 16%),
            radial-gradient(#3e5e32 15%, transparent 16%),
            linear-gradient(45deg, #5b804d 25%, transparent 25%, transparent 75%, #5b804d 75%, #5b804d)
          `,
          backgroundSize: '24px 24px, 24px 24px, 12px 12px',
          backgroundPosition: '0 0, 12px 12px, 0 0'
        }}
      />

      {/* 2. Topographical Terrain Variation (Mounds, Clearings, Forest Ridges) */}
      {/* North Castle Foundation Plateau */}
      <div className="absolute top-[8%] left-[34%] w-[420px] h-[190px] bg-[#618b52] rounded-[70px] blur-[1px] opacity-70" />
      

      {/* South-West Garden Soil Mound */}
      <div className="absolute bottom-[8%] left-[16%] w-[330px] h-[210px] bg-[#5c854b] rounded-[60px] blur-[1px] opacity-65" />

      {/* South-East Arena Stone Plateau */}
      <div className="absolute bottom-[8%] right-[16%] w-[340px] h-[220px] bg-[#5c854b] rounded-[60px] blur-[1px] opacity-65" />

      {/* 3. Comprehensive SVG Layer: Cobblestone Road Network & Environmental Scenery */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
<defs>
        
          <pattern id="grassTile" width="16" height="16" patternUnits="userSpaceOnUse">
            <image href="/assets/tiny_town/Tiles/tile_0000.png" width="16" height="16"/>
          </pattern>
          <pattern id="waterTile" width="16" height="16" patternUnits="userSpaceOnUse">
            <image href="/assets/tiny_town/Tiles/tile_0048.png" width="16" height="16"/>
                    </pattern>
          <pattern id="sandTile" width="16" height="16" patternUnits="userSpaceOnUse">
            <image href="/assets/tiny_town/Tiles/tile_0013.png" width="16" height="16"/>
          </pattern>
          <pattern id="dungeonGround" width="16" height="16" patternUnits="userSpaceOnUse">
            <image href="/assets/tiny_dungeon/Tiles/tile_0000.png" width="16" height="16"/>
          </pattern>
          {/* Tiled Cobblestone Paver Pattern */}
          <pattern id="cobblestones" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#dfd6c7" />
            <rect x="1" y="1" width="8" height="8" fill="#eee5d7" rx="1" />
            <rect x="2" y="2" width="6" height="6" fill="#f5eee3" />
            <rect x="11" y="1" width="8" height="8" fill="#d7ccba" rx="1" />
            <rect x="12" y="2" width="6" height="6" fill="#e3d8c7" />
            <rect x="1" y="11" width="8" height="8" fill="#d2c7b3" rx="1" />
            <rect x="11" y="11" width="8" height="8" fill="#ded5c4" rx="1" />
            <line x1="0" y1="10" x2="20" y2="10" stroke="#b0a28d" strokeWidth="1" />
            <line x1="10" y1="0" x2="10" y2="20" stroke="#b0a28d" strokeWidth="1" />
          </pattern>

          {/* Plaza Stone Mosaic Fill */}
          <radialGradient id="plazaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5efe6" />
            <stop offset="65%" stopColor="#e5dbcb" />
            <stop offset="100%" stopColor="#c5b7a1" />
          </radialGradient>

          {/* Water Shimmer Gradients */}
          <linearGradient id="lakeWater" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d82a6" />
            <stop offset="60%" stopColor="#5599bd" />
            <stop offset="100%" stopColor="#76b8da" />
          </linearGradient>

          {/* Evergreen Pine Tree SVG Symbol */}
          <g id="pineTree">
            <ellipse cx="0" cy="18" rx="8" ry="3" fill="#2c3d24" opacity="0.45" />
            <rect x="-1.5" y="12" width="3" height="6" fill="#4a331f" />
            <polygon points="0,0 -9,12 9,12" fill="#264b2a" />
            <polygon points="0,0 0,12 9,12" fill="#1e3d22" />
            <polygon points="0,-4 -7,6 7,6" fill="#315c36" />
            <polygon points="0,-4 0,6 7,6" fill="#274d2c" />
            <polygon points="0,-8 -5,0 5,0" fill="#407346" />
          </g>

          {/* Deciduous Oak Tree SVG Symbol */}
          <g id="oakTree">
            <ellipse cx="0" cy="16" rx="9" ry="3.5" fill="#2c3d24" opacity="0.45" />
            <rect x="-2" y="10" width="4" height="6" fill="#4a331f" rx="1" />
            <circle cx="-4" cy="4" r="7" fill="#32662f" />
            <circle cx="4" cy="4" r="7" fill="#275424" />
            <circle cx="0" cy="-2" r="8" fill="#3f7e3a" />
            <circle cx="-1" cy="-3" r="5" fill="#4f994a" opacity="0.8" />
          </g>

          {/* Granite Boulder Symbol */}
          <g id="stoneRock">
            <ellipse cx="0" cy="3" rx="7" ry="2.5" fill="#2c3d24" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="6" ry="3.8" fill="#788b9c" />
            <ellipse cx="-1.5" cy="-1" rx="4" ry="2.2" fill="#a4b4c2" />
          </g>

          {/* Wildflower Cluster Symbol */}
          <g id="flowerCluster">
            <circle cx="-3" cy="-1" r="2" fill="#fb7185" />
            <circle cx="3" cy="0" r="2" fill="#f43f5e" />
            <circle cx="0" cy="3" r="2" fill="#facc15" />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Ancient Standing Stones Monument */}
          <g id="standingStones">
            <ellipse cx="0" cy="8" rx="14" ry="5" fill="#2c3d24" opacity="0.4" />
            <rect x="-10" y="-14" width="6" height="20" fill="#64748b" rx="2" />
            <rect x="4" y="-16" width="7" height="22" fill="#64748b" rx="2" />
            <rect x="-12" y="-18" width="24" height="6" fill="#94a3b8" rx="1.5" />
            <rect x="-1" y="-8" width="3" height="14" fill="#475569" />
          </g>

          {/* Kingdom Road Lantern Post */}
          <g id="lanternPost">
            <line x1="0" y1="0" x2="0" y2="-18" stroke="#332211" strokeWidth="2" />
            <rect x="-3" y="-22" width="6" height="5" fill="#78350f" rx="1" />
            <circle cx="0" cy="-20" r="3" fill="#fef08a" />
            <circle cx="0" cy="-20" r="6" fill="#facc15" opacity="0.3" />
          </g>

          {/* Forest Mushrooms */}
          <g id="mushrooms">
            <ellipse cx="-2" cy="0" rx="4" ry="1.5" fill="#1b2814" opacity="0.4" />
            <rect x="-3" y="-5" width="2" height="5" fill="#f1f5f9" />
            <ellipse cx="-2" cy="-6" rx="4.5" ry="3" fill="#ef4444" />
            <circle cx="-2" cy="-7" r="0.8" fill="#fff" />
            <rect x="2" y="-3" width="1.5" height="3" fill="#f1f5f9" />
            <ellipse cx="3" cy="-4" rx="3" ry="2" fill="#ef4444" />
          </g>
        </defs>

        {/* --- CONTINUOUS COBBLESTONE ROAD NETWORK --- */}
        {/* Soft Natural Earth Shadow Underlay */}
        {/* Hub to Castle (North) */}
        <path d="M 500 500 L 500 240" stroke="#3d5631" strokeWidth="12" strokeLinecap="round" opacity="0.45" />
        {/* Hub to Garden (South-West) */}
        <path d="M 500 500 C 420 570, 350 660, 270 760" stroke="#3d5631" strokeWidth="40" strokeLinecap="round" opacity="0.45" fill="none" />
        {/* Hub to Library & Pond (West) */}
        <path d="M 500 500 C 400 470, 320 400, 240 330" stroke="#3d5631" strokeWidth="40" strokeLinecap="round" opacity="0.45" fill="none" />
        <path d="M 240 330 C 200 400, 180 480, 170 570" stroke="#3d5631" strokeWidth="36" strokeLinecap="round" opacity="0.45" fill="none" />
        {/* Hub to Treasure (South-East) */}
        <path d="M 500 500 C 580 580, 660 670, 740 760" stroke="#3d5631" strokeWidth="40" strokeLinecap="round" opacity="0.45" fill="none" />
        {/* Hub to Wizard & Arena (North-East) */}
        <path d="M 500 500 C 590 460, 660 410, 720 380" stroke="#3d5631" strokeWidth="38" strokeLinecap="round" opacity="0.45" fill="none" />
        <path d="M 720 380 C 760 320, 800 270, 860 230" stroke="#3d5631" strokeWidth="34" strokeLinecap="round" opacity="0.45" fill="none" />
        {/* Hub to Pet (East) */}
        <path d="M 500 500 C 600 530, 720 550, 850 560" stroke="#3d5631" strokeWidth="34" strokeLinecap="round" opacity="0.45" fill="none" />

        {/* Warm Earth/Gravel Shoulder */}
        <path d="M 500 500 L 500 240" stroke="#bfae95" strokeWidth="36" strokeLinecap="round" />
        <path d="M 500 500 C 420 570, 350 660, 270 760" stroke="#bfae95" strokeWidth="34" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 400 470, 320 400, 240 330" stroke="#bfae95" strokeWidth="34" strokeLinecap="round" fill="none" />
        <path d="M 240 330 C 200 400, 180 480, 170 570" stroke="#bfae95" strokeWidth="30" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 580 580, 660 670, 740 760" stroke="#bfae95" strokeWidth="34" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 590 460, 660 410, 720 380" stroke="#bfae95" strokeWidth="32" strokeLinecap="round" fill="none" />
        <path d="M 720 380 C 760 320, 800 270, 860 230" stroke="#bfae95" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 600 530, 720 550, 850 560" stroke="#bfae95" strokeWidth="28" strokeLinecap="round" fill="none" />

        {/* Detailed Tiled Cobblestone Road Surface */}
        <path d="M 500 500 L 500 240" stroke="url(#cobblestones)" strokeWidth="30" strokeLinecap="round" />
        <path d="M 500 500 C 420 570, 350 660, 270 760" stroke="url(#cobblestones)" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 400 470, 320 400, 240 330" stroke="url(#cobblestones)" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d="M 240 330 C 200 400, 180 480, 170 570" stroke="url(#cobblestones)" strokeWidth="24" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 580 580, 660 670, 740 760" stroke="url(#cobblestones)" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 590 460, 660 410, 720 380" stroke="url(#cobblestones)" strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M 720 380 C 760 320, 800 270, 860 230" stroke="url(#cobblestones)" strokeWidth="22" strokeLinecap="round" fill="none" />
        <path d="M 500 500 C 600 530, 720 550, 850 560" stroke="url(#cobblestones)" strokeWidth="22" strokeLinecap="round" fill="none" />

        {/* --- CENTRAL COURTYARD PLAZA --- */}
        {/* Plaza Multi-tiered Stone Ring */}
        <circle cx="500" cy="500" r="66" fill="#3d5631" opacity="0.45" />
        <circle cx="500" cy="500" r="62" fill="#bfae95" />
        <circle cx="500" cy="500" r="57" fill="url(#cobblestones)" />
        {/* Polished Stone Inlay Terrace */}
        <circle cx="500" cy="500" r="44" fill="url(#plazaGlow)" stroke="#9c8c76" strokeWidth="2" />
        <circle cx="500" cy="500" r="33" fill="none" stroke="#a3937c" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* 8-Point Compass Rose Star */}
        <polygon points="500,470 506,494 530,500 506,506 500,530 494,506 470,500 494,494" fill="#c49f68" stroke="#8c6c3e" strokeWidth="1" />
        <polygon points="500,470 504,495 500,497" fill="#dfbe8c" />
        <polygon points="530,500 505,504 503,500" fill="#dfbe8c" />
        <polygon points="500,530 496,505 500,503" fill="#dfbe8c" />
        <polygon points="470,500 495,496 497,500" fill="#dfbe8c" />
        <circle cx="500" cy="500" r="4.5" fill="#584122" />

        {/* Plaza Stone Lantern Pillars */}
        <g transform="translate(454, 466)">
          <rect x="-3" y="0" width="6" height="14" fill="#786c5e" rx="1" />
          <rect x="-4" y="-3" width="8" height="3" fill="#4a4034" />
          <circle cx="0" cy="-1.5" r="2.5" fill="#fcd34d" />
        </g>
        <g transform="translate(546, 466)">
          <rect x="-3" y="0" width="6" height="14" fill="#786c5e" rx="1" />
          <rect x="-4" y="-3" width="8" height="3" fill="#4a4034" />
          <circle cx="0" cy="-1.5" r="2.5" fill="#fcd34d" />
        </g>
        <g transform="translate(454, 534)">
          <rect x="-3" y="0" width="6" height="14" fill="#786c5e" rx="1" />
          <rect x="-4" y="-3" width="8" height="3" fill="#4a4034" />
          <circle cx="0" cy="-1.5" r="2.5" fill="#fcd34d" />
        </g>
        <g transform="translate(546, 534)">
          <rect x="-3" y="0" width="6" height="14" fill="#786c5e" rx="1" />
          <rect x="-4" y="-3" width="8" height="3" fill="#4a4034" />
          <circle cx="0" cy="-1.5" r="2.5" fill="#fcd34d" />
        </g>

        {/* Plaza Stone Benches */}
        <g transform="translate(500, 442)">
          <rect x="-12" y="-2" width="24" height="5" fill="#8f8373" rx="1" />
          <rect x="-10" y="3" width="4" height="4" fill="#5c5245" />
          <rect x="6" y="3" width="4" height="4" fill="#5c5245" />
        </g>
        <g transform="translate(500, 558)">
          <rect x="-12" y="-2" width="24" height="5" fill="#8f8373" rx="1" />
          <rect x="-10" y="3" width="4" height="4" fill="#5c5245" />
          <rect x="6" y="3" width="4" height="4" fill="#5c5245" />
        </g>

        {/* --- LARGE EXPANSIVE POND (Lower Left Corner) --- */}
        {/* Natural Irregular Shoreline Sand & Stone Riprap */}
        <path d="M 20 440 Q 60 400 160 410 Q 240 420 280 500 Q 300 600 230 670 Q 140 700 40 680 Q 10 600 20 440 Z" fill="url(#sandTile)" />
        <path d="M 30 450 Q 68 410 155 420 Q 230 430 268 505 Q 285 595 222 660 Q 138 688 48 670 Q 20 595 30 450 Z" fill="url(#sandTile)" />
        {/* Layered Clear Lake Body */}
        <path d="M 40 460 Q 75 422 150 430 Q 220 440 255 510 Q 270 590 212 650 Q 135 675 58 660 Q 30 590 40 460 Z" fill="url(#lakeWater)" />
        {/* Deep Under-water Shelf */}
        <path d="M 60 480 Q 95 450 145 458 Q 200 468 225 525 Q 235 585 185 630 Q 120 650 72 638 Q 50 580 60 480 Z" fill="#2d6888" opacity="0.45" />

        {/* Water Ripples & Reeds */}
        <path d="M 70 500 Q 105 495 140 500" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d="M 120 540 Q 165 535 210 540" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M 80 580 Q 125 575 170 580" stroke="#ffffff" strokeWidth="1.8" fill="none" opacity="0.5" strokeLinecap="round" />
        {/* Shoreline Reeds & Cattails */}
        <g transform="translate(60, 440)">
          <line x1="0" y1="0" x2="-3" y2="-15" stroke="#3b6631" strokeWidth="1.8" />
          <rect x="-4" y="-15" width="2.5" height="7" fill="#6b4624" rx="0.5" />
          <line x1="5" y1="0" x2="6" y2="-18" stroke="#3b6631" strokeWidth="1.8" />
          <rect x="5" y="-18" width="2.5" height="8" fill="#6b4624" rx="0.5" />
        </g>
        <g transform="translate(260, 480)">
          <line x1="0" y1="0" x2="-3" y2="-14" stroke="#3b6631" strokeWidth="1.8" />
          <rect x="-4" y="-14" width="2.5" height="6.5" fill="#6b4624" rx="0.5" />
          <line x1="6" y1="0" x2="8" y2="-17" stroke="#3b6631" strokeWidth="1.8" />
          <rect x="7" y="-17" width="2.5" height="8" fill="#6b4624" rx="0.5" />
        </g>
        <use href="#stoneRock" x="45" y="445" />
        <use href="#stoneRock" x="250" y="460" />
        <use href="#stoneRock" x="240" y="640" />
        <use href="#stoneRock" x="50" y="660" />

        {/* --- D. ARENA AREA (Natural Forest Clearing Blended with Road) --- */}
        <g transform="translate(860, 230)">
        </g>

        {/* --- PURPOSEFUL SCENERY FILLING EMPTY AREAS --- */}
        {/* 1. North-West Woodland (Surrounding Library & Upper Map Boundary) */}
        <use href="#pineTree" x="60" y="100" />
        <use href="#oakTree" x="100" y="90" />
        <use href="#pineTree" x="140" y="110" />
        <use href="#pineTree" x="100" y="150" />
        <use href="#oakTree" x="135" y="170" />
        <use href="#pineTree" x="175" y="145" />
        <use href="#oakTree" x="115" y="215" />
        <use href="#pineTree" x="70" y="240" />
        <use href="#stoneRock" x="150" y="240" />
        <use href="#flowerCluster" x="190" y="235" />
        <use href="#flowerCluster" x="75" y="140" />
        <use href="#mushrooms" x="85" y="180" />

        {/* 2. North Central Forest (Between Castle & Library) with Ancient Standing Stones */}
        <use href="#pineTree" x="270" y="110" />
        <use href="#oakTree" x="310" y="125" />
        <use href="#oakTree" x="350" y="155" />
        <use href="#pineTree" x="385" y="125" />
        <use href="#standingStones" x="340" y="210" />
        <use href="#stoneRock" x="375" y="225" />
        <use href="#flowerCluster" x="315" y="220" />
        <use href="#mushrooms" x="290" y="170" />
        <use href="#lanternPost" x="420" y="320" />

        {/* 3. North-East Ridge (Between Castle & Arena/Wizard) with Watchpost Ruins */}
        <use href="#pineTree" x="615" y="130" />
        <use href="#oakTree" x="655" y="150" />
        <use href="#pineTree" x="690" y="125" />
        <use href="#standingStones" x="670" y="145" />
        <use href="#stoneRock" x="640" y="190" />
        <use href="#flowerCluster" x="670" y="200" />
        <use href="#flowerCluster" x="630" y="160" />
        <use href="#lanternPost" x="580" y="320" />

        {/* 4. Garden Grove (South-West surrounding) */}
        <use href="#oakTree" x="60" y="700" />
        <use href="#pineTree" x="90" y="720" />
        <use href="#oakTree" x="120" y="740" />
        <use href="#oakTree" x="155" y="780" />
        <use href="#pineTree" x="190" y="820" />
        <use href="#flowerCluster" x="220" y="710" />
        <use href="#flowerCluster" x="340" y="720" />
        <use href="#flowerCluster" x="170" y="840" />
        <use href="#flowerCluster" x="360" y="830" />
        <use href="#stoneRock" x="345" y="770" />
        <use href="#mushrooms" x="140" y="810" />
        <use href="#mushrooms" x="205" y="770" />
        <use href="#lanternPost" x="330" y="650" />

        {/* 5. South Central Woodlands (Under Hub Plaza) with Ancient Monument */}
        <use href="#pineTree" x="420" y="790" />
        <use href="#oakTree" x="460" y="810" />
        <use href="#pineTree" x="500" y="780" />
        <use href="#oakTree" x="540" y="815" />
        <use href="#pineTree" x="580" y="785" />
        <use href="#pineTree" x="620" y="810" />
        <use href="#stoneRock" x="485" y="850" />
        <use href="#flowerCluster" x="445" y="835" />
        <use href="#flowerCluster" x="535" y="845" />
        <use href="#flowerCluster" x="590" y="830" />
        <use href="#standingStones" x="500" y="680" />
        <use href="#mushrooms" x="470" y="770" />
        <use href="#lanternPost" x="500" y="620" />

        {/* 6. Arena Perimeter Grounds (South & East of Arena) */}
        <use href="#pineTree" x="930" y="110" />
        <use href="#oakTree" x="965" y="130" />
        <use href="#pineTree" x="930" y="180" />
        <use href="#pineTree" x="960" y="220" />
        <use href="#stoneRock" x="900" y="270" />
        <use href="#flowerCluster" x="940" y="260" />
        <use href="#mushrooms" x="920" y="250" />

        {/* 7. Far East Forest (Bordering Treasure & Pet) */}
        <use href="#oakTree" x="935" y="340" />
        <use href="#pineTree" x="965" y="380" />
        <use href="#pineTree" x="940" y="440" />
        <use href="#oakTree" x="965" y="520" />
        <use href="#pineTree" x="935" y="590" />
        <use href="#stoneRock" x="915" y="490" />
        <use href="#flowerCluster" x="955" y="480" />
        <use href="#mushrooms" x="945" y="550" />
        <use href="#lanternPost" x="720" y="600" />

        {/* 8. Southeast Creek Stream with Willow Shore */}
        <path d="M 770 940 Q 840 880 920 890 Q 980 900 1010 930 L 1010 1010 L 770 1010 Z" fill="#bfae82" />
        <path d="M 785 950 Q 850 895 925 905 Q 980 915 1010 945 L 1010 1010 L 785 1010 Z" fill="url(#lakeWater)" />
        <use href="#stoneRock" x="825" y="890" />
        <use href="#stoneRock" x="910" y="885" />
        <use href="#flowerCluster" x="860" y="865" />
      </svg>

      {/* 4. Architectural Street Signpost: Kingdom of Learning Plaque */}
      <div 
        className="absolute bottom-4 left-6 bg-[#2a1d13] border-2 border-[#8c7457] px-3.5 py-1.5 rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.5)] text-center pointer-events-none select-none flex items-center gap-2.5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(0deg, #2a1d13, #2a1d13 16px, #22160d 17px, #22160d 18px)
          `
        }}
      >
        <img 
          src="/assets/realm logo.png" 
          alt="Realm Check Logo" 
          className="w-7 h-7 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
        />
        <div className="text-left">
          <p className="font-pixel text-[10px] text-[#fef08a] tracking-wider uppercase drop-shadow-sm">Kingdom of Learning</p>
          <p className="text-[9px] text-[#c7b49d] font-semibold">Explore the 8 Realms</p>
        </div>
      </div>
    </div>
  );
};

export default RealmEnvironment;
