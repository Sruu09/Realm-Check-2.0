export interface Exam {
  id: number;
  userId: number;
  subject: string;
  name: string;
  date: string;
  difficulty: string;
  progress: number;
  status: 'UPCOMING' | 'PASSED' | 'FAILED';
}

const API_URL = 'http://localhost:8080/api/exams';

export const getUserExams = async (userId: number): Promise<Exam[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch exams');
  return res.json();
};

export const createExam = async (exam: Partial<Exam>): Promise<Exam> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exam),
  });
  if (!res.ok) throw new Error('Failed to create exam');
  return res.json();
};

export const updateExam = async (id: number, exam: Partial<Exam>): Promise<Exam> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exam),
  });
  if (!res.ok) throw new Error('Failed to update exam');
  return res.json();
};

export const deleteExam = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete exam');
};
