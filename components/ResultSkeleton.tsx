
import React from 'react';

const ResultSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse">
      <div className="flex items-start space-x-4">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {/* Name and handle skeleton */}
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-2 w-16 bg-gray-50 rounded" />
            </div>
            {/* Badge skeleton */}
            <div className="h-4 w-12 bg-gray-50 rounded-full" />
          </div>
          
          {/* Content lines skeleton */}
          <div className="space-y-2 mb-5">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
            <div className="h-3 w-4/6 bg-gray-100 rounded" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-3 w-8 bg-gray-50 rounded" />
              <div className="h-3 w-8 bg-gray-50 rounded" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 bg-gray-100 rounded" />
              <div className="h-5 w-5 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSkeleton;
