import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, ExternalLink } from 'lucide-react';
import { fetchRss, type RssArticle } from '../services/RssService';
import { fetchCourses, startCourse, completeCourse } from '../services/courseApi';
import { fetchScholarships } from '../services/scholarshipApi';

const FEEDS = [
  { id: 'tech', name: 'Technology', icon: '💻', url: 'https://techcrunch.com/feed/' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', url: 'https://www.wired.com/feed/category/science/latest/rss' },
  { id: 'careers', name: 'Careers', icon: '💼', url: 'https://www.thebalancecareers.com/rss' },
  { id: 'cyber', name: 'Cybersecurity', icon: '🔐', url: 'https://krebsonsecurity.com/feed/' }
];

const SECTION = {
  RSS: 'rss',
  COURSES: 'courses',
  SCHOLARSHIPS: 'scholarships',
} as const;

type SectionKey = typeof SECTION[keyof typeof SECTION];

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeed, setActiveFeed] = useState(FEEDS[0]);
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState<SectionKey>(SECTION.RSS);
  const [courses, setCourses] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState('');

  // RSS effect
  useEffect(() => {
    if (section === SECTION.RSS) loadFeed(activeFeed.url);
  }, [activeFeed, section]);

  // Courses effect
  useEffect(() => {
    if (section === SECTION.COURSES) {
      setSectionLoading(true);
      fetchCourses()
        .then(res => setCourses(res.data))
        .catch(() => setSectionError('Failed to load courses'))
        .finally(() => setSectionLoading(false));
    }
  }, [section]);

  // Scholarships effect
  useEffect(() => {
    if (section === SECTION.SCHOLARSHIPS) {
      setSectionLoading(true);
      fetchScholarships()
        .then(res => setScholarships(res.data))
        .catch(() => setSectionError('Failed to load scholarships'))
        .finally(() => setSectionLoading(false));
    }
  }, [section]);

  const loadFeed = async (url: string) => {
    setLoading(true);
    setError('');
    setArticles([]);
    try {
      const data = await fetchRss(url);
      if (data.length === 0) setError('No articles found in this feed.');
      setArticles(data);
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ RSS feed refreshed' }));
    } catch (e) {
      setError('Unable to load RSS feed.');
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '⚠ RSS feed unavailable' }));
    } finally {
      setLoading(false);
    }
  };

  const renderRss = () => (
    <>
      <div className="flex justify-between items-center mb-6 border-b-4 border-[#d4c3a3] pb-4 shrink-0">
        <div>
          <h2 className="font-pixel text-xl text-[#4a3b2c] uppercase flex items-center gap-2">
            {activeFeed.icon} {activeFeed.name}
          </h2>
          <a href={activeFeed.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-500 mt-1 hover:underline">
            {activeFeed.url}
          </a>
        </div>
        <button
          onClick={() => loadFeed(activeFeed.url)}
          className="bg-[#3d2516] hover:bg-[#2a1a0f] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-md"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
        {loading && <div className="text-center font-bold text-[#8c7457] mt-10">Fetching ancient scrolls…</div>}
        {error && <div className="text-center font-bold text-red-600 mt-10">⚠ {error}</div>}
        {!loading && !error && articles.map((article, i) => (
          <div key={i} className="bg-white border-2 border-[#d4c3a3] rounded-lg p-5 hover:border-[#b58c5a] shadow-sm">
            <h3 className="font-bold text-[#4a3b2c] text-lg mb-1">{article.title}</h3>
            <p className="text-xs font-bold text-[#8c7457] mb-3">{article.pubDate || 'Recent'}</p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.description.replace(/<[^>]*>?/gm, '')}</p>
            <a href={article.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[#e0cdad] hover:bg-[#d4c3a3] text-[#4a3b2c] font-bold px-4 py-2 rounded text-xs">
              Open Article <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </>
  );

  const renderCourses = () => (
    <>
      <h2 className="font-pixel text-xl text-[#4a3b2c] uppercase mb-4">📖 Courses</h2>
      {sectionLoading && <div className="text-center font-bold text-[#8c7457]">Loading courses…</div>}
      {sectionError && <div className="text-center font-bold text-red-600">⚠ {sectionError}</div>}
      {!sectionLoading && !sectionError && courses.length === 0 && <div className="text-center text-[#8c7457]">No courses available.</div>}
      <div className="flex flex-col gap-4">
        {courses.map(c => (
          <div key={c.id} className="bg-[#fcf5e3] border-2 border-[#d4c3a3] rounded p-4">
            <h3 className="font-bold text-[#4a3b2c] text-lg">{c.title}</h3>
            <p className="text-sm text-[#8c7457]">{c.provider} • {c.level}</p>
            <p className="mt-2 text-[#4a3b2c]">{c.description}</p>
            <div className="mt-3 flex gap-2">
              <button className="bg-[#3d2516] text-[#e0cdad] px-3 py-1 rounded" onClick={() => startCourse(1, c.id)}>
                Start
              </button>
              <button className="bg-[#5c3e21] text-[#e0cdad] px-3 py-1 rounded" onClick={() => completeCourse(1, c.id)}>
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderScholarships = () => (
    <>
      <h2 className="font-pixel text-xl text-[#4a3b2c] uppercase mb-4">🎓 Scholarships</h2>
      {sectionLoading && <div className="text-center font-bold text-[#8c7457]">Loading scholarships…</div>}
      {sectionError && <div className="text-center font-bold text-red-600">⚠ {sectionError}</div>}
      {!sectionLoading && !sectionError && scholarships.length === 0 && <div className="text-center text-[#8c7457]">No scholarships found.</div>}
      <div className="flex flex-col gap-4">
        {scholarships.map(s => (
          <div key={s.id} className="bg-[#fcf5e3] border-2 border-[#d4c3a3] rounded p-4">
            <h3 className="font-bold text-[#4a3b2c] text-lg">{s.name}</h3>
            <p className="text-sm text-[#8c7457]">{s.provider} • {s.field} • {s.amount}</p>
            <p className="mt-2 text-[#4a3b2c]">{s.description}</p>
            <p className="mt-1 text-xs text-[#8c7457]">Deadline: {s.deadline || 'N/A'}</p>
            <a href={s.applicationUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 bg-[#e0cdad] text-[#4a3b2c] px-3 py-1 rounded hover:bg-[#d4c3a3]">
              Apply
            </a>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#4a3424] p-8 flex items-center justify-center relative font-body select-none">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(90deg, #2a1a0f 2px, transparent 2px)',
        backgroundSize: '100px 100%'
      }} />
      <button onClick={() => navigate('/realm')} className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold">
        <ChevronLeft /> Back to Realm
      </button>
      <div className="relative z-10 w-full max-w-6xl bg-[#4a3424] rounded-2xl border-8 border-[#2a1a0f] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden h-[85vh]">
        <div className="bg-[#e0cdad] border-b-8 border-[#7a5e3f] p-4 flex items-center justify-between relative shadow-md flex-shrink-0">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-12 h-12 bg-[#2a1a0f] border-4 border-[#e0cdad] rounded-full flex items-center justify-center text-[#e0cdad] text-xl shadow-lg z-20">📚</div>
          <h1 className="font-pixel text-2xl text-[#4a3b2c] tracking-widest uppercase">Library of Knowledge</h1>
          <div className="flex gap-2">
            <button onClick={() => setSection(SECTION.RSS)} className={`px-3 py-1 rounded ${section===SECTION.RSS?'bg-[#e0cdad] text-[#4a3b2c]':'bg-[#2a1a0f] text-[#a3907c]'}`}>RSS</button>
            <button onClick={() => setSection(SECTION.COURSES)} className={`px-3 py-1 rounded ${section===SECTION.COURSES?'bg-[#e0cdad] text-[#4a3b2c]':'bg-[#2a1a0f] text-[#a3907c]'}`}>Courses</button>
            <button onClick={() => setSection(SECTION.SCHOLARSHIPS)} className={`px-3 py-1 rounded ${section===SECTION.SCHOLARSHIPS?'bg-[#e0cdad] text-[#4a3b2c]':'bg-[#2a1a0f] text-[#a3907c]'}`}>Scholarships</button>
          </div>
        </div>
        <div className="flex-grow flex relative z-10">
          {section===SECTION.RSS && (
            <div className="w-64 bg-[#3d2516] border-r-8 border-[#2a1a0f] p-4 flex flex-col gap-2 shrink-0">
              <h3 className="font-bold text-[#e0cdad] text-sm uppercase mb-4 text-center border-b-2 border-[#5c3e21] pb-2">Feed Categories</h3>
              {FEEDS.map(feed => (
                <button key={feed.id} onClick={() => setActiveFeed(feed)} className={`p-3 rounded text-left font-bold flex items-center gap-3 ${activeFeed.id===feed.id?'bg-[#e0cdad] text-[#4a3b2c]':'bg-[#2a1a0f] text-[#a3907c] hover:bg-[#5c3e21] hover:text-[#e0cdad]'}`}>
                  <span className="text-xl filter drop-shadow-md">{feed.icon}</span>
                  <span className="text-sm">{feed.name}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex-grow bg-[#fcf5e3] p-6 flex flex-col overflow-hidden">
            {section===SECTION.RSS && renderRss()}
            {section===SECTION.COURSES && renderCourses()}
            {section===SECTION.SCHOLARSHIPS && renderScholarships()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
