
import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Tag, Plane, MessageSquare, Settings, Menu, Bell, Moon, Sun, LogOut, Ticket, Globe, ChevronDown, Wallet, User, HelpCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ViewState, UserProfile, Language, Currency } from '../types';
import { LANGUAGES, CURRENCIES, t } from '../utils/i18n';
import { MOCK_NOTIFICATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentView, onChangeView, theme, toggleTheme, user, onLogout,
  language, setLanguage, currency, setCurrency
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: t(language, 'dashboard'), icon: LayoutDashboard },
    { id: 'tracker', label: t(language, 'priceTracker'), icon: Tag },
    { id: 'coupons', label: t(language, 'couponFinder'), icon: Ticket },
    { id: 'trips', label: t(language, 'tripPlanner'), icon: Plane },
    { id: 'chat', label: t(language, 'aiAssistant'), icon: MessageSquare },
  ];

  const dir = LANGUAGES[language].dir;

  const NavContent = ({ collapsed }: { collapsed: boolean }) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-all duration-300">
      <div className={`p-4 border-b border-slate-200 dark:border-slate-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center gap-2 truncate">
            <Tag className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-900 flex-shrink-0" />
            Trackifly
          </h1>
        )}
        {collapsed && (
          <Tag className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-900" size={24} />
        )}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          className="hidden lg:block text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onChangeView(item.id as ViewState);
              setIsMobileMenuOpen(false);
            }}
            title={collapsed ? item.label : ''}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button 
          onClick={() => onChangeView('settings')}
          title={collapsed ? t(language, 'settings') : ''}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800`}
        >
          <Settings size={20} className="flex-shrink-0" />
          {!collapsed && <span className="truncate">{t(language, 'settings')}</span>}
        </button>
        
        <button 
          onClick={() => onChangeView('help')}
          title={collapsed ? 'Help & Support' : ''}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800`}
        >
          <HelpCircle size={20} className="flex-shrink-0" />
          {!collapsed && <span className="truncate">Help & Support</span>}
        </button>

        <button 
          onClick={onLogout}
          title={collapsed ? t(language, 'signOut') : ''}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="truncate">{t(language, 'signOut')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200 overflow-hidden" dir={dir}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} z-50 bg-white dark:bg-slate-900 border-r border-l border-slate-200 dark:border-slate-800 transition-all duration-300 
        ${isMobileMenuOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
      `}>
        <NavContent collapsed={isSidebarCollapsed} />
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 lg:px-8 transition-colors z-30 relative shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white lg:hidden">Trackifly</h2>
          </div>
          
          <div className="ml-auto flex items-center gap-3">
            
            {/* Currency Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Wallet size={14} className="text-slate-400" />
                <span>{currency}</span>
                <ChevronDown size={14} />
              </button>
              
              {isCurrencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 gap-1">
                    {CURRENCIES.map(curr => (
                      <button
                        key={curr}
                        onClick={() => { setCurrency(curr as Currency); setIsCurrencyMenuOpen(false); }}
                        className={`px-2 py-1.5 rounded text-xs font-medium text-left ${currency === curr ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 -z-10" onClick={() => setIsCurrencyMenuOpen(false)}></div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Globe size={16} />
                <span>{LANGUAGES[language].flag}</span>
                <ChevronDown size={14} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 gap-1">
                    {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setIsLangMenuOpen(false); }}
                        className={`px-3 py-2 rounded-lg text-sm text-left flex items-center gap-3 ${language === lang ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        <span className="text-lg">{LANGUAGES[lang].flag}</span>
                        <span>{LANGUAGES[lang].label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="fixed inset-0 -z-10" onClick={() => setIsLangMenuOpen(false)}></div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full dark:text-slate-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>

              {isNotifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                   <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                     <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
                     <span className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">Mark all read</span>
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                     {MOCK_NOTIFICATIONS.map(notif => (
                       <div key={notif.id} className="p-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                         <div className="flex gap-3">
                           <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-indigo-500'}`}></div>
                           <div>
                             <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notif.title}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                             <p className="text-[10px] text-slate-400 mt-2">{notif.timestamp}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="p-2 text-center border-t border-slate-100 dark:border-slate-800">
                     <button className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">View All</button>
                   </div>
                </div>
              )}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative pl-2" ref={profileRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 transition-colors"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.type === 'guest' ? 'Guest Access' : 'Pro Member'}</p>
                </div>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 md:hidden">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { onChangeView('settings'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User size={16} /> My Profile
                    </button>
                    <button 
                      onClick={() => { onChangeView('settings'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Settings size={16} /> Settings
                    </button>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 p-2">
                     <button 
                       onClick={onLogout}
                       className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                     >
                       <LogOut size={16} /> Sign Out
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content with Independent Scroll */}
        <div className="flex-1 overflow-auto scroll-smooth relative z-10 flex flex-col">
          <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto h-full">
              {children}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-auto flex-shrink-0">
             <div className="max-w-6xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="text-center md:text-left">
                 <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center md:justify-start">
                   <Tag size={16} className="text-indigo-600" /> Trackifly
                 </h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                   © 2024 Trackifly Inc. All rights reserved.
                 </p>
               </div>
               
               {/* Newsletter */}
               <div className="flex flex-col sm:flex-row gap-2">
                  <input placeholder="Enter your email" className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white" />
                  <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">Subscribe</button>
               </div>

               <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a>
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</a>
                 <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Support</a>
               </div>
             </div>
          </footer>
        </div>
      </main>
    </div>
  );
};
