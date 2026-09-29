import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { fetchRss, type RssArticle } from '../services/RssService';
import { fetchEducationData } from '../services/educationApi';

const FEEDS = [
  { id: 'tech', name: 'Technology', icon: '💻', url: 'https://techcrunch.com/feed/' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', url: 'https://www.wired.com/feed/category/science/latest/rss' },
  { id: 'cyber', name: 'Cybersecurity', icon: '🔐', url: 'https://krebsonsecurity.com/feed/' }
];

const SECTION = {
  BLOG: 'blog',
  COURSES: 'courses',
  SCHOLARSHIPS: 'scholarships',
  EXAMS: 'exams',
  COLLEGES: 'colleges',
  UNIVERSITIES: 'universities',
} as const;

type SectionKey = typeof SECTION[keyof typeof SECTION];

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeed, setActiveFeed] = useState(FEEDS[0]);
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState<SectionKey>(SECTION.BLOG);

  const [data, setData] = useState<any[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Blog/RSS effect
  useEffect(() => {
    if (section === SECTION.BLOG) loadFeed(activeFeed.url);
  }, [activeFeed, section]);

  // General Education Data effect (initial load)
  useEffect(() => {
    if (section !== SECTION.BLOG) {
      if (section === SECTION.COURSES && !searchQuery) {
        setData([]);
        return;
      }
      loadEducationData(section, section === SECTION.COURSES ? searchQuery : undefined);
    }
  }, [section]);

  const loadFeed = async (url: string) => {
    setLoading(true);
    setError('');
    setArticles([]);
    try {
      const respData = await fetchRss(url);
      if (respData.length === 0) setError('No articles found in this feed.');
      setArticles(respData);
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Blog feed refreshed' }));
    } catch (e) {
      setError('Unable to load Blog feed.');
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '⚠ Blog feed unavailable' }));
    } finally {
      setLoading(false);
    }
  };

  const loadEducationData = async (type: string, query?: string) => {
    setSectionLoading(true);
    setSectionError('');
    setData([]);
    try {
      const results = await fetchEducationData(type, query);
      if (!results || results.length === 0) setSectionError(`No ${type} found.`);
      setData(results);
    } catch (e) {
      setSectionError(`Failed to load ${type}.`);
    } finally {
      setSectionLoading(false);
    }
  };

  const handleSearchCourses = () => {
    if (searchQuery.trim()) {
      loadEducationData(SECTION.COURSES, searchQuery);
    }
  };

  const renderBlog = () => (
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
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.description?.replace(/<[^>]*>?/gm, '')}</p>
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
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search for courses..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-grow py-3 px-4 outline-none border-2 border-[#c7b293] rounded-lg font-bold text-[#4a3b2c]"
          onKeyDown={e => e.key === 'Enter' && handleSearchCourses()}
        />
        <button onClick={handleSearchCourses} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 rounded-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2">
          <Search size={16} /> Search
        </button>
      </div>

      {sectionLoading && <div className="text-center font-bold text-[#8c7457] mt-4">Scraping Course Knowledge…</div>}
      {sectionError && <div className="text-center font-bold text-red-600 mt-4">⚠ {sectionError}</div>}
      {!sectionLoading && !sectionError && data.length === 0 && <div className="text-center text-[#8c7457] mt-4">Search for courses above.</div>}
      
      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
        {data.map((c, i) => (
          <div key={i} className="bg-[#fcf5e3] border-2 border-[#d4c3a3] rounded p-4 flex flex-col md:flex-row gap-4">
            {c.courseImageUrl && (
              <img src={c.courseImageUrl} alt={c.courseTitle} className="w-full md:w-48 h-32 object-cover rounded border-2 border-[#d4c3a3]" />
            )}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-bold text-[#4a3b2c] text-lg">{c.courseTitle || c.title}</h3>
                <p className="text-sm text-[#8c7457] font-bold">
                  {c.institution || c.provider || 'Unknown Provider'} • {c.pricing || 'Check Site'}
                </p>
                {c.workload && <p className="text-xs text-gray-500 mt-1">Workload: {c.workload}</p>}
                {c.ratingText && <p className="text-xs text-yellow-600 mt-1">Rating: {c.ratingText}</p>}
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{c.description}</p>
              </div>
              <div className="mt-3">
                <a href={c.courseUrl || c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[#3d2516] text-[#e0cdad] px-4 py-2 rounded text-xs font-bold hover:bg-[#2a1a0f]">
                  View Course <ExternalLink size={12} />
                </a>
              </div>
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
      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
        {data.map((s, i) => (
          <div key={i} className="bg-[#fcf5e3] border-2 border-[#d4c3a3] rounded p-4">
            <h3 className="font-bold text-[#4a3b2c] text-lg">{s.name}</h3>
            <p className="text-sm text-[#8c7457] font-bold">{s.provider}</p>
            {s.education_level && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 mr-2">{s.education_level}</span>}
            {s.state && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">{s.state}</span>}
            <p className="mt-3 text-sm text-gray-700">{s.eligibility || s.description}</p>
            <p className="mt-2 text-[#4a3b2c] font-bold text-sm">Amount: {s.amount || 'Varies'}</p>
            {s.official_url || s.applicationUrl ? (
               <a href={s.official_url || s.applicationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 bg-[#e0cdad] text-[#4a3b2c] px-4 py-2 font-bold rounded text-xs hover:bg-[#d4c3a3]">
                 Details <ExternalLink size={12} />
               </a>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );

  const renderExams = () => (
    <>
      <h2 className="font-pixel text-xl text-[#4a3b2c] uppercase mb-4">📝 Exams</h2>
      {sectionLoading && <div className="text-center font-bold text-[#8c7457]">Loading exams…</div>}
      {sectionError && <div className="text-center font-bold text-red-600">⚠ {sectionError}</div>}
      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
        {data.map((e, i) => (
          <div key={i} className="bg-[#fcf5e3] border-2 border-[#d4c3a3] rounded p-4">
            <h3 className="font-bold text-[#4a3b2c] text-lg">{e.name || e.exam_name || e.title}</h3>
            {e.category && <p className="text-sm text-[#8c7457] font-bold">{e.category}</p>}
            <p className="mt-2 text-sm text-gray-700">{e.description || e.details || 'Check official site for more information.'}</p>
            {e.official_url || e.url ? (
               <a href={e.official_url || e.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 bg-[#e0cdad] text-[#4a3b2c] px-4 py-2 font-bold rounded text-xs hover:bg-[#d4c3a3]">
                 Official Site <ExternalLink size={12} />
               </a>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );

  const renderInstitutions = (typeLabel: string) => (
    <>
      <h2 className="font-pixel text-xl text-[#4a3b2c] uppercase mb-4">🏛️ {typeLabel}</h2>
      {sectionLoading && <div className="text-center font-bold text-[#8c7457]">Loading {typeLabel.toLowerCase()}…</div>}
      {sectionError && <div className="text-center font-bold text-red-600">⚠ {sectionError}</div>}
      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
        {data.map((inst, i) => (
          <div key={i} className="bg-[#fcf5e3] border-2 border-[#d4c3a3] rounded p-4">
            <h3 className="font-bold text-[#4a3b2c] text-lg">{inst.name || inst.institution_name}</h3>
            <p className="text-sm text-[#8c7457] font-bold">
               {inst.location || inst.state || inst.city || 'Location Unknown'} 
               {inst.type ? ` • ${inst.type}` : ''}
            </p>
            <p className="mt-2 text-sm text-gray-700">{inst.description || inst.details || 'Explore their official website for details.'}</p>
            {inst.official_url || inst.website || inst.url ? (
               <a href={inst.official_url || inst.website || inst.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 bg-[#e0cdad] text-[#4a3b2c] px-4 py-2 font-bold rounded text-xs hover:bg-[#d4c3a3]">
                 Visit Website <ExternalLink size={12} />
               </a>
            ) : null}
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
          
          <div className="flex gap-1 overflow-x-auto custom-scrollbar pr-2 pb-1">
            {Object.values(SECTION).map(sec => (
              <button 
                key={sec}
                onClick={() => setSection(sec)} 
                className={`px-3 py-1.5 rounded font-bold text-sm uppercase transition-colors whitespace-nowrap
                  ${section === sec ? 'bg-[#4a3b2c] text-[#e0cdad]' : 'bg-[#2a1a0f] text-[#a3907c] hover:bg-[#3d2516]'}`}
              >
                {sec === SECTION.BLOG ? 'Blog' : sec}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-grow flex relative z-10 overflow-hidden">
          {section === SECTION.BLOG && (
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
            {section === SECTION.BLOG && renderBlog()}
            {section === SECTION.COURSES && renderCourses()}
            {section === SECTION.SCHOLARSHIPS && renderScholarships()}
            {section === SECTION.EXAMS && renderExams()}
            {section === SECTION.COLLEGES && renderInstitutions('Colleges')}
            {section === SECTION.UNIVERSITIES && renderInstitutions('Universities')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
