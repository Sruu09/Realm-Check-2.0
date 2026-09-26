export interface RssArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

const API_URL = 'http://localhost:8080/api/rss';

export const fetchRss = async (feedUrl: string): Promise<RssArticle[]> => {
  const res = await fetch(`${API_URL}/fetch?url=${encodeURIComponent(feedUrl)}`);
  if (!res.ok) throw new Error('Failed to fetch RSS feed');
  return res.json();
};
