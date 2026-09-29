import axios from 'axios';

const API_URL = 'http://localhost:8080/api/education';

export const fetchEducationData = async (type: string, search?: string) => {
  try {
    const params = search ? { search } : {};
    const res = await axios.get(`${API_URL}/${type}`, { params });
    // Handle both cases: API might return { data: [...] } or just [...]
    return res.data.data ? res.data.data : res.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};
