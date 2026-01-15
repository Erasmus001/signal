
import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface OnboardingProps {
  onComplete: (intent: 'Leads' | 'Long-form' | 'Both') => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<'Leads' | 'Long-form' | 'Both' | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-md w-full text-center mb-12">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-zinc-200">
          <span className="text-white font-bold text-xl italic">S</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">Welcome to Signal</h1>
        <p className="text-gray-500 text-sm leading-relaxed">Let's personalize your discovery experience. What are you looking to find on X?</p>
      </div>

      <div className="max-w-xl w-full flex flex-col space-y-4 mb-12">
        <button
          onClick={() => setSelected('Leads')}
          className={`group flex items-center p-6 rounded-2xl border-2 transition-all text-left ${
            selected === 'Leads' 
              ? 'border-black bg-zinc-50 shadow-sm' 
              : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50/50'
          }`}
        >
          <div className={`p-3 rounded-xl mr-5 transition-colors ${selected === 'Leads' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">High-Intent Leads</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Find people asking for product recommendations and looking for solutions.</p>
          </div>
        </button>

        <button
          onClick={() => setSelected('Long-form')}
          className={`group flex items-center p-6 rounded-2xl border-2 transition-all text-left ${
            selected === 'Long-form' 
              ? 'border-black bg-zinc-50 shadow-sm' 
              : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50/50'
          }`}
        >
          <div className={`p-3 rounded-xl mr-5 transition-colors ${selected === 'Long-form' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">Expert Content</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Discover threads, deep-dives, and shared articles from top minds in your industry.</p>
          </div>
        </button>

        <button
          onClick={() => setSelected('Both')}
          className={`group flex items-center p-6 rounded-2xl border-2 transition-all text-left ${
            selected === 'Both' 
              ? 'border-black bg-zinc-50 shadow-sm' 
              : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50/50'
          }`}
        >
          <div className={`p-3 rounded-xl mr-5 transition-colors ${selected === 'Both' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">Everything Discovery</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Keep a pulse on the entire ecosystem. Leads, threads, and latest trending links.</p>
          </div>
        </button>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <button
          disabled={!selected}
          onClick={() => selected && onComplete(selected)}
          className={`flex items-center space-x-3 px-10 py-3.5 rounded-xl font-bold transition-all duration-300 ${
            selected 
              ? 'bg-black text-white shadow-2xl shadow-zinc-200 hover:-translate-y-0.5 active:scale-95' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200/50'
          }`}
        >
          <span className="text-sm">Get Started</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
        
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
          No credit card or X account connection required for prototype.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
