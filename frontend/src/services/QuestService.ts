export interface Quest {
  id: number;
  userId: number;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  goldReward: number;
  status: 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  isDaily: boolean;
  createdAt: string;
}

const API_URL = 'http://localhost:8080/api/quests';

export const getQuests = async (userId: number): Promise<Quest[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch quests');
  return res.json();
};


export const createQuest = async (quest: Partial<Quest>): Promise<Quest> => {
  const res = await fetch(API_URL, {
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
  });
  if (!res.ok) throw new Error('Failed to complete quest');
  return res.json();
};

export const updateQuest = async (questId: number, status: string): Promise<Quest> => {
  const res = await fetch(`${API_URL}/${questId}/status?status=${status}`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to update quest');
  return res.json();
};

