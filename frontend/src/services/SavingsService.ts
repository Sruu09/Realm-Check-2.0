export interface SavingsTransaction {
  id: number;
  userId: number;
  amount: number;
  description: string;
  category: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  date: string;
}

const API_URL = 'http://localhost:8081/api/savings';

export const getUserSavings = async (userId: number): Promise<SavingsTransaction[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch savings');
  return res.json();
};

export const addTransaction = async (transaction: Partial<SavingsTransaction>): Promise<SavingsTransaction> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!res.ok) throw new Error('Failed to add transaction');
  return res.json();
};

export const updateTransaction = async (id: number, transaction: Partial<SavingsTransaction>): Promise<SavingsTransaction> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  return res.json();
};

export const deleteTransaction = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to delete transaction');
};
