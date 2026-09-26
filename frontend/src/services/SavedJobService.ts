export interface SavedJob {
  id: number;
  userId: number;
  title: string;
  company: string;
  location: string;
  url: string;
  dateSaved: string;
}

const API_URL = 'http://localhost:8080/api/saved-jobs';

export const getSavedJobs = async (userId: number): Promise<SavedJob[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch saved jobs');
  return res.json();
};

export const saveJob = async (job: Partial<SavedJob>): Promise<SavedJob> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  if (!res.ok) throw new Error('Failed to save job');
  return res.json();
};

export const deleteSavedJob = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete saved job');
};
