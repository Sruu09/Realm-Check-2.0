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
    <div className="min-h-screen bg-[#1a0f14] p-8 flex items-center justify-center relative font-body select-none">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4a1525 0%, #1a0f14 70%)' }} />

      <button onClick={() => navigate('/realm')} className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold">
        <ChevronLeft /> Back to Realm
      </button>

      <div className="relative z-10 w-full max-w-6xl bg-[#2b1820] rounded-2xl border-8 border-[#170a0e] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden h-[85vh]">
        
        {/* Header Tabs */}
        <div className="bg-[#e0cdad] border-b-8 border-[#7a5e3f] flex items-center justify-between px-8 py-3 shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-red-800 border-4 border-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20">⚔️</div>
             <h1 className="font-pixel text-xl text-[#4a3b2c] tracking-widest uppercase">Combat & Study</h1>
          </div>
          <div className="flex bg-[#d4c3a3] rounded-lg border-2 border-[#b58c5a] p-1">
             <button onClick={() => setView('ARENA')} className={`px-4 py-2 rounded font-bold text-sm uppercase transition-colors ${view === 'ARENA' ? 'bg-[#a3222a] text-white shadow' : 'text-[#8c7457] hover:bg-[#e0cdad]'}`}>Battle Arena</button>
             <button onClick={() => setView('STUDY')} className={`px-4 py-2 rounded font-bold text-sm uppercase transition-colors ${view === 'STUDY' ? 'bg-[#4a3b2c] text-white shadow' : 'text-[#8c7457] hover:bg-[#e0cdad]'}`}>Study Stats</button>
          </div>
        </div>

        <div className="flex-grow flex p-6 gap-6 relative z-10 overflow-hidden">
          
          {view === 'ARENA' ? (
            <>
              {/* Left Side: The Battlefield */}
              <div className="w-2/3 flex flex-col items-center justify-center relative">
                 <div className="absolute bottom-10 w-[400px] h-40 bg-[#3d222c] rounded-[100%] border-4 border-[#170a0e] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] transform rotate-x-60" />
                 
                 {/* The Boss */}
                 <div className={`relative flex flex-col items-center z-10 transition-transform ${bossHpPercentage === 0 ? 'opacity-0 scale-50' : 'animate-bounce'}`} style={{ animationDuration: '3s' }}>
                    <span className="font-pixel text-white text-sm mb-2 drop-shadow-md">{selectedExam?.name || 'No Boss Active'}</span>
                    
                    <div className="w-48 h-4 bg-[#170a0e] border-2 border-[#170a0e] rounded-sm mb-6 relative overflow-hidden shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                       <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${bossHpPercentage}%` }} />
                    </div>
                    
                    <div className="w-32 h-40 bg-purple-900 border-4 border-purple-950 rounded-lg flex items-center justify-center relative shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                       <div className="absolute top-10 flex gap-4">
                         <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)]" />
                         <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)]" />
                       </div>
                       <div className="absolute top-20 flex gap-1">
                          {[1,2,3,4].map(t => <div key={t} className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white" />)}
                       </div>
                    </div>
                 </div>

                 <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-6xl drop-shadow-[0_10px_5px_rgba(0,0,0,0.5)]">🚶‍♂️</div>
              </div>

              {/* Right Side: Boss Stats & Attacks */}
              <div className="w-1/3 bg-[#fcf5e3] border-4 border-[#b58c5a] rounded-xl shadow-2xl flex flex-col overflow-hidden shrink-0">
                <div className="bg-[#f2e6cf] border-b-4 border-[#d4c3a3] p-4 flex justify-between items-center">
                   <div>
                     <h2 className="font-bold text-[#4a3b2c] text-sm tracking-wider">Exam Boss: {selectedExam?.subject || 'Unknown'}</h2>
                     <p className="text-[10px] text-[#8c7457] font-bold mt-1">Status: {selectedExam?.status || 'UPCOMING'}</p>
                   </div>
                   <button onClick={() => {setShowAddBoss(!showAddBoss); setEditingBossId(null); setNewBossName('');}} className="text-[#a3222a] font-bold text-xs bg-white px-2 py-1 rounded border-2 border-[#d4c3a3]">+ Add Boss</button>
                </div>
                
                <div className="p-4 flex-grow flex flex-col items-center">
                  {showAddBoss && (
                    <div className="w-full mb-4 bg-white p-3 rounded border-2 border-[#d4c3a3] shadow-sm">
                      <input type="text" placeholder="Subject Name..." value={newBossName} onChange={e=>setNewBossName(e.target.value)} className="w-full p-2 border border-[#d4c3a3] rounded mb-2 text-sm text-[#4a3b2c] font-bold outline-none" />
                      <div className="flex gap-2">
                        {editingBossId && <button onClick={() => {setShowAddBoss(false); setEditingBossId(null);}} className="w-1/3 bg-gray-500 text-white font-bold py-2 rounded text-xs">Cancel</button>}
                        <button onClick={handleAddBoss} className="flex-grow bg-green-600 text-white font-bold py-2 rounded text-xs">{editingBossId ? 'Update Boss' : 'Summon Boss'}</button>
                      </div>
                    </div>
                  )}

                  {exams.length > 0 && (
                    <div className="w-full mb-6">
                      <select 
                        className="w-full p-2 bg-white border-2 border-[#d4c3a3] rounded text-xs font-bold text-[#4a3b2c] outline-none"
                        onChange={(e) => setSelectedExam(exams.find(ex => ex.id === parseInt(e.target.value)) || null)}
                        value={selectedExam?.id || ''}
                      >
                        {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.subject} ({ex.progress}% Complete)</option>)}
                      </select>
                      {selectedExam && (
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => handleEditBoss(selectedExam)} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Edit2 size={10}/> Edit</button>
                          <button onClick={() => handleDeleteBoss(selectedExam.id)} className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Trash2 size={10}/> Delete</button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="w-full mt-auto">
                    <h3 className="font-bold text-[#8c7457] text-xs uppercase mb-2 text-center">Prepare for Battle</h3>
                    <input type="text" placeholder="Topic (e.g. Chapter 4)" value={studyTopic} onChange={e=>setStudyTopic(e.target.value)} className="w-full p-2 mb-2 bg-white border-2 border-[#d4c3a3] rounded text-xs font-bold text-[#4a3b2c] outline-none" />
                    <input type="text" placeholder="Notes (optional)" value={studyNotes} onChange={e=>setStudyNotes(e.target.value)} className="w-full p-2 mb-4 bg-white border-2 border-[#d4c3a3] rounded text-xs font-bold text-[#4a3b2c] outline-none" />
                    
                    <button onClick={attackBoss} disabled={!selectedExam || bossHpPercentage === 0} className="w-full bg-[#a3222a] hover:bg-[#851b21] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl border-b-4 border-[#591015] active:border-b-0 active:mt-1 transition-all shadow-md flex flex-col items-center justify-center gap-1">
                      <Swords size={24} />
                      <span>Study Session (60m)</span>
                      <span className="text-[9px] text-red-200 uppercase font-bold tracking-widest block">-20% Boss HP</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Study Stats View */}
              <div className="w-full flex gap-6">
                
                {/* Left: Overall Stats */}
                <div className="w-1/3 flex flex-col gap-4 shrink-0">
                  <div className="bg-[#4a3b2c] border-4 border-[#b58c5a] rounded-xl p-6 shadow-inner text-center">
                    <div className="text-4xl mb-2">🔥</div>
                    <p className="text-[#d4c3a3] text-xs uppercase font-bold tracking-wider">Study Streak</p>
                    <p className="font-pixel text-3xl text-yellow-500 mt-2">{streak} Days</p>
                  </div>
                  
                  <div className="bg-[#4a3b2c] border-4 border-[#b58c5a] rounded-xl p-6 shadow-inner text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <p className="text-[#d4c3a3] text-xs uppercase font-bold tracking-wider">Total Time</p>
                    <p className="font-pixel text-3xl text-white mt-2">{totalStudyHours} hrs</p>
                  </div>

                  <div className="bg-[#4a3b2c] border-4 border-[#b58c5a] rounded-xl p-6 shadow-inner text-center">
                    <div className="text-4xl mb-2">⭐</div>
                    <p className="text-[#d4c3a3] text-xs uppercase font-bold tracking-wider">Total XP Earned</p>
                    <p className="font-pixel text-3xl text-blue-400 mt-2">{totalXp}</p>
                  </div>
                </div>

                {/* Right: Study History */}
                <div className="w-2/3 bg-[#fcf5e3] border-4 border-[#b58c5a] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                  <div className="bg-[#f2e6cf] border-b-4 border-[#d4c3a3] p-4 flex justify-between items-center">
                    <h2 className="font-bold text-[#4a3b2c] text-sm tracking-wider uppercase flex items-center gap-2"><BookOpen size={16}/> Study History</h2>
                    <span className="text-xs font-bold text-[#8c7457]">{sessions.length} Total Sessions</span>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                    {sessions.length === 0 && <p className="text-center font-bold text-[#8c7457] mt-10">No study sessions recorded yet. Go fight a boss!</p>}
                    {sessions.map(s => (
                      <div key={s.id} className="bg-white border-2 border-[#d4c3a3] p-4 rounded-lg flex flex-col shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-[#4a3b2c]">{s.subject}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{s.topic || 'General'}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">+{s.xpEarned} XP</span>
                        </div>
                        {s.notes && <p className="text-xs text-gray-600 mb-2 border-l-2 border-[#d4c3a3] pl-2">{s.notes}</p>}
                        <div className="flex justify-between items-center mt-2 border-t pt-2 border-gray-100">
                           <span className="text-[10px] font-bold text-[#8c7457]">{s.durationMinutes} Minutes</span>
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
