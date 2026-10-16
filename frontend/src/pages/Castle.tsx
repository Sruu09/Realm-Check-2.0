import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Briefcase, Star, ExternalLink, Trash2 } from 'lucide-react';
import { getRecommendations, type RecommendationDTO } from '../services/RecommendationService';
import { getSavedJobs, saveJob, deleteSavedJob, type SavedJob } from '../services/SavedJobService';
import { getApplications, createApplication, updateApplicationStatus, type JobApplication } from '../services/ApplicationService';

const Castle: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'applications' | 'recommended'>('search');
  
  // Search State
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<RecommendationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Saved Jobs & Apps
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationDTO[]>([]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRecommendations();
      setRecommendations(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const userId = Number(localStorage.getItem('userId') ?? 1);

  useEffect(() => {
    if (activeTab === 'saved') fetchSavedJobs();
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'recommended') fetchRecommendations();
  }, [activeTab]);

  const fetchSavedJobs = () => getSavedJobs(userId).then(setSavedJobs).catch(e => console.error(e));
  const fetchApplications = () => getApplications(userId).then(setApplications).catch(e => console.error(e));

  const handleSearch = async () => {
    if (!keyword) {
      setError('Please enter a search keyword.');
      return;
    }
    setLoading(true);
    setError('');
    setJobs([]);
    try {
      // Query unified multi-source endpoint with profile match evaluation
      const results = await getRecommendations(keyword, location);
      if (results.length === 0) setError('No results found.');
      setJobs(results);
    } catch (e) {
      setError('Unable to load jobs. The API might be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job: RecommendationDTO) => {
    try {
      await saveJob({
        userId,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        dateSaved: new Date().toISOString()
      });
      alert('✓ Job saved!');
      window.dispatchEvent(new CustomEvent('realm-notify', { detail: '✓ Job saved!' }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSaved = async (id: number) => {
    await deleteSavedJob(id);
    fetchSavedJobs();
  };

  const handleMoveToApp = async (job: SavedJob) => {
    try {
      await createApplication({
        userId,
        company: job.company,
        title: job.title,
        url: job.url,
        status: 'APPLIED',
        applicationDate: new Date().toISOString(),
        notes: ''
      });
      await deleteSavedJob(job.id);
      alert('Moved to Applications Tracker!');
      fetchSavedJobs();
    } catch(e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (appId: number, status: string) => {
    await updateApplicationStatus(appId, status);
    fetchApplications();
  };

  return (
    <div className="min-h-screen bg-[#38434f] p-4 md:p-8 flex items-center justify-center relative font-body select-none">
      {/* Stone Castle Wall Texture */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(#1e2730 20%, transparent 20%),
            linear-gradient(45deg, #242f3a 25%, transparent 25%, transparent 75%, #242f3a 75%, #242f3a)
          `,
          backgroundSize: '28px 28px, 14px 14px',
          backgroundPosition: '0 0, 7px 7px'
        }} 
      />

      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/realm')} 
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-[#fbf6ec] border-2 border-[#b59d79] px-3.5 py-2 rounded-xl shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-[#4a3b2c] font-bold text-xs"
      >
        <ChevronLeft size={16} /> Back to Realm
      </button>

      {/* Main Royal Guild Hall Container */}
      <div className="relative z-10 w-full max-w-6xl bg-[#f7f1e3] rounded-2xl border-4 border-[#8c7457] shadow-[0_16px_36px_rgba(0,0,0,0.35)] flex flex-col h-[88vh] overflow-hidden mt-6">
        
        {/* Royal Dungeon Hall Header */}
        <div className="bg-[#2d2218] px-6 py-4 flex items-center justify-between border-b-4 border-[#1c140d] relative flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#4a3b2c] border-2 border-[#b89758] rounded-xl flex items-center justify-center text-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              🏰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-base md:text-lg text-[#f5ebd7] tracking-wider uppercase drop-shadow-sm">Castle Guild Hall</h1>
                <span className="hidden sm:inline-block bg-[#8c6d3b] text-[#fdf6e7] text-[10px] font-pixel px-2 py-0.5 rounded border border-[#bfa268]">AGED BRONZE GUILD</span>
              </div>
              <p className="text-xs text-[#c9b59e] font-medium mt-0.5">Explore guild apprenticeships, postings, and verify your applications</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-[#ecd9c2] font-medium bg-[#1e150f] px-3.5 py-1.5 rounded-lg border border-[#523d2a]">
            <span>⚔️ Live Career Registries</span>
          </div>
        </div>

        {/* Parchment Tab Bar */}
        <div className="flex border-b-2 border-[#d8c8b0] bg-[#ebdcc4] px-4 gap-1 pt-2 flex-shrink-0">
          <button 
            onClick={() => setActiveTab('search')} 
            className={`px-4 py-2.5 font-bold text-xs uppercase flex items-center gap-2 rounded-t-lg transition-all ${
              activeTab === 'search' 
                ? 'bg-[#f7f1e3] text-[#4a3b2c] border-t-2 border-x-2 border-[#b8a280] shadow-sm -mb-[2px]' 
                : 'text-[#85705a] hover:bg-[#dfcbb1]'
            }`}
          >
            <Search size={14}/> Job Postings
          </button>
          <button 
            onClick={() => setActiveTab('saved')} 
            className={`px-4 py-2.5 font-bold text-xs uppercase flex items-center gap-2 rounded-t-lg transition-all ${
              activeTab === 'saved' 
                ? 'bg-[#f7f1e3] text-[#4a3b2c] border-t-2 border-x-2 border-[#b8a280] shadow-sm -mb-[2px]' 
                : 'text-[#85705a] hover:bg-[#dfcbb1]'
            }`}
          >
            <Star size={14}/> Saved ({savedJobs.length})
          </button>
          <button 
            onClick={() => setActiveTab('applications')} 
            className={`px-4 py-2.5 font-bold text-xs uppercase flex items-center gap-2 rounded-t-lg transition-all ${
              activeTab === 'applications' 
                ? 'bg-[#f7f1e3] text-[#4a3b2c] border-t-2 border-x-2 border-[#b8a280] shadow-sm -mb-[2px]' 
                : 'text-[#85705a] hover:bg-[#dfcbb1]'
            }`}
          >
            <Briefcase size={14}/> Tracker ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('recommended')} 
            className={`px-4 py-2.5 font-bold text-xs uppercase flex items-center gap-2 rounded-t-lg transition-all ${
              activeTab === 'recommended' 
                ? 'bg-[#f7f1e3] text-[#4a3b2c] border-t-2 border-x-2 border-[#b8a280] shadow-sm -mb-[2px]' 
                : 'text-[#85705a] hover:bg-[#dfcbb1]'
            }`}
          >
            <Star size={14} className="text-amber-600"/> Recommended Guilds
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-grow p-4 md:p-6 overflow-hidden flex flex-col bg-[#fdfaf2]">
          {activeTab === 'search' && (
            <div className="flex flex-col h-full">
              {/* Aged Bronze & Iron Notice Board Search Bar */}
              <div className="bg-[#2a2017] p-3.5 rounded-xl border-2 border-[#544131] shadow-md flex flex-col sm:flex-row gap-3 mb-4 flex-shrink-0">
                <div className="flex-grow flex items-center bg-[#fdfbf7] border-2 border-[#8c7457] rounded-lg px-3 focus-within:border-[#d97706] shadow-inner">
                  <Search size={16} className="text-[#8c7457] mr-2 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Role title or skill (e.g. Software Engineer, React, Java)..." 
                    value={keyword} 
                    onChange={e => setKeyword(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full py-2.5 outline-none font-semibold text-sm text-[#2b2219] placeholder:text-[#9c8973]" 
                  />
                </div>
                <div className="sm:w-1/3 flex items-center bg-[#fdfbf7] border-2 border-[#8c7457] rounded-lg px-3 focus-within:border-[#d97706] shadow-inner">
                  <MapPin size={16} className="text-[#8c7457] mr-2 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Location or Remote..." 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full py-2.5 outline-none font-semibold text-sm text-[#2b2219] placeholder:text-[#9c8973]" 
                  />
                </div>
                <button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-[#b45309] hover:bg-[#92400e] disabled:bg-[#785b41] text-[#fef3c7] font-pixel text-xs px-6 py-3 rounded-lg border-b-4 border-[#78350f] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
                >
                  {loading ? 'Searching...' : 'Explore Jobs'}
                </button>
              </div>

              {/* Status / Loading State */}
              {loading && (
                <div className="flex-grow flex flex-col items-center justify-center gap-3 text-[#79634e]">
                  <div className="animate-spin text-2xl">⚔️</div>
                  <p className="font-semibold text-sm">Consulting guild registries and parsing live listings...</p>
                </div>
              )}

              {error && (
                <div className="bg-[#fcebeb] border-2 border-[#e6b8b8] text-[#933434] p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3">
                  <span>⚠</span> {error}
                </div>
              )}

              {!loading && jobs.length === 0 && !error && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#dcd0bb] rounded-xl bg-[#faf5ea]">
                  <div className="text-4xl mb-3">📜</div>
                  <h3 className="font-pixel text-xs text-[#5c4a38] uppercase">The Noticeboard is Waiting</h3>
                  <p className="text-xs text-[#8c7457] max-w-sm mt-1">Enter a keyword or skill above to search the kingdom's aggregated career boards.</p>
                </div>
              )}

              {/* Job Listings List */}
              <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 select-text">
                {jobs.map((job, idx) => {
                  const scorePct = Math.round((job.score || 0) * 100);
                  const isHighMatch = scorePct >= 80;
                  const isMedMatch = scorePct >= 50 && scorePct < 80;

                  return (
                    <div 
                      key={job.url || idx} 
                      className="bg-white border-2 border-[#d9cbb4] hover:border-[#967d5e] p-4 rounded-xl shadow-sm transition-all hover:shadow-md flex flex-col"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-base text-[#3d2f21]">{job.title}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              job.source === 'Jobicy' 
                                ? 'bg-[#f3e8ff] text-[#6b21a8] border-[#d8b4fe]' 
                                : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
                            }`}>
                              {job.source || 'Adzuna'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#79634e] flex items-center gap-1.5">
                            <Briefcase size={13} className="text-[#967d5e]"/> {job.company}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            isHighMatch ? 'bg-[#eaf4ea] text-[#246124] border-[#a1d1a1]' :
                            isMedMatch ? 'bg-[#fef9e7] text-[#8a6805] border-[#f5dc8c]' :
                            'bg-[#f3f4f6] text-[#4b5563] border-[#d1d5db]'
                          }`}>
                            Match: {scorePct}%
                          </span>
                          <span className="text-[11px] text-[#7d6f5f] font-medium">
                            {job.salary || 'Salary Undisclosed'}
                          </span>
                        </div>
                      </div>

                      {/* Matched skills badges */}
                      {job.matchedTerms && job.matchedTerms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {job.matchedTerms.map((term, tIdx) => (
                            <span key={tIdx} className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#fde68a]">
                              ✓ {term}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Plain-language explanation */}
                      {job.explanation && (
                        <p className="text-xs text-[#5a4c3e] mt-2.5 bg-[#fbf6ec] p-2 rounded-lg border border-[#e4d4be] italic leading-relaxed">
                          💡 {job.explanation}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#ede3d1]">
                        <span className="text-xs font-semibold text-[#8a755d] flex items-center gap-1">
                          <MapPin size={13}/> {job.location || 'Remote / Unspecified'}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleSaveJob(job)} 
                            className="bg-[#fcf5e5] hover:bg-[#f6ebd1] text-[#795a20] border border-[#d6be8d] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Star size={13}/> Save
                          </button>
                          <a 
                            href={job.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-[#24527a] hover:bg-[#1b3d5b] text-[#f7f9fa] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            Apply Notice <ExternalLink size={13}/>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 select-text">
              {savedJobs.length === 0 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#dcd0bb] rounded-xl bg-[#faf5ea]">
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="font-pixel text-xs text-[#5c4a38] uppercase">No Saved Postings Yet</h3>
                  <p className="text-xs text-[#8c7457] max-w-sm mt-1">Bookmark promising apprenticeships and positions from the Job Postings tab.</p>
                </div>
              )}
              {savedJobs.map(job => (
                <div key={job.id} className="bg-white border-2 border-[#d9cbb4] hover:border-[#967d5e] p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[#3d2f21]">{job.title}</h3>
                    <p className="text-xs font-bold text-[#79634e] mt-0.5">{job.company} • {job.location || 'Remote'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                      onClick={() => handleMoveToApp(job)} 
                      className="bg-[#2c5836] hover:bg-[#23472b] text-[#fbf6ec] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      Track Application
                    </button>
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-[#eef2f6] hover:bg-[#e0e7ee] text-[#24527a] border border-[#cbd5e1] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      View <ExternalLink size={12}/>
                    </a>
                    <button 
                      onClick={() => handleDeleteSaved(job.id)} 
                      title="Remove saved posting"
                      className="bg-[#faebeb] hover:bg-[#f7d6d6] text-[#b91c1c] p-1.5 rounded-lg border border-[#fca5a5] transition-colors"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 select-text">
              {applications.length === 0 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#dcd0bb] rounded-xl bg-[#faf5ea]">
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="font-pixel text-xs text-[#5c4a38] uppercase">Application Pipeline Empty</h3>
                  <p className="text-xs text-[#8c7457] max-w-sm mt-1">Move saved jobs into this tracker to track your stages from Applied to Offer.</p>
                </div>
              )}
              {applications.map(app => (
                <div key={app.id} className="bg-white border-2 border-[#d9cbb4] hover:border-[#967d5e] p-4 rounded-xl shadow-sm flex flex-col gap-2.5">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <h3 className="font-bold text-base text-[#3d2f21]">{app.title}</h3>
                      <p className="text-xs font-bold text-[#79634e]">{app.company}</p>
                    </div>
                    <select 
                      value={app.status} 
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border-2 outline-none cursor-pointer
                        ${app.status === 'APPLIED' ? 'bg-[#e0f2fe] text-[#0369a1] border-[#7dd3fc]' :
                          app.status === 'ASSESSMENT' ? 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]' :
                          app.status === 'INTERVIEW' ? 'bg-[#f3e8ff] text-[#6b21a8] border-[#d8b4fe]' :
                          app.status === 'OFFER' ? 'bg-[#dcfce7] text-[#15803d] border-[#86efac]' :
                          'bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5]'}`}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="ASSESSMENT">Assessment</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer 🎉</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="w-full bg-[#ede4d4] h-2.5 rounded-full overflow-hidden mt-1 border border-[#dacbb4]">
                    <div className={`h-full transition-all duration-300 ${
                      app.status === 'APPLIED' ? 'w-1/4 bg-[#0284c7]' :
                      app.status === 'ASSESSMENT' ? 'w-1/2 bg-[#ca8a04]' :
                      app.status === 'INTERVIEW' ? 'w-3/4 bg-[#9333ea]' :
                      app.status === 'OFFER' ? 'w-full bg-[#16a34a]' : 'w-full bg-[#dc2626]'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-3 select-text">
              {loading && (
                <div className="flex-grow flex flex-col items-center justify-center gap-3 text-[#79634e]">
                  <div className="animate-spin text-2xl">⭐</div>
                  <p className="font-semibold text-sm">Evaluating user profile matches and tailored guild postings...</p>
                </div>
              )}
              {error && (
                <div className="bg-[#fcebeb] border-2 border-[#e6b8b8] text-[#933434] p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3">
                  <span>⚠</span> {error}
                </div>
              )}
              {!loading && !error && recommendations.length === 0 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#dcd0bb] rounded-xl bg-[#faf5ea]">
                  <div className="text-4xl mb-3">🏰</div>
                  <h3 className="font-pixel text-xs text-[#5c4a38] uppercase">No Recommendations Available</h3>
                  <p className="text-xs text-[#8c7457] max-w-sm mt-1">Complete your profile or explore search terms to calibrate recommended postings.</p>
                </div>
              )}
              {recommendations.map((rec, idx) => {
                const scorePct = Math.round((rec.score || 0) * 100);
                return (
                  <div 
                    key={rec.url || idx} 
                    className="bg-white border-2 border-[#d9cbb4] hover:border-[#967d5e] p-4 rounded-xl shadow-sm transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base text-[#3d2f21]">{rec.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            rec.source === 'Jobicy' 
                              ? 'bg-[#f3e8ff] text-[#6b21a8] border-[#d8b4fe]' 
                              : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
                          }`}>
                            {rec.source || 'Adzuna'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#79634e]">{rec.company}</p>
                        <p className="text-xs text-[#8c7457] mt-0.5">{rec.location || 'Remote'}</p>
                      </div>
                      <span className="bg-[#eaf4ea] text-[#246124] border border-[#a1d1a1] text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                        Match: {scorePct}%
                      </span>
                    </div>

                    {rec.matchedTerms && rec.matchedTerms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {rec.matchedTerms.map((term, tIdx) => (
                          <span key={tIdx} className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#fde68a]">
                            ✓ {term}
                          </span>
                        ))}
                      </div>
                    )}

                    {rec.explanation && (
                      <p className="text-xs text-[#5a4c3e] mt-2.5 bg-[#fbf6ec] p-2 rounded-lg border border-[#e4d4be] italic leading-relaxed">
                        💡 {rec.explanation}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#ede3d1]">
                      <span className="text-xs text-[#7d6f5f] font-medium">{rec.salary || 'Salary Undisclosed'}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSaveJob(rec)} 
                          className="bg-[#fcf5e5] hover:bg-[#f6ebd1] text-[#795a20] border border-[#d6be8d] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Star size={13}/> Save
                        </button>
                        <a 
                          href={rec.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-[#24527a] hover:bg-[#1b3d5b] text-[#f7f9fa] px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          Apply Notice <ExternalLink size={13}/>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Castle;
