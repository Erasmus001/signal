
import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  CreditCardIcon, 
  CommandLineIcon,
  CheckIcon,
  ClipboardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import UpgradeModal from '../features/billing/UpgradeModal';
import { getSavedSearches } from '../utils/storage';

const Settings: React.FC = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  // Account States
  const [email, setEmail] = useState('demo@signal.so');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);
  const [xAccountConnected, setXAccountConnected] = useState(true);
  
  // API Key State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Subscription Stats
  const [savedSearchesCount, setSavedSearchesCount] = useState(0);
  const limit = 3;

  useEffect(() => {
    setSavedSearchesCount(getSavedSearches().length);
  }, []);

  const handleEmailSave = () => {
    if (tempEmail.includes('@')) {
      setEmail(tempEmail);
      setIsEditingEmail(false);
    }
  };

  const generateApiKey = () => {
    const key = `sig_live_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(key);
  };

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account and app preferences.</p>
      </div>

      <div className="space-y-10">
        {/* Account Section */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center">
            <UserCircleIcon className="w-4 h-4 mr-2" />
            Account
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
            <div className="p-5 flex items-center justify-between group">
              <div className="flex-1 mr-4">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Email Address</p>
                {isEditingEmail ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <input 
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-black/5 flex-1 max-w-xs"
                      autoFocus
                    />
                    <button 
                      onClick={handleEmailSave}
                      className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-black transition-colors"
                    >
                      <CheckIcon className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setIsEditingEmail(false)}
                      className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">{email}</p>
                )}
              </div>
              {!isEditingEmail && (
                <button 
                  onClick={() => {
                    setTempEmail(email);
                    setIsEditingEmail(true);
                  }}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Change
                </button>
              )}
            </div>

            <div className="p-5 flex items-center justify-between group">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">X Account</p>
                <p className="text-xs text-gray-500">
                  {xAccountConnected ? 'Connected as @signal_demo' : 'Not connected'}
                </p>
              </div>
              <button 
                onClick={() => setXAccountConnected(!xAccountConnected)}
                className={`text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  xAccountConnected 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'bg-zinc-900 text-white hover:bg-black'
                }`}
              >
                {xAccountConnected ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center">
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Subscription
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-lg font-bold text-gray-900">Free Forever</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">Active</span>
                </div>
                <p className="text-xs text-gray-500">Limited to 3 saved searches and 50 results/day.</p>
              </div>
              <button 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-zinc-200 active:scale-95"
              >
                Upgrade to Pro
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Saved Searches Usage</p>
                <p className="text-xs font-bold text-zinc-900">{savedSearchesCount} <span className="text-zinc-400">/ {limit}</span></p>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-gray-50">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    savedSearchesCount >= limit ? 'bg-red-500' : 'bg-zinc-900'
                  }`} 
                  style={{ width: `${Math.min((savedSearchesCount / limit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">
                {savedSearchesCount >= limit 
                  ? 'Limit reached. Upgrade to Pro for unlimited searches.' 
                  : `${limit - savedSearchesCount} slots remaining on Free plan.`
                }
              </p>
            </div>
          </div>
        </section>

        {/* API Access Section */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center">
            <CommandLineIcon className="w-4 h-4 mr-2" />
            API Access
          </h2>
          <div className="bg-zinc-950 rounded-3xl p-8 text-white overflow-hidden relative group shadow-2xl shadow-zinc-200">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 tracking-tight">Build on top of Signal</h3>
              <p className="text-zinc-500 text-sm mb-6 max-w-sm leading-relaxed">
                Connect your own internal tools to our real-time X discovery engine via our developer API.
              </p>
              
              {!apiKey ? (
                <button 
                  onClick={generateApiKey}
                  className="bg-white text-zinc-900 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95 shadow-xl"
                >
                  Get API Key
                </button>
              ) : (
                <div className="flex flex-col space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Live API Key</p>
                  <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-xs overflow-hidden group/key">
                    <span className="text-zinc-300 truncate flex-1">{apiKey}</span>
                    <button 
                      onClick={copyToClipboard}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-white"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setApiKey(null)}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-white"
                      title="Revoke Key"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && <span className="text-[10px] text-green-500 font-bold">Copied to clipboard!</span>}
                </div>
              )}
            </div>
            
            {/* Abstract Background Design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 pointer-events-none group-hover:opacity-30 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" />
          </div>
        </section>
      </div>

      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
};

export default Settings;
