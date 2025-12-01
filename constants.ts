
import { Product, Trip, Notification } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'electronics',
    currentPrice: 348.00,
    originalPrice: 399.00,
    targetPrice: 299.00,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    url: 'https://example.com/sony-headphones',
    history: [
      { date: '2023-10-01', price: 399 },
      { date: '2023-11-01', price: 399 },
      { date: '2023-12-01', price: 348 },
      { date: '2024-01-01', price: 348 },
      { date: '2024-02-01', price: 329 },
      { date: '2024-03-01', price: 348 },
    ],
    tags: ['noise-canceling', 'audio', 'tech']
  },
  {
    id: '2',
    name: 'Herman Miller Aeron Chair',
    category: 'home',
    currentPrice: 1250.00,
    originalPrice: 1600.00,
    targetPrice: 1000.00,
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80',
    url: 'https://example.com/chair',
    history: [
      { date: '2023-10-01', price: 1600 },
      { date: '2023-12-15', price: 1450 },
      { date: '2024-01-10', price: 1250 },
    ],
    tags: ['ergonomic', 'office', 'furniture']
  },
  {
    id: '3',
    name: 'Flight: NYC to Tokyo (JAL)',
    category: 'travel',
    currentPrice: 1450.00,
    originalPrice: 2100.00,
    targetPrice: 1200.00,
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    url: 'https://example.com/flight-nyc-tokyo',
    history: [
      { date: '2024-01-01', price: 2100 },
      { date: '2024-01-15', price: 1800 },
      { date: '2024-02-01', price: 1450 },
      { date: '2024-02-15', price: 1550 },
    ],
    tags: ['flight', 'international', 'vacation']
  }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    origin: 'New York, USA',
    destination: 'Kyoto, Japan',
    startDate: '2024-04-10',
    endDate: '2024-04-24',
    tripType: 'round-trip',
    budget: 5000,
    currency: 'USD',
    travelers: 2,
    estimatedCost: 4200,
    status: 'planning',
    activities: ['Temple Visit', 'Tea Ceremony', 'Bamboo Forest'],
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    preferences: {
      needsHotel: true,
      needsCar: false
    }
  },
  {
    id: 't2',
    origin: 'London, UK',
    destination: 'Iceland Ring Road',
    startDate: '2024-08-01',
    endDate: '2024-08-10',
    tripType: 'round-trip',
    budget: 3500,
    currency: 'USD',
    travelers: 2,
    estimatedCost: 3800,
    status: 'planning',
    activities: ['Glacier Hike', 'Blue Lagoon', 'Northern Lights'],
    imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80',
    preferences: {
      needsHotel: true,
      needsCar: true
    }
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Price Drop Alert!',
    message: 'Sony WH-1000XM5 has dropped to $348.00 (13% off).',
    type: 'price_drop',
    isRead: false,
    timestamp: '10 mins ago'
  },
  {
    id: '2',
    title: 'Trip Recommendation',
    message: 'Flights to Kyoto are trending cheaper for April.',
    type: 'trip_alert',
    isRead: false,
    timestamp: '2 hours ago'
  },
  {
    id: '3',
    title: 'Welcome to Trackifly',
    message: 'Start tracking products to see your dashboard come alive.',
    type: 'system',
    isRead: true,
    timestamp: '1 day ago'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  electronics: 'text-blue-600 bg-blue-50',
  clothing: 'text-pink-600 bg-pink-50',
  travel: 'text-indigo-600 bg-indigo-50',
  home: 'text-emerald-600 bg-emerald-50',
};
