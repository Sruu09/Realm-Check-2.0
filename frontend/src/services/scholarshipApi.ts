import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export interface ScholarshipDTO {
  id: number;
  name: string;
  provider: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  level: string;
  field: string;
  location: string;
  applicationUrl: string;
  status: string;
}

export const fetchScholarships = () => api.get<ScholarshipDTO[]>('/api/scholarships');
export const searchScholarships = (q: string) => api.get<ScholarshipDTO[]>(`/api/scholarships/search?q=${q}`);
export const filterScholarshipsByProvider = (provider: string) =>
  api.get<ScholarshipDTO[]>(`/api/scholarships/provider/${provider}`);
export const filterScholarshipsByField = (field: string) =>
  api.get<ScholarshipDTO[]>(`/api/scholarships/field/${field}`);
export const filterScholarshipsByLevel = (level: string) =>
  api.get<ScholarshipDTO[]>(`/api/scholarships/level/${level}`);
export const filterScholarshipsByStatus = (status: string) =>
  api.get<ScholarshipDTO[]>(`/api/scholarships/status/${status}`);
