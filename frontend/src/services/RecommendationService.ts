export interface RecommendationDTO {
  title: string;
  company: string;
  location: string;
  url: string;
  score: number; // 0‑1 heuristic relevance score
  matchedTerms: string[];
  explanation?: string;
  source?: string;
  salary?: string;
  jobType?: string;
}

/**
 * Fetch multi-source job recommendations or run a parameterized search
 * with live skill and preference scoring.
 * Preserves backend port 8081 and auth header conventions.
 */
export const getRecommendations = async (keyword?: string, location?: string): Promise<RecommendationDTO[]> => {
  const token = localStorage.getItem('authToken');
  const params = new URLSearchParams();
  if (keyword && keyword.trim()) params.append('keyword', keyword.trim());
  if (location && location.trim()) params.append('location', location.trim());

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`http://localhost:8081/api/recommendations/jobs${queryString}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to load recommendations – ${res.status}: ${txt}`);
  }

  return res.json();
};
