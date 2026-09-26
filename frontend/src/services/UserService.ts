export interface User {
  id: number;
  email: string;
  level: number;
  xp: number;
  gold: number;
  savings: number;
  streak: number;
  currentMood: string;
}

export const getUserStats = async (userId: number): Promise<User> => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
};

export const updateMood = async (userId: number, mood: string): Promise<User> => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}/mood?mood=${mood}`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to update mood');
  return res.json();
};
