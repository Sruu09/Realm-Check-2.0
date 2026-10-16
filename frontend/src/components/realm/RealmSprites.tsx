import React from 'react';

// ==========================================
// A. CASTLE — Upper Centre
// Expansive multi-towered stone castle with gatehouse, turrets, and banners
// ==========================================
export const CastleSprite: React.FC = () => (
  <svg width="170" height="120" viewBox="0 0 170 120" className="filter drop-shadow-[0_8px_12px_rgba(40,30,20,0.35)]">
    {/* Ground flagstone courtyard & cast shadow */}
    <ellipse cx="85" cy="112" rx="76" ry="7" fill="#3a4f32" opacity="0.45" />
    <rect x="20" y="105" width="130" height="7" fill="#697a85" rx="1" />
    <rect x="25" y="102" width="120" height="4" fill="#8294a0" />

    {/* Outer Curtain Walls */}
    <rect x="24" y="56" width="122" height="50" fill="#889aa8" />
    <rect x="26" y="58" width="118" height="46" fill="#9db0bd" />
    {/* Masonry Bricks pattern */}
    {[
      { x: 30, y: 62 }, { x: 50, y: 62 }, { x: 104, y: 62 }, { x: 124, y: 62 },
      { x: 40, y: 72 }, { x: 60, y: 72 }, { x: 96, y: 72 }, { x: 116, y: 72 },
      { x: 32, y: 82 }, { x: 54, y: 82 }, { x: 102, y: 82 }, { x: 126, y: 82 },
      { x: 42, y: 92 }, { x: 112, y: 92 },
    ].map((b, i) => (
      <rect key={i} x={b.x} y={b.y} width="12" height="5" fill="#788b99" rx="0.5" />
    ))}

    {/* Left Outer Tower */}
    <rect x="14" y="34" width="24" height="74" fill="#758896" rx="1" />
    <rect x="16" y="36" width="20" height="70" fill="#8fa1af" />
    {/* Battlements */}
    <rect x="12" y="28" width="6" height="8" fill="#586b78" />
    <rect x="23" y="28" width="6" height="8" fill="#586b78" />
    <rect x="34" y="28" width="6" height="8" fill="#586b78" />
    {/* Conical Roof (Slate Blue / Indigo) */}
    <polygon points="26,8 10,28 42,28" fill="#3d5a80" />
    <polygon points="26,8 26,28 42,28" fill="#293d56" />
    {/* Arrow slit windows */}
    <rect x="24" y="50" width="4" height="10" fill="#222f3e" rx="1" />
    <rect x="24" y="74" width="4" height="10" fill="#222f3e" rx="1" />

    {/* Right Outer Tower */}
    <rect x="132" y="34" width="24" height="74" fill="#758896" rx="1" />
    <rect x="134" y="36" width="20" height="70" fill="#8fa1af" />
    {/* Battlements */}
    <rect x="130" y="28" width="6" height="8" fill="#586b78" />
    <rect x="141" y="28" width="6" height="8" fill="#586b78" />
    <rect x="152" y="28" width="6" height="8" fill="#586b78" />
    {/* Conical Roof */}
    <polygon points="144,8 128,28 160,28" fill="#3d5a80" />
    <polygon points="144,8 144,28 160,28" fill="#293d56" />
    <rect x="142" y="50" width="4" height="10" fill="#222f3e" rx="1" />
    <rect x="142" y="74" width="4" height="10" fill="#222f3e" rx="1" />

    {/* Central Great Keep */}
    <rect x="62" y="24" width="46" height="84" fill="#7f93a2" rx="1" />
    <rect x="64" y="26" width="42" height="80" fill="#9db0bd" />
    {/* Keep Battlements */}
    <rect x="60" y="18" width="7" height="8" fill="#5e717e" />
    <rect x="71" y="18" width="7" height="8" fill="#5e717e" />
    <rect x="82" y="18" width="7" height="8" fill="#5e717e" />
    <rect x="93" y="18" width="7" height="8" fill="#5e717e" />
    <rect x="103" y="18" width="7" height="8" fill="#5e717e" />
    {/* Keep Pyramidal High Spire */}
    <polygon points="85,2 62,18 108,18" fill="#992b2b" />
    <polygon points="85,2 85,18 108,18" fill="#7d1f1f" />
    {/* Royal Gold Crest & Banner Flag */}
    <line x1="85" y1="2" x2="85" y2="-6" stroke="#4a3b2c" strokeWidth="2" />
    <polygon points="85,-6 98,-3 85,0" fill="#f59e0b" />
    <circle cx="85" cy="38" r="5" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />

    {/* Gatehouse Arch & Iron Portcullis */}
    <path d="M72,108 L72,74 Q85,64 98,74 L98,108 Z" fill="#221811" />
    <path d="M74,108 L74,76 Q85,67 96,76 L96,108 Z" fill="#140d08" />
    {/* Portcullis Grate Bars */}
    <line x1="85" y1="68" x2="85" y2="108" stroke="#d4b488" strokeWidth="1.8" />
    <line x1="79" y1="72" x2="79" y2="108" stroke="#d4b488" strokeWidth="1.8" />
    <line x1="91" y1="72" x2="91" y2="108" stroke="#d4b488" strokeWidth="1.8" />
    <line x1="74" y1="84" x2="96" y2="84" stroke="#d4b488" strokeWidth="1.5" />
    <line x1="74" y1="96" x2="96" y2="96" stroke="#d4b488" strokeWidth="1.5" />

    {/* Royal Wall Tapestry Banners */}
    <rect x="46" y="64" width="8" height="22" fill="#1e3a8a" />
    <polygon points="46,86 50,82 54,86" fill="#9db0bd" />
    <rect x="116" y="64" width="8" height="22" fill="#1e3a8a" />
    <polygon points="116,86 120,82 124,86" fill="#9db0bd" />

    {/* Gate Lamps */}
    <circle cx="68" cy="80" r="3" fill="#fcd34d" />
    <circle cx="102" cy="80" r="3" fill="#fcd34d" />
  </svg>
);

// ==========================================
// B. LIBRARY — Upper Left
// Timber & Stone Medieval Bookstore with Bookshelves & Sign
// ==========================================
export const LibrarySprite: React.FC = () => (
  <svg width="118" height="98" viewBox="0 0 118 98" className="filter drop-shadow-[0_6px_10px_rgba(40,30,20,0.3)]">
    {/* Cast Shadow */}
    <ellipse cx="59" cy="92" rx="52" ry="6" fill="#3a4f32" opacity="0.45" />
    {/* Stone Foundation */}
    <rect x="10" y="86" width="98" height="7" fill="#6f7d88" rx="1" />
    <rect x="14" y="82" width="90" height="5" fill="#889aa8" />

    {/* Half-Timbered Walls (Beige Plaster + Timber Beams) */}
    <rect x="18" y="44" width="82" height="40" fill="#ede5d8" rx="1" />
    {/* Timber Corner Pillars */}
    <rect x="16" y="44" width="6" height="40" fill="#6b4423" />
    <rect x="96" y="44" width="6" height="40" fill="#6b4423" />
    <rect x="56" y="44" width="6" height="40" fill="#6b4423" />
    {/* Diagonal Timber Struts */}
    <line x1="22" y1="44" x2="56" y2="84" stroke="#6b4423" strokeWidth="4" />
    <line x1="62" y1="84" x2="96" y2="44" stroke="#6b4423" strokeWidth="4" />
    <rect x="16" y="62" width="86" height="4" fill="#58371c" />

    {/* Library Display Windows with visible books */}
    <rect x="25" y="49" width="24" height="22" fill="#2d2218" rx="1" />
    <rect x="26" y="50" width="22" height="20" fill="#4a3725" />
    {/* Bookshelf Rows in Window */}
    <rect x="27" y="52" width="20" height="3" fill="#78350f" />
    <rect x="28" y="56" width="3" height="6" fill="#dc2626" />
    <rect x="32" y="56" width="3" height="6" fill="#2563eb" />
    <rect x="36" y="56" width="3" height="6" fill="#16a34a" />
    <rect x="40" y="56" width="4" height="6" fill="#d97706" />
    <rect x="27" y="63" width="20" height="2" fill="#78350f" />
    {/* Warm window glow */}
    <circle cx="37" cy="60" r="7" fill="#fcd34d" opacity="0.35" />

    {/* Pitched Thatched/Slate Roof */}
    <polygon points="59,10 6,46 112,46" fill="#7c4a27" />
    <polygon points="59,13 12,44 106,44" fill="#965a30" />
    {/* Shingle Ridge Lines */}
    <line x1="20" y1="40" x2="98" y2="40" stroke="#5a341a" strokeWidth="2" />
    <line x1="30" y1="32" x2="88" y2="32" stroke="#5a341a" strokeWidth="2" />
    <line x1="42" y1="24" x2="76" y2="24" stroke="#5a341a" strokeWidth="2" />

    {/* Dormer Window with Attic Archive */}
    <polygon points="59,16 48,28 70,28" fill="#5a341a" />
    <rect x="52" y="26" width="14" height="12" fill="#6b4423" />
    <circle cx="59" cy="32" r="3.5" fill="#fcd34d" />

    {/* Entrance Door & Steps */}
    <rect x="69" y="54" width="18" height="30" fill="#3d2716" rx="2" />
    <rect x="71" y="56" width="14" height="28" fill="#58381f" />
    <circle cx="82" cy="70" r="1.5" fill="#f59e0b" />

    {/* Hanging Wooden Sign "BOOK" */}
    <rect x="98" y="52" width="14" height="10" fill="#d97706" stroke="#78350f" strokeWidth="1" rx="1" />
    <line x1="102" y1="46" x2="102" y2="52" stroke="#451a03" strokeWidth="1.2" />
    <line x1="108" y1="46" x2="108" y2="52" stroke="#451a03" strokeWidth="1.2" />
    {/* Open Book Icon on Sign */}
    <path d="M101,57 Q105,55 109,57" stroke="#ffffff" strokeWidth="1.2" fill="none" />
  </svg>
);

// ==========================================
// C. WIZARD — Upper Right
// Mystical Wizard Character with Robe, Hat, Staff & Astral Spire
// ==========================================
export const WizardSprite: React.FC = () => (
  <svg width="124" height="104" viewBox="0 0 124 104" className="filter drop-shadow-[0_6px_10px_rgba(40,30,20,0.3)]">
    {/* Ground Shadow */}
    <ellipse cx="62" cy="98" rx="54" ry="6" fill="#3a4f32" opacity="0.45" />

    {/* Small Arcane Observatory Stone Tower (Left side) */}
    <rect x="18" y="44" width="36" height="54" fill="#605273" rx="1" />
    <rect x="20" y="46" width="32" height="50" fill="#75658b" />
    {/* Tower Spire Roof */}
    <polygon points="36,12 12,44 60,44" fill="#3a2a4f" />
    <polygon points="36,12 36,44 60,44" fill="#281c38" />
    {/* Golden Moon Topper */}
    <circle cx="36" cy="10" r="4.5" fill="#fbbf24" />
    <circle cx="38" cy="9" r="3.5" fill="#75658b" />
    {/* Mystical Stained-Glass Window */}
    <circle cx="36" cy="60" r="7" fill="#1e132d" />
    <circle cx="36" cy="60" r="5.5" fill="#c084fc" />
    <line x1="36" y1="53" x2="36" y2="67" stroke="#fff" strokeWidth="1" />
    <line x1="29" y1="60" x2="43" y2="60" stroke="#fff" strokeWidth="1" />
    {/* Tower Door */}
    <path d="M28,96 L28,82 Q36,78 44,82 L44,96 Z" fill="#241736" />

    {/* Floating Magical Books & Sparkles */}
    <rect x="10" y="58" width="8" height="6" fill="#3b82f6" rx="0.5" />
    <rect x="8" y="70" width="8" height="6" fill="#ec4899" rx="0.5" />
    <circle cx="28" cy="36" r="1.5" fill="#facc15" />
    <circle cx="56" cy="48" r="1.5" fill="#facc15" />
    <circle cx="68" cy="30" r="2" fill="#c084fc" />

    {/* VISIBLE PIXEL WIZARD CHARACTER (Right Side, Foreground) */}
    {/* Robe Hem Shadow */}
    <ellipse cx="88" cy="97" rx="14" ry="3.5" fill="#221832" opacity="0.6" />
    {/* Violet Wizard Robe */}
    <path d="M78,96 L82,56 L94,56 L98,96 Z" fill="#4c1d95" />
    <path d="M82,96 L85,58 L91,58 L94,96 Z" fill="#6d28d9" />
    {/* Golden Robe Trim & Belt */}
    <rect x="83" y="68" width="10" height="2.5" fill="#f59e0b" />
    <circle cx="88" cy="69" r="2" fill="#fef08a" />

    {/* Flowing Long White Beard */}
    <polygon points="84,54 92,54 88,72" fill="#f8fafc" />
    <polygon points="85,54 91,54 88,68" fill="#e2e8f0" />

    {/* Wizard Face */}
    <circle cx="88" cy="50" r="5" fill="#fed7aa" />
    <circle cx="86" cy="49" r="0.8" fill="#1e1b4b" />
    <circle cx="90" cy="49" r="0.8" fill="#1e1b4b" />

    {/* Pointed Wizard Hat with floppy brim */}
    <ellipse cx="88" cy="46" rx="13" ry="3.5" fill="#311042" />
    <polygon points="88,20 78,46 98,46" fill="#4c1d95" />
    <polygon points="88,20 88,46 98,46" fill="#3b0764" />
    <rect x="81" y="43" width="14" height="2.5" fill="#f59e0b" />
    {/* Star badge on hat */}
    <circle cx="88" cy="34" r="2" fill="#facc15" />

    {/* Magic Staff (Left Hand) */}
    <line x1="74" y1="96" x2="74" y2="42" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
    {/* Glowing Crystal Orb on Staff */}
    <circle cx="74" cy="40" r="5" fill="#818cf8" opacity="0.5" />
    <circle cx="74" cy="40" r="3.5" fill="#a855f7" />
    <circle cx="73" cy="39" r="1.5" fill="#ffffff" />
  </svg>
);

// ==========================================
// D. GHOST BOSS CLEARING (Decorative Environmental Landmark)
// Haunted grove in far upper right with ghost boss, twisted trees & lanterns
// ==========================================
export const GhostBossSprite: React.FC = () => (
  <svg width="100" height="90" viewBox="0 0 100 90" className="filter drop-shadow-[0_6px_10px_rgba(20,10,30,0.5)]">
    {/* Dark Haunted Clearing Mound */}
    <ellipse cx="50" cy="78" rx="46" ry="10" fill="#2d3b2a" opacity="0.8" />
    <ellipse cx="50" cy="76" rx="38" ry="7" fill="#3a4836" />

    {/* Twisted Spooky Bare Trees */}
    <path d="M18,78 Q22,55 16,40 Q12,30 8,24 M16,40 Q24,32 28,26" stroke="#2c221b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M82,78 Q78,55 84,40 Q88,30 92,24 M84,40 Q76,32 72,26" stroke="#2c221b" strokeWidth="3.5" fill="none" strokeLinecap="round" />

    {/* Mossy Tombstone / Ruin Arch */}
    <rect x="42" y="58" width="16" height="20" fill="#475569" rx="3" />
    <rect x="44" y="60" width="12" height="16" fill="#64748b" rx="2" />
    <line x1="50" y1="64" x2="50" y2="72" stroke="#334155" strokeWidth="1.5" />
    <line x1="47" y1="67" x2="53" y2="67" stroke="#334155" strokeWidth="1.5" />

    {/* Floating Ghost Boss Sprite */}
    <ellipse cx="50" cy="74" rx="14" ry="4" fill="#0f172a" opacity="0.4" />
    {/* Ghost Astral Body with Wisp Trail */}
    <path d="M34,42 Q34,22 50,22 Q66,22 66,42 Q66,54 60,56 Q55,50 50,56 Q45,50 40,56 Q34,54 34,42 Z" fill="#e0e7ff" />
    <path d="M36,42 Q36,25 50,25 Q64,25 64,42 Q64,52 59,54 Q55,48 50,54 Q45,48 41,54 Q36,52 36,42 Z" fill="#f8fafc" />
    
    {/* Ghost Crown / Horns */}
    <polygon points="50,16 46,24 54,24" fill="#6366f1" />
    <polygon points="42,20 40,26 46,25" fill="#818cf8" />
    <polygon points="58,20 60,26 54,25" fill="#818cf8" />

    {/* Glowing Purple Ghost Eyes & Mouth */}
    <ellipse cx="45" cy="34" rx="2.5" ry="3.5" fill="#4338ca" />
    <ellipse cx="55" cy="34" rx="2.5" ry="3.5" fill="#4338ca" />
    <circle cx="45.5" cy="33.5" r="1.2" fill="#a5b4fc" />
    <circle cx="55.5" cy="33.5" r="1.2" fill="#a5b4fc" />
    <ellipse cx="50" cy="44" rx="3.5" ry="4" fill="#312e81" />

    {/* Floating Wisp Orbs */}
    <circle cx="28" cy="46" r="3" fill="#a855f7" opacity="0.75" />
    <circle cx="72" cy="44" r="3" fill="#a855f7" opacity="0.75" />
    <circle cx="28" cy="46" r="1.5" fill="#ffffff" />
    <circle cx="72" cy="44" r="1.5" fill="#ffffff" />
  </svg>
);

// ==========================================
// E. POND — Lower / Middle Left
// Pier, Waterside Fountain, Water Lily Beds, & Reeds
// ==========================================
export const PondSprite: React.FC = () => (
  <svg width="134" height="110" viewBox="0 0 134 110" className="filter drop-shadow-[0_6px_12px_rgba(30,40,30,0.35)]">
    {/* Ground Shoreline Sand and Grass Shadow */}
    <ellipse cx="67" cy="98" rx="60" ry="8" fill="#304429" opacity="0.5" />
    <ellipse cx="67" cy="62" rx="58" ry="38" fill="#c4b693" />
    
    {/* Deep Spring Water */}
    <ellipse cx="67" cy="60" rx="52" ry="32" fill="#2d6888" />
    <ellipse cx="65" cy="58" rx="46" ry="26" fill="#3d82a6" />
    <ellipse cx="62" cy="56" rx="38" ry="20" fill="#5599bd" />

    {/* Concentric Water Shimmer Waves */}
    <ellipse cx="58" cy="56" rx="28" ry="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeDasharray="6 3" />
    <path d="M34,48 Q46,44 58,48" stroke="#ffffff" strokeWidth="1.6" fill="none" opacity="0.8" strokeLinecap="round" />
    <path d="M68,66 Q82,62 96,66" stroke="#ffffff" strokeWidth="1.6" fill="none" opacity="0.8" strokeLinecap="round" />

    {/* Central Stone Fountain Spout */}
    <g transform="translate(58, 54)">
      <ellipse cx="0" cy="4" rx="10" ry="4" fill="#64748b" />
      <ellipse cx="0" cy="2" rx="8" ry="3" fill="#94a3b8" />
      <rect x="-2" y="-4" width="4" height="6" fill="#475569" />
      {/* Water Spray Jets */}
      <path d="M0,-4 Q-4,-12 -8,-4" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M0,-4 Q4,-12 8,-4" fill="none" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="0" cy="-6" r="2" fill="#bae6fd" />
    </g>

    {/* Lily Pads & Lotus Blossoms */}
    <ellipse cx="34" cy="52" rx="7" ry="4.5" fill="#2d6a32" />
    <polygon points="34,52 30,49 32,55" fill="#5599bd" />
    <circle cx="35" cy="50" r="2.5" fill="#f472b6" />
    <circle cx="35" cy="50" r="1.2" fill="#ffffff" />

    <ellipse cx="88" cy="46" rx="6.5" ry="4" fill="#255829" />
    <circle cx="89" cy="45" r="2.2" fill="#fb7185" />

    <ellipse cx="38" cy="68" rx="6" ry="3.8" fill="#2d6a32" />

    {/* Shoreline Green Reeds & Reeds */}
    <g transform="translate(20, 50)">
      <line x1="0" y1="0" x2="-2" y2="-12" stroke="#2e5927" strokeWidth="1.6" />
      <rect x="-3" y="-12" width="2" height="6" fill="#6b4624" rx="0.5" />
      <line x1="4" y1="0" x2="5" y2="-15" stroke="#2e5927" strokeWidth="1.6" />
      <rect x="4" y="-15" width="2" height="7" fill="#6b4624" rx="0.5" />
    </g>

    {/* Waterside Wooden Dock / Pier */}
    <rect x="82" y="60" width="28" height="38" fill="#6d4c2b" rx="1" />
    <rect x="84" y="62" width="24" height="6" fill="#8f6438" />
    <rect x="84" y="70" width="24" height="6" fill="#8f6438" />
    <rect x="84" y="78" width="24" height="6" fill="#8f6438" />
    <rect x="84" y="86" width="24" height="6" fill="#8f6438" />
    {/* Pier Mooring Posts */}
    <rect x="80" y="58" width="4" height="12" fill="#4a3520" rx="1" />
    <rect x="108" y="58" width="4" height="12" fill="#4a3520" rx="1" />
    <circle cx="82" cy="57" r="1.5" fill="#fcd34d" />
    <circle cx="110" cy="57" r="1.5" fill="#fcd34d" />
  </svg>
);

// ==========================================
// F. GARDEN — Lower Left
// Rich Botanical Glasshouse / Pergola with Flowerbeds & Picket Fence
// ==========================================
export const GardenSprite: React.FC = () => (
  <svg width="126" height="106" viewBox="0 0 126 106" className="filter drop-shadow-[0_6px_12px_rgba(30,40,20,0.35)]">
    {/* Earth Soil Base */}
    <ellipse cx="63" cy="98" rx="58" ry="7" fill="#2d3f26" opacity="0.45" />
    <rect x="10" y="60" width="106" height="38" fill="#4a2e16" rx="4" />
    <rect x="12" y="62" width="102" height="34" fill="#38200d" rx="3" />

    {/* Cultivated Rich Crop Rows */}
    <line x1="16" y1="70" x2="110" y2="70" stroke="#4a2e16" strokeWidth="3" />
    <line x1="16" y1="82" x2="110" y2="82" stroke="#4a2e16" strokeWidth="3" />

    {/* Garden Trellis Greenhouse Frame with Ivy & Vines */}
    <rect x="36" y="20" width="54" height="44" fill="#5c2e0b" rx="2" />
    <polygon points="63,2 26,22 100,22" fill="#14532d" />
    <polygon points="63,5 30,21 96,21" fill="#16a34a" />

    {/* Trellis Grid inside Greenhouse */}
    <rect x="40" y="24" width="46" height="36" fill="#f0fdf4" opacity="0.9" rx="1" />
    <line x1="40" y1="34" x2="86" y2="34" stroke="#22c55e" strokeWidth="1" />
    <line x1="40" y1="46" x2="86" y2="46" stroke="#22c55e" strokeWidth="1" />
    <line x1="52" y1="24" x2="52" y2="60" stroke="#22c55e" strokeWidth="1" />
    <line x1="64" y1="24" x2="64" y2="60" stroke="#22c55e" strokeWidth="1" />
    <line x1="76" y1="24" x2="76" y2="60" stroke="#22c55e" strokeWidth="1" />

    {/* Climbing Leafy Vines on Greenhouse Walls */}
    <path d="M28,62 Q24,44 32,32 Q34,26 38,22" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="27" cy="48" r="3" fill="#4ade80" />
    <circle cx="31" cy="38" r="3" fill="#4ade80" />
    <circle cx="33" cy="28" r="2.5" fill="#f43f5e" />

    <path d="M98,62 Q102,44 94,32 Q92,26 88,22" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="99" cy="48" r="3" fill="#4ade80" />
    <circle cx="95" cy="38" r="3" fill="#4ade80" />
    <circle cx="93" cy="28" r="2.5" fill="#fbbf24" />

    {/* Blooming Vibrant Flowerbed Sprites */}
    {/* Sunflowers (Back Left & Right) */}
    <circle cx="22" cy="68" r="5.5" fill="#f59e0b" />
    <circle cx="22" cy="68" r="2.8" fill="#78350f" />
    <circle cx="104" cy="68" r="5.5" fill="#f59e0b" />
    <circle cx="104" cy="68" r="2.8" fill="#78350f" />
    {/* Scarlet Coral Roses */}
    <circle cx="32" cy="78" r="4.5" fill="#e11d48" />
    <circle cx="32" cy="78" r="1.8" fill="#fff" />
    <circle cx="94" cy="78" r="4.5" fill="#e11d48" />
    <circle cx="94" cy="78" r="1.8" fill="#fff" />
    {/* Bluebells, Lilacs & Marigolds in Center Bed */}
    <circle cx="48" cy="80" r="4" fill="#3b82f6" />
    <circle cx="63" cy="79" r="4" fill="#ec4899" />
    <circle cx="78" cy="80" r="4" fill="#a855f7" />

    {/* White Garden Picket Fence */}
    {[12, 22, 32, 42, 52, 62, 72, 82, 92, 102].map((x, i) => (
      <polygon key={i} points={`${x},82 ${x+4},82 ${x+4},98 ${x},98`} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
    ))}
    <rect x="10" y="88" width="98" height="2.5" fill="#e2e8f0" />
  </svg>
);

// ==========================================
// G. TREASURE — Right Side
// Gold Mine Built into Rocky Hillside with Timber Beams & Ore Cart
// ==========================================
export const TreasureSprite: React.FC = () => (
  <svg width="124" height="102" viewBox="0 0 124 102" className="filter drop-shadow-[0_6px_10px_rgba(40,30,20,0.35)]">
    {/* Rocky Hillside Base */}
    <ellipse cx="62" cy="94" rx="56" ry="7" fill="#3a4f32" opacity="0.45" />

    {/* Mountain Rock Mound */}
    <path d="M12,94 Q18,36 50,22 Q78,14 106,42 Q118,62 114,94 Z" fill="#64748b" />
    <path d="M18,94 Q24,42 52,28 Q76,20 100,48 Q108,66 106,94 Z" fill="#788b9c" />
    {/* Visible Gold Veins in Rock Face */}
    <path d="M28,46 L38,42 L42,48 L48,44" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M84,38 L92,44 L96,40" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="44" r="1.5" fill="#fef08a" />
    <circle cx="44" cy="46" r="1.5" fill="#fef08a" />

    {/* Timber-Supported Mine Shaft Entrance */}
    <rect x="36" y="44" width="52" height="50" fill="#1e1814" rx="2" />
    <rect x="40" y="48" width="44" height="46" fill="#0f0c0a" />

    {/* Timber Shoring Beams */}
    <rect x="34" y="42" width="8" height="52" fill="#78350f" />
    <rect x="82" y="42" width="8" height="52" fill="#78350f" />
    <rect x="30" y="38" width="64" height="8" fill="#92400e" rx="1" />
    {/* Hanging Mine Lantern */}
    <line x1="62" y1="46" x2="62" y2="54" stroke="#451a03" strokeWidth="1.5" />
    <rect x="58" y="54" width="8" height="9" fill="#d97706" rx="1" />
    <circle cx="62" cy="58" r="3.5" fill="#fef08a" />

    {/* Wooden Mine Rail Tracks */}
    <line x1="50" y1="94" x2="74" y2="94" stroke="#374151" strokeWidth="2" />
    <line x1="52" y1="88" x2="72" y2="88" stroke="#78350f" strokeWidth="2" />
    <line x1="54" y1="82" x2="70" y2="82" stroke="#78350f" strokeWidth="2" />

    {/* Mine Ore Cart Overflowing with Gold Nuggets */}
    <rect x="50" y="74" width="24" height="16" fill="#475569" rx="2" />
    <rect x="52" y="76" width="20" height="12" fill="#64748b" />
    {/* Cart Wheels */}
    <circle cx="54" cy="92" r="3.5" fill="#1e293b" />
    <circle cx="70" cy="92" r="3.5" fill="#1e293b" />
    {/* Sparkling Gold Nuggets in Cart */}
    <ellipse cx="62" cy="74" rx="9" ry="5" fill="#f59e0b" />
    <circle cx="58" cy="72" r="2.5" fill="#fcd34d" />
    <circle cx="64" cy="71" r="3" fill="#fbbf24" />
    <circle cx="67" cy="73" r="2" fill="#fef08a" />

    {/* Scattered Gold Nuggets, Coins & Jewels on ground */}
    <circle cx="24" cy="90" r="3.5" fill="#f59e0b" />
    <circle cx="28" cy="88" r="3" fill="#fbbf24" />
    <circle cx="32" cy="91" r="3.5" fill="#f59e0b" />
    <polygon points="30,86 33,83 36,86 33,89" fill="#ef4444" /> {/* Ruby */}
    <polygon points="22,91 24,88 26,91 24,94" fill="#10b981" /> {/* Emerald */}

    <circle cx="94" cy="90" r="3.5" fill="#f59e0b" />
    <circle cx="98" cy="89" r="3" fill="#fbbf24" />
    <circle cx="102" cy="92" r="3.5" fill="#f59e0b" />
    <polygon points="96,86 98,83 101,86 98,89" fill="#3b82f6" /> {/* Sapphire */}
    <polygon points="104,89 106,86 108,89 106,92" fill="#ef4444" /> {/* Ruby */}
  </svg>
);

// ==========================================
// H. PET — Right Side (Below / Near Wizard)
// Welcoming Animal Cottage with Cheerful Animal Companion
// ==========================================
export const PetSprite: React.FC = () => (
  <svg width="118" height="98" viewBox="0 0 118 98" className="filter drop-shadow-[0_6px_10px_rgba(40,30,20,0.3)]">
    {/* Ground Shadow */}
    <ellipse cx="59" cy="92" rx="50" ry="6" fill="#3a4f32" opacity="0.45" />

    {/* Cozy Log Cabin Pet House (Left Side) */}
    <rect x="12" y="44" width="54" height="46" fill="#92400e" rx="2" />
    <rect x="15" y="46" width="48" height="42" fill="#b45309" />
    {/* Horizontal Log Planks */}
    <line x1="12" y1="54" x2="66" y2="54" stroke="#78350f" strokeWidth="2" />
    <line x1="12" y1="64" x2="66" y2="64" stroke="#78350f" strokeWidth="2" />
    <line x1="12" y1="74" x2="66" y2="74" stroke="#78350f" strokeWidth="2" />
    <line x1="12" y1="84" x2="66" y2="84" stroke="#78350f" strokeWidth="2" />

    {/* Red Timber Gabled Roof */}
    <polygon points="39,18 6,46 72,46" fill="#991b1b" />
    <polygon points="39,21 11,44 67,44" fill="#b91c1c" />
    {/* Bone Sigil above door */}
    <rect x="34" y="36" width="10" height="3" fill="#fef3c7" rx="1.5" />

    {/* Cottage Arched Entrance */}
    <path d="M26,90 L26,62 Q39,54 52,62 L52,90 Z" fill="#451a03" />

    {/* CHEERFUL PET COMPANION (Golden Puppy in Foreground) */}
    {/* Body Shadow */}
    <ellipse cx="88" cy="91" rx="14" ry="4" fill="#291c10" opacity="0.5" />
    {/* Body */}
    <ellipse cx="86" cy="74" rx="13" ry="11" fill="#f59e0b" />
    <ellipse cx="84" cy="76" rx="9" ry="7" fill="#fef3c7" />

    {/* Cheerful Head */}
    <circle cx="88" cy="54" r="11" fill="#f59e0b" />
    <ellipse cx="88" cy="58" rx="7" ry="5" fill="#fef3c7" />

    {/* Floppy Puppy Ears */}
    <ellipse cx="78" cy="50" rx="3.5" ry="7" fill="#b45309" transform="rotate(-15 78 50)" />
    <ellipse cx="98" cy="50" rx="3.5" ry="7" fill="#b45309" transform="rotate(15 98 50)" />

    {/* Expressive Eyes & Nose */}
    <ellipse cx="84" cy="52" rx="2" ry="2.5" fill="#0f172a" />
    <circle cx="85" cy="51" r="0.8" fill="#ffffff" />
    <ellipse cx="92" cy="52" rx="2" ry="2.5" fill="#0f172a" />
    <circle cx="93" cy="51" r="0.8" fill="#ffffff" />
    <polygon points="88,57 85,55 91,55" fill="#1e293b" />
    {/* Happy Tongue */}
    <path d="M86,60 Q88,64 90,60" stroke="#1e293b" strokeWidth="1" fill="none" />
    <ellipse cx="88" cy="62" rx="2" ry="2.5" fill="#f43f5e" />

    {/* Red Collar with Gold Bell */}
    <rect x="80" y="62" width="16" height="3" fill="#dc2626" rx="1" />
    <circle cx="88" cy="65" r="2" fill="#facc15" />

    {/* Playful Wagging Tail */}
    <path d="M74,74 Q68,66 70,60" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Pet Water Bowl */}
    <ellipse cx="104" cy="88" rx="7" ry="4" fill="#0284c7" />
    <ellipse cx="104" cy="87" rx="5.5" ry="2.5" fill="#38bdf8" />
  </svg>
);

// ==========================================
// I. BATTLE ARENA — Northeast Clearing
// Dark Dungeon Boss Battleground with Stone Ruins & Torches
// ==========================================
export const ArenaSprite: React.FC = () => (
  <svg width="128" height="106" viewBox="0 0 128 106" className="filter drop-shadow-[0_4px_8px_rgba(10,5,15,0.4)]">
    {/* Compact Ground Foundation Shadow Hugging Platform Footprint */}
    <ellipse cx="64" cy="84" rx="46" ry="12" fill="#18121d" opacity="0.6" />
    <ellipse cx="64" cy="74" rx="48" ry="20" fill="#2d2235" />
    <ellipse cx="64" cy="72" rx="44" ry="17" fill="#3c2f47" />

    {/* Dungeon Brick Border / Broken Outer Ruins */}
    <rect x="22" y="44" width="12" height="24" fill="#4a3e56" rx="1" />
    <rect x="24" y="46" width="8" height="20" fill="#5c4d6a" />
    <rect x="94" y="44" width="12" height="24" fill="#4a3e56" rx="1" />
    <rect x="96" y="46" width="8" height="20" fill="#5c4d6a" />
    
    {/* Rear Spooky Stone Wall Tier */}
    <rect x="34" y="28" width="60" height="28" fill="#281e30" rx="2" />
    <rect x="36" y="30" width="56" height="24" fill="#382b42" />
    {[42, 54, 66, 78].map((x, i) => (
      <path key={i} d={`M${x},46 L${x},36 Q${x+3},32 ${x+6},36 L${x+6},46 Z`} fill="#18121f" />
    ))}

    {/* Spooky Torches with Animated Glow Flame */}
    <g transform="translate(30, 48)">
      <rect x="-1.5" y="0" width="3" height="12" fill="#78350f" />
      <polygon points="0,-6 -4,0 4,0" fill="#ef4444" />
      <polygon points="0,-4 -2,0 2,0" fill="#fbbf24" />
      <circle cx="0" cy="-2" r="6" fill="#f59e0b" opacity="0.35" />
    </g>
    <g transform="translate(98, 48)">
      <rect x="-1.5" y="0" width="3" height="12" fill="#78350f" />
      <polygon points="0,-6 -4,0 4,0" fill="#ef4444" />
      <polygon points="0,-4 -2,0 2,0" fill="#fbbf24" />
      <circle cx="0" cy="-2" r="6" fill="#f59e0b" opacity="0.35" />
    </g>

    {/* Center Boss Combat Pit Floor */}
    <ellipse cx="64" cy="72" rx="36" ry="14" fill="#201726" />

    {/* Pixel Dungeon Demon Boss Icon in Center */}
    <g transform="translate(64, 66)">
      {/* Shadow */}
      <ellipse cx="0" cy="10" rx="14" ry="4" fill="#000" opacity="0.5" />
      {/* Demon Torso */}
      <rect x="-10" y="-12" width="20" height="18" fill="#881337" rx="2" />
      <rect x="-8" y="-10" width="16" height="14" fill="#9f1239" />
      {/* Horns */}
      <polygon points="-8,-12 -12,-18 -6,-14" fill="#f43f5e" />
      <polygon points="8,-12 12,-18 6,-14" fill="#f43f5e" />
      {/* Glowing Crimson Eyes */}
      <rect x="-6" y="-6" width="3" height="2" fill="#fef08a" />
      <rect x="3" y="-6" width="3" height="2" fill="#fef08a" />
      {/* Fangs */}
      <polygon points="-3,0 -1,4 1,0" fill="#fff" />
    </g>

    {/* Crossed Battle Blades Sigil */}
    <line x1="52" y1="84" x2="76" y2="92" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    <line x1="76" y1="84" x2="52" y2="92" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ==========================================
// J. CENTRAL PLAYER CHARACTER — Youthful Adventurer
// High-detail 2D pixel adventurer using authentic Kenney Tiny Dungeon hero sprites
// ==========================================
interface PlayerCharacterSpriteProps {
  direction?: 'down' | 'up' | 'left' | 'right';
  isMoving?: boolean;
}

export const PlayerCharacterSprite: React.FC<PlayerCharacterSpriteProps> = ({
  direction = 'down',
  isMoving = false
}) => {
  // Kenney Tiny Dungeon hero sprites:
  // Down: tile_0085.png (adventurer idle) / tile_0098.png (walking/step)
  // Up: tile_0086.png
  // Left / Right: tile_0088.png (side pose with scaleX flip)
  let spriteSrc = '/assets/tiny_dungeon/Tiles/tile_0085.png';
  let flipX = false;

  if (direction === 'up') {
    spriteSrc = '/assets/tiny_dungeon/Tiles/tile_0086.png';
  } else if (direction === 'left') {
    spriteSrc = '/assets/tiny_dungeon/Tiles/tile_0088.png';
    flipX = true;
  } else if (direction === 'right') {
    spriteSrc = '/assets/tiny_dungeon/Tiles/tile_0088.png';
    flipX = false;
  } else {
    // down
    spriteSrc = isMoving ? '/assets/tiny_dungeon/Tiles/tile_0098.png' : '/assets/tiny_dungeon/Tiles/tile_0085.png';
  }

  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* Soft Ground Shadow directly underneath feet */}
      <div className="w-7 h-2 bg-[#121c0e]/60 rounded-full blur-[0.6px] absolute -bottom-0.5" />
      
      {/* Crisp 2D Pixel Adventurer Character */}
      <div 
        className={`transition-transform duration-75 ${isMoving ? 'animate-bounce' : ''}`}
        style={{
          transform: `${flipX ? 'scaleX(-1)' : 'scaleX(1)'}`,
          animationDuration: '0.35s'
        }}
      >
        <img 
          src={spriteSrc} 
          alt="Adventurer" 
          className="w-9 h-9 object-contain [image-rendering:pixelated] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
        />
      </div>
    </div>
  );
};
