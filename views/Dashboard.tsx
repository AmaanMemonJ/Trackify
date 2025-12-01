import React from 'react';
import { ArrowDown, ArrowUp, TrendingDown, Plane, PiggyBank } from 'lucide-react';
import { Product, Trip, UserProfile } from '../types';
import { PriceChart } from '../components/PriceChart';

interface DashboardProps {
  products: Product[];
  trips: Trip[];
  onNavigate: (view: any) => void;
  user: UserProfile | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, trips, onNavigate, user }) => {
  const totalSavings = products.reduce((acc, p) => acc + (p.originalPrice - p.currentPrice), 0);
  const activeTrips = trips.filter(t => t.status === 'planning').length;
  const priceDrops = products.filter(p => p.currentPrice < p.history[p.history.length - 2]?.price || p.currentPrice < p.originalPrice).length;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name.split(' ')[0]}</span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <PiggyBank size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Savings</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${totalSavings.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('tracker')}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Price Drops</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{priceDrops} Items</h3>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('trips')}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Plane size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Planned Trips</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeTrips} Upcoming</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity / Deals */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Deals</h3>
            <div className="space-y-4">
              {products.slice(0, 3).map(product => (
                <div key={product.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md bg-slate-100 dark:bg-slate-700" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">${product.currentPrice}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through">${product.originalPrice}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                        -{Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>
                  <PriceChart data={product.history} color={product.currentPrice < product.history[0].price ? '#10b981' : '#f59e0b'} />
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('tracker')} className="w-full mt-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
              View All Tracked Items
            </button>
          </div>

          {/* AI Quick Insight */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 p-6 rounded-xl text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/20 p-1 rounded">
                  <TrendingDown size={16} className="text-white" />
                </div>
                <span className="text-indigo-100 font-medium text-sm">AI Insight</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Flight prices to Tokyo dropped!</h3>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                Prices for your monitored flight to Tokyo (JAL) are down 15% this week. This is $250 below your target price. Historical trends suggest this might be the lowest for the next 30 days.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('chat')}
              className="mt-6 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors w-max"
            >
              Ask Assistant for Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};