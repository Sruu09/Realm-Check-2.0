export interface JobApplication {
  id: number;
  userId: number;
  company: string;
  title: string;
  url: string;
  status: 'SAVED' | 'APPLIED' | 'ASSESSMENT' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  applicationDate: string;
  notes: string;
}

const API_URL = 'http://localhost:8080/api/applications';

export const getApplications = async (userId: number): Promise<JobApplication[]> => {
  const res = await fetch(`${API_URL}/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
};

export const createApplication = async (app: Partial<JobApplication>): Promise<JobApplication> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app),
  });
  if (!res.ok) throw new Error('Failed to create application');
  return res.json();
};

export const updateApplicationStatus = async (id: number, status: string): Promise<JobApplication> => {
  const res = await fetch(`${API_URL}/${id}/status?status=${status}`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to update application');
  return res.json();
};
