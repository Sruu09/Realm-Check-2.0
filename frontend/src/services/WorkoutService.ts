import type { Workout } from '../types/Workout';

const API_BASE = 'http://localhost:8080/api/workouts';

export const getWorkouts = async (userId: number): Promise<Workout[]> => {
  const res = await fetch(`${API_BASE}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch workouts');
  return res.json();
};

export const createWorkout = async (workout: Omit<Workout, 'id'>): Promise<Workout> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
  if (!res.ok) throw new Error('Failed to create workout');
  return res.json();
};

export const toggleWorkout = async (id: number, userId: number): Promise<Workout> => {
  const res = await fetch(`${API_BASE}/${id}/toggle?userId=${userId}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to toggle workout');
  return res.json();
};
