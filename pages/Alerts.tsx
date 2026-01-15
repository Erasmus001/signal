
import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Modal from '../components/Modal';
import { getSavedSearches } from '../utils/storage';
import { MOCK_POSTS } from '../constants';
import ResultCard from '../features/search/ResultCard';

const Alerts: React.FC = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(MOCK_POSTS[0]);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  // Email Digest Settings
  const [digestFrequency, setDigestFrequency] = useState<'daily' | 'weekly'>('daily');
  const [savedSearches, setSavedSearches] = useState(getSavedSearches());

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'granted') {
        setBrowserNotificationsEnabled(true);
      }
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      setBrowserNotificationsEnabled(true);
      new Notification('Signal Alerts Enabled', {
        body: 'You will now receive instant match notifications.',
        icon: '/favicon.ico'
      });
    }
  };

  const handleViewSignal = (postIndex: number) => {
    setSelectedPost(MOCK_POSTS[postIndex % MOCK_POSTS.length]);
    setIsViewModalOpen(true);
  };

  const recentNotifications = [
    { id: 1, query: "CRM Recommendations", time: "14 minutes ago", postIndex: 0 },
    { id: 2, query: "SaaS growth", time: "2 hours ago", postIndex: 1 },
    { id: 3, query: "X discovery tool", time: "5 hours ago", postIndex: 4 },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Alerts</h1>
        <p className="text-gray-500 text-sm">Manage how you receive signal notifications.</p>
      </div>

      <div className="grid gap-6">
        {/* Email Digest Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <EnvelopeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Email Digest</h3>
              <p className="text-sm text-gray-500 mt-0.5">Receive a daily summary of high-intent signals.</p>
              <div className="flex items-center space-x-3 mt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                  {digestFrequency === 'daily' ? 'Daily' : 'Weekly'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Active
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEmailModalOpen(true)}
            className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-zinc-200"
          >
            Configure
          </button>
        </div>

        {/* Browser Notifications Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-start justify-between shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
              <BellIcon className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Browser Notifications</h3>
              <p className="text-sm text-gray-500 mt-0.5">Get notified instantly when a high-priority match is found.</p>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                {notificationPermission === 'denied' ? 'Permission denied. Please reset in browser settings.' : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={requestNotificationPermission}
            disabled={browserNotificationsEnabled || notificationPermission === 'denied'}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              browserNotificationsEnabled 
                ? 'bg-green-50 text-green-700 border border-green-200 shadow-none cursor-default' 
                : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-zinc-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {browserNotificationsEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {/* Recent Notifications Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              Recent Notifications
            </h2>
            <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">Mark all as read</button>
          </div>
          
          <div className="space-y-3">
            {recentNotifications.length > 0 ? recentNotifications.map(notification => (
              <div 
                key={notification.id} 
                className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-300 transition-all cursor-pointer group"
                onClick={() => handleViewSignal(notification.postIndex)}
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    Signal matched for <span className="text-blue-600 font-bold">"{notification.query}"</span>
                  </p>
                  <p className="text-xs text-gray-400 flex items-center mt-0.5">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {notification.time}
                  </p>
                </div>
                <button className="text-xs text-zinc-400 font-bold group-hover:text-zinc-900 transition-colors flex items-center">
                  View <ChevronRightIcon className="w-3 h-3 ml-1" />
                </button>
              </div>
            )) : (
              <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">No recent notifications.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Digest Configuration Modal */}
      <Modal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        title="Email Digest Settings"
      >
        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Frequency</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDigestFrequency('daily')}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                  digestFrequency === 'daily' ? 'border-zinc-900 bg-zinc-50' : 'border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                Daily Digest
              </button>
              <button 
                onClick={() => setDigestFrequency('weekly')}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                  digestFrequency === 'weekly' ? 'border-zinc-900 bg-zinc-50' : 'border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                Weekly Digest
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Included Searches</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {savedSearches.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{s.query}</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="w-4 h-4 rounded text-zinc-900 border-gray-300 focus:ring-zinc-900 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              alert('Settings saved successfully.');
              setIsEmailModalOpen(false);
            }}
            className="w-full bg-zinc-900 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-zinc-200 active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Signal View Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title="Signal Match"
      >
        <div className="p-4">
          <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-blue-800 font-medium">This match was found based on your saved search criteria.</p>
          </div>
          <ResultCard 
            post={selectedPost} 
            onSave={(id) => {
              // Toggle locally
              setSelectedPost(prev => ({ ...prev, isSaved: !prev.isSaved }));
            }} 
          />
          <div className="mt-6 flex space-x-3">
            <button 
              className="flex-1 bg-zinc-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all text-center"
            >
              Open on X
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Alerts;
