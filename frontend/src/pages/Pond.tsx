import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Check } from 'lucide-react';
import { getQuests, createQuest, completeQuest, isQuestCompletedToday, type Quest } from '../services/QuestService';
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

  const userId = Number(localStorage.getItem('userId') ?? 1);

  useEffect(() => {
    fetchQuests();
    fetchEntries();
  }, []);

const fetchQuests = async () => {
  try {
    const res = await getQuests(userId);
    const enriched = await Promise.all(res.map(async (q) => {
      if (q.isDaily) {
        const completedToday = await isQuestCompletedToday(q.id);
        return { ...q, completedToday };
      }
      return q;
    }));
    setQuests(enriched);
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
      // Prevent completing a daily quest again on the same day
      if (quest.isDaily && (quest as any).completedToday) {
        return;
      }
      // Direct completion: one click should complete the quest and award XP
      if (quest.status === 'COMPLETED') {
        // already done – nothing to do
        return;
      }
      // For AVAILABLE or ACTIVE quests, trigger completion
      await completeQuest(quest.id);
      window.dispatchEvent(new Event('player-stats-updated'));
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Quest Completed! XP earned.' }));
      fetchQuests();
    } catch (e) { console.error(e); }
  };
  const handleAddQuest = async () => {
    if (!newQuestTitle.trim()) return;
    try {
      await createQuest({ userId, title: newQuestTitle, description: 'Custom', difficulty: 'EASY', xpReward: 10, status: 'AVAILABLE', isDaily: false });
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
    <div className="min-h-screen bg-[#244b46] p-4 md:p-8 flex items-center justify-center relative overflow-hidden font-body select-none">
      
      {/* Serene Lake Ripple Background Pattern */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#3a6b64 15%, transparent 16%),
            linear-gradient(45deg, #1b3d39 25%, transparent 25%, transparent 75%, #1b3d39 75%, #1b3d39)
          `,
          backgroundSize: '36px 36px, 18px 18px',
          backgroundPosition: '0 0, 9px 9px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#fcf8ee] border-2 border-[#8da399] px-3.5 py-2 rounded-xl shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-[#244b46] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Lakeside Sanctuary Container */}
      <div className="relative z-10 w-full max-w-6xl bg-[#f8f5ed] rounded-2xl border-4 border-[#3d695e] shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_0_24px_rgba(45,104,136,0.15)] flex flex-col h-[88vh] overflow-hidden mt-6 ring-2 ring-[#76b8da]/30">
        
        {/* Lake Sanctuary Header */}
        <div className="bg-[#19332f] px-6 py-4 flex items-center justify-between border-b-4 border-[#0f1f1d] relative flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#254d46] border-2 border-[#6ee7b7] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(110,231,183,0.3)]">
              ⛲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#e6fbf4] tracking-wide uppercase drop-shadow-sm">Reflective Lake Sanctuary</h1>
                <span className="hidden sm:inline-block bg-[#047857] text-[#ecfdf5] text-[9px] font-pixel px-2 py-0.5 rounded border border-[#6ee7b7]/40">FOUNTAIN SHORE</span>
              </div>
              <p className="text-xs text-[#a7d9cb] font-medium mt-0.5">Gentle ripples, aquatic lily pads, and mindful daily reflection ledger</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#a7f3d0] font-medium bg-[#112421] px-3.5 py-1.5 rounded-lg border border-[#2b5951] shadow-inner">
            <span className="animate-pulse">💧</span>
            <span>Tranquil Waters</span>
          </div>

          {/* Mood Stepping Stones Bar in Header */}
          <div className="flex items-center gap-1.5 bg-[#172d2a] px-3 py-1.5 rounded-xl border border-[#3b5e57]">
            <span className="text-[10px] text-[#9fc4bc] font-bold mr-1 hidden sm:inline">Mood:</span>
            {moods.map(m => (
              <button 
                key={m.id} 
                onClick={() => setMood(m.id)} 
                title={`Feel ${m.id}`}
                className={`text-lg w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  mood === m.id 
                    ? 'bg-[#3b6b63] border-2 border-[#99f6e4] scale-110 shadow-sm' 
                    : 'hover:bg-[#254641] opacity-75 hover:opacity-100 border border-transparent'
                }`}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Lake Content Split: Left Dock (Quests + Lake) | Right Ledger (Journal) */}
        <div className="flex-grow p-4 md:p-6 flex flex-col md:flex-row gap-6 overflow-hidden bg-[#fbf9f4]">
          
          {/* Left Column: Floating Lotus Pond & Quest Scroll */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 overflow-hidden">
            
            {/* Visual Lotus Pond with Lilies */}
            <div className="h-44 bg-[#418a99] rounded-2xl border-4 border-[#285c67] shadow-inner relative flex items-center justify-center overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_#93c5fd_10%,_transparent_70%)]" />
              <div className="absolute w-[80%] h-[75%] border-2 border-white/20 rounded-full" />
              
              {/* Floating Lotus Lilies for Quests */}
              <div className="relative z-10 flex items-center justify-around w-full px-6">
                {quests.slice(0, 4).map((q) => (
                  <div key={q.id} className="flex flex-col items-center group cursor-pointer" onClick={() => handleToggleQuest(q)}>
                    <span className="text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-125">
                      {q.status === 'COMPLETED' ? '🪷' : '🌱'}
                    </span>
                    <span className="text-[10px] font-bold text-[#f0fdfa] bg-[#134e4a]/80 px-2 py-0.5 rounded-full mt-1 max-w-[90px] truncate">
                      {q.title}
                    </span>
                  </div>
                ))}
                {quests.length === 0 && (
                  <span className="text-xs text-[#e0f2fe] font-semibold">The pond waters are quiet. Create a quest below.</span>
                )}
              </div>
            </div>

            {/* Daily Quest Board Notice */}
            <div className="flex-grow bg-white border-2 border-[#d0dfda] rounded-2xl p-4 shadow-sm flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#e2ece8]">
                <div className="flex items-center gap-2">
                  <h3 className="font-pixel text-[#244b46] text-xs uppercase tracking-wider">Quest Checklist</h3>
                  <span className="text-[10px] bg-[#dcfce7] text-[#15803d] border border-[#86efac] font-bold px-2 py-0.5 rounded-full">
                    {quests.filter(q => q.status === 'COMPLETED').length}/{quests.length} Done
                  </span>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)} 
                  className="bg-[#244b46] hover:bg-[#1a3834] text-white p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus size={14}/> Add Quest
                </button>
              </div>

              {showAddForm && (
                <div className="mb-3 flex gap-2 p-2 bg-[#f0fdfa] rounded-xl border border-[#ccfbf1]">
                  <input 
                    type="text" 
                    value={newQuestTitle} 
                    onChange={e => setNewQuestTitle(e.target.value)} 
                    placeholder="New quest objective..." 
                    className="flex-grow bg-white border border-[#99f6e4] rounded-lg p-2 text-xs font-semibold text-[#134e4a] outline-none" 
                    onKeyDown={e => e.key === 'Enter' && handleAddQuest()}
                  />
                  <button 
                    onClick={handleAddQuest} 
                    className="bg-[#0f766e] hover:bg-[#115e59] text-white px-3 font-bold rounded-lg text-xs transition-colors"
                  >
                    Commit
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-grow pr-1">
                {quests.length === 0 && <p className="text-xs font-semibold text-[#64748b] text-center my-auto">No quests in the journal.</p>}
                {quests.map(q => (
                  <div 
                    key={q.id} 
                    onClick={() => handleToggleQuest(q)} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      q.status === 'COMPLETED' 
                        ? 'border-[#bbf7d0] bg-[#f0fdf4]' 
                        : 'border-[#e2e8f0] bg-[#fafafa] hover:border-[#99f6e4] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-grow">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        q.status === 'COMPLETED' ? 'bg-[#22c55e] border-[#16a34a]' : 'bg-white border-[#cbd5e1]'
                      }`}>
                        {q.status === 'COMPLETED' && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-xs font-semibold ${q.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-[#1e293b]'}`}>
                        {q.title}
                      </span>
                    </div>
                    {q.status !== 'COMPLETED' && (
                      <span className="text-[10px] font-bold text-[#0284c7] bg-[#e0f2fe] border border-[#bae6fd] px-2 py-0.5 rounded-md ml-2 flex-shrink-0">
                        +{q.xpReward} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inscription Ledger & Historical Archives */}
          <div className="w-full md:w-1/2 bg-white border-2 border-[#d0dfda] rounded-2xl p-5 shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#e2ece8]">
                <div className="flex items-center gap-2">
                  <h3 className="font-pixel text-[#244b46] text-xs uppercase tracking-wider">
                    {editingId ? 'Edit Thought Inscription' : 'Reflective Journal'}
                  </h3>
                  <span className="text-base" title={`Current mood: ${mood}`}>
                    {moods.find(m => m.id === mood)?.icon}
                  </span>
                </div>
                <button 
                  onClick={() => setShowHistory(!showHistory)} 
                  className="text-xs font-bold bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] border border-[#7dd3fc] px-3 py-1 rounded-lg transition-colors"
                >
                  Archives ({entries.length})
                </button>
              </div>

              <textarea 
                value={journalContent}
                onChange={e => setJournalContent(e.target.value)}
                className="w-full h-52 bg-[#fdfaf2] border border-[#e8decb] rounded-xl p-3.5 resize-none outline-none font-medium text-[#2d3748] placeholder-[#94a3b8] text-sm leading-relaxed focus:border-[#5b7a70] transition-colors"
                placeholder="Inscribe today's mindful thoughts, academic progress, or questions..."
              />
            </div>

            <div className="mt-3 pt-3 border-t border-[#e2ece8] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <input 
                type="text" 
                value={journalTags}
                onChange={e => setJournalTags(e.target.value)}
                placeholder="#tags (e.g. #career #focus #exam)"
                className="bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-1.5 outline-none text-[#334155] font-semibold text-xs flex-grow focus:border-[#5b7a70]"
              />
              <div className="flex gap-2 justify-end">
                {editingId && (
                  <button 
                    onClick={() => { setEditingId(null); setJournalContent(''); setJournalTags(''); }} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={handleSaveJournal} 
                  className="bg-[#244b46] hover:bg-[#1b3935] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  {editingId ? 'Update Inscription' : 'Inscribe in Stone'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* History Modal */}
        {showHistory && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 md:p-8">
            <div className="bg-[#fcfaf5] w-full max-w-3xl h-[80vh] rounded-2xl border-4 border-[#5b7a70] shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-[#213f3b] p-4 text-[#f0f9f6] flex justify-between items-center shrink-0">
                <h2 className="font-pixel text-sm uppercase tracking-wider">Reflective Journal Archives</h2>
                <button onClick={() => setShowHistory(false)} className="text-[#a3c9c1] hover:text-white font-bold text-sm">✕ Close</button>
              </div>
              <div className="p-3.5 flex gap-3 bg-white border-b border-[#e2ece8] shrink-0">
                <input 
                  type="text" 
                  placeholder="Search entries or #tags..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="flex-grow border border-[#cbd5e1] rounded-lg p-2 text-xs font-semibold text-[#1e293b] outline-none focus:border-[#5b7a70]" 
                />
                <select 
                  value={moodFilter} 
                  onChange={e => setMoodFilter(e.target.value)} 
                  className="border border-[#cbd5e1] rounded-lg p-2 text-xs font-bold text-[#1e293b] outline-none"
                >
                  <option value="">All Moods</option>
                  {moods.map(m => <option key={m.id} value={m.id}>{m.icon} {m.id}</option>)}
                </select>
              </div>
              <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                {filteredEntries.map(e => (
                  <div key={e.id} className="bg-white border border-[#e2e8f0] p-4 rounded-xl shadow-sm flex flex-col hover:border-[#99f6e4] transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl">{moods.find(m => m.id === e.mood)?.icon || '☀️'}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditEntry(e)} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-bold transition-colors">Edit</button>
                        <button onClick={() => handleDeleteEntry(e.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-bold transition-colors">Delete</button>
                      </div>
                    </div>
                    <p className="text-[#334155] font-normal mb-3 whitespace-pre-wrap leading-relaxed text-xs">{e.content}</p>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                      <span className="text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">{e.tags || 'No tags'}</span>
                      <span className="text-[10px] text-gray-400 font-medium uppercase">{new Date(e.date).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {filteredEntries.length === 0 && <div className="text-center font-bold text-[#64748b] my-auto">No reflections match your search.</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Pond;
