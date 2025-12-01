import React, { useState } from 'react';
import { Ticket, Search, Loader2, Copy, ExternalLink, ShoppingBag } from 'lucide-react';
import { findCoupons } from '../services/geminiService';

export const CouponFinder: React.FC = () => {
  const [url, setUrl] = useState('');
  const [coupons, setCoupons] = useState<string[]>([]);
  const [isFinding, setIsFinding] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindCoupons = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsFinding(true);
    setHasSearched(true);
    setCoupons([]);
    
    // Simulate slight network delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const found = await findCoupons(url);
    setCoupons(found);
    setIsFinding(false);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could add toast notification here
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 rounded-2xl p-6 md:p-10 border border-white/50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 pointer-events-none">
        <Ticket size={240} className="transform rotate-12 text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform rotate-3">
            <Ticket size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Smart Coupon Finder</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Paste a store link below, and our AI will scour the web to find the best active discount codes for you.
          </p>
        </div>

        <form onSubmit={handleFindCoupons} className="relative max-w-xl mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative flex shadow-xl bg-white dark:bg-slate-800 rounded-xl overflow-hidden p-1">
            <input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste product or store URL (e.g., www.nike.com)" 
              className="flex-1 pl-4 pr-4 py-3 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button 
              type="submit" 
              disabled={isFinding || !url}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFinding ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              <span className="hidden sm:inline">{isFinding ? 'Scanning...' : 'Find Codes'}</span>
            </button>
          </div>
        </form>

        {/* Results Area */}
        {hasSearched && !isFinding && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left mt-12">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/50 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-indigo-600 dark:text-indigo-400" />
                Discounts Found for {new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')}
              </h3>
              
              {coupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coupons.map((code, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                      <div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Promo Code</p>
                         <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-wide">{code}</div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(code)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Copy Code"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p>No specific codes found for this URL right now. Try looking for seasonal sales!</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <span>Success Rate: High</span>
                <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Visit Store <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
