import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Check } from 'lucide-react';
import { getQuests, updateQuest, createQuest, type Quest } from '../services/QuestService';
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry, type JournalEntry } from '../services/JournalService';

const Pond: React.FC = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [mood, setMood] = useState('good');
  
  // Journal State
  const [journalContent, setJournalContent] = useState('');
  const [journalTags, setJournalTags] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const userId = 1;

  useEffect(() => {
    fetchQuests();
    fetchEntries();
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await getQuests(userId);
      setQuests(res);
    } catch (e) { console.error(e); }
  };

  const fetchEntries = async () => {
    try {
      const res = await getJournalEntries(userId);
      setEntries(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch(e) { console.error(e); }
  };

  const handleToggleQuest = async (quest: Quest) => {
    try {
      let newStatus = quest.status;
      if (quest.status === 'AVAILABLE') newStatus = 'ACTIVE';
      else if (quest.status === 'ACTIVE') newStatus = 'COMPLETED';
      else return; 
      
      await updateQuest(quest.id, newStatus);
      if (newStatus === 'COMPLETED') {
        window.dispatchEvent(new Event('player-stats-updated'));
        window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Quest Completed! XP & Gold earned.' }));
      }
      fetchQuests();
    } catch (e) { console.error(e); }
  };

  const handleAddQuest = async () => {
    if (!newQuestTitle.trim()) return;
    try {
      await createQuest({ userId, title: newQuestTitle, description: 'Custom', difficulty: 'EASY', xpReward: 10, goldReward: 5, status: 'AVAILABLE', isDaily: false });
      setNewQuestTitle('');
      setShowAddForm(false);
      fetchQuests();
    } catch (e) { console.error(e); }
  };

  const handleSaveJournal = async () => {
    if (!journalContent.trim()) return;
    try {
      if (editingId) {
        await updateJournalEntry(editingId, { userId, content: journalContent, mood, tags: journalTags, date: new Date().toISOString() });
        setEditingId(null);
        window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Journal entry updated' }));
      } else {
        await createJournalEntry({ userId, content: journalContent, mood, tags: journalTags, date: new Date().toISOString() });
        window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Journal entry saved' }));
      }
      setJournalContent('');
      setJournalTags('');
      fetchEntries();
      window.dispatchEvent(new Event('player-stats-updated'));
    } catch(e) { console.error(e); }
  };

  const handleEditEntry = (e: JournalEntry) => {
    setJournalContent(e.content);
    setJournalTags(e.tags || '');
    setMood(e.mood);
    setEditingId(e.id);
    setShowHistory(false);
  };

  const handleDeleteEntry = async (id: number) => {
    if (confirm('Delete this entry?')) {
      await deleteJournalEntry(id);
      fetchEntries();
    }
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.content.toLowerCase().includes(searchQuery.toLowerCase()) || (e.tags && e.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = moodFilter ? e.mood === moodFilter : true;
    return matchesSearch && matchesMood;
  });

  const moods = [
    { id: 'good', icon: '☀️' },
    { id: 'neutral', icon: '🌤️' },
    { id: 'low', icon: '☁️' },
    { id: 'sad', icon: '🌧️' },
    { id: 'tired', icon: '🌙' }
  ];

  return (
    <div className="min-h-screen bg-[#5c8a4c] p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4d7a3d 15%, transparent 15%), radial-gradient(#4d7a3d 15%, transparent 15%)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }} />

      <button onClick={() => navigate('/realm')} className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold">
        <ChevronLeft /> Back to Realm
      </button>

      <div className="relative z-10 w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center">
        
        {/* The Pond */}
        <div className="w-[600px] h-[350px] bg-blue-400 rounded-[200px] border-[16px] border-[#8a8d91] shadow-[inset_0_20px_50px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.5)] relative flex items-center justify-center mt-[-80px]">
           <div className="absolute w-[80%] h-[80%] border-4 border-blue-300 rounded-[200px] opacity-30" />
           <div className="absolute w-[60%] h-[60%] border-4 border-blue-300 rounded-[200px] opacity-20" />
           {quests.slice(0, 4).map((q, i) => {
             const positions = [{ top: '20%', left: '20%' }, { top: '30%', right: '30%' }, { bottom: '30%', left: '40%' }, { bottom: '20%', right: '20%' }];
             return (<div key={q.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 text-5xl filter drop-shadow-lg" style={positions[i]}>{q.status === 'COMPLETED' ? '🌸' : '🌱'}</div>);
           })}
        </div>

        {/* Quest Board */}
        <div className="absolute top-10 right-0 w-80 bg-[#fcf5e3] rounded-xl border-4 border-[#b58c5a] shadow-2xl p-4 flex flex-col z-20 max-h-[60vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b-2 border-[#d4c3a3] pb-2">
             <h3 className="font-pixel text-[#4a3b2c] text-sm tracking-wider uppercase">Quests</h3>
             <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 text-white p-1 rounded hover:bg-green-700 shadow"><Plus size={16}/></button>
          </div>
          
          {showAddForm && (
            <div className="mb-4 flex gap-2">
              <input type="text" value={newQuestTitle} onChange={e => setNewQuestTitle(e.target.value)} placeholder="New Quest..." className="flex-grow bg-white border-2 border-[#d4c3a3] rounded p-2 text-sm font-bold text-[#4a3b2c]" />
              <button onClick={handleAddQuest} className="bg-[#a3222a] text-white px-3 font-bold rounded shadow border-b-2 border-[#591015]">Add</button>
            </div>
          )}

          <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-grow pr-1">
            {quests.length === 0 && <p className="text-xs font-bold text-[#8c7457] text-center mt-4">No active quests.</p>}
            {quests.map(q => (
              <div key={q.id} onClick={() => handleToggleQuest(q)} className={`flex flex-col p-2 bg-white rounded border-2 cursor-pointer transition-colors group ${q.status === 'COMPLETED' ? 'border-green-400 bg-green-50' : 'border-[#d4c3a3] hover:border-[#b58c5a]'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${q.status === 'COMPLETED' ? 'bg-green-500 border-green-600' : q.status === 'ACTIVE' ? 'bg-yellow-400 border-yellow-600' : 'bg-gray-100 border-gray-300'}`}>
                    {q.status === 'COMPLETED' && <Check size={14} className="text-white" />}
                    {q.status === 'ACTIVE' && <span className="text-[10px] font-bold text-yellow-900">!</span>}
                  </div>
                  <span className={`text-sm font-bold flex-grow ${q.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-[#4a3b2c]'}`}>{q.title}</span>
                </div>
                {q.status !== 'COMPLETED' && (
                  <div className="flex justify-between mt-2 ml-9">
                    <span className="text-[9px] font-bold text-blue-500 bg-blue-100 px-1 rounded">+{q.xpReward} XP</span>
                    <span className="text-[9px] font-bold text-yellow-600 bg-yellow-100 px-1 rounded">+{q.goldReward} Gold</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mood Selector */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-[#364259] rounded-full border-4 border-[#252d3d] shadow-xl p-2 flex gap-2 z-20">
           {moods.map(m => (
             <button key={m.id} onClick={() => setMood(m.id)} className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all ${mood === m.id ? 'bg-[#1a233a] border-2 border-yellow-400 scale-110' : 'hover:bg-[#4a5a7a] border-2 border-transparent'}`}>
               {m.icon}
             </button>
           ))}
        </div>

        {/* Journal Stone Wall */}
        <div className="absolute bottom-0 w-[700px] h-56 bg-[#929699] rounded-t-lg border-x-4 border-t-4 border-[#6c7072] shadow-2xl p-6 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #505456 2px, transparent 2px), linear-gradient(#505456 2px, transparent 2px)', backgroundSize: '60px 40px' }} />
          
          <div className="relative z-10 flex justify-between items-center mb-2">
            <h3 className="font-pixel text-[#3a3d3d] text-sm uppercase tracking-widest">{editingId ? 'Edit Entry' : 'Journal'}</h3>
            <button onClick={() => setShowHistory(!showHistory)} className="text-xs font-bold bg-[#6c7072] text-white px-2 py-1 rounded shadow hover:bg-[#4a4d4f]">History</button>
          </div>
          
          <textarea 
            value={journalContent}
            onChange={e => setJournalContent(e.target.value)}
            className="flex-grow w-full bg-transparent resize-none outline-none font-bold text-[#2a2d2d] placeholder-[#6c7072] text-lg leading-relaxed relative z-10"
            placeholder="Inscribe your thoughts here..."
          />
          
          <div className="relative z-10 mt-2 flex justify-between items-center">
            <input 
              type="text" 
              value={journalTags}
              onChange={e => setJournalTags(e.target.value)}
              placeholder="#tags (e.g. #study #college)"
              className="bg-transparent outline-none text-[#3a3d3d] font-bold text-xs border-b border-[#6c7072] w-1/2"
            />
            <div className="flex gap-2">
              {editingId && <button onClick={() => {setEditingId(null); setJournalContent(''); setJournalTags('');}} className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-bold shadow">Cancel</button>}
              <button onClick={handleSaveJournal} className="bg-[#4a4d4f] hover:bg-[#3a3d3d] text-white px-4 py-1 rounded text-xs font-bold font-pixel shadow border-b-2 border-[#2a2d2d] active:translate-y-[2px] active:border-0 transition-all">{editingId ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>

        {/* History Modal */}
        {showHistory && (
          <div className="absolute inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-8">
            <div className="bg-[#fcf5e3] w-full max-w-3xl h-[80vh] rounded-xl border-4 border-[#b58c5a] shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-[#e0cdad] p-4 border-b-4 border-[#b58c5a] flex justify-between items-center shrink-0">
                <h2 className="font-pixel text-[#4a3b2c]">Journal Archives</h2>
                <button onClick={() => setShowHistory(false)} className="text-[#8c7457] hover:text-[#4a3b2c] font-bold">✕ Close</button>
              </div>
              <div className="p-4 flex gap-4 bg-white border-b-2 border-[#d4c3a3] shrink-0">
                <input type="text" placeholder="Search entries or tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-grow border-2 border-[#d4c3a3] rounded p-2 text-sm font-bold text-[#4a3b2c] outline-none" />
                <select value={moodFilter} onChange={e => setMoodFilter(e.target.value)} className="border-2 border-[#d4c3a3] rounded p-2 text-sm font-bold text-[#4a3b2c] outline-none">
                  <option value="">All Moods</option>
                  {moods.map(m => <option key={m.id} value={m.id}>{m.icon} {m.id}</option>)}
                </select>
              </div>
              <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                {filteredEntries.map(e => (
                  <div key={e.id} className="bg-white border-2 border-[#d4c3a3] p-4 rounded shadow-sm flex flex-col">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-2xl">{moods.find(m => m.id === e.mood)?.icon}</span>
                       <div className="flex gap-2">
                         <button onClick={() => handleEditEntry(e)} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded font-bold">Edit</button>
                         <button onClick={() => handleDeleteEntry(e.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded font-bold">Delete</button>
                       </div>
                     </div>
                     <p className="text-[#4a3b2c] font-bold mb-3 whitespace-pre-wrap leading-relaxed">{e.content}</p>
                     <div className="flex justify-between items-center mt-2 border-t pt-3 border-gray-100">
                       <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded">{e.tags || 'No tags'}</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(e.date).toLocaleString()}</span>
                     </div>
                  </div>
                ))}
                {filteredEntries.length === 0 && <div className="text-center font-bold text-[#8c7457] mt-10">No entries match your search.</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Pond;
