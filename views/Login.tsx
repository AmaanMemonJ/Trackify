
import React, { useState } from 'react';
import { Tag, Moon, Sun, ArrowRight, User, Mail, ShieldCheck, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

type AuthMode = 'signin' | 'signup' | 'guest';

export const Login: React.FC<LoginProps> = ({ onLogin, theme, toggleTheme }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onLogin({
        name: formData.name,
        email: formData.email,
        type: 'guest',
        avatar: undefined
      });
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would validate against a backend
    onLogin({
      name: formData.name || 'Demo User',
      email: formData.email,
      type: 'auth',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    });
  };

  const handleSocialLogin = (provider: string) => {
    // Mock login behavior
    onLogin({
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      type: 'auth'
    });
  };

  const SocialButtons = () => (
    <div className="space-y-3 mt-4">
      <button
        type="button"
        onClick={() => handleSocialLogin('google')}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium text-sm"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>
      
      <button
        type="button"
        onClick={() => handleSocialLogin('apple')}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.09-.48-3.08.35-1.99 1.7-5.35-1.58-4.66-6.57.55-4.14 4.17-5.56 5.6-5.46 1.19.08 1.95.53 2.62.53.67 0 1.92-.53 3.23-.46 2.21.1 3.75 1.58 3.75 1.58-.19.11-2.2 1.28-2.18 4.96.02 3.19 2.57 4.54 2.8 4.67-2.48 5.68-3.79 4.35-5.00 5.48zm-2.03-14.7c-1.3-.64-2.41 1.25-2.3 2.65 1.23.95 2.62-.73 2.3-2.65z" />
        </svg>
        Continue with Apple
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('facebook')}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1877F2] text-white rounded-xl hover:bg-[#166fe5] transition-colors font-medium text-sm"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Continue with Facebook
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 relative overflow-hidden">
      
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2021&q=80" 
          alt="Travel Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-900/80 to-slate-900/90 dark:from-slate-950/90 dark:to-slate-950/90 backdrop-blur-[2px]"></div>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors shadow-lg"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="max-w-md w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 pb-4 text-center border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <Tag className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Trackifly</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {mode === 'signin' && 'Welcome back! Sign in to continue.'}
            {mode === 'signup' && 'Create an account to start tracking.'}
            {mode === 'guest' && 'Enter your details for guest access.'}
          </p>
        </div>

        <div className="p-8 pt-6">
          {mode === 'signin' && (
             <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Sign In
              </button>
             </form>
          )}

          {mode === 'signup' && (
             <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="Create a password"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Create Account
              </button>
             </form>
          )}

          {mode === 'guest' && (
            <form onSubmit={handleGuestSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none dark:bg-slate-800 dark:text-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Enter as Guest
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Social Divider */}
          {mode !== 'guest' && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 rounded">Or {mode === 'signin' ? 'continue' : 'sign up'} with</span>
              </div>
            </div>
          )}

          {mode !== 'guest' && <SocialButtons />}

          {/* Footer Toggles */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
             {mode === 'signin' && (
               <>
                 <p className="text-sm text-slate-600 dark:text-slate-400">
                   Don't have an account?{' '}
                   <button onClick={() => setMode('signup')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign up</button>
                 </p>
                 <button onClick={() => setMode('guest')} className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Continue as Guest</button>
               </>
             )}
             {mode === 'signup' && (
               <>
                 <p className="text-sm text-slate-600 dark:text-slate-400">
                   Already have an account?{' '}
                   <button onClick={() => setMode('signin')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in</button>
                 </p>
                  <button onClick={() => setMode('guest')} className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Continue as Guest</button>
               </>
             )}
             {mode === 'guest' && (
               <button onClick={() => setMode('signin')} className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                 Back to Sign In
               </button>
             )}
          </div>
        </div>
      </div>
      
      {/* Footer text */}
      <div className="relative z-10 mt-8 text-white/60 text-xs font-medium">
        © 2024 Trackifly. All rights reserved.
      </div>
    </div>
  );
};
