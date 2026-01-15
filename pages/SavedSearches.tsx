
import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  TrashIcon, 
  ArrowPathIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { getSavedSearches, removeSavedSearch, toggleSearchAlert } from '../utils/storage';
import { SavedSearch } from '../types';

const SavedSearches: React.FC = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSearches(getSavedSearches());
  }, []);

  const handleToggleAlert = (id: string) => {
    setSearches(toggleSearchAlert(id));
  };

  const handleDeleteSearch = (id: string) => {
    setSearches(removeSavedSearch(id));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Saved Searches</h1>
          <p className="text-gray-500 text-sm">Automated queries running in the background.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          New Search
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-medium uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-6 py-3">Query</th>
              <th className="px-6 py-3">Last Run</th>
              <th className="px-6 py-3">Email Alerts</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {searches.length > 0 ? searches.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center">
                      <MagnifyingGlassIcon className="w-4 h-4 text-zinc-500" />
                    </div>
                    <span className="font-medium text-gray-900">{s.query}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{s.lastRun}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleAlert(s.id)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      s.alertsEnabled ? 'bg-black' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        s.alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Tooltip Wrapper for Run Search */}
                    <div className="relative group/tooltip">
                      <button 
                        onClick={() => navigate(`/?query=${encodeURIComponent(s.query)}`)}
                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                      >
                        <PlayIcon className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-white bg-black rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        Run Search
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></span>
                      </span>
                    </div>

                    {/* Tooltip Wrapper for Delete Search */}
                    <div className="relative group/tooltip">
                      <button 
                        onClick={() => handleDeleteSearch(s.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-white bg-black rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        Delete Search
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></span>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                  No saved searches yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
        <div className="text-center">
          <ArrowPathIcon className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">All searches are re-indexed every 60 minutes.</p>
        </div>
      </div>
    </div>
  );
};

export default SavedSearches;
