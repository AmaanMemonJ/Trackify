import React, { useState } from 'react';
import { UserProfile, Language, Currency } from '../types';
import { User, Mail, Globe, Wallet, Bell, Moon, Sun, Shield, Save, Check } from 'lucide-react';
import { CURRENCIES, LANGUAGES } from '../utils/i18n';

interface SettingsProps {
  user: UserProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  user, language, setLanguage, currency, setCurrency, theme, toggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    notifications: true,
    marketing: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-2xl p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your account and app preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <User size={18} /> Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Globe size={18} /> Preferences
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              {activeTab === 'profile' && (
                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Profile Picture</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                      <button type="button" className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                        Upload New
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-indigo-600 dark:text-indigo-400" /> Security
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      className={`px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    >
                      {saved ? <Check size={18} /> : <Save size={18} />}
                      {saved ? 'Changes Saved' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'preferences' && (
                <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
                  
                  {/* Regional Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Regional Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Globe size={16} /> Language
                        </label>
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as Language)}
                          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                        >
                          {(Object.keys(LANGUAGES) as Language[]).map(lang => (
                            <option key={lang} value={lang}>{LANGUAGES[lang].flag} {LANGUAGES[lang].label}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This will adjust the application interface language.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Wallet size={16} /> Default Currency
                        </label>
                        <select 
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as Currency)}
                          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200"
                        >
                          {CURRENCIES.map(curr => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Used for budget planning and price estimates.</p>
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Appearance</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          {theme === 'light' ? <Sun size={24} className="text-amber-500" /> : <Moon size={24} className="text-indigo-400" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">Dark Mode</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark themes</p>
                        </div>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Notifications</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <span className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                          <Bell size={18} className="text-slate-400" /> Price Drop Alerts
                        </span>
                        <input type="checkbox" checked={formData.notifications} onChange={() => setFormData({...formData, notifications: !formData.notifications})} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <span className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium">
                          <Mail size={18} className="text-slate-400" /> Marketing Emails
                        </span>
                        <input type="checkbox" checked={formData.marketing} onChange={() => setFormData({...formData, marketing: !formData.marketing})} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                      </label>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};