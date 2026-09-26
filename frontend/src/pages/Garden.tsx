import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';

const Garden: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Morning Jog', duration: '30 min', completed: true },
    { id: 2, name: 'Yoga', duration: '20 min', completed: false },
    { id: 3, name: 'Pushups', duration: '10 min', completed: false },
  ]);

  const toggleWorkout = (id: number) => {
    setWorkouts(workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  return (
    <div className="min-h-screen bg-[#618c4b] p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      {/* Background simulating garden area */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#4d7a3d 15%, transparent 15%)',
        backgroundSize: '30px 30px'
      }} />

      {/* Back Button */}
      <button 
        onClick={() => navigate('/realm')}
        className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold"
      >
        <ChevronLeft /> Back to Realm
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#8c6742] rounded-2xl border-8 border-[#593f26] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden h-[80vh]">
        
        {/* Header */}
        <div className="bg-[#e0cdad] border-b-8 border-[#7a5e3f] p-4 text-center relative shadow-md flex-shrink-0">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-12 h-12 bg-green-600 border-4 border-[#3d5e2a] rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20">
            🌻
          </div>
          <h1 className="font-pixel text-2xl text-[#4a3b2c] tracking-widest uppercase">Garden</h1>
          <p className="text-xs font-bold text-[#8c7457] uppercase tracking-[0.2em] mt-1">Fitness Journal</p>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex p-8 gap-8 relative z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          
          {/* Left Side: The Farm / Graph */}
          <div className="w-2/3 flex flex-col gap-6">
             {/* The Farm Grid */}
             <div className="bg-[#a37e55] border-8 border-[#735231] rounded-lg p-6 shadow-inner flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #382512 2px, transparent 2px), linear-gradient(#382512 2px, transparent 2px)', backgroundSize: '80px 80px' }} />
                
                <h3 className="font-pixel text-[#382512] text-sm uppercase relative z-10 bg-[#a37e55] px-4 -mt-2">Workout Farm</h3>
                
                <div className="flex gap-8 relative z-10 mt-4">
                  {workouts.map(w => (
                    <div key={w.id} className="flex flex-col items-center group cursor-pointer" onClick={() => toggleWorkout(w.id)}>
                      <div className="w-20 h-20 bg-[#825c38] rounded-full border-4 border-[#5e4125] flex items-center justify-center shadow-inner relative overflow-visible">
                        {/* Dirt patch */}
                        <div className="absolute w-[60%] h-[30%] bg-[#4a311c] rounded-[100%] bottom-4 opacity-50" />
                        <span className="text-5xl filter drop-shadow-md z-10 transform origin-bottom transition-transform group-hover:scale-110">
                           {w.completed ? '🌸' : '🌱'}
                        </span>
                      </div>
                      <span className="mt-3 text-xs font-bold text-[#382512] bg-[#c49b66] px-2 py-1 rounded shadow-sm">
                        {w.name}
                      </span>
                    </div>
                  ))}
                </div>
             </div>

             {/* Graph Placeholder */}
             <div className="bg-[#fcf5e3] border-4 border-[#b58c5a] rounded-lg p-4 shadow-xl flex-grow flex flex-col">
               <h3 className="font-pixel text-[#4a3b2c] text-xs uppercase mb-4">Workout Consistency (Time in min)</h3>
               <div className="flex-grow border-l-2 border-b-2 border-[#d4c3a3] relative ml-4 mb-4">
                  {/* Mock graph line drawn with CSS */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polyline points="0,80 20,60 40,70 60,30 80,40 100,20" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinejoin="round" />
                    <circle cx="0" cy="80" r="2" fill="#16a34a"/>
                    <circle cx="20" cy="60" r="2" fill="#16a34a"/>
                    <circle cx="40" cy="70" r="2" fill="#16a34a"/>
                    <circle cx="60" cy="30" r="2" fill="#16a34a"/>
                    <circle cx="80" cy="40" r="2" fill="#16a34a"/>
                    <circle cx="100" cy="20" r="2" fill="#16a34a"/>
                  </svg>
               </div>
               <div className="flex justify-between text-[9px] font-bold text-[#8c7457] ml-4">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
             </div>
          </div>

          {/* Right Side: Add Workout */}
          <div className="w-1/3 bg-[#fcf5e3] border-4 border-[#b58c5a] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-[#f2e6cf] border-b-4 border-[#d4c3a3] p-4 text-center">
               <h2 className="font-bold text-[#4a3b2c] uppercase text-sm tracking-wider flex items-center justify-center gap-2"><Plus size={16}/> Add Workout</h2>
            </div>
            
            <div className="p-6 flex-grow flex flex-col gap-4">
              <label className="text-xs font-bold text-[#8c7457] uppercase">Workout Name</label>
              <input type="text" className="w-full bg-white border-2 border-[#d4c3a3] rounded p-3 font-bold text-[#4a3b2c]" placeholder="e.g. 5K Run" />
              
              <label className="text-xs font-bold text-[#8c7457] uppercase mt-2">Duration (min)</label>
              <input type="number" className="w-full bg-white border-2 border-[#d4c3a3] rounded p-3 font-bold text-[#4a3b2c]" placeholder="30" />
              
              <label className="text-xs font-bold text-[#8c7457] uppercase mt-2">Date</label>
              <input type="date" className="w-full bg-white border-2 border-[#d4c3a3] rounded p-3 font-bold text-[#4a3b2c]" />
              
              <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded border-b-4 border-green-800 active:border-b-0 active:mt-1 transition-all shadow-md flex items-center justify-center gap-2">
                <Plus size={18}/> Plant Workout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Garden;
