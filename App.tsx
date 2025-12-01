import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { ProductTracker } from './views/ProductTracker';
import { TripPlanner } from './views/TripPlanner';
import { AiAssistant } from './views/AiAssistant';
import { CouponFinder } from './views/CouponFinder';
import { Settings } from './views/Settings';
import { Login } from './views/Login';
import { Help } from './views/Help';
import { ViewState, Product, Trip, UserProfile, Language, Currency } from './types';
import { MOCK_PRODUCTS, MOCK_TRIPS } from './constants';
import { fetchProducts, fetchTrips } from './services/dataService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  
  // Localization State
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Initialize theme from local storage or system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard products={products} trips={trips} onNavigate={setCurrentView} user={user} />;
      case 'tracker':
        return <ProductTracker products={products} setProducts={setProducts} />;
      case 'trips':
        return <TripPlanner trips={trips} setTrips={setTrips} language={language} currency={currency} setCurrency={setCurrency} />;
      case 'coupons':
        return <CouponFinder />;
      case 'chat':
        return <AiAssistant products={products} trips={trips} />;
      case 'settings':
        return (
          <Settings 
            user={user!} 
            language={language} 
            setLanguage={setLanguage}
            currency={currency}
            setCurrency={setCurrency}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      case 'help':
        return <Help />;
      default:
        return <Dashboard products={products} trips={trips} onNavigate={setCurrentView} user={user} />;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // If Supabase envs are present, attempt to load persistent data
      const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY;
      if (!hasSupabase) return;
      const [p, t] = await Promise.all([fetchProducts(), fetchTrips()]);
      if (p.length) setProducts(p);
      if (t.length) setTrips(t);
    };
    loadData();
  }, [user]);

  if (!user) {
    return <Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      theme={theme}
      toggleTheme={toggleTheme}
      user={user}
      onLogout={handleLogout}
      language={language}
      setLanguage={setLanguage}
      currency={currency}
      setCurrency={setCurrency}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
