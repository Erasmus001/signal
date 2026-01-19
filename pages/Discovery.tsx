
import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, SparklesIcon, BookmarkIcon, ListBulletIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ResultCard from '../features/search/ResultCard';
import ResultSkeleton from '../components/ResultSkeleton';
import EmptyStateIllustration from '../components/EmptyStateIllustration';
import { MOCK_POSTS } from '../constants';
import { Post, ContentType, UserPreferences } from '../types';
import { saveSearch, logSearch, getBookmarkedPostIds, togglePostBookmark } from '../utils/storage';
import { discoverSignals } from '../ai/signalService';

const Discovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ContentType>('All');
  const [minEngagement, setMinEngagement] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('signal_prefs');
    if (stored) {
      const prefs: UserPreferences = JSON.parse(stored);
      setUserPrefs(prefs);
      // Map intent to content filter
      if (prefs.searchIntent === 'Leads') setActiveFilter('Leads');
      else if (prefs.searchIntent === 'Long-form') setActiveFilter('Threads');
      else setActiveFilter('All');
    }

    const bookmarkedIds = getBookmarkedPostIds();
    setPosts(MOCK_POSTS.map(p => ({
      ...p,
      isSaved: bookmarkedIds.includes(p.id)
    })));
    setIsLoading(false);
  }, []);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAnalyzing(true);
    logSearch(searchQuery);

    const signals = await discoverSignals(searchQuery, userPrefs?.searchIntent || null);
    
    if (signals.length > 0) {
      setPosts(signals);
    } else {
      // Fallback or just empty
      setPosts([]);
    }
    
    setIsAnalyzing(false);
  };

  // Calculate counts based on current search query and engagement
  const filterCounts = useMemo(() => {
    const baseResults = posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEngagement = post.likes >= minEngagement;
      return matchesSearch && matchesEngagement;
    });

    return {
      All: baseResults.length,
      Leads: baseResults.filter(p => p.type === 'Leads').length,
      Threads: baseResults.filter(p => p.type === 'Threads').length,
      Links: baseResults.filter(p => p.type === 'Links').length,
      Video: baseResults.filter(p => p.type === 'Video').length,
    };
  }, [searchQuery, minEngagement, posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || post.type === activeFilter;
      const matchesEngagement = post.likes >= minEngagement;
      return matchesSearch && matchesFilter && matchesEngagement;
    });
  }, [searchQuery, activeFilter, minEngagement, posts]);

  const handleSaveResult = (id: string) => {
    togglePostBookmark(id);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const handleSaveSearch = () => {
    if (!searchQuery.trim()) return;
    saveSearch(searchQuery);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const aiInsightsText = useMemo(() => {
    if (isAnalyzing) return "AI is currently scanning live signals for high-intent activity...";
    if (userPrefs?.searchIntent === 'Leads') {
      return "Focusing on buying intent signals. Latest analysis shows rising demand for SaaS solutions in your niche.";
    }
    if (userPrefs?.searchIntent === 'Long-form') {
      return "Thread activity is up 12% in the tech sector. Focus on expert breakdowns for best reach.";
    }
    return "Our Signal Discovery engine is active. Perform an 'Analyze' to see grounded real-time data.";
  }, [userPrefs, isAnalyzing]);

  const filterOptions: ContentType[] = ['All', 'Leads', 'Threads', 'Links', 'Video'];

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Discovery</h1>
        <p className="text-gray-500 text-sm">Real-time signal tracking and content discovery via Gemini Search Grounding.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-2 mb-12 flex items-center space-x-2 focus-within:ring-2 focus-within:ring-zinc-100 transition-all max-w-3xl mx-auto">
        <div className="pl-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search for keywords, leads, or experts..." 
          className="flex-1 py-3 px-2 outline-none text-gray-800 placeholder-gray-400 bg-transparent text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        
        <div className="flex items-center space-x-2 pr-1">
          <button 
            onClick={handleSaveSearch}
            disabled={!searchQuery.trim()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              isSaved 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed'
            }`}
          >
            <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved!' : 'Save Search'}</span>
          </button>
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !searchQuery.trim()}
            className="bg-zinc-900 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center space-x-2"
          >
            {isAnalyzing && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-12">
        <aside className="w-56 flex-shrink-0 space-y-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              <ListBulletIcon className="w-4 h-4" />
              <span>Filters</span>
            </div>
            <div className="space-y-1">
              {filterOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                    activeFilter === f 
                      ? 'bg-gray-100 text-gray-900 font-semibold shadow-sm shadow-zinc-100' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{f}</span>
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                    activeFilter === f ? 'bg-white text-gray-900' : 'text-gray-300 group-hover:text-gray-400'
                  }`}>
                    {filterCounts[f]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min. Engagement</span>
              <span className="text-xs font-semibold text-zinc-900">{minEngagement}+</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={minEngagement}
              onChange={(e) => setMinEngagement(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          <div className={`p-4 rounded-2xl border transition-all duration-500 ${isAnalyzing ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100 ring-1 ring-zinc-200/50'}`}>
            <div className={`flex items-center space-x-2 mb-2 ${isAnalyzing ? 'text-white' : 'text-zinc-900'}`}>
              <SparklesIcon className={`w-4 h-4 ${isAnalyzing ? 'text-zinc-400 animate-pulse' : 'text-zinc-600'}`} />
              <span className="text-xs font-bold uppercase tracking-tight">AI Insights</span>
            </div>
            <p className={`text-[11px] leading-relaxed font-medium ${isAnalyzing ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {aiInsightsText}
            </p>
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          {(isLoading || isAnalyzing) ? (
            Array.from({ length: 3 }).map((_, i) => <ResultSkeleton key={i} />)
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <ResultCard key={post.id} post={post} onSave={handleSaveResult} />
            ))
          ) : (
            <div className="py-24 text-center bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center px-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-sm hover:border-gray-200">
              <div className="mb-6">
                <EmptyStateIllustration className="w-40 h-40" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Scanning for Signal...</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't find any results matching your current filters. Try clicking 'Analyze' to fetch real-time data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
