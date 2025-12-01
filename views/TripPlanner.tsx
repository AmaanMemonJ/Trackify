
import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Plus, Compass, Users, Car, BedDouble, Utensils, WheatOff, Plane, CheckCircle2, Clock, Download, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { Trip, Language, Currency, TripPlan } from '../types';
import { generateTripItinerary } from '../services/geminiService';
import { insertTrip } from '../services/dataService';
import { t, CURRENCIES } from '../utils/i18n';

interface TripPlannerProps {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  language: Language;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const getDestinationImage = (destination: string): string => {
  const d = destination.toLowerCase();
  if (d.includes('japan') || d.includes('tokyo') || d.includes('kyoto')) {
    return 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80';
  }
  if (d.includes('paris') || d.includes('france')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';
  }
  if (d.includes('london') || d.includes('uk') || d.includes('england')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80';
  }
  if (d.includes('new york') || d.includes('nyc')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?auto=format&fit=crop&w=800&q=80';
  }
  if (d.includes('iceland')) {
    return 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80';
  }
  if (d.includes('italy') || d.includes('rome')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80';
  }
  if (d.includes('dubai') || d.includes('uae')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea904acfb5a?auto=format&fit=crop&w=800&q=80';
  }
  // Generic travel image
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
};

type ViewSection = 'roadmap' | 'flights' | 'hotels' | 'food' | 'cars';

export const TripPlanner: React.FC<TripPlannerProps> = ({ trips, setTrips, language, currency, setCurrency }) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [activeSection, setActiveSection] = useState<ViewSection>('roadmap');
  
  const [formData, setFormData] = useState({ 
    origin: '', 
    destination: '', 
    budget: '', 
    startDate: '',
    endDate: '',
    travelers: 1,
    tripType: 'round-trip' as 'round-trip' | 'one-way',
    needsHotel: false,
    needsCar: false,
    dietaryRestrictions: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<TripPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedPlan(null);
    
    const result = await generateTripItinerary({
      ...formData,
      budget: Number(formData.budget),
      currency: currency,
      preferences: {
        needsHotel: formData.needsHotel,
        needsCar: formData.needsCar,
        dietaryRestrictions: formData.dietaryRestrictions
      }
    }, language);
    
    setGeneratedPlan(result);
    setIsGenerating(false);
    setActiveSection('roadmap');
  };

  const saveTrip = async () => {
    if (!generatedPlan) return;
    
    const newTrip: Trip = {
      id: Date.now().toString(),
      origin: formData.origin,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      tripType: formData.tripType,
      budget: Number(formData.budget),
      currency: currency,
      travelers: formData.travelers,
      estimatedCost: Number(formData.budget) * 0.95, // Simulated or parsed from generatedPlan.totalEstimatedCost
      status: 'planning',
      activities: generatedPlan.dailyItinerary.flatMap(d => d.schedule.map(s => s.activity)),
      structuredPlan: generatedPlan,
      imageUrl: getDestinationImage(formData.destination),
      preferences: {
        needsHotel: formData.needsHotel,
        needsCar: formData.needsCar,
        dietaryRestrictions: formData.dietaryRestrictions
      }
    };
    
    setTrips([newTrip, ...trips]);
    try { await insertTrip(newTrip); } catch {}
    setActiveTab('existing');
    // Reset form partial
    setFormData(prev => ({ ...prev, destination: '', budget: '', startDate: '', endDate: '', dietaryRestrictions: '' }));
    setGeneratedPlan(null);
  };

  const downloadItinerary = () => {
    if (!generatedPlan) return;
    
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(generatedPlan, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `Trip-to-${formData.destination || 'Unknown'}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const RoadmapView = ({ plan }: { plan: TripPlan }) => (
    <div className="space-y-6">
       <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
         <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Trip Summary</h4>
         <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{plan.summary}</p>
         <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
           Est. Total Cost: {plan.totalEstimatedCost}
         </div>
       </div>

       <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 py-2">
         {plan.dailyItinerary.map((day, idx) => (
           <div key={idx} className="relative pl-8">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900"></div>
             
             <h4 className="font-bold text-slate-900 dark:text-white mb-1">
               Day {day.day}: {day.title}
             </h4>
             
             <div className="space-y-3 mt-3">
               {day.schedule.map((item, i) => (
                 <div key={i} className="flex gap-3 items-start bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                   <div className="text-xs font-medium text-slate-500 dark:text-slate-400 w-16 pt-0.5 flex-shrink-0 flex items-center gap-1">
                     <Clock size={12} /> {item.time}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.activity}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                       <MapPin size={10} /> {item.location}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ))}
       </div>
    </div>
  );

  const SectionButton = ({ id, label, icon: Icon }: { id: ViewSection, label: string, icon: any }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
        activeSection === id
          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
      }`}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/30 rounded-2xl p-6 md:p-8 border border-white/50 dark:border-slate-800/50 shadow-sm">
      
      <div className="space-y-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="text-indigo-600 dark:text-indigo-400 hidden md:block" />
              {t(language, 'tripPlanner')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Organize your adventure from {formData.origin || 'home'} to anywhere.</p>
          </div>
          <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg w-max">
            <button 
              onClick={() => setActiveTab('existing')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'existing' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t(language, 'myTrips')}
            </button>
            <button 
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'new' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t(language, 'planNew')}
            </button>
          </div>
        </div>

        {activeTab === 'new' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-6">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} /> AI Trip Generator
                </h3>
                <form onSubmit={handleGenerate} className="space-y-5">
                  
                  {/* Trip Type Selector */}
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg w-full md:w-max">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tripType: 'round-trip' })}
                      className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        formData.tripType === 'round-trip' 
                          ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <ArrowLeftRight size={14} /> Round Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tripType: 'one-way' })}
                      className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        formData.tripType === 'one-way' 
                          ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <ArrowRight size={14} /> One Way
                    </button>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From (Origin)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                          required
                          value={formData.origin}
                          onChange={e => setFormData({...formData, origin: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To (Destination)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 text-indigo-500" size={18} />
                        <input 
                          required
                          value={formData.destination}
                          onChange={e => setFormData({...formData, destination: e.target.value})}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Depart</label>
                      <input 
                        required
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${formData.tripType === 'one-way' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        Return {formData.tripType === 'one-way' && '(Optional)'}
                      </label>
                      <input 
                        required={formData.tripType === 'round-trip'}
                        disabled={formData.tripType === 'one-way'}
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                        className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-opacity ${formData.tripType === 'one-way' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Budget & Travelers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget</label>
                       <div className="flex">
                         <input 
                           required
                           type="number"
                           value={formData.budget}
                           onChange={e => setFormData({...formData, budget: e.target.value})}
                           className="w-full px-3 py-2 border border-r-0 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                           placeholder="2000"
                         />
                         <select
                           value={currency}
                           onChange={(e) => setCurrency(e.target.value as Currency)}
                           className="bg-slate-100 dark:bg-slate-800 border border-l-0 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-r-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                         >
                           {CURRENCIES.map((curr) => (
                             <option key={curr} value={curr}>{curr}</option>
                           ))}
                         </select>
                       </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Travelers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                          required
                          type="number"
                          min="1"
                          value={formData.travelers}
                          onChange={e => setFormData({...formData, travelers: parseInt(e.target.value)})}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dietary Restrictions / Allergens</label>
                    <div className="relative">
                      <WheatOff className="absolute left-3 top-2.5 text-slate-400" size={18} />
                      <input 
                        type="text"
                        value={formData.dietaryRestrictions}
                        onChange={e => setFormData({...formData, dietaryRestrictions: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                        placeholder="e.g. Vegetarian, Gluten-free, Nut allergy"
                      />
                    </div>
                  </div>

                  {/* Preferences Checkboxes */}
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-1">
                      <input 
                        type="checkbox"
                        checked={formData.needsHotel}
                        onChange={e => setFormData({...formData, needsHotel: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <BedDouble size={16} /> Need Hotel?
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-1">
                      <input 
                        type="checkbox"
                        checked={formData.needsCar}
                        onChange={e => setFormData({...formData, needsCar: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Car size={16} /> Need Car?
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
                  >
                    {isGenerating ? 'Designing Itinerary...' : t(language, 'generatePlan')}
                    {!isGenerating && <Sparkles size={16} />}
                  </button>
                </form>
              </div>
            </div>

            {/* Structured Itinerary Result */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[600px] flex flex-col transition-colors overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">Trip Plan</h3>
                {generatedPlan && (
                   <div className="flex gap-2">
                     <button onClick={downloadItinerary} className="text-xs flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                       <Download size={12} /> Export
                     </button>
                     <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                       {formData.destination}
                     </span>
                   </div>
                )}
              </div>

              {generatedPlan ? (
                <>
                  <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/50 p-2 gap-1 overflow-x-auto">
                    <SectionButton id="roadmap" label="Roadmap" icon={MapPin} />
                    <SectionButton id="flights" label="Flights" icon={Plane} />
                    <SectionButton id="hotels" label="Hotels" icon={BedDouble} />
                    <SectionButton id="food" label="Food" icon={Utensils} />
                    <SectionButton id="cars" label="Rental" icon={Car} />
                  </div>

                  <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {activeSection === 'roadmap' && <RoadmapView plan={generatedPlan} />}
                    
                    {activeSection === 'flights' && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Flight Options ({formData.tripType === 'round-trip' ? 'Round Trip' : 'One Way'})</h4>
                        {generatedPlan.flights.map((flight, idx) => (
                          <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex justify-between items-center bg-white dark:bg-slate-800">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{flight.airline}</p>
                              <p className="text-sm text-slate-500">{flight.duration} • {flight.departureTime}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{flight.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeSection === 'hotels' && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Where to Stay</h4>
                        {generatedPlan.hotels.map((hotel, idx) => (
                          <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-slate-900 dark:text-white">{hotel.name}</h5>
                              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{hotel.pricePerNight}</span>
                            </div>
                            <p className="text-xs text-yellow-500 mb-2">★ {hotel.rating}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{hotel.description}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} /> {hotel.location}</p>
                          </div>
                        ))}
                        {generatedPlan.hotels.length === 0 && <p className="text-sm text-slate-500">No hotel options requested.</p>}
                      </div>
                    )}

                    {activeSection === 'food' && (
                      <div className="space-y-4">
                         <h4 className="font-bold text-slate-900 dark:text-white mb-2">Food Recommendations</h4>
                         {generatedPlan.food.map((food, idx) => (
                            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800">
                               <div className="flex justify-between">
                                  <h5 className="font-bold text-slate-900 dark:text-white">{food.name}</h5>
                                  <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{food.priceRange}</span>
                               </div>
                               <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{food.cuisine}</p>
                               <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{food.description}</p>
                               <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                 <CheckCircle2 size={12} /> Must try: {food.mustTry}
                               </div>
                            </div>
                         ))}
                      </div>
                    )}

                    {activeSection === 'cars' && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Car Rentals</h4>
                        {generatedPlan.carRentals.map((car, idx) => (
                          <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 flex justify-between items-center">
                             <div>
                               <p className="font-bold text-slate-900 dark:text-white">{car.company}</p>
                               <p className="text-sm text-slate-500">{car.carType}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{car.dailyRate}</p>
                               <p className="text-xs text-slate-400">per day</p>
                             </div>
                          </div>
                        ))}
                         {generatedPlan.carRentals.length === 0 && <p className="text-sm text-slate-500">No car rental requested.</p>}
                      </div>
                    )}

                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <button onClick={saveTrip} className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      Save to My Trips
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                  <MapPin size={48} className="mb-4 opacity-20" />
                  <p>Enter details to generate your trip plan</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                  <img 
                    src={trip.imageUrl || `https://picsum.photos/400/200?random=${trip.id}`} 
                    alt={trip.destination} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-200">
                    {trip.status.toUpperCase()}
                  </div>
                  {trip.tripType === 'one-way' && (
                     <div className="absolute top-3 left-3 bg-indigo-600 px-2 py-1 rounded text-xs font-bold text-white shadow-sm flex items-center gap-1">
                       <ArrowRight size={10} /> One Way
                     </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{trip.destination}</h3>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4 gap-2">
                    <Calendar size={12} />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} 
                      {trip.tripType === 'round-trip' && ` - ${new Date(trip.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Budget ({trip.currency || currency})</span>
                      <span className="font-medium text-slate-900 dark:text-slate-200">{trip.budget}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Travelers</span>
                      <span className="font-medium text-slate-900 dark:text-slate-200 flex items-center gap-1">
                        <Users size={12} /> {trip.travelers}
                      </span>
                    </div>
                    {/* Visual Progress Bar for Budget */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${trip.estimatedCost > trip.budget ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((trip.estimatedCost / trip.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {trip.preferences?.needsHotel && <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">Hotel</span>}
                      {trip.preferences?.needsCar && <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">Car</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setActiveTab('new')}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all min-h-[300px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium">{t(language, 'planNew')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
