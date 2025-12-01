import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, RefreshCw, Loader2, Share2, Check } from 'lucide-react';
import { Product } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { PriceChart } from '../components/PriceChart';
import { analyzeProductValue } from '../services/geminiService';
import { insertProduct, deleteProduct } from '../services/dataService';

interface ProductTrackerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const getProductImage = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('headphone') || n.includes('sony') || n.includes('bose') || n.includes('audio')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('laptop') || n.includes('macbook') || n.includes('computer')) {
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('camera') || n.includes('canon') || n.includes('nikon')) {
    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('shoe') || n.includes('sneaker') || n.includes('nike') || n.includes('adidas')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('watch') || n.includes('rolex') || n.includes('smartwatch')) {
    return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('chair') || n.includes('sofa') || n.includes('furniture')) {
    return 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('phone') || n.includes('iphone') || n.includes('samsung') || n.includes('android')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
  }
  if (n.includes('flight') || n.includes('trip') || n.includes('travel')) {
    return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80';
  }
  // Generic fallback
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
};

export const ProductTracker: React.FC<ProductTrackerProps> = ({ products, setProducts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [analysis, setAnalysis] = useState<Record<string, string>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', url: '', price: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      url: newProduct.url,
      currentPrice: Number(newProduct.price),
      originalPrice: Number(newProduct.price) * 1.1, // Simulated
      targetPrice: Number(newProduct.price) * 0.9,
      category: 'electronics', // Defaulting for simplicity
      imageUrl: getProductImage(newProduct.name),
      history: [{ date: new Date().toISOString(), price: Number(newProduct.price) }],
      tags: ['new']
    };
    setProducts([product, ...products]);
    // Persist to Supabase if configured
    try { await insertProduct(product); } catch {}
    setIsAdding(false);
    setNewProduct({ name: '', url: '', price: '' });
  };

  const handleAnalyze = async (product: Product) => {
    setLoadingAnalysis(product.id);
    const result = await analyzeProductValue(product);
    setAnalysis(prev => ({ ...prev, [product.id]: result }));
    setLoadingAnalysis(null);
  };

  const handleDelete = async (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    try { await deleteProduct(id); } catch {}
  };

  const handleShare = (product: Product) => {
    const text = `Check out this deal! ${product.name} is currently $${product.currentPrice} at ${product.url}`;
    navigator.clipboard.writeText(text);
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-2xl p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm">
      
      <div className="space-y-8 pb-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Price Tracker</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor price changes and get AI insights</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 flex items-center gap-2 transition-colors shadow-sm w-max"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>

        {/* Add Product Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-top-4 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                <input 
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-slate-900 dark:text-white"
                  placeholder="e.g. iPad Air 5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
                <input 
                  required
                  type="url"
                  value={newProduct.url}
                  onChange={e => setNewProduct({...newProduct, url: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-slate-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Current Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400">$</span>
                  <input 
                    required
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full pl-6 pr-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-slate-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500">Track Item</button>
            </div>
          </form>
        )}

        {/* Product List */}
        <div className="grid gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col md:flex-row transition-colors group">
              <div className="w-full md:w-56 h-48 md:h-auto relative bg-slate-100 dark:bg-slate-900 flex-shrink-0 overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 left-2">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${CATEGORY_COLORS[product.category]}`}>
                     {product.category}
                   </span>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                    <a href={product.url} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:underline flex items-center gap-1 mt-1">
                      Visit Store <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">${product.currentPrice}</div>
                    {product.currentPrice < product.originalPrice && (
                      <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        Save ${(product.originalPrice - product.currentPrice).toFixed(0)}
                      </div>
                    )}
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Target: ${product.targetPrice}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Price History</h4>
                    <PriceChart data={product.history} />
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 relative border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">AI Analysis</h4>
                       <button 
                         onClick={() => handleAnalyze(product)}
                         disabled={loadingAnalysis === product.id}
                         className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 p-1 rounded transition-colors"
                       >
                         <RefreshCw size={14} className={loadingAnalysis === product.id ? 'animate-spin' : ''} />
                       </button>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      {loadingAnalysis === product.id 
                        ? "Consulting market data..." 
                        : analysis[product.id] || "Click refresh to get an AI opinion on this price point based on historical trends."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button 
                    onClick={() => handleShare(product)}
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    {copiedId === product.id ? <Check size={16} /> : <Share2 size={16} />} 
                    {copiedId === product.id ? 'Copied!' : 'Share'}
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={16} /> Stop Tracking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
