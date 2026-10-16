export interface User {
  id?: number;
  userId?: number;
  email?: string;
  level: number;
  xp: number;
  health?: number;
  savings: number;
  totalSavings?: number;
  streak: number;
  xpForNextLevel?: number;
}

export type PlayerStats = User;

export const getUserStats = async (userId: number): Promise<User> => {
  const res = await fetch(`http://localhost:8081/api/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
};

export const getPlayerStats = async (userId: number): Promise<User> => {
  const res = await fetch(`http://localhost:8081/api/player/stats?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch player stats');
  return res.json();
};



export const updateMood = async (userId: number, mood: string): Promise<User> => {
  const res = await fetch(`http://localhost:8081/api/users/${userId}/mood?mood=${mood}`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to update mood');
  return res.json();
};
