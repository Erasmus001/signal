
export type ContentType = 'Leads' | 'Threads' | 'Links' | 'Video' | 'All';

export interface Post {
  id: string;
  authorHandle: string;
  authorName: string;
  avatar: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  isSaved: boolean;
  type: ContentType;
}

export interface SavedSearch {
  id: string;
  query: string;
  lastRun: string;
  alertsEnabled: boolean;
}

export interface SearchLog {
  id: string;
  query: string;
  timestamp: number; // ms
}

export interface UserPreferences {
  isOnboarded: boolean;
  searchIntent: 'Leads' | 'Long-form' | 'Both' | null;
}

export type TimeFilter = '24h' | '48h' | '7d' | '30d' | 'custom';
