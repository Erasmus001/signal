
import { SavedSearch, SearchLog } from '../types';
import { INITIAL_SAVED_SEARCHES, INITIAL_SEARCH_LOGS } from '../constants';

const STORAGE_KEY = 'signal_saved_searches';
const HISTORY_KEY = 'signal_search_history';
const BOOKMARKS_KEY = 'signal_post_bookmarks';

export function getSavedSearches(): SavedSearch[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_SAVED_SEARCHES;
}

export function saveSearch(query: string): SavedSearch {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    id: `s-${Date.now()}`,
    query: query,
    lastRun: 'Just now',
    alertsEnabled: false
  };
  
  const updated = [newSearch, ...searches];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newSearch;
}

export function logSearch(query: string): void {
  const history = getSearchHistory();
  const newLog: SearchLog = {
    id: `log-${Date.now()}`,
    query,
    timestamp: Date.now()
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([newLog, ...history]));
}

export function getSearchHistory(): SearchLog[] {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : INITIAL_SEARCH_LOGS;
}

export function removeSavedSearch(id: string): SavedSearch[] {
  const searches = getSavedSearches();
  const updated = searches.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function toggleSearchAlert(id: string): SavedSearch[] {
  const searches = getSavedSearches();
  const updated = searches.map(s => 
    s.id === id ? { ...s, alertsEnabled: !s.alertsEnabled } : s
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getBookmarkedPostIds(): string[] {
  const stored = localStorage.getItem(BOOKMARKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function togglePostBookmark(id: string): string[] {
  const current = getBookmarkedPostIds();
  const exists = current.includes(id);
  const updated = exists 
    ? current.filter(itemId => itemId !== id)
    : [...current, id];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
}
