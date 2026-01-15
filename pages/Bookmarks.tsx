
import React, { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlassIcon, BookmarkIcon, ListBulletIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ResultCard from '../features/search/ResultCard';
import ResultSkeleton from '../components/ResultSkeleton';
import EmptyStateIllustration from '../components/EmptyStateIllustration';
import { MOCK_POSTS } from '../constants';
import { Post, ContentType } from '../types';
import { getBookmarkedPostIds, togglePostBookmark } from '../utils/storage';

const Bookmarks: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ContentType>('All');
  const [minEngagement, setMinEngagement] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookmarkedIds = getBookmarkedPostIds();
    // Only include posts that are bookmarked
    const savedPosts = MOCK_POSTS
      .filter(p => bookmarkedIds.includes(p.id))
      .map(p => ({ ...p, isSaved: true }));
    
    setPosts(savedPosts);
    setIsLoading(false);
  }, []);

  const filterCounts = useMemo(() => {
    const baseResults = posts.filter(post => post.likes >= minEngagement);
    return {
      All: baseResults.length,
      Leads: baseResults.filter(p => p.type === 'Leads').length,
      Threads: baseResults.filter(p => p.type === 'Threads').length,
      Links: baseResults.filter(p => p.type === 'Links').length,
      Video: baseResults.filter(p => p.type === 'Video').length,
    };
  }, [minEngagement, posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesFilter = activeFilter === 'All' || post.type === activeFilter;
      const matchesEngagement = post.likes >= minEngagement;
      return matchesFilter && matchesEngagement;
    });
  }, [activeFilter, minEngagement, posts]);

  const handleToggleSave = (id: string) => {
    togglePostBookmark(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const filterOptions: ContentType[] = ['All', 'Leads', 'Threads', 'Links', 'Video'];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Bookmarks</h1>
        <p className="text-gray-500 text-sm">Your curated collection of high-intent signals.</p>
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
                      ? 'bg-gray-100 text-gray-900 font-semibold' 
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
        </aside>

        <div className="flex-1 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ResultSkeleton key={i} />)
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <ResultCard key={post.id} post={post} onSave={handleToggleSave} />
            ))
          ) : (
            <div className="py-24 text-center bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center px-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-sm hover:border-gray-200">
              <div className="mb-6">
                <EmptyStateIllustration className="w-40 h-40" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">No Bookmarks Found</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                Save interesting signals from the Discovery tab to see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
