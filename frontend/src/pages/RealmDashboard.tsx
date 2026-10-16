import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RPGHud from '../components/realm/RPGHud';
import ProfilePanel from '../components/realm/ProfilePanel';
import SideMenu from '../components/realm/SideMenu';
import RealmEnvironment from '../components/realm/RealmEnvironment';
import LocationNode from '../components/realm/LocationNode';
import {
  CastleSprite,
  LibrarySprite,
  PondSprite,
  GardenSprite,
  ArenaSprite,
  TreasureSprite,
  WizardSprite,
  PetSprite,
  PlayerCharacterSprite
} from '../components/realm/RealmSprites';

// Calibrated positions fitting desktop 1280x800 and 1920x1080 perfectly with road network and zero overlap
const locations = [
  { id: 'castle', name: 'Castle', subtitle: 'Central Hub', top: '22%', left: '50%', icon: <CastleSprite />, route: '/castle', x: 50, y: 22 },
  { id: 'library', name: 'Library', subtitle: 'Courses & Grants', top: '34%', left: '24%', icon: <LibrarySprite />, route: '/library', x: 24, y: 34 },
  { id: 'pond', name: 'Pond', subtitle: 'Digital Journal', top: '56%', left: '14%', icon: <PondSprite />, route: '/pond', x: 14, y: 56 },
  { id: 'garden', name: 'Garden', subtitle: 'Fitness & Habits', top: '78%', left: '27%', icon: <GardenSprite />, route: '/garden', x: 27, y: 78 },
  { id: 'arena', name: 'Arena', subtitle: 'Exam Prep', top: '23%', left: '86%', icon: <ArenaSprite />, route: '/arena', x: 86, y: 23 },
  { id: 'wizard', name: 'Wizard', subtitle: 'AI Mentor', top: '38%', left: '72%', icon: <WizardSprite />, route: '/wizard', x: 72, y: 38 },
  { id: 'pet', name: 'Pet', subtitle: 'Companion', top: '56%', left: '85%', icon: <PetSprite />, route: '/pet', x: 85, y: 56 },
  { id: 'treasure', name: 'Treasure', subtitle: 'Finance & Savings', top: '78%', left: '74%', icon: <TreasureSprite />, route: '/treasure', x: 74, y: 78 },
];

// Solid obstacles defined as bounding boxes in percentage (xMin, xMax, yMin, yMax)
const OBSTACLES = [
  // Castle building core
  { xMin: 45, xMax: 55, yMin: 14, yMax: 23 },
  // Library building
  { xMin: 19, xMax: 29, yMin: 28, yMax: 36 },
  // Pond / Lake deep water
  { xMin: 6, xMax: 21, yMin: 48, yMax: 65 },
  // Garden greenhouse / farm beds
  { xMin: 22, xMax: 32, yMin: 72, yMax: 83 },
  // Arena raised stone battle platform
  { xMin: 81, xMax: 92, yMin: 16, yMax: 26 },
  // Wizard tower
  { xMin: 67, xMax: 77, yMin: 32, yMax: 41 },
  // Pet house & kennel
  { xMin: 80, xMax: 90, yMin: 50, yMax: 60 },
  // Treasure vault & gold mine
  { xMin: 69, xMax: 79, yMin: 72, yMax: 83 },
];

const RealmDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Player position (% coordinates across the map)
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);

  // Proximity to realm
  const [nearbyRealm, setNearbyRealm] = useState<typeof locations[0] | null>(null);

  // Movement loop references
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const posRef = useRef({ x: 50, y: 50 });
  const animFrameRef = useRef<number | null>(null);

  // Check if target position collides with obstacles or screen borders
  const canMoveTo = (newX: number, newY: number): boolean => {
    // Kingdom boundaries (stay well within viewable game map, avoiding edge clipping)
    if (newX < 6 || newX > 94 || newY < 12 || newY > 90) {
      return false;
    }

    // Check collision with defined building/water obstacles
    for (const obs of OBSTACLES) {
      if (newX >= obs.xMin && newX <= obs.xMax && newY >= obs.yMin && newY <= obs.yMax) {
        return false;
      }
    }

    return true;
  };

  // Keyboard listeners & movement animation loop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      // Proximity interaction: 'E' or 'e' enters nearby realm
      if ((e.key === 'e' || e.key === 'E') && nearbyRealm) {
        e.preventDefault();
        navigate(nearbyRealm.route);
        return;
      }

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keysPressed.current[key]) {
        keysPressed.current[key] = false;
      }
    };

    const handleBlur = () => {
      keysPressed.current = {};
      setIsMoving(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Movement loop
    let lastTime = performance.now();
    const speed = 0.032; // percent per ms (~32% map distance per second for smooth, responsive feel)

    const updateMovement = (currentTime: number) => {
      const dt = Math.min(currentTime - lastTime, 50); // cap delta time to avoid large skips
      lastTime = currentTime;

      const keys = keysPressed.current;
      let dx = 0;
      let dy = 0;

      if (keys['w'] || keys['arrowup']) dy -= 1;
      if (keys['s'] || keys['arrowdown']) dy += 1;
      if (keys['a'] || keys['arrowleft']) dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;

      const moving = dx !== 0 || dy !== 0;
      setIsMoving(moving);

      if (moving) {
        // Set facing direction
        if (Math.abs(dy) > Math.abs(dx)) {
          setDirection(dy > 0 ? 'down' : 'up');
        } else {
          setDirection(dx > 0 ? 'right' : 'left');
        }

        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const step = speed * dt;
        const targetX = posRef.current.x + dx * step;
        const targetY = posRef.current.y + dy * step;

        // Try full diagonal move, then try axis-aligned slide if blocked
        if (canMoveTo(targetX, targetY)) {
          posRef.current = { x: targetX, y: targetY };
        } else if (canMoveTo(targetX, posRef.current.y)) {
          posRef.current = { x: targetX, y: posRef.current.y };
        } else if (canMoveTo(posRef.current.x, targetY)) {
          posRef.current = { x: posRef.current.x, y: targetY };
        }

        setPlayerPos({ ...posRef.current });
      }

      // Check proximity to all locations (distance threshold = 9% of screen)
      const currentX = posRef.current.x;
      const currentY = posRef.current.y;
      let closest: typeof locations[0] | null = null;
      let minDist = 9; // threshold in %

      for (const loc of locations) {
        // Euclidean distance in % space
        const d = Math.hypot(loc.x - currentX, loc.y - currentY);
        if (d < minDist) {
          minDist = d;
          closest = loc;
        }
      }

      setNearbyRealm(closest);

      animFrameRef.current = requestAnimationFrame(updateMovement);
    };

    animFrameRef.current = requestAnimationFrame(updateMovement);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [nearbyRealm, navigate]);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden select-none bg-[#6d965d] font-body"
      style={{
        backgroundImage: `
          url('/assets/tiny_town/Tiles/tile_0000.png')
        `,
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated'
      }}
    >
      {/* 2D Pixel Environment Scenery */}
      <RealmEnvironment />

      {/* Top Navigation Bar: Brand | Live RPG HUD | Profile */}
      <header className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Brand Banner - Medieval Dark Walnut Plaque */}
        <div 
          className="pointer-events-auto bg-[#2a1d13] border-2 border-[#8c7457] px-3.5 py-1.5 rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.5)] flex items-center gap-2.5 text-[#fef3c7]"
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
            className="w-8 h-8 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
          />
          <div>
            <h1 className="font-pixel text-xs text-[#fef08a] tracking-wider uppercase drop-shadow-sm">Realm Check</h1>
            <p className="text-[9px] text-[#c7b49d] font-semibold tracking-wide">A Brighter You</p>
          </div>
        </div>

        {/* Live RPG HUD (Health, Level/XP, Streak, Savings) */}
        <div className="pointer-events-auto hidden md:block">
          <RPGHud />
        </div>

        {/* Profile Card & Menu Trigger */}
        <div className="pointer-events-auto">
          <ProfilePanel onToggleMenu={() => setMenuOpen(!menuOpen)} />
        </div>
      </header>

      {/* Mobile-Friendly HUD Fallback if screen width is narrow */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 md:hidden pointer-events-auto">
        <RPGHud />
      </div>

      {/* Side Slideout Drawer */}
      <SideMenu isOpen={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />

      {/* Interactive Realm Locations */}
      <div className="absolute inset-0 z-20 pointer-events-auto">
        {locations.map((loc) => (
          <LocationNode key={loc.id} {...loc} />
        ))}
      </div>

      {/* Dynamic Player Character (Free-roam WASD/Arrow controls with directional sprites) */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`
        }}
      >
        <PlayerCharacterSprite direction={direction} isMoving={isMoving} />

        {/* Player Proximity Action Tooltip / Press [E] Prompt */}
        {nearbyRealm && (
          <div 
            className="absolute -top-12 px-3 py-1 bg-[#1e130c]/95 border-2 border-[#f59e0b] rounded-lg shadow-[0_6px_16px_rgba(0,0,0,0.8)] flex items-center gap-1.5 whitespace-nowrap animate-bounce pointer-events-auto cursor-pointer z-40"
            onClick={() => navigate(nearbyRealm.route)}
          >
            <span className="px-1.5 py-0.5 bg-[#d97706] text-[#fffbeb] font-pixel text-[10px] rounded border border-[#fde68a] shadow-sm">
              E
            </span>
            <span className="font-pixel text-[10px] text-[#fef3c7] tracking-wide">
              Enter {nearbyRealm.name}
            </span>
          </div>
        )}
      </div>

      {/* Controls Hint Badge at bottom-center - Medieval Dark Walnut Panel matching HUD */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-25 pointer-events-none hidden sm:flex items-center gap-2.5 bg-[#2a1d13] border-2 border-[#8c7457] px-4 py-2 rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.5)] text-[#fef3c7]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.3) 100%),
            repeating-linear-gradient(0deg, #2a1d13, #2a1d13 16px, #22160d 17px, #22160d 18px)
          `
        }}
      >
        <span className="text-sm filter drop-shadow">🎮</span>
        <div className="flex items-center gap-1.5 font-pixel text-[9px] text-[#e2d5c3]">
          <span className="px-1.5 py-0.5 bg-[#452b1b] rounded border border-[#785438] text-[#fef08a] shadow-inner">WASD</span>
          <span className="text-[#a89078]">/</span>
          <span className="px-1.5 py-0.5 bg-[#452b1b] rounded border border-[#785438] text-[#fef08a] shadow-inner">ARROWS</span>
          <span className="text-[#c7b49d] tracking-wide">Move</span>
          <span className="mx-1.5 text-[#f59e0b]">•</span>
          <span className="px-1.5 py-0.5 bg-[#d97706] text-white rounded border border-[#fde68a] shadow-sm font-bold">E</span>
          <span className="text-[#c7b49d] tracking-wide">Enter Realm</span>
        </div>
      </div>
    </div>
  );
};

export default RealmDashboard;

