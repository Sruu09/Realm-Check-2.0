import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { getWorkouts, createWorkout } from '../services/WorkoutService';

const Garden: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([] as any[]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');

  const userId = Number(localStorage.getItem('userId') || 1);

  useEffect(() => {
    getWorkouts(userId)
      .then(data => setWorkouts(data))
      .catch(err => console.error('Failed to load workouts', err));
  }, []);

  const handleAddWorkout = async () => {
    if (!name || !duration || !date) {
      alert('Please fill all fields');
      return;
    }
    const newWorkout = {
      userId,
      name,
      duration: Number(duration),
      date,
    };
    try {
      const saved = await createWorkout(newWorkout);
      setWorkouts(prev => [...prev, saved]);
      setName('');
      setDuration('');
      setDate('');
    } catch (e) {
      console.error(e);
      alert('Failed to save workout');
    }
  };


  return (
    <div className="min-h-screen bg-[#385e34] p-4 md:p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      {/* Garden Grass & Soil Tile Pattern */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#4d7a42 16%, transparent 16%),
            linear-gradient(45deg, #2b4c27 25%, transparent 25%, transparent 75%, #2b4c27 75%, #2b4c27)
          `,
          backgroundSize: '32px 32px, 16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#fbf6ec] border-2 border-[#8da683] px-3.5 py-2 rounded-xl shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-[#2e4d28] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Garden Sanctuary Container */}
      <div className="relative z-10 w-full max-w-6xl bg-[#f8f5eb] rounded-2xl border-4 border-[#5b874f] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden h-[88vh] mt-6">
        
        {/* Garden Header */}
        <div className="bg-[#2d4d24] px-6 py-4 flex items-center justify-between border-b-4 border-[#1c3316] relative flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#3d6932] border-2 border-[#86efac] rounded-xl flex items-center justify-center text-2xl shadow-inner">
              🌻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#f0fdf4] tracking-wide uppercase">Verdant Garden</h1>
                <span className="hidden sm:inline-block bg-[#166534] text-[#bbf7d0] text-[9px] font-pixel px-2 py-0.5 rounded">HABITS & FITNESS</span>
              </div>
              <p className="text-xs text-[#bbf7d0] font-medium mt-0.5">Nurture physical wellness, plant workout habits, and grow consistency</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#dcfce7] font-pixel bg-[#1e3818] px-3.5 py-1.5 rounded-lg border border-[#3b6630]">
            <span>🌱 Bloom Plots Active</span>
          </div>
        </div>

        {/* Content Split: Left Farm Plot & History | Right Plant Workout Seed */}
        <div className="flex-grow flex flex-col md:flex-row p-4 md:p-6 gap-6 relative z-10 overflow-hidden bg-[#faf8f0]">
          
          {/* Left Side: Farm Plots & Workout History */}
          <div className="w-full md:w-2/3 flex flex-col gap-4 overflow-hidden">
            {/* The Farm Plots Dais */}
            <div className="bg-[#6b4728] border-4 border-[#4a2e16] rounded-2xl p-5 shadow-inner flex flex-col items-center justify-center gap-3 relative overflow-hidden flex-shrink-0">
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(#8c5e34 20%, transparent 20%)',
                  backgroundSize: '20px 20px'
                }} 
              />
              
              <div className="flex items-center justify-between w-full relative z-10 px-2">
                <h3 className="font-pixel text-[#fbf6ec] text-xs uppercase tracking-wider">Tilled Crop Plots</h3>
                <span className="text-[10px] text-[#fde68a] bg-[#4a2e16] px-2.5 py-0.5 rounded-full font-bold">
                  {workouts.length} Crops Planted
                </span>
              </div>
              
              <div className="flex flex-wrap gap-5 justify-center relative z-10 py-2">
                {workouts.slice(-6).map((w, idx) => (
                  <div key={w.id || idx} className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 bg-[#523319] rounded-2xl border-2 border-[#3d2311] flex items-center justify-center shadow-inner relative transition-transform group-hover:scale-110">
                      <div className="absolute w-[70%] h-[30%] bg-[#38200d] rounded-full bottom-2 opacity-60" />
                      <span className="text-3xl filter drop-shadow-md z-10">
                        {w.duration >= 45 ? '🌳' : w.duration >= 25 ? '🌿' : '🌱'}
                      </span>
                    </div>
                    <span className="mt-1.5 text-[10px] font-bold text-[#fbf6ec] bg-[#3d2311] px-2 py-0.5 rounded-md max-w-[85px] truncate">
                      {w.name}
                    </span>
                    <span className="text-[9px] text-[#fed7aa] font-medium">
                      {w.duration}m
                    </span>
                  </div>
                ))}
                {workouts.length === 0 && (
                  <div className="text-center py-4 text-[#fed7aa] text-xs font-semibold">
                    The garden soil is freshly tilled. Plant your first workout activity on the right!
                  </div>
                )}
              </div>
            </div>

            {/* Workout Ledger */}
            <div className="flex-grow bg-white border-2 border-[#d5dfd0] rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="bg-[#f0f7ee] px-4 py-3 border-b border-[#dde8d9] flex justify-between items-center flex-shrink-0">
                <h3 className="font-pixel text-xs text-[#2e4d28] uppercase tracking-wider">Fitness Ledger</h3>
                <span className="text-[10px] font-bold text-[#4d7044] bg-[#e1ebd9] px-2 py-0.5 rounded-full">
                  Total Active Time: {workouts.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0)} min
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto p-3 md:p-4 custom-scrollbar">
                {workouts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 text-[#788c73] my-auto">
                    <div className="text-3xl mb-2">🌻</div>
                    <p className="font-bold text-sm">No recorded workouts yet.</p>
                    <p className="text-xs text-[#9aa896] mt-0.5">Use the seed form to plant a cardio, strength, or stretching session.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {workouts.map(w => (
                      <div 
                        key={w.id} 
                        className="flex items-center justify-between p-3 rounded-xl border border-[#e2ece0] hover:border-[#86efac] bg-[#fafdf9] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {w.duration >= 45 ? '🌳' : w.duration >= 25 ? '🌿' : '🌱'}
                          </span>
                          <div>
                            <p className="font-bold text-xs text-[#2e4d28]">{w.name}</p>
                            <p className="text-[10px] text-[#6b8265] font-medium">
                              {new Date(w.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] text-xs font-bold px-2.5 py-1 rounded-lg">
                          {w.duration} min
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Plant Workout Seed Card */}
          <div className="w-full md:w-1/3 bg-white border-2 border-[#d5dfd0] rounded-2xl shadow-sm flex flex-col overflow-hidden shrink-0">
            <div className="bg-[#f0f7ee] border-b border-[#dde8d9] p-3.5 text-center flex-shrink-0">
              <h2 className="font-pixel text-[#2e4d28] uppercase text-xs tracking-wider flex items-center justify-center gap-2">
                <Plus size={15}/> Plant Workout Seed
              </h2>
            </div>
            
            <div className="p-5 flex-grow flex flex-col gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#5c7a52] uppercase tracking-wider block mb-1">
                  Activity Name
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#f8faf8] border-2 border-[#cbd5cb] rounded-xl p-2.5 font-semibold text-xs text-[#2e4d28] outline-none focus:border-[#4caf50]" 
                  placeholder="e.g. 5K Jog, Yoga Flow, Gym Circuit" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-[#5c7a52] uppercase tracking-wider block mb-1">
                  Duration (Minutes)
                </label>
                <input 
                  type="number" 
                  className="w-full bg-[#f8faf8] border-2 border-[#cbd5cb] rounded-xl p-2.5 font-semibold text-xs text-[#2e4d28] outline-none focus:border-[#4caf50]" 
                  placeholder="30" 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-[#5c7a52] uppercase tracking-wider block mb-1">
                  Session Date
                </label>
                <input 
                  type="date" 
                  className="w-full bg-[#f8faf8] border-2 border-[#cbd5cb] rounded-xl p-2.5 font-semibold text-xs text-[#2e4d28] outline-none focus:border-[#4caf50]" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                />
              </div>
              
              <button 
                onClick={handleAddWorkout} 
                className="mt-auto w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-3.5 rounded-xl border-b-4 border-[#144717] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <Plus size={16}/> Sow Activity Crop
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Garden;
