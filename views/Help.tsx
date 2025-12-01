import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, MessageSquare, Mail, Search, FileQuestion } from 'lucide-react';

export const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const faqs = [
    {
      question: "How does the Price Tracker work?",
      answer: "We monitor product URLs you provide. Our system scans these pages periodically (every 6-12 hours) to detect price changes. When a price drops below your target, we send you a notification."
    },
    {
      question: "Is the AI Trip Planner free?",
      answer: "Yes! The basic AI trip generation is free for all users. It uses advanced models to structure itineraries based on your budget and preferences."
    },
    {
      question: "Can I book flights directly through Trackifly?",
      answer: "Currently, Trackifly is a planning and discovery tool. We provide links to third-party booking sites (airlines, hotels) but do not handle transactions directly."
    },
    {
      question: "How do I change my currency?",
      answer: "You can change your preferred currency in the top navigation bar (wallet icon) or in the Settings page under 'Regional Settings'."
    },
    {
      question: "What happens if a coupon doesn't work?",
      answer: "Our AI Coupon Finder scans the web for likely codes, but retailers change active coupons frequently. We recommend trying multiple codes from the list provided."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 rounded-2xl p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How can we help you?</h2>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              placeholder="Search for answers..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileQuestion size={20} className="text-indigo-600 dark:text-indigo-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all shadow-sm"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    {faq.question}
                    {openFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-2 bg-slate-50/50 dark:bg-slate-900/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-indigo-600 dark:text-indigo-400" />
              Contact Support
            </h3>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {isSent ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                    <Send size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Message Sent!</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic</label>
                    <select 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                    >
                      <option value="" disabled>Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="bug">Report a Bug</option>
                      <option value="billing">Billing Issue</option>
                      <option value="feature">Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white resize-none"
                      placeholder="Describe your issue or suggestion..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};