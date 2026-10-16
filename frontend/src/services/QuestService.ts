export interface Quest {
  id: number;
  userId: number;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;

  status: 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  isDaily: boolean;
  createdAt: string;
}

const API_URL = 'http://localhost:8081/api/quests';

export const getQuests = async (userId: number): Promise<Quest[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch quests');
  return res.json();
};


export const createQuest = async (quest: Partial<Quest>): Promise<Quest> => {
  const res = await fetch(API_URL, { credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quest),
  });
  if (!res.ok) throw new Error('Failed to create quest');
  return res.json();
};

export const completeQuest = async (questId: number): Promise<Quest> => {
  const res = await fetch(`${API_URL}/${questId}/complete`, {
    method: 'PUT',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to complete quest');
  const data = await res.json();
  window.dispatchEvent(new Event('player-stats-updated'));
  return data;
};

export const updateQuest = async (questId: number, status: string): Promise<Quest> => {
  const res = await fetch(`${API_URL}/${questId}/status?status=${status}`, { method: 'PUT', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to update quest');
  return res.json();
};

export const isQuestCompletedToday = async (questId: number): Promise<boolean> => {
  const res = await fetch(`${API_URL}/${questId}/completion/today`);
  if (!res.ok) throw new Error('Failed to check quest completion today');
  return res.json();
};

