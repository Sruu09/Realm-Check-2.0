export interface Workout {
  id: number;
  userId: number;
  name: string;
  duration: number; // duration in minutes
  date: string; // ISO date string
}
