
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import SavedSearches from './pages/SavedSearches';
import Bookmarks from './pages/Bookmarks';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { UserPreferences } from './types';

function App() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('signal_prefs');
    return stored ? JSON.parse(stored) : { isOnboarded: false, searchIntent: null };
  });

  useEffect(() => {
    localStorage.setItem('signal_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const handleOnboard = (intent: 'Leads' | 'Long-form' | 'Both') => {
    setPrefs({ isOnboarded: true, searchIntent: intent });
  };

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/onboarding" 
          element={prefs.isOnboarded ? <Navigate to="/" /> : <Onboarding onComplete={handleOnboard} />} 
        />
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={prefs.isOnboarded ? <Dashboard /> : <Navigate to="/onboarding" />} 
          />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/saved" element={<SavedSearches />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
