
import { Post, SavedSearch, SearchLog } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorHandle: '@startup_founder',
    authorName: 'Alex Rivers',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    content: "Looking for a specialized CRM that handles high-volume B2B outreach without the bloat of Salesforce. Any recommendations for lean teams? #SaaS #Growth",
    likes: 42,
    replies: 12,
    timestamp: '2h ago',
    isSaved: false,
    type: 'Leads'
  },
  {
    id: '2',
    authorHandle: '@marketing_wiz',
    authorName: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    content: "1/12: How we scaled our search discovery tool to 10k users in 3 months with 0 spend. A thread on intent-based marketing. 🧵",
    likes: 850,
    replies: 45,
    timestamp: '5h ago',
    isSaved: true,
    type: 'Threads'
  },
  {
    id: '3',
    authorHandle: '@dev_insights',
    authorName: 'Jordan Smith',
    avatar: 'https://picsum.photos/seed/jordan/100/100',
    content: "Just published: 'The Future of Real-time Search Infrastructure'. Read it here: signal.com/blog/future-search",
    likes: 120,
    replies: 8,
    timestamp: '1d ago',
    isSaved: false,
    type: 'Links'
  },
  {
    id: '4',
    authorHandle: '@product_guy',
    authorName: 'David Miller',
    avatar: 'https://picsum.photos/seed/david/100/100',
    content: "Does anyone know a tool that tracks 'buying intent' keywords on X? Looking for something like Attio but for social signals.",
    likes: 15,
    replies: 32,
    timestamp: '4h ago',
    isSaved: false,
    type: 'Leads'
  },
  {
    id: '5',
    authorHandle: '@video_pro',
    authorName: 'Marcus Vlogs',
    avatar: 'https://picsum.photos/seed/marcus/100/100',
    content: "Check out my latest breakdown of the new X video algorithms. Long-form video is officially taking over the timeline! 🎥 [Video: 12:45]",
    likes: 340,
    replies: 28,
    timestamp: '3h ago',
    isSaved: false,
    type: 'Video'
  },
  {
    id: '6',
    authorHandle: '@short_form_king',
    authorName: 'Leo Sparks',
    avatar: 'https://picsum.photos/seed/leo/100/100',
    content: "3 tips to hook your audience in the first 3 seconds of your X videos. ⚡️ #VideoMarketing #GrowthHacking [Video: 0:45]",
    likes: 1200,
    replies: 156,
    timestamp: '30m ago',
    isSaved: false,
    type: 'Video'
  }
];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  { id: 's1', query: 'CRM recommendations', lastRun: '10m ago', alertsEnabled: true },
  { id: 's2', query: 'buying intent tool', lastRun: '1h ago', alertsEnabled: false }
];

// Generate some fake history for the last 30 days
const now = Date.now();
const day = 24 * 60 * 60 * 1000;
export const INITIAL_SEARCH_LOGS: SearchLog[] = Array.from({ length: 42 }).map((_, i) => ({
  id: `init-${i}`,
  query: ['SaaS leads', 'CRM tools', 'X discovery', 'intent signal'][i % 4],
  timestamp: now - (Math.random() * 30 * day)
}));
