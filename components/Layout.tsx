
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BookmarkIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  MagnifyingGlassIcon,
  ChevronRightIcon,
  SparklesIcon,
  MagnifyingGlassCircleIcon
} from '@heroicons/react/24/outline';

const SidebarItem: React.FC<{ to: string; icon: any; label: string }> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-gray-100 text-black font-medium' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

const Layout: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    if (path === '/discovery') return 'Discovery';
    if (path === '/saved') return 'Saved Searches';
    if (path === '/bookmarks') return 'Bookmarks';
    if (path === '/alerts') return 'Alerts';
    if (path === '/settings') return 'Settings';
    return 'Main Feed';
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 flex flex-col p-4">
        <div className="flex items-center space-x-2 px-3 mb-8">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-zinc-200">
            <span className="text-white font-bold text-xs italic">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Signal</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem to="/" icon={HomeIcon} label="Dashboard" />
          <SidebarItem to="/discovery" icon={SparklesIcon} label="Discovery" />
          <SidebarItem to="/saved" icon={MagnifyingGlassCircleIcon} label="Saved Searches" />
          <SidebarItem to="/bookmarks" icon={BookmarkIcon} label="Bookmarks" />
          <SidebarItem to="/alerts" icon={BellIcon} label="Alerts" />
          <SidebarItem to="/settings" icon={Cog6ToothIcon} label="Settings" />
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-4 px-3">
          <div className="flex items-center space-x-3">
            <img 
              src="https://picsum.photos/seed/user/100/100" 
              className="w-8 h-8 rounded-full border border-gray-200" 
              alt="User" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">Demo User</p>
              <p className="text-[10px] text-gray-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center text-sm text-gray-400 space-x-2">
            <span>Workspace</span>
            <ChevronRightIcon className="w-3 h-3" />
            <span className="text-gray-900 font-medium">{getPageTitle()}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <NavLink 
              to="/discovery"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm shadow-zinc-200 active:scale-95"
            >
              Start New Search
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#fcfcfc]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
