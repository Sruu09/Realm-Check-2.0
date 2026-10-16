import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Swords, BookOpen, Trash2, Edit2 } from 'lucide-react';
import { getUserExams, createExam, updateExam, deleteExam, type Exam } from '../services/ExamService';
import { getStudySessions, addStudySession, type StudySession } from '../services/StudyService';

const Arena: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  
  const [showAddBoss, setShowAddBoss] = useState(false);
  const [editingBossId, setEditingBossId] = useState<number | null>(null);
  const [newBossName, setNewBossName] = useState('');
  
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [view, setView] = useState<'ARENA' | 'STUDY'>('ARENA');
  const [studyTopic, setStudyTopic] = useState('');
  const [studyNotes, setStudyNotes] = useState('');

  const userId = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getUserExams(userId);
      setExams(res);
      if (res.length > 0 && !selectedExam) {
        setSelectedExam(res[0]);
      }
      
      const sesh = await getStudySessions(userId);
      setSessions(sesh.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBoss = async () => {
    if (!newBossName.trim()) return;
    try {
      if (editingBossId) {
         await updateExam(editingBossId, { userId, subject: newBossName, name: `Demon of ${newBossName}`, date: new Date().toISOString(), difficulty: 'MEDIUM', progress: 0, status: 'UPCOMING' });
         setEditingBossId(null);
      } else {
         const newBoss = await createExam({ userId, subject: newBossName, name: `Demon of ${newBossName}`, date: new Date().toISOString(), difficulty: 'MEDIUM', progress: 0, status: 'UPCOMING' });
         setSelectedExam(newBoss);
      }
      setNewBossName('');
      setShowAddBoss(false);
      fetchData();
    } catch(e) { console.error(e); }
  };

  const handleEditBoss = (ex: Exam) => {
    setNewBossName(ex.subject);
    setEditingBossId(ex.id);
    setShowAddBoss(true);
  };

  const handleDeleteBoss = async (id: number) => {
    if (confirm('Delete this Boss?')) {
      await deleteExam(id);
      if (selectedExam?.id === id) setSelectedExam(null);
      fetchData();
    }
  };

  const attackBoss = async () => {
    if (!selectedExam) return;
    try {
      await addStudySession({
        userId, subject: selectedExam.subject, topic: studyTopic || 'General Study', notes: studyNotes, durationMinutes: 60, date: new Date().toISOString(), xpEarned: 50
      });
      setStudyTopic('');
      setStudyNotes('');
      
      // Update boss HP
      const newProgress = Math.min(100, selectedExam.progress + 20);
      await updateExam(selectedExam.id, { ...selectedExam, progress: newProgress, status: newProgress >= 100 ? 'PASSED' : 'UPCOMING' });
      
      fetchData();
      window.dispatchEvent(new Event('player-stats-updated'));
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '⚔️ Dealt damage to Boss! XP Earned.' }));
    } catch (e) { console.error(e); }
  };

  const bossHpPercentage = selectedExam ? Math.max(0, 100 - selectedExam.progress) : 100;

  // Study Stats
  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const totalXp = sessions.reduce((acc, s) => acc + (s.xpEarned || 0), 0);
  
  // Simple streak logic based on unique dates
  const uniqueDates = new Set(sessions.map(s => new Date(s.date).toDateString()));
  const streak = uniqueDates.size;

  return (
    <div className="min-h-screen bg-[#110914] p-4 md:p-8 flex items-center justify-center relative font-body select-none overflow-hidden">
      {/* Dark Boss Chamber Ambient Texture */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, #4a1528 0%, transparent 60%),
            radial-gradient(#2a121e 15%, transparent 16%)
          `,
          backgroundSize: '100% 100%, 32px 32px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#24141e] border-2 border-[#542938] hover:border-[#a3222a] px-3.5 py-2 rounded-xl shadow-lg hover:bg-[#331c2b] transition-all flex items-center gap-2 text-[#f3d5dc] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Coliseum Container */}
      <div className="relative z-10 w-full max-w-6xl bg-[#1f1019] rounded-2xl border-4 border-[#421d2b] shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden h-[88vh] mt-6">
        
        {/* Header Tabs */}
        <div className="bg-[#29131f] border-b-2 border-[#451e2f] flex items-center justify-between px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#7f1d1d] border-2 border-[#ea580c] rounded-xl flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(234,88,12,0.4)]">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#fecdd3] tracking-widest uppercase">Arena — Exam Prep</h1>
                <span className="hidden sm:inline-block bg-[#991b1b] text-[#fee2e2] text-[9px] font-pixel px-2 py-0.5 rounded">BOSS TRIAL</span>
              </div>
              <p className="text-[11px] text-[#cca5b0] font-medium mt-0.5">Defeat academic exam demons through logged study sessions</p>
            </div>
          </div>
          <div className="flex bg-[#160a12] rounded-xl border border-[#4d2033] p-1 gap-1">
            <button 
              onClick={() => setView('ARENA')} 
              className={`px-4 py-2 rounded-lg font-pixel text-[10px] uppercase transition-all ${
                view === 'ARENA' 
                  ? 'bg-[#991b1b] text-white shadow-[0_0_12px_rgba(153,27,27,0.5)]' 
                  : 'text-[#9c7985] hover:text-[#fecdd3]'
              }`}
            >
              Battle Stage
            </button>
            <button 
              onClick={() => setView('STUDY')} 
              className={`px-4 py-2 rounded-lg font-pixel text-[10px] uppercase transition-all ${
                view === 'STUDY' 
                  ? 'bg-[#4c1d30] text-[#fecdd3] shadow' 
                  : 'text-[#9c7985] hover:text-[#fecdd3]'
              }`}
            >
              Study Ledger
            </button>
          </div>
        </div>

        <div className="flex-grow flex p-4 md:p-6 gap-6 relative z-10 overflow-hidden bg-[#160b13]">
          
          {view === 'ARENA' ? (
            <>
              {/* Left Side: The Battlefield Stage */}
              <div className="w-full md:w-2/3 flex flex-col items-center justify-center relative bg-[#1c0d18] rounded-xl border-2 border-[#3d1927] p-6 shadow-inner overflow-hidden">
                {/* Stone Combat Dais with Dungeon Torches */}
                <div className="absolute bottom-6 w-[360px] md:w-[460px] h-32 bg-[#2d1424] rounded-[100%] border-4 border-[#4f2038] shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]" />
                
                {/* Dungeon Sconce Torches Left & Right */}
                <div className="absolute bottom-24 left-10 flex flex-col items-center">
                  <div className="text-xl animate-pulse">🔥</div>
                  <div className="w-2 h-6 bg-[#3d2314] rounded-xs shadow" />
                </div>
                <div className="absolute bottom-24 right-10 flex flex-col items-center">
                  <div className="text-xl animate-pulse">🔥</div>
                  <div className="w-2 h-6 bg-[#3d2314] rounded-xs shadow" />
                </div>
                
                {/* The Boss */}
                <div className={`relative flex flex-col items-center z-10 transition-transform ${bossHpPercentage === 0 ? 'opacity-0 scale-50' : 'animate-bounce'}`} style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-pixel text-white text-xs md:text-sm drop-shadow-md">
                      {selectedExam?.name || 'No Boss Active'}
                    </span>
                    <span className="text-[10px] bg-red-950 text-red-300 border border-red-700 px-2 py-0.5 rounded font-bold uppercase">
                      HP: {bossHpPercentage}%
                    </span>
                  </div>
                  
                  {/* Glowing HP Bar */}
                  <div className="w-52 h-3.5 bg-[#0a0508] border-2 border-[#571f33] rounded-full mb-6 relative overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.35)]">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-500 rounded-full" 
                      style={{ width: `${bossHpPercentage}%` }} 
                    />
                  </div>
                  
                  {/* Pixel Boss Monster Sprite Frame */}
                  <div className="w-32 h-40 bg-[#3b122e] border-4 border-[#731c52] rounded-2xl flex flex-col items-center justify-center relative shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                    <div className="absolute top-8 flex gap-5">
                      <div className="w-4 h-4 bg-amber-300 rounded-full shadow-[0_0_12px_rgba(252,211,77,1)]" />
                      <div className="w-4 h-4 bg-amber-300 rounded-full shadow-[0_0_12px_rgba(252,211,77,1)]" />
                    </div>
                    <div className="absolute top-18 flex gap-1">
                      {[1,2,3,4,5].map(t => (
                        <div key={t} className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-red-200" />
                      ))}
                    </div>
                    <div className="mt-14 font-pixel text-[10px] text-purple-300 uppercase tracking-widest">
                      Lv. {selectedExam ? Math.max(1, Math.round(selectedExam.progress / 10)) : 1}
                    </div>
                  </div>
                </div>

                {/* Player Champion Hero (Pixel Knight from Tiny Dungeon) */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                  <img 
                    src="/assets/tiny_dungeon/Tiles/tile_0100.png" 
                    alt="Player Champion" 
                    className="w-16 h-16 [image-rendering:pixelated] filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform cursor-pointer"
                  />
                  <div className="bg-[#12080f]/90 border border-[#4a1d2e] px-2 py-0.5 rounded text-[9px] font-pixel text-[#fca5a5] -mt-1 shadow">
                    HERO LV. 1
                  </div>
                </div>
              </div>

              {/* Right Side: Boss Stats & Attacks Command Deck */}
              <div className="w-full md:w-1/3 bg-[#fdfaf3] border-4 border-[#8c7457] rounded-xl shadow-2xl flex flex-col overflow-hidden shrink-0">
                <div className="bg-[#ede2cb] border-b-2 border-[#d5c3a5] p-3.5 flex justify-between items-center">
                  <div>
                    <h2 className="font-bold text-[#3d2f21] text-xs md:text-sm tracking-wider">Exam Boss: {selectedExam?.subject || 'Unknown'}</h2>
                    <p className="text-[10px] text-[#79634e] font-bold mt-0.5">Status: {selectedExam?.status || 'UPCOMING'}</p>
                  </div>
                  <button 
                    onClick={() => { setShowAddBoss(!showAddBoss); setEditingBossId(null); setNewBossName(''); }} 
                    className="text-[#991b1b] font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-[#d5c3a5] hover:bg-[#fff7ed] transition-colors"
                  >
                    + Add Boss
                  </button>
                </div>
                
                <div className="p-4 flex-grow flex flex-col items-center custom-scrollbar overflow-y-auto">
                  {showAddBoss && (
                    <div className="w-full mb-4 bg-white p-3 rounded-xl border-2 border-[#d5c3a5] shadow-sm">
                      <input 
                        type="text" 
                        placeholder="Subject Name (e.g. Algorithms, Calculus)..." 
                        value={newBossName} 
                        onChange={e => setNewBossName(e.target.value)} 
                        className="w-full p-2 border border-[#d5c3a5] rounded-lg mb-2 text-xs text-[#3d2f21] font-semibold outline-none" 
                      />
                      <div className="flex gap-2">
                        {editingBossId && (
                          <button onClick={() => { setShowAddBoss(false); setEditingBossId(null); }} className="w-1/3 bg-gray-400 text-white font-bold py-1.5 rounded-lg text-xs">
                            Cancel
                          </button>
                        )}
                        <button onClick={handleAddBoss} className="flex-grow bg-[#2c5836] hover:bg-[#23472b] text-white font-bold py-1.5 rounded-lg text-xs transition-colors">
                          {editingBossId ? 'Update Boss' : 'Summon Boss'}
                        </button>
                      </div>
                    </div>
                  )}

                  {exams.length > 0 && (
                    <div className="w-full mb-4">
                      <select 
                        className="w-full p-2.5 bg-white border-2 border-[#d5c3a5] rounded-lg text-xs font-bold text-[#3d2f21] outline-none"
                        onChange={(e) => setSelectedExam(exams.find(ex => ex.id === parseInt(e.target.value)) || null)}
                        value={selectedExam?.id || ''}
                      >
                        {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.subject} ({ex.progress}% Complete)</option>)}
                      </select>
                      {selectedExam && (
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => handleEditBoss(selectedExam)} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold flex items-center gap-1 hover:bg-blue-100">
                            <Edit2 size={10}/> Edit
                          </button>
                          <button onClick={() => handleDeleteBoss(selectedExam.id)} className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold flex items-center gap-1 hover:bg-red-100">
                            <Trash2 size={10}/> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="w-full mt-auto pt-3 border-t border-[#ede2cb]">
                    <h3 className="font-pixel text-[10px] text-[#79634e] uppercase mb-2 text-center">Execute Study Strike</h3>
                    <input 
                      type="text" 
                      placeholder="Topic (e.g. Chapter 4, Graph Traversal)" 
                      value={studyTopic} 
                      onChange={e => setStudyTopic(e.target.value)} 
                      className="w-full p-2 mb-2 bg-white border-2 border-[#d5c3a5] rounded-lg text-xs font-semibold text-[#3d2f21] outline-none" 
                    />
                    <input 
                      type="text" 
                      placeholder="Study Notes (optional)" 
                      value={studyNotes} 
                      onChange={e => setStudyNotes(e.target.value)} 
                      className="w-full p-2 mb-3 bg-white border-2 border-[#d5c3a5] rounded-lg text-xs font-semibold text-[#3d2f21] outline-none" 
                    />
                    
                    <button 
                      onClick={attackBoss} 
                      disabled={!selectedExam || bossHpPercentage === 0} 
                      className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] disabled:bg-gray-300 disabled:border-gray-400 text-white font-bold py-3.5 rounded-xl border-b-4 border-[#591015] active:border-b-0 active:translate-y-1 transition-all shadow-md flex flex-col items-center justify-center gap-1"
                    >
                      <div className="flex items-center gap-2">
                        <Swords size={20} />
                        <span className="text-xs uppercase font-pixel tracking-wider">Strike Session (60m)</span>
                      </div>
                      <span className="text-[10px] text-red-200 font-bold tracking-wider">-20% BOSS HP • +50 XP</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Study Stats View */}
              <div className="w-full flex flex-col md:flex-row gap-6">
                
                {/* Left: Overall Stats Cards */}
                <div className="w-full md:w-1/3 flex flex-col gap-3 shrink-0">
                  <div className="bg-[#24131d] border-2 border-[#542539] rounded-xl p-5 shadow-inner text-center">
                    <div className="text-3xl mb-1">🔥</div>
                    <p className="text-[#d8a8b8] text-[10px] uppercase font-pixel tracking-wider">Battle Streak</p>
                    <p className="font-pixel text-2xl text-amber-400 mt-1">{streak} Days</p>
                  </div>
                  
                  <div className="bg-[#24131d] border-2 border-[#542539] rounded-xl p-5 shadow-inner text-center">
                    <div className="text-3xl mb-1">⏱️</div>
                    <p className="text-[#d8a8b8] text-[10px] uppercase font-pixel tracking-wider">Total Training</p>
                    <p className="font-pixel text-2xl text-white mt-1">{totalStudyHours} hrs</p>
                  </div>

                  <div className="bg-[#24131d] border-2 border-[#542539] rounded-xl p-5 shadow-inner text-center">
                    <div className="text-3xl mb-1">⭐</div>
                    <p className="text-[#d8a8b8] text-[10px] uppercase font-pixel tracking-wider">Total XP Earned</p>
                    <p className="font-pixel text-2xl text-indigo-300 mt-1">{totalXp}</p>
                  </div>
                </div>

                {/* Right: Study History Ledger */}
                <div className="w-full md:w-2/3 bg-[#fdfaf3] border-4 border-[#8c7457] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                  <div className="bg-[#ede2cb] border-b-2 border-[#d5c3a5] p-3.5 flex justify-between items-center">
                    <h2 className="font-bold text-[#3d2f21] text-xs md:text-sm tracking-wider uppercase flex items-center gap-2">
                      <BookOpen size={16} className="text-[#79634e]"/> Study History Ledger
                    </h2>
                    <span className="text-xs font-bold text-[#79634e]">{sessions.length} Recorded Strikes</span>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-2.5 custom-scrollbar">
                    {sessions.length === 0 && (
                      <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-[#79634e]">
                        <div className="text-3xl mb-2">⚔️</div>
                        <p className="font-bold text-sm">No battle sessions recorded yet.</p>
                        <p className="text-xs text-[#a08a75] mt-0.5">Switch to Battle Stage and strike a boss to record training.</p>
                      </div>
                    )}
                    {sessions.map(s => (
                      <div key={s.id} className="bg-white border-2 border-[#d9cbb4] p-3.5 rounded-xl flex flex-col shadow-sm">
                        <div className="flex justify-between items-start mb-1.5">
                          <div>
                            <h3 className="font-bold text-sm text-[#3d2f21]">{s.subject}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{s.topic || 'General'}</p>
                          </div>
                          <span className="bg-[#dcfce7] text-[#15803d] border border-[#86efac] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            +{s.xpEarned} XP
                          </span>
                        </div>
                        {s.notes && <p className="text-xs text-gray-600 mb-2 border-l-2 border-[#d5c3a5] pl-2">{s.notes}</p>}
                        <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-gray-100">
                          <span className="text-[10px] font-bold text-[#79634e]">{s.durationMinutes} Minutes</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(s.date).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Arena;
