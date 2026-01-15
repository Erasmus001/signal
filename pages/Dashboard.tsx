
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChartBarIcon, 
  BookmarkSquareIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { getSavedSearches, getSearchHistory } from '../utils/storage';
import { TimeFilter, UserPreferences } from '../types';
import SearchChart from '../features/dashboard/SearchChart';
import UpgradeModal from '../features/billing/UpgradeModal';

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<TimeFilter>('7d');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('signal_prefs');
    if (stored) {
      setUserPrefs(JSON.parse(stored));
    }
  }, []);

  const history = getSearchHistory();
  const savedSearches = getSavedSearches();
  
  const filteredHistory = useMemo(() => {
    const now = Date.now();
    let threshold = 0;
    
    switch (filter) {
      case '24h': threshold = now - 24 * 60 * 60 * 1000; break;
      case '48h': threshold = now - 48 * 60 * 60 * 1000; break;
      case '7d': threshold = now - 7 * 24 * 60 * 60 * 1000; break;
      case '30d': threshold = now - 30 * 24 * 60 * 60 * 1000; break;
      case 'custom':
        const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
        const end = dateRange.end ? new Date(dateRange.end).getTime() : now;
        return history.filter(log => log.timestamp >= start && log.timestamp <= end);
    }
    
    return history.filter(log => log.timestamp >= threshold);
  }, [filter, dateRange, history]);

  const totalSearches = filteredHistory.length;

  // Chart data: Grouping logs into buckets based on filter
  const chartData = useMemo(() => {
    const now = Date.now();
    let buckets: { label: string; start: number; end: number }[] = [];
    
    if (filter === '24h') {
      for (let i = 23; i >= 0; i -= 4) {
        buckets.push({ 
          label: `${23 - i}h`, 
          start: now - (i + 4) * 60 * 60 * 1000, 
          end: now - i * 60 * 60 * 1000 
        });
      }
    } else if (filter === '7d') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now - i * 24 * 60 * 60 * 1000);
        buckets.push({
          label: days[d.getDay()],
          start: new Date(d.setHours(0,0,0,0)).getTime(),
          end: new Date(d.setHours(23,59,59,999)).getTime()
        });
      }
    } else if (filter === '30d') {
      for (let i = 4; i >= 0; i--) {
        buckets.push({
          label: `W${4 - i + 1}`,
          start: now - (i + 1) * 7 * 24 * 60 * 60 * 1000,
          end: now - i * 7 * 24 * 60 * 60 * 1000
        });
      }
    } else {
      // Default / fallback
      const segments = 7;
      return Array.from({ length: segments }).map((_, i) => ({
        label: `P${i + 1}`,
        value: Math.floor(totalSearches / segments) + (i === segments - 1 ? totalSearches % segments : 0)
      }));
    }

    return buckets.map(b => ({
      label: b.label,
      value: history.filter(log => log.timestamp >= b.start && log.timestamp <= b.end).length
    }));
  }, [filter, history, totalSearches]);

  // Dynamic values for other cards to simulate real activity
  const growthRate = useMemo(() => {
    if (filter === '24h') return '+18%';
    if (filter === '7d') return '+12%';
    return '+4%';
  }, [filter]);

  const alertsSent = useMemo(() => {
    const base = 8;
    const factor = filter === '24h' ? 1 : filter === '48h' ? 2 : filter === '7d' ? 7 : 30;
    return Math.floor(base * factor * (0.8 + Math.random() * 0.4));
  }, [filter]);

  const welcomeMessage = useMemo(() => {
    if (userPrefs?.searchIntent === 'Leads') return "Welcome back. We're prioritizing high-intent leads for you today.";
    if (userPrefs?.searchIntent === 'Long-form') return "Welcome back. Expert content and industry threads are ready for discovery.";
    return "Welcome back. Here's what happened with your signals across the platform.";
  }, [userPrefs]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Overview</h1>
          <p className="text-gray-500 text-sm font-medium">{welcomeMessage}</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white border border-gray-100 rounded-xl p-1 shadow-sm ring-1 ring-black/5">
          {(['24h', '48h', '7d', '30d', 'custom'] as TimeFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                filter === f 
                  ? 'bg-black text-white shadow-lg shadow-zinc-200' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filter === 'custom' && (
        <div className="mb-8 flex items-center space-x-4 bg-zinc-50 p-4 rounded-xl border border-zinc-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start</label>
            <input 
              type="date" 
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/5"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">End</label>
            <input 
              type="date" 
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/5"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="flex items-center space-x-3 text-gray-400 mb-4 group-hover:text-zinc-900 transition-colors">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Searches</span>
          </div>
          <div className="flex items-baseline space-x-3 relative z-10">
            <span className="text-4xl font-bold text-gray-900 tracking-tighter">{totalSearches}</span>
            <div className="flex items-center text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
              <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
              {growthRate}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 text-zinc-50 group-hover:text-zinc-100 transition-colors duration-500 transform scale-150 rotate-12">
             <MagnifyingGlassIcon className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="flex items-center space-x-3 text-gray-400 mb-4 group-hover:text-zinc-900 transition-colors">
            <BookmarkSquareIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Saved Queries</span>
          </div>
          <div className="flex items-baseline space-x-3 relative z-10">
            <span className="text-4xl font-bold text-gray-900 tracking-tighter">{savedSearches.length}</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="absolute -bottom-2 -right-2 text-zinc-50 group-hover:text-zinc-100 transition-colors duration-500 transform scale-150 -rotate-12">
             <BookmarkSquareIcon className="w-24 h-24" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="flex items-center space-x-3 text-gray-400 mb-4 group-hover:text-zinc-900 transition-colors">
            <ChartBarIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Alerts Dispatched</span>
          </div>
          <div className="flex items-baseline space-x-3 relative z-10">
            <span className="text-4xl font-bold text-gray-900 tracking-tighter">{alertsSent}</span>
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">Real-time</span>
          </div>
          <div className="absolute -bottom-2 -right-2 text-zinc-50 group-hover:text-zinc-100 transition-colors duration-500 transform scale-150">
             <ChartBarIcon className="w-24 h-24" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm relative group ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="font-bold text-gray-900 text-xl tracking-tight">Signal Analysis Flow</h3>
            <p className="text-sm text-gray-400 mt-1">Real-time volume of discovery events across selected period.</p>
          </div>
        </div>
        
        <SearchChart data={chartData} />
      </div>

      <div className="mt-12 p-8 bg-zinc-950 rounded-3xl text-white flex items-center justify-between overflow-hidden relative group shadow-2xl shadow-zinc-200">
        <div className="relative z-10">
          <h4 className="font-bold text-2xl mb-2 tracking-tight">Scale your signal hunting</h4>
          <p className="text-zinc-500 text-sm max-w-md leading-relaxed">Upgrade to Signal Pro for unlimited saved searches, high-velocity background indexing, and team collaboration features.</p>
        </div>
        <button 
          onClick={() => setIsUpgradeModalOpen(true)}
          className="relative z-10 bg-white text-zinc-950 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-2xl active:scale-95 duration-200 ring-2 ring-white/20"
        >
          Get Signal Pro
        </button>
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-800 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none opacity-20" />
      </div>

      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
