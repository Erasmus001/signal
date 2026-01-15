
import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface SearchChartProps {
  data: DataPoint[];
}

const SearchChart: React.FC<SearchChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="h-64 flex items-end justify-between space-x-3 pt-10 px-2 relative">
      {/* Background Grid Lines */}
      <div className="absolute inset-x-0 top-10 bottom-8 flex flex-col justify-between pointer-events-none">
        {[0, 1, 2, 3].map((_, i) => (
          <div key={i} className="w-full border-t border-gray-100 border-dashed" />
        ))}
      </div>

      {data.map((point, i) => {
        const heightPercent = (point.value / max) * 100;
        const isHovered = hoveredIndex === i;
        
        return (
          <div 
            key={i} 
            className="flex-1 flex flex-col items-center group relative h-full"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Value Tooltip - Active on Hover */}
            <div className={`absolute -top-12 bg-zinc-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl transition-all duration-300 pointer-events-none z-20 flex flex-col items-center ${
              isHovered ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-2'
            }`}>
              <span className="font-bold">{point.value}</span>
              <span className="text-zinc-400 text-[9px] uppercase tracking-tighter">Signals Found</span>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
            </div>
            
            <div className="flex-1 w-full flex items-end">
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 ease-out cursor-pointer ${
                  isHovered ? 'bg-zinc-900 shadow-lg scale-x-102' : 'bg-zinc-900 hover:bg-zinc-900'
                }`}
                style={{ 
                  height: `${heightPercent}%`,
                  transitionDelay: `${i * 20}ms`
                }}
              />
            </div>

            {/* Label */}
            <div className="h-8 flex items-center justify-center w-full">
              <span className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                isHovered ? 'text-zinc-900 font-bold' : 'text-gray-400'
              }`}>
                {point.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchChart;
