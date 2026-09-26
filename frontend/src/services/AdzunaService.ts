export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  created: string;
  url: string;
}

const API_URL = 'http://localhost:8080/api/adzuna';

export const searchJobs = async (keyword: string, location: string): Promise<AdzunaJob[]> => {
  const res = await fetch(`${API_URL}/search?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  const data = await res.json();
  
  if (!data.results) return [];
  
  return data.results.map((job: any) => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || 'Unknown',
    location: job.location?.display_name || 'Unknown',
    salary: job.salary_min ? `$${job.salary_min}` : '',
    type: job.contract_time || '',
    description: job.description || '',
    created: job.created || '',
    url: job.redirect_url || ''
  }));
};
