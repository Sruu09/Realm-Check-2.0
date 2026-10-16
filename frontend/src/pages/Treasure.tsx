import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { getUserSavings, addTransaction, updateTransaction, deleteTransaction, type SavingsTransaction } from '../services/SavingsService';
import { getUserStats } from '../services/UserService';
const getUserId = () => Number(localStorage.getItem('userId') ?? 0);
const Treasure: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'add' | 'expenditure' | 'limit'>('add');
  const [totalSavings, setTotalSavings] = useState(0);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [filter, setFilter] = useState('All Time');
  const [editingId, setEditingId] = useState<number | null>(null);
  


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const uid = getUserId();
      if (!uid) return;
      const txs = await getUserSavings(uid);
      setTransactions(txs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      const user = await getUserStats(uid);
      setTotalSavings(user.savings);
    } catch (e) { console.error(e); }
  };

  const handleTransaction = async (type: 'DEPOSIT' | 'WITHDRAWAL') => {
    if (!amount) return;
    try {
      const uid = getUserId();
      console.log('Submitting transaction for userId:', uid);
      if (!uid) { console.error('User ID missing'); return; }
      if (editingId) {
        await updateTransaction(editingId, {
          userId: uid,
          amount: parseFloat(amount),
          description: description || (type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'),
          category: type === 'WITHDRAWAL' ? category : 'Income',
          type,
          date: new Date().toISOString()
        });
        setEditingId(null);
      } else {
        await addTransaction({
          userId: uid,
          amount: parseFloat(amount),
          description: description || (type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'),
          category: type === 'WITHDRAWAL' ? category : 'Income',
          type,
          date: new Date().toISOString()
        });
      }
      setAmount('');
      setDescription('');
      fetchData();
      window.dispatchEvent(new Event('player-stats-updated'));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete transaction?')) {
      await deleteTransaction(id);
      fetchData();
      window.dispatchEvent(new Event('player-stats-updated'));
    }
  };

  const handleEdit = (tx: SavingsTransaction) => {
    setAmount(tx.amount.toString());
    setDescription(tx.description);
    setCategory(tx.category);
    setActiveTab(tx.type === 'DEPOSIT' ? 'add' : 'expenditure');
    setEditingId(tx.id);
  };

  const filteredTxs = transactions.filter(tx => {
    if (filter === 'All Time') return true;
    const txDate = new Date(tx.date);
    const now = new Date();
    if (filter === 'Today') return txDate.toDateString() === now.toDateString();
    if (filter === 'This Month') return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    if (filter === 'This Year') return txDate.getFullYear() === now.getFullYear();
    return true;
  });

  const totalDeposits = filteredTxs.filter(t => t.type === 'DEPOSIT').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = filteredTxs.filter(t => t.type === 'WITHDRAWAL').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#2c1a0e] p-4 md:p-8 flex items-center justify-center relative font-body select-none overflow-hidden">
      {/* Stone Treasure Vault Wall Texture */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#54331a 18%, transparent 19%),
            linear-gradient(45deg, #3d2311 25%, transparent 25%, transparent 75%, #3d2311 75%, #3d2311)
          `,
          backgroundSize: '32px 32px, 16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#fdf7ea] border-2 border-[#bfa27a] px-3.5 py-2 rounded-xl shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-[#4a3520] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Treasury Vault Container */}
      <div className="relative z-10 w-full max-w-6xl bg-[#fbf6eb] rounded-2xl border-4 border-[#8c6b41] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden h-[88vh] mt-6">
        
        {/* Treasury Header */}
        <div className="bg-[#483017] px-6 py-4 flex items-center justify-between border-b-4 border-[#32200e] relative flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#6b4721] border-2 border-[#eab308] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              💰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#fef9c3] tracking-wide uppercase">Royal Treasury Vault</h1>
                <span className="hidden sm:inline-block bg-[#a16207] text-[#fef9c3] text-[9px] font-pixel px-2 py-0.5 rounded">SAVINGS & EXPENSES</span>
              </div>
              <p className="text-xs text-[#d7ba95] font-medium mt-0.5">Manage student savings, record expenditures, and maintain fiscal awareness</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#fef08a] font-pixel bg-[#32200e] px-3.5 py-1.5 rounded-lg border border-[#713f12]">
            <span>🪙 Gold Coin Vault</span>
          </div>
        </div>

        {/* Content Split: Left Transaction Forge | Right Ledger & Vault Overview */}
        <div className="flex-grow flex flex-col md:flex-row p-4 md:p-6 gap-6 relative z-10 overflow-hidden bg-[#fbf8f0]">
          
          {/* Left Column: Muted Bronze & Iron Transaction Forge */}
          <div className="w-full md:w-1/3 bg-[#2b2219] border-2 border-[#4d3c2c] rounded-2xl shadow-md flex flex-col overflow-hidden shrink-0 text-[#fbf6ec]">
            <div className="flex border-b-2 border-[#3d2f23] bg-[#221b14]">
              <button 
                onClick={() => { setActiveTab('add'); setEditingId(null); setAmount(''); setDescription(''); }} 
                className={`flex-1 p-3 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'add' 
                    ? 'bg-[#2b2219] text-[#4ade80] border-b-2 border-[#4ade80] -mb-[2px] shadow-sm' 
                    : 'text-[#9c8973] hover:bg-[#281f17]'
                }`}
              >
                <Plus size={15}/> Deposit (+₹)
              </button>
              <button 
                onClick={() => { setActiveTab('expenditure'); setEditingId(null); setAmount(''); setDescription(''); }} 
                className={`flex-1 p-3 font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all border-l border-[#d8c7ac] ${
                  activeTab === 'expenditure' 
                    ? 'bg-[#2b2219] text-[#f87171] border-b-2 border-[#f87171] -mb-[2px] shadow-sm' 
                    : 'text-[#9c8973] hover:bg-[#281f17]'
                }`}
              >
                <Minus size={15}/> Spend (-₹)
              </button>
            </div>

            <div className="p-5 flex-grow flex flex-col gap-3.5 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-[11px] font-bold text-[#c7b49d] uppercase tracking-wider block mb-1">
                  Amount (₹ Indian Rupee)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-lg text-[#9c8973]">₹</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    className={`w-full bg-[#1e1711] border-2 border-[#544131] rounded-xl py-2.5 pl-8 pr-3 font-bold text-xl outline-none focus:border-[#d97706] transition-colors ${
                      activeTab === 'add' ? 'text-[#4ade80]' : 'text-[#f87171]'
                    }`} 
                    placeholder="0" 
                  />
                </div>
              </div>
              
              {activeTab === 'expenditure' && (
                <div>
                  <label className="text-[11px] font-bold text-[#79634e] uppercase tracking-wider block mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    className="w-full bg-[#f8fafc] border-2 border-[#cbd5e1] rounded-xl p-2.5 font-semibold text-xs text-[#334155] outline-none focus:border-[#ca8a04]"
                  >
                    <option>Food</option>
                    <option>Travel</option>
                    <option>Education</option>
                    <option>Entertainment</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Other</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#79634e] uppercase tracking-wider block mb-1">Description</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full bg-[#f8fafc] border-2 border-[#cbd5e1] rounded-xl p-2.5 font-semibold text-xs text-[#334155] outline-none focus:border-[#ca8a04]" 
                  placeholder={activeTab === 'add' ? 'e.g. Allowance, Stipend, Tutoring' : 'e.g. Lunch, Course Textbook'} 
                />
              </div>
              
              <div className="flex gap-2 mt-auto pt-2">
                {editingId && (
                  <button 
                    onClick={() => { setEditingId(null); setAmount(''); setDescription(''); }} 
                    className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => handleTransaction(activeTab === 'add' ? 'DEPOSIT' : 'WITHDRAWAL')} 
                  disabled={!amount}
                  className={`flex-grow ${
                    activeTab === 'add' 
                      ? 'bg-[#15803d] hover:bg-[#166534] border-[#14532d]' 
                      : 'bg-[#b91c1c] hover:bg-[#991b1b] border-[#7f1d1d]'
                  } disabled:opacity-50 text-white font-bold py-3 rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all shadow-md text-xs uppercase tracking-wider`}
                >
                  {editingId ? 'Update Record' : (activeTab === 'add' ? '+ Deposit to Vault' : '- Record Expense')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Vault Overview & Ledger */}
          <div className="w-full md:w-2/3 flex flex-col gap-4 overflow-hidden">
            {/* Vault Balance Ribbon */}
            <div className="bg-[#24170d] border-2 border-[#694625] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-inner relative overflow-hidden gap-4">
              <div className="absolute right-3 bottom-0 text-7xl opacity-10 pointer-events-none">🪙</div>
              <div>
                <p className="text-[#caa885] font-pixel text-[10px] uppercase tracking-wider mb-1">Current Treasury Reserve</p>
                <p className="font-pixel text-2xl sm:text-3xl text-[#facc15] drop-shadow-sm">
                  ₹ {(totalSavings ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-5 text-right flex-shrink-0">
                <div className="bg-[#172517] px-3.5 py-2 rounded-xl border border-[#225422]">
                  <p className="text-[#86efac] font-bold text-[10px] uppercase">Deposits</p>
                  <p className="font-bold text-[#4ade80] text-sm md:text-base">+ ₹ {totalDeposits.toLocaleString()}</p>
                </div>
                <div className="bg-[#271515] px-3.5 py-2 rounded-xl border border-[#5c2424]">
                  <p className="text-[#fca5a5] font-bold text-[10px] uppercase">Expenses</p>
                  <p className="font-bold text-[#f87171] text-sm md:text-base">- ₹ {totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Ledger History List */}
            <div className="flex-grow bg-white border-2 border-[#d8c7ac] rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="bg-[#fcf7ee] px-4 py-3 border-b border-[#e2d5c1] flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-pixel text-xs text-[#4a3520] uppercase tracking-wider">Vault Ledger</h3>
                  <span className="text-[10px] font-bold text-[#79634e] bg-[#ede0cb] px-2 py-0.5 rounded-full">
                    {filteredTxs.length} Transactions
                  </span>
                </div>
                <select 
                  value={filter} 
                  onChange={e => setFilter(e.target.value)} 
                  className="bg-white border border-[#cbd5e1] rounded-lg px-2.5 py-1 text-xs font-bold text-[#334155] outline-none cursor-pointer"
                >
                  <option>All Time</option>
                  <option>Today</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              
              <div className="flex-grow overflow-y-auto p-3 md:p-4 flex flex-col gap-2.5 custom-scrollbar">
                {filteredTxs.length === 0 && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-[#8c7457] my-auto">
                    <div className="text-3xl mb-2">📜</div>
                    <p className="font-bold text-sm">No transactions recorded for this timeframe.</p>
                    <p className="text-xs text-[#a08a75] mt-0.5">Use the deposit or spend forms on the left to record activity.</p>
                  </div>
                )}
                {filteredTxs.map(tx => (
                  <div 
                    key={tx.id} 
                    className="bg-white border border-[#e2e8f0] hover:border-[#ca8a04] p-3 rounded-xl shadow-xs flex justify-between items-center transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1e293b]">{tx.description}</span>
                      <span className="text-[10px] text-[#64748b] font-semibold uppercase mt-0.5">
                        {tx.category} • {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-pixel text-xs md:text-sm ${
                        tx.type === 'DEPOSIT' ? 'text-[#16a34a]' : 'text-[#dc2626]'
                      }`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'} ₹ {tx.amount.toLocaleString()}
                      </span>
                      <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(tx)} 
                          className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(tx.id)} 
                          className="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Treasure;
