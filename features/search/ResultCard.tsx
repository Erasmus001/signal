
import React from 'react';
import { Post } from '../../types';
import { 
  ChatBubbleLeftIcon, 
  HeartIcon, 
  ArrowTopRightOnSquareIcon,
  BookmarkIcon as BookmarkOutline,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

interface ResultCardProps {
  post: Post;
  onSave: (id: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ post, onSave }) => {
  const isVideo = post.type === 'Video';

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img src={post.avatar} alt={post.authorName} className="w-10 h-10 rounded-full border border-gray-100" />
          {isVideo && (
            <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-0.5 rounded-full border-2 border-white">
              <VideoCameraIcon className="w-2.5 h-2.5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 text-sm">{post.authorName}</span>
              <span className="text-gray-400 text-xs">{post.authorHandle}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-xs">{post.timestamp}</span>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                post.type === 'Leads' ? 'bg-green-50 text-green-700 border-green-100' :
                post.type === 'Threads' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                post.type === 'Video' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                'bg-purple-50 text-purple-700 border-purple-100'
              }`}>
                {post.type}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {post.content}
          </p>
          
          {isVideo && (
            <div className="mb-4 aspect-video bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 relative group/video cursor-pointer">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover/video:scale-110 transition-transform">
                <VideoCameraIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                {post.content.includes('[Video: ') ? post.content.split('[Video: ')[1].replace(']', '') : 'Play'}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer transition-colors">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span className="text-xs">{post.replies}</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer transition-colors">
                <HeartIcon className="w-4 h-4" />
                <span className="text-xs">{post.likes}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onSave(post.id)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                {post.isSaved ? <BookmarkSolid className="w-5 h-5 text-black" /> : <BookmarkOutline className="w-5 h-5" />}
              </button>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
