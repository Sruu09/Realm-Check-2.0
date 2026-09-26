export interface JournalEntry {
  id: number;
  userId: number;
  content: string;
  mood: string;
  date: string;
  tags: string;
}

const API_URL = 'http://localhost:8080/api/journals';

export const getJournalEntries = async (userId: number): Promise<JournalEntry[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch journals');
  return res.json();
};

export const createJournalEntry = async (entry: Partial<JournalEntry>): Promise<JournalEntry> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to create journal entry');
  return res.json();
};

export const updateJournalEntry = async (id: number, entry: Partial<JournalEntry>): Promise<JournalEntry> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to update journal entry');
  return res.json();
};

export const deleteJournalEntry = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete journal entry');
};
