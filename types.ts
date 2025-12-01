
export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'electronics' | 'clothing' | 'travel' | 'home';
  currentPrice: number;
  originalPrice: number;
  targetPrice: number;
  imageUrl: string;
  url: string;
  history: PricePoint[];
  tags: string[];
}

export interface TripPreferences {
  needsHotel: boolean;
  needsCar: boolean;
  dietaryRestrictions?: string;
}

// Structured Trip Data for the new UI
export interface FlightOption {
  airline: string;
  price: string;
  duration: string;
  departureTime: string;
}

export interface HotelOption {
  name: string;
  pricePerNight: string;
  rating: string;
  location: string;
  description: string;
}

export interface CarRentalOption {
  company: string;
  carType: string;
  dailyRate: string;
}

export interface FoodRecommendation {
  name: string;
  cuisine: string;
  priceRange: string;
  description: string;
  mustTry: string;
}

export interface DailyActivity {
  time: string;
  activity: string;
  location: string;
}

export interface DayPlan {
  day: number;
  title: string;
  schedule: DailyActivity[];
}

export interface TripPlan {
  summary: string;
  flights: FlightOption[];
  hotels: HotelOption[];
  carRentals: CarRentalOption[];
  food: FoodRecommendation[];
  dailyItinerary: DayPlan[];
  totalEstimatedCost: string;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  tripType: 'round-trip' | 'one-way';
  travelers: number;
  budget: number;
  currency: string;
  estimatedCost: number;
  status: 'planning' | 'booked' | 'completed';
  activities: string[]; // Legacy support
  structuredPlan?: TripPlan; // New structured support
  imageUrl?: string;
  preferences: TripPreferences;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  type: 'guest' | 'auth';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'trip_alert' | 'system';
  isRead: boolean;
  timestamp: string;
}

export type ViewState = 'dashboard' | 'tracker' | 'coupons' | 'trips' | 'chat' | 'settings' | 'help';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hu' | 'ur' | 'ar' | 'zh' | 'hi' | 'pt';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'HUF' | 'INR' | 'AED';
