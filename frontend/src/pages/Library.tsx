// Library.tsx - Comprehensive, bug-free implementation
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, ExternalLink, Search, ChevronDown, ChevronUp, Calendar, Award, Building, BookOpen } from 'lucide-react';
import { fetchRss, type RssArticle } from '../services/RssService';
import { fetchEducationData } from '../services/educationApi';
import { fetchCoursesPaged } from '../services/courseApi';
import axios from 'axios';

const FEEDS = [
  { id: 'tech', name: 'Technology', icon: '💻', url: 'https://techcrunch.com/feed/' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', url: 'https://www.wired.com/feed/category/science/latest/rss' },
  { id: 'cyber', name: 'Cybersecurity', icon: '🔐', url: 'https://krebsonsecurity.com/feed/' }
];

const SECTION = {
  BLOG: 'blog',
  COURSES: 'courses',
  SCHOLARSHIPS: 'scholarships',
  EXAMS: 'exams'
} as const;

type SectionKey = typeof SECTION[keyof typeof SECTION];

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeed, setActiveFeed] = useState(FEEDS[0]);
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState('');
  const [section, setSection] = useState<SectionKey>(SECTION.BLOG);

  const [data, setData] = useState<any[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [coursePage, setCoursePage] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const PAGE_SIZE = 12;

  // Track if this is a user-initiated refresh for notifications
  const isUserRefresh = useRef(false);

  // Blog / RSS effect
  useEffect(() => {
    if (section === SECTION.BLOG) {
      loadFeed(activeFeed.url);
    }
  }, [activeFeed, section]);

  // Section switch effect: clear search and pagination
  useEffect(() => {
    if (section !== SECTION.BLOG) {
      setSearchQuery('');
      setActiveSearch('');
      setCoursePage(0);
      loadEducationData(section, '', 0);
    }
  }, [section]);

  const loadFeed = async (url: string) => {
    setBlogLoading(true);
    setBlogError('');
    setArticles([]);
    try {
      const respData = await fetchRss(url);
      if (respData.length === 0) setBlogError('No articles found in this feed.');
      setArticles(respData);
      if (isUserRefresh.current) {
        window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Blog feed refreshed' }));
        isUserRefresh.current = false;
      }
    } catch {
      setBlogError('Unable to load Blog feed.');
      if (isUserRefresh.current) {
        window.dispatchEvent(new CustomEvent('realm-notify', { detail: '⚠ Blog feed unavailable' }));
        isUserRefresh.current = false;
      }
    } finally {
      setBlogLoading(false);
    }
  };

  const handleManualFeedRefresh = () => {
    isUserRefresh.current = true;
    loadFeed(activeFeed.url);
  };

  const loadEducationData = async (type: SectionKey, query: string, page: number = 0) => {
    setSectionLoading(true);
    setSectionError('');
    setData([]);

    const trimmedQuery = (query || '').trim().toLowerCase();

    try {
      if (type === SECTION.COURSES) {
        if (!trimmedQuery) {
          // Default courses view: paginated from backend
          const raw = await fetchCoursesPaged(page, PAGE_SIZE);
          const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
          setData(Array.isArray(list) ? list : []);
        } else {
          // Courses search: check database via /api/courses/search or /api/education/courses
          let results: any[] = [];
          try {
            const searchResp = await axios.get(`http://localhost:8081/api/courses/search`, {
              params: { q: trimmedQuery }
            });
            results = Array.isArray(searchResp.data) ? searchResp.data : [];
          } catch {
            // Fallback to /api/education/courses endpoint
            const fallback = await fetchEducationData('courses', trimmedQuery);
            results = Array.isArray(fallback) ? fallback : [];
          }

          // If empty, try searching the full course list locally across all metadata
          if (results.length === 0) {
            try {
              const allResp = await axios.get('http://localhost:8081/api/courses');
              const allCourses: any[] = Array.isArray(allResp.data) ? allResp.data : [];
              results = allCourses.filter(c => {
                const text = `${c.title || ''} ${c.description || ''} ${c.category || ''} ${c.provider || ''} ${c.tags || ''}`.toLowerCase();
                return text.includes(trimmedQuery);
              });
            } catch {
              // Ignore
            }
          }

          if (results.length === 0) {
            setSectionError('No courses found.');
          }
          setData(results);
        }
      } else if (type === SECTION.SCHOLARSHIPS) {
        const raw = await fetchEducationData('scholarships', trimmedQuery || undefined);
        let results: any[] = [];

        if (Array.isArray(raw)) {
          results = raw;
        } else if (raw && typeof raw === 'object') {
          const possible = raw.data || raw.scholarships || raw.results;
          if (Array.isArray(possible)) results = possible;
        }

        // Apply strict client-side filtering if query provided to ensure accuracy
        if (trimmedQuery && results.length > 0) {
          results = results.filter(item => {
            const searchable = [
              item.name,
              item.title,
              item.provider,
              item.eligibility,
              item.description,
              item.amount,
              item.state,
              item.education_level
            ].filter(Boolean).join(' ').toLowerCase();
            return searchable.includes(trimmedQuery);
          });
        }

        if (trimmedQuery && results.length === 0) {
          setSectionError('No scholarships found.');
        }
        setData(results);
      } else if (type === SECTION.EXAMS) {
        const raw = await fetchEducationData('exams', trimmedQuery || undefined);
        let results: any[] = [];

        if (Array.isArray(raw)) {
          results = raw;
        } else if (raw && typeof raw === 'object') {
          const possible = raw.data || raw.exams || raw.results;
          if (Array.isArray(possible)) results = possible;
        }

        // Apply strict client-side filtering if query provided
        if (trimmedQuery && results.length > 0) {
          results = results.filter(item => {
            const searchable = [
              item.name,
              item.title,
              item.short_name,
              item.examName,
              item.category,
              item.description,
              item.eligibility_summary,
              item.education_level
            ].filter(Boolean).join(' ').toLowerCase();
            return searchable.includes(trimmedQuery);
          });
        }

        if (trimmedQuery && results.length === 0) {
          setSectionError('No exams found.');
        }
        setData(results);
      }
    } catch {
      setSectionError(`Failed to load ${type}.`);
    } finally {
      setSectionLoading(false);
    }
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    setActiveSearch(q);
    if (section === SECTION.COURSES) {
      setCoursePage(0);
    }
    loadEducationData(section, q, 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    if (section === SECTION.COURSES) {
      setCoursePage(0);
    }
    loadEducationData(section, '', 0);
  };

  const handlePageChange = (newPage: number) => {
    setCoursePage(newPage);
    loadEducationData(SECTION.COURSES, activeSearch, newPage);
  };

  const toggleExpand = (id: string | number) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderSearchBar = () => {
    const searchable: SectionKey[] = [SECTION.COURSES, SECTION.SCHOLARSHIPS, SECTION.EXAMS];
    if (!searchable.includes(section)) return null;

    return (
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={`Search ${section.toLowerCase()} (e.g. java, engineering, science)...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full py-2.5 px-4 pr-10 outline-none border-2 border-[#c7b293] rounded-lg font-medium text-sm text-[#4a3b2c] bg-white focus:border-[#7ba36a] transition-all"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c7457] hover:text-[#4a3b2c] p-1"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-[#3d2516] hover:bg-[#2a1f0f] text-white font-bold px-6 py-2.5 rounded-lg border-b-4 border-[#2a1f0f] active:border-b-0 active:translate-y-0.5 transition-all flex items-center gap-2 text-sm shrink-0"
          >
            <Search size={15} /> Search
          </button>
          {activeSearch && (
            <button
              onClick={handleClearSearch}
              className="bg-[#e0cdad] hover:bg-[#d4c3a3] text-[#4a3b2c] font-bold px-4 py-2.5 rounded-lg border-b-4 border-[#c7b293] active:border-b-0 active:translate-y-0.5 transition-all text-sm shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBlog = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b-2 border-[#d4c3a3] pb-4 shrink-0 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeFeed.icon}</span>
            <h2 className="font-pixel text-base text-[#4a3b2c] uppercase">
              {activeFeed.name}
            </h2>
          </div>
          <div className="flex gap-2 mt-2">
            {FEEDS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFeed(f)}
                className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all border ${
                  activeFeed.id === f.id
                    ? 'bg-[#3d2516] text-white border-[#3d2516]'
                    : 'bg-[#f5ebd7] text-[#4a3b2c] border-[#c7b293] hover:bg-[#e0cdad]'
                }`}
              >
                {f.icon} {f.name}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleManualFeedRefresh}
          className="bg-[#3d2516] hover:bg-[#2a1f0f] text-[#e0cdad] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <RefreshCw size={13} className={blogLoading ? 'animate-spin' : ''} /> Refresh Feed
        </button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
        {blogLoading && <div className="text-center font-bold text-[#8c7457] py-12">Fetching ancient scrolls…</div>}
        {blogError && <div className="text-center font-bold text-red-600 py-12">⚠ {blogError}</div>}
        {!blogLoading && !blogError && articles.map((article, i) => (
          <div key={i} className="bg-white border-2 border-[#d4c3a3] rounded-xl p-4 hover:border-[#b58c5a] shadow-sm transition-all">
            <h3 className="font-bold text-[#4a3c2c] text-base mb-1">{article.title}</h3>
            <p className="text-[11px] font-bold text-[#8c7457] mb-2">{article.pubDate || 'Recent'}</p>
            <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">{article.description?.replace(/<[^>]*>/gm, '')}</p>
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#f0e2cc] hover:bg-[#e0cdad] text-[#4a3c2c] font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors"
            >
              Open Article <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </>
  );

  const renderCourses = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-base text-[#4a3b2c] uppercase flex items-center gap-2">
          <BookOpen size={18} /> Courses & Learning Tracks
        </h2>
        {activeSearch && (
          <span className="text-xs text-[#8c7457] font-semibold">
            Results for: &ldquo;<span className="text-[#3d2516] font-bold">{activeSearch}</span>&rdquo;
          </span>
        )}
      </div>

      {renderSearchBar()}

      {sectionLoading && <div className="text-center font-bold text-[#8c7457] py-12">Retrieving course scrolls…</div>}
      {sectionError && <div className="text-center font-bold text-red-600 py-12">⚠ {sectionError}</div>}
      {!sectionLoading && !sectionError && Array.isArray(data) && data.length === 0 && (
        <div className="text-center text-[#8c7457] py-12 font-bold">No courses found matching your criteria.</div>
      )}

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
        {Array.isArray(data) && data.map((c, i) => (
          <div key={c.id ?? i} className="bg-[#fcf8f0] border-2 border-[#d4c3a3] rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:border-[#b58c5a] shadow-sm transition-all">
            {c.courseImageUrl && (
              <img src={c.courseImageUrl} alt={c.courseTitle || c.title} className="w-full md:w-44 h-28 object-cover rounded-lg border border-[#d4c3a3]" />
            )}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[#4a3b2c] text-base">{c.courseTitle || c.title}</h3>
                  {c.category && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#e8ded0] text-[#5e4b38] rounded-full shrink-0">
                      {c.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8c7457] font-semibold mt-1">
                  {c.provider || c.institution || 'Online Academy'}
                  {c.level && ` • Level: ${c.level}`}
                  {c.duration && ` • ${c.duration}`}
                  {c.pricing && ` • ${c.pricing}`}
                </p>
                <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">{c.description}</p>
                {c.tags && (
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {c.tags.split(',').map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="text-[10px] bg-white border border-[#d4c3a3] text-[#7d6852] px-2 py-0.5 rounded">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href={c.courseUrl || c.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#3d2516] text-[#e0cdad] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2a1f0f] transition-colors"
                >
                  View Course <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!activeSearch && (
        <div className="flex justify-center items-center gap-4 mt-4 pt-2 border-t border-[#d4c3a3]">
          <button
            onClick={() => handlePageChange(Math.max(coursePage - 1, 0))}
            disabled={coursePage === 0 || sectionLoading}
            className="px-4 py-1.5 bg-[#e0cdad] text-[#4a3b2c] text-xs font-bold rounded-lg border border-[#c7b293] disabled:opacity-40 hover:bg-[#d4c3a3] transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-[#4a3b2c]">
            Page {coursePage + 1}
          </span>
          <button
            onClick={() => handlePageChange(coursePage + 1)}
            disabled={data.length < PAGE_SIZE || sectionLoading}
            className="px-4 py-1.5 bg-[#e0cdad] text-[#4a3b2c] text-xs font-bold rounded-lg border border-[#c7b293] disabled:opacity-40 hover:bg-[#d4c3a3] transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );

  const renderScholarships = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-base text-[#4a3b2c] uppercase flex items-center gap-2">
          <Award size={18} /> Scholarships & Financial Grants
        </h2>
        {activeSearch && (
          <span className="text-xs text-[#8c7457] font-semibold">
            Filtered by: &ldquo;<span className="text-[#3d2516] font-bold">{activeSearch}</span>&rdquo;
          </span>
        )}
      </div>

      {renderSearchBar()}

      {sectionLoading && <div className="text-center font-bold text-[#8c7457] py-12">Consulting scholarship archives…</div>}
      {sectionError && <div className="text-center font-bold text-red-600 py-12">⚠ {sectionError}</div>}
      {!sectionLoading && !sectionError && data.length === 0 && (
        <div className="text-center text-[#8c7457] py-12 font-bold">No scholarships found matching your search.</div>
      )}

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
        {data.map((s, i) => {
          const itemKey = s.id ? `sch-${s.id}` : `sch-idx-${i}`;
          const isExpanded = !!expandedItems[itemKey];
          const name = s.name || s.title || s.scholarshipTitle || 'Scholarship Scheme';
          const provider = s.provider || 'Ministry / Department of Education';
          const amount = s.amount || 'As per scheme guidelines';
          const deadline = s.deadline || 'Check official notification';
          const eligibility = s.eligibility || 'Refer to scheme guidelines';
          const eduLevel = s.education_level || s.educationLevel;
          const state = s.state;
          const officialUrl = s.official_url || s.url || s.application_url;
          const applicationProcess = s.application_process || s.description || s.details;

          return (
            <div
              key={itemKey}
              className="bg-[#f7f9fc] border-2 border-[#c8d6e5] rounded-xl p-4 shadow-sm hover:border-[#8395a7] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-grow">
                  <h3 className="font-bold text-[#2c3e50] text-base">{name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#576574]">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Building size={13} className="text-[#8395a7]" /> {provider}
                    </span>
                    {amount && (
                      <span className="font-bold text-[#2e7d32]">
                        💰 {amount}
                      </span>
                    )}
                    {deadline && (
                      <span className="inline-flex items-center gap-1 text-[#b85c38] font-medium">
                        <Calendar size={13} /> Deadline: {deadline}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(itemKey)}
                  className="px-2.5 py-1 text-xs font-bold bg-[#e8eef5] hover:bg-[#d8e2ed] text-[#2c3e50] rounded-lg flex items-center gap-1 transition-colors shrink-0"
                >
                  {isExpanded ? (
                    <>Details <ChevronUp size={14} /></>
                  ) : (
                    <>Details <ChevronDown size={14} /></>
                  )}
                </button>
              </div>

              {/* Tags summary */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {eduLevel && (
                  <span className="text-[10px] font-bold bg-[#e1ecf7] text-[#1e5a8e] px-2 py-0.5 rounded">
                    Level: {eduLevel}
                  </span>
                )}
                {state && (
                  <span className="text-[10px] font-bold bg-[#e9f0ea] text-[#2e6036] px-2 py-0.5 rounded">
                    State: {state}
                  </span>
                )}
              </div>

              {/* Collapsible Detailed View */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-[#dce4ec] flex flex-col gap-2.5 text-xs text-[#34495e] bg-white/70 p-3 rounded-lg">
                  <div>
                    <h4 className="font-bold text-[#2c3e50] uppercase tracking-wide text-[10px] mb-0.5">Eligibility Criteria:</h4>
                    <p className="text-gray-700 leading-relaxed">{eligibility}</p>
                  </div>

                  {applicationProcess && (
                    <div>
                      <h4 className="font-bold text-[#2c3e50] uppercase tracking-wide text-[10px] mb-0.5">Application Process & Notes:</h4>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{applicationProcess}</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    {officialUrl ? (
                      <a
                        href={officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#1b4965] hover:bg-[#133549] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        Official Application Portal <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#8395a7] italic">No direct application link available</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const renderExams = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-base text-[#4a3b2c] uppercase flex items-center gap-2">
          📝 Competitive & Entrance Examinations
        </h2>
        {activeSearch && (
          <span className="text-xs text-[#8c7457] font-semibold">
            Filtered by: &ldquo;<span className="text-[#3d2516] font-bold">{activeSearch}</span>&rdquo;
          </span>
        )}
      </div>

      {renderSearchBar()}

      {sectionLoading && <div className="text-center font-bold text-[#8c7457] py-12">Loading examination roster…</div>}
      {sectionError && <div className="text-center font-bold text-red-600 py-12">⚠ {sectionError}</div>}
      {!sectionLoading && !sectionError && data.length === 0 && (
        <div className="text-center text-[#8c7457] py-12 font-bold">No examinations found matching your search.</div>
      )}

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
        {data.map((e, i) => {
          const itemKey = e.id ? `exam-${e.id}` : `exam-idx-${i}`;
          const isExpanded = !!expandedItems[itemKey];
          const name = e.name || e.title || e.examName || 'Examination';
          const shortName = e.short_name;
          const category = e.category || 'National / State Level';
          const educationLevel = e.education_level;
          const description = e.description ? e.description.replace(/<[^>]*>/gm, '') : 'No description provided.';
          const eligibility = e.eligibility_summary ? e.eligibility_summary.replace(/<[^>]*>/gm, '') : null;

          const organizer = e.organizer || e.organization || e.provider;
          const examDates = e.exam_dates || e.dates || e.date;
          const officialUrl = e.official_url || e.url;

          return (
            <div
              key={itemKey}
              className="bg-[#fff9f9] border-2 border-[#f0c8c8] rounded-xl p-4 shadow-sm hover:border-[#d98282] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#4a2828] text-base">{name}</h3>
                    {shortName && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#fce4e4] text-[#a83232] rounded">
                        {shortName}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#8f5a5a]">
                    {organizer && (
                      <span className="font-semibold flex items-center gap-1">
                        🏛️ {organizer}
                      </span>
                    )}
                    <span>Category: {category}</span>
                    {educationLevel && <span>• Level: {educationLevel}</span>}
                    {examDates && (
                      <span className="font-bold text-[#b85c38] flex items-center gap-1">
                        <Calendar size={13} /> {examDates}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(itemKey)}
                  className="px-2.5 py-1 text-xs font-bold bg-[#fce4e4] hover:bg-[#fad0d0] text-[#4a2828] rounded-lg flex items-center gap-1 transition-colors shrink-0"
                >
                  {isExpanded ? (
                    <>Details <ChevronUp size={14} /></>
                  ) : (
                    <>Details <ChevronDown size={14} /></>
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-700 line-clamp-2 leading-relaxed">
                {description}
              </p>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#f5d6d6] flex flex-col gap-2.5 text-xs text-gray-800 bg-white/70 p-3 rounded-lg">
                  <div>
                    <h4 className="font-bold text-[#4a2828] uppercase tracking-wide text-[10px] mb-0.5">Overview & Syllabus:</h4>
                    <p className="leading-relaxed text-gray-700">{description}</p>
                  </div>

                  {eligibility && (
                    <div>
                      <h4 className="font-bold text-[#4a2828] uppercase tracking-wide text-[10px] mb-0.5">Eligibility Summary:</h4>
                      <p className="leading-relaxed text-gray-700">{eligibility}</p>
                    </div>
                  )}

                  {examDates && (
                    <div>
                      <h4 className="font-bold text-[#4a2828] uppercase tracking-wide text-[10px] mb-0.5">Examination Schedule:</h4>
                      <p className="leading-relaxed text-gray-700">{examDates}</p>
                    </div>
                  )}

                  {officialUrl && (
                    <div className="pt-2">
                      <a
                        href={officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#8b263e] hover:bg-[#701e32] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        Official Examination Portal <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#2c1d11] p-4 md:p-8 flex items-center justify-center relative font-body select-none overflow-hidden">
      {/* Warm Bookshelf & Library Wood Texture */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#5a3d28 20%, transparent 20%),
            linear-gradient(45deg, #3d2817 25%, transparent 25%, transparent 75%, #3d2817 75%, #3d2817)
          `,
          backgroundSize: '24px 24px, 12px 12px',
          backgroundPosition: '0 0, 6px 6px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#fcf6ea] border-2 border-[#bda682] px-3.5 py-2 rounded-xl shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-[#4a3b2c] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Open Enchanted Book of Knowledge Container */}
      <div className="relative z-10 w-full max-w-6xl bg-[#fbf6eb] rounded-2xl border-4 border-[#6d4c2d] shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(180,140,80,0.15)] flex flex-col h-[88vh] overflow-hidden mt-6 ring-2 ring-[#d4af37]/30">
        
        {/* Book Spine & Illuminated Tome Header */}
        <div className="bg-[#382313] px-6 py-4 flex items-center justify-between border-b-4 border-[#22140a] relative flex-shrink-0 shadow-md">
          {/* Subtle Gilded Spine Bookmark Ribbons */}
          <div className="absolute -top-1 left-12 w-4 h-8 bg-[#991b1b] rounded-b-md shadow-md z-20 border-x border-[#7f1d1d]" />
          <div className="absolute -top-1 left-18 w-3 h-6 bg-[#d97706] rounded-b-md shadow-md z-20 border-x border-[#b45309]" />

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#573921] border-2 border-[#d4af37] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-sm md:text-base text-[#fef3c7] tracking-wide uppercase drop-shadow-sm">Enchanted Tome of Knowledge</h1>
                <span className="hidden sm:inline-block bg-[#8c6738] text-[#fdf8f0] text-[9px] font-pixel px-2 py-0.5 rounded border border-[#d4af37]/50">OPEN CODEX</span>
              </div>
              <p className="text-xs text-[#d7c4b0] font-medium mt-0.5">Flippable parchment leaves of courses, scholarships, exam dates, and intelligence</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-[#ebd8c5] font-medium bg-[#24150a] px-3.5 py-1.5 rounded-lg border border-[#5d4029] shadow-inner">
            <span>✨ Golden Leaf Script</span>
          </div>
        </div>

        {/* Parchment Section Switcher Tabs */}
        <div className="flex border-b-2 border-[#d8c8b0] bg-[#ebdcc4] px-4 gap-1.5 pt-2 flex-shrink-0 overflow-x-auto no-scrollbar">
          {[
            { key: SECTION.BLOG, label: '📰 Blog Feeds & News' },
            { key: SECTION.COURSES, label: '📖 Learning Courses' },
            { key: SECTION.SCHOLARSHIPS, label: '🎓 Scholarships & Grants' },
            { key: SECTION.EXAMS, label: '📝 National Exams' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key as SectionKey)}
              className={`px-4 py-2.5 font-bold text-xs uppercase flex items-center gap-2 rounded-t-lg transition-all whitespace-nowrap ${
                section === item.key
                  ? 'bg-[#fbf6eb] text-[#3d2516] border-t-2 border-x-2 border-[#b8a280] shadow-sm -mb-[2px]'
                  : 'text-[#85705a] hover:bg-[#dfcbb1]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Display Card Body */}
        <div className="flex-1 bg-[#fdfaf2] p-4 sm:p-6 flex flex-col overflow-hidden">
          {section === SECTION.BLOG && renderBlog()}
          {section === SECTION.COURSES && renderCourses()}
          {section === SECTION.SCHOLARSHIPS && renderScholarships()}
          {section === SECTION.EXAMS && renderExams()}
        </div>
      </div>
    </div>
  );
};

export default Library;
