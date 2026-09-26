export interface StudySession {
  id: number;
  userId: number;
  subject: string;
  topic?: string;
  notes?: string;
  durationMinutes: number;
  date: string;
  xpEarned: number;
}

const API_URL = 'http://localhost:8080/api/exams/sessions';

export const getStudySessions = async (userId: number): Promise<StudySession[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch study sessions');
  return res.json();
};

export const addStudySession = async (session: Partial<StudySession>): Promise<StudySession> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  });
  if (!res.ok) throw new Error('Failed to create study session');
  return res.json();
};
