import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MapPin, Briefcase, Star, ExternalLink, Trash2 } from 'lucide-react';
import { searchJobs, type AdzunaJob } from '../services/AdzunaService';
import { getSavedJobs, saveJob, deleteSavedJob, type SavedJob } from '../services/SavedJobService';
import { getApplications, createApplication, updateApplicationStatus, type JobApplication } from '../services/ApplicationService';

const Castle: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'applications'>('search');
  
  // Search State
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Saved Jobs & Apps
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  
  const userId = 1; // hardcoded for phase 2

  useEffect(() => {
    if (activeTab === 'saved') fetchSavedJobs();
    if (activeTab === 'applications') fetchApplications();
  }, [activeTab]);

  const fetchSavedJobs = () => getSavedJobs(userId).then(setSavedJobs).catch(e => console.error(e));
  const fetchApplications = () => getApplications(userId).then(setApplications).catch(e => console.error(e));

  const handleSearch = async () => {
    if (!keyword) {
      // Small toast notification handled via basic state here, but we will add a global one later
      setError('Please enter a search keyword.');
      return;
    }
    setLoading(true);
    setError('');
    setJobs([]);
    try {
      const results = await searchJobs(keyword, location);
      if (results.length === 0) setError('No results found.');
      setJobs(results);
    } catch (e) {
      setError('Unable to load jobs. The API might be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job: AdzunaJob) => {
    try {
      await saveJob({
        userId, title: job.title, company: job.company, 
        location: job.location, url: job.url, dateSaved: new Date().toISOString()
      });
      alert('✓ Job saved!');
      // Dispatch an event just in case we have a global toast listener later
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
        userId, company: job.company, title: job.title, 
        url: job.url, status: 'APPLIED', applicationDate: new Date().toISOString(), notes: ''
      });
      await deleteSavedJob(job.id);
      alert('Moved to Applications Tracker!');
      fetchSavedJobs();
    } catch(e) { console.error(e); }
  };

  const handleStatusChange = async (appId: number, status: string) => {
    await updateApplicationStatus(appId, status);
    fetchApplications();
  };

  return (
    <div className="min-h-screen bg-[#4a5c6a] p-8 flex items-center justify-center relative font-body select-none">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(45deg, #2a343d 25%, transparent 25%, transparent 75%, #2a343d 75%, #2a343d), linear-gradient(45deg, #2a343d 25%, transparent 25%, transparent 75%, #2a343d 75%, #2a343d)',
        backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px'
      }} />

      <button onClick={() => navigate('/realm')} className="absolute top-6 left-6 z-50 bg-[#e0cdad] border-4 border-[#7a5e3f] p-3 rounded-lg shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2 text-[#4a3b2c] font-bold">
        <ChevronLeft /> Back to Realm
      </button>

      <div className="relative z-10 w-full max-w-6xl bg-[#e6d5b8] rounded-2xl border-8 border-[#7a5e3f] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-[85vh]">
        <div className="bg-[#4a3b2c] p-4 text-center relative border-b-8 border-[#2e241b]">
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-12 h-12 bg-[#8c7457] border-4 border-[#e6d5b8] rounded-full flex items-center justify-center text-white text-xl shadow-lg z-20">
            🏰
          </div>
          <h1 className="font-pixel text-2xl text-white tracking-widest uppercase">Career Center</h1>
        </div>

        <div className="flex border-b-4 border-[#c7b293] bg-[#d9c4a5] mt-4">
          <button onClick={() => setActiveTab('search')} className={`flex-1 p-3 font-bold text-sm uppercase flex items-center justify-center gap-2 ${activeTab==='search'?'bg-[#e6d5b8] text-[#4a3b2c] border-b-4 border-[#a3222a] -mb-1':'text-[#8c7457] hover:bg-[#ebdfcc]'}`}><Search size={16}/> Search Jobs</button>
          <button onClick={() => setActiveTab('saved')} className={`flex-1 p-3 font-bold text-sm uppercase flex items-center justify-center gap-2 border-x-2 border-[#c7b293] ${activeTab==='saved'?'bg-[#e6d5b8] text-[#4a3b2c] border-b-4 border-[#a3222a] -mb-1':'text-[#8c7457] hover:bg-[#ebdfcc]'}`}><Star size={16}/> Saved Jobs</button>
          <button onClick={() => setActiveTab('applications')} className={`flex-1 p-3 font-bold text-sm uppercase flex items-center justify-center gap-2 ${activeTab==='applications'?'bg-[#e6d5b8] text-[#4a3b2c] border-b-4 border-[#a3222a] -mb-1':'text-[#8c7457] hover:bg-[#ebdfcc]'}`}><Briefcase size={16}/> Applications</button>
        </div>

        <div className="flex-grow p-6 overflow-hidden flex flex-col">
          {activeTab === 'search' && (
            <div className="flex flex-col h-full">
              <div className="flex gap-4 mb-4">
                <div className="flex-grow flex items-center bg-white border-4 border-[#c7b293] rounded-lg px-4">
                  <Search className="text-gray-400 mr-2" />
                  <input type="text" placeholder="Job Title / Keyword (e.g. Java Developer)" value={keyword} onChange={e=>setKeyword(e.target.value)} className="w-full py-3 outline-none font-bold text-[#4a3b2c]" />
                </div>
                <div className="w-1/3 flex items-center bg-white border-4 border-[#c7b293] rounded-lg px-4">
                  <MapPin className="text-gray-400 mr-2" />
                  <input type="text" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} className="w-full py-3 outline-none font-bold text-[#4a3b2c]" />
                </div>
                <button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 rounded-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all">Search</button>
              </div>

              {loading && <div className="text-center font-bold text-[#8c7457] mt-10">Searching Adzuna APIs...</div>}
              {error && <div className="text-center font-bold text-red-600 mt-10">⚠ {error}</div>}

              <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white border-2 border-[#c7b293] p-4 rounded-xl shadow-sm flex flex-col group hover:border-[#a3222a]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-[#4a3b2c]">{job.title}</h3>
                        <p className="text-sm font-bold text-[#8c7457] flex items-center gap-1"><Briefcase size={14}/> {job.company}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{job.salary || 'Salary Undisclosed'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{job.description.replace(/<[^>]*>?/gm, '')}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveJob(job)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><Star size={14}/> Save</button>
                        <a href={job.url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-xs font-bold flex items-center gap-1">Apply <ExternalLink size={14}/></a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4">
              {savedJobs.length === 0 && <div className="text-center font-bold text-[#8c7457] mt-10">No saved jobs yet.</div>}
              {savedJobs.map(job => (
                <div key={job.id} className="bg-white border-2 border-[#c7b293] p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-[#4a3b2c]">{job.title}</h3>
                    <p className="text-xs font-bold text-[#8c7457]">{job.company} • {job.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleMoveToApp(job)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-xs font-bold">Apply Now</button>
                    <a href={job.url} target="_blank" rel="noreferrer" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs font-bold">View</a>
                    <button onClick={() => handleDeleteSaved(job.id)} className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4">
              {applications.length === 0 && <div className="text-center font-bold text-[#8c7457] mt-10">No applications yet.</div>}
              {applications.map(app => (
                <div key={app.id} className="bg-white border-2 border-[#c7b293] p-4 rounded-xl flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold text-[#4a3b2c]">{app.title}</h3>
                      <p className="text-xs font-bold text-[#8c7457]">{app.company}</p>
                    </div>
                    <select 
                      value={app.status} 
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded border-2 outline-none
                        ${app.status === 'APPLIED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          app.status === 'ASSESSMENT' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          app.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          app.status === 'OFFER' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-red-100 text-red-800 border-red-200'}`}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="ASSESSMENT">Assessment</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer 🎉</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                     <div className={`h-full transition-all ${
                       app.status === 'APPLIED' ? 'w-1/4 bg-blue-500' :
                       app.status === 'ASSESSMENT' ? 'w-1/2 bg-yellow-500' :
                       app.status === 'INTERVIEW' ? 'w-3/4 bg-purple-500' :
                       app.status === 'OFFER' ? 'w-full bg-green-500' : 'w-full bg-red-500'
                     }`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Castle;
