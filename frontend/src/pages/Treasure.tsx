import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { getUserSavings, addTransaction, updateTransaction, deleteTransaction, type SavingsTransaction } from '../services/SavingsService';
import { getUserStats } from '../services/UserService';

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
  
  const userId = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const txs = await getUserSavings(userId);
      setTransactions(txs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      const user = await getUserStats(userId);
      setTotalSavings(user.savings);
    } catch (e) { console.error(e); }
  };

  const handleTransaction = async (type: 'DEPOSIT' | 'WITHDRAWAL') => {
    if (!amount) return;
    try {
      if (editingId) {
        await updateTransaction(editingId, {
          userId, amount: parseFloat(amount), description: description || (type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'), category: type === 'WITHDRAWAL' ? category : 'Income', type, date: new Date().toISOString()
        });
        setEditingId(null);
      } else {
        await addTransaction({
          userId, amount: parseFloat(amount), description: description || (type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'), category: type === 'WITHDRAWAL' ? category : 'Income', type, date: new Date().toISOString()
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
    <div className="min-h-screen bg-[#3a200d] p-8 flex items-center justify-center relative font-body select-none">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a3118 15%, transparent 15%)', backgroundSize: '80px 80px' }} />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#1a1005] to-transparent pointer-events-none z-0" />

      <button onClick={() => navigate('/realm')} className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold">
        <ChevronLeft /> Back to Realm
      </button>

      <div className="relative z-10 w-full max-w-6xl bg-[#3d2817] rounded-2xl border-8 border-[#211409] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden h-[85vh]">
        <div className="bg-[#e0cdad] border-b-8 border-[#7a5e3f] p-4 text-center relative shadow-md flex-shrink-0">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-12 h-12 bg-yellow-500 border-4 border-[#b58c5a] rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20">🏆</div>
          <h1 className="font-pixel text-2xl text-[#4a3b2c] tracking-widest uppercase">Treasure Chest</h1>
        </div>

        <div className="flex-grow flex p-6 gap-6 relative z-10 overflow-hidden">
          
          <div className="w-1/3 bg-[#fcf5e3] border-4 border-[#b58c5a] rounded-xl shadow-2xl flex flex-col overflow-hidden shrink-0">
            <div className="flex border-b-4 border-[#d4c3a3] bg-[#f2e6cf]">
              <button onClick={() => {setActiveTab('add'); setEditingId(null); setAmount(''); setDescription('');}} className={`flex-1 p-3 font-bold text-xs uppercase flex items-center justify-center gap-2 ${activeTab==='add' ? 'bg-[#fcf5e3] text-[#4a3b2c] border-b-4 border-[#a3222a] -mb-1' : 'text-[#8c7457] hover:bg-[#e8dbc3]'}`}><Plus size={16}/> Add Money</button>
              <button onClick={() => {setActiveTab('expenditure'); setEditingId(null); setAmount(''); setDescription('');}} className={`flex-1 p-3 font-bold text-xs uppercase flex items-center justify-center gap-2 border-x-2 border-[#d4c3a3] ${activeTab==='expenditure' ? 'bg-[#fcf5e3] text-[#4a3b2c] border-b-4 border-[#a3222a] -mb-1' : 'text-[#8c7457] hover:bg-[#e8dbc3]'}`}><Minus size={16}/> Spend</button>
            </div>

            <div className="p-6 flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <label className="text-xs font-bold text-[#8c7457] uppercase">Amount (₹)</label>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className={`w-full bg-white border-2 border-[#d4c3a3] rounded p-3 font-bold text-xl ${activeTab === 'add' ? 'text-green-700' : 'text-red-600'}`} placeholder="0" />
              
              {activeTab === 'expenditure' && (
                <>
                  <label className="text-xs font-bold text-[#8c7457] uppercase">Category</label>
                  <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-white border-2 border-[#d4c3a3] rounded p-3 font-bold text-[#4a3b2c]">
                    <option>Food</option><option>Travel</option><option>Education</option><option>Entertainment</option><option>Shopping</option><option>Bills</option><option>Other</option>
                  </select>
                </>
              )}

              <label className="text-xs font-bold text-[#8c7457] uppercase">Description</label>
              <input type="text" value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-white border-2 border-[#d4c3a3] rounded p-3 font-bold text-[#4a3b2c]" placeholder={activeTab === 'add' ? 'e.g. Pocket Money' : 'e.g. Lunch'} />
              
              <div className="flex gap-2 mt-2">
                {editingId && <button onClick={() => {setEditingId(null); setAmount(''); setDescription('');}} className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded shadow-md text-xs">Cancel</button>}
                <button onClick={() => handleTransaction(activeTab === 'add' ? 'DEPOSIT' : 'WITHDRAWAL')} className={`flex-grow ${activeTab === 'add' ? 'bg-green-600 hover:bg-green-700 border-green-800' : 'bg-red-600 hover:bg-red-700 border-red-800'} text-white font-bold py-3 rounded border-b-4 active:border-b-0 active:mt-1 transition-all shadow-md`}>
                  {editingId ? 'Update' : (activeTab === 'add' ? '+ Add to Savings' : '- Record Expense')}
                </button>
              </div>
            </div>
          </div>

          <div className="w-2/3 flex flex-col gap-4">
             <div className="bg-[#2a1a0f] border-4 border-[#b58c5a] rounded-xl p-6 flex justify-between items-center shadow-inner relative overflow-hidden">
                <div className="absolute right-0 bottom-0 text-8xl opacity-10">💰</div>
                <div>
                  <p className="text-[#a3907c] font-bold text-xs uppercase tracking-wider mb-1">Total Current Savings</p>
                  <p className="font-pixel text-4xl text-yellow-500">₹ {totalSavings.toLocaleString()}</p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-[#a3907c] font-bold text-xs uppercase">Total Deposits</p>
                    <p className="font-bold text-green-500 text-lg">+ ₹ {totalDeposits.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[#a3907c] font-bold text-xs uppercase">Total Expenses</p>
                    <p className="font-bold text-red-500 text-lg">- ₹ {totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
             </div>

             <div className="flex-grow bg-[#fcf5e3] border-4 border-[#b58c5a] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="bg-[#e0cdad] p-3 border-b-4 border-[#b58c5a] flex justify-between items-center">
                   <h3 className="font-pixel text-sm text-[#4a3b2c]">Ledger History</h3>
                   <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-white border-2 border-[#d4c3a3] rounded px-2 py-1 text-xs font-bold text-[#4a3b2c] outline-none">
                     <option>All Time</option><option>Today</option><option>This Month</option><option>This Year</option>
                   </select>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
                   {filteredTxs.length === 0 && <p className="text-center font-bold text-[#8c7457] mt-10">No transactions found for this period.</p>}
                   {filteredTxs.map(tx => (
                     <div key={tx.id} className="bg-white border-2 border-[#d4c3a3] p-3 rounded shadow-sm flex justify-between items-center hover:border-[#b58c5a] group transition-colors">
                       <div className="flex flex-col">
                         <span className="font-bold text-[#4a3b2c]">{tx.description}</span>
                         <span className="text-[10px] text-gray-500 font-bold uppercase">{tx.category} • {new Date(tx.date).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className={`font-pixel text-sm ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                           {tx.type === 'DEPOSIT' ? '+' : '-'} ₹ {tx.amount.toLocaleString()}
                         </span>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleEdit(tx)} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Edit</button>
                           <button onClick={() => handleDelete(tx.id)} className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold">Del</button>
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
