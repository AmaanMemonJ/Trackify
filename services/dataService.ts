import { supabase } from './supabaseClient';
import { Product, Trip } from '../types';

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('id,name,url,currentprice,targetprice,imageurl,category,status,history,originalprice,tags')
    .order('id', { ascending: false });
  if (error || !data) return [];
  return (data as any[]).map(row => ({
    id: row.id,
    name: row.name,
    url: row.url,
    currentPrice: Number(row.currentprice ?? 0),
    originalPrice: Number(row.originalprice ?? row.currentprice ?? 0),
    targetPrice: Number(row.targetprice ?? 0),
    imageUrl: row.imageurl ?? '',
    category: (row.category ?? 'electronics'),
    history: Array.isArray(row.history) ? row.history : (typeof row.history === 'string' ? JSON.parse(row.history) : []),
    tags: row.tags ?? []
  }));
}

export async function insertProduct(product: Product): Promise<boolean> {
  if (!supabase) return false;
  const payload = {
    id: product.id,
    name: product.name,
    url: product.url,
    currentprice: product.currentPrice,
    originalprice: product.originalPrice,
    targetprice: product.targetPrice,
    imageurl: product.imageUrl,
    category: product.category,
    status: 'active',
    history: product.history
  };
  const { error } = await supabase.from('products').insert(payload);
  return !error;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('products').delete().eq('id', id);
  return !error;
}

export async function fetchTrips(): Promise<Trip[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('trips')
    .select('id,destination,startdate,enddate,budget,estimatedcost,itinerary,notes,origin,roundtrip,people,needshotel,dietary,currency,status,activities,structuredplan,imageurl,preferences,triptype,travelers')
    .order('id', { ascending: false });
  if (error || !data) return [];
  return (data as any[]).map(row => ({
    id: row.id,
    origin: row.origin ?? '',
    destination: row.destination ?? '',
    startDate: row.startdate ?? '',
    endDate: row.enddate ?? '',
    tripType: row.triptype ?? (row.roundtrip ? 'round-trip' : 'one-way'),
    travelers: Number(row.travelers ?? row.people ?? 1),
    budget: Number(row.budget ?? 0),
    currency: row.currency ?? 'USD',
    estimatedCost: Number(row.estimatedcost ?? 0),
    status: row.status ?? 'planning',
    activities: Array.isArray(row.activities) ? row.activities : [],
    structuredPlan: row.structuredplan ? (typeof row.structuredplan === 'string' ? JSON.parse(row.structuredplan) : row.structuredplan) : undefined,
    imageUrl: row.imageurl ?? undefined,
    preferences: row.preferences ?? { needsHotel: !!row.needshotel, needsCar: false, dietaryRestrictions: row.dietary ?? undefined }
  }));
}

export async function insertTrip(trip: Trip): Promise<boolean> {
  if (!supabase) return false;
  const payload = {
    id: trip.id,
    origin: trip.origin,
    destination: trip.destination,
    startdate: trip.startDate,
    enddate: trip.endDate,
    budget: trip.budget,
    estimatedcost: trip.estimatedCost,
    itinerary: trip.structuredPlan ? JSON.stringify(trip.structuredPlan) : '',
    notes: '',
    roundtrip: trip.tripType === 'round-trip',
    people: trip.travelers,
    needshotel: trip.preferences?.needsHotel ?? false,
    dietary: trip.preferences?.dietaryRestrictions ?? null,
    currency: trip.currency ?? 'USD',
    status: trip.status ?? 'planning',
    activities: trip.activities ?? [],
    structuredplan: trip.structuredPlan ?? null,
    imageurl: trip.imageUrl ?? null,
    preferences: trip.preferences ?? null,
    triptype: trip.tripType,
    travelers: trip.travelers
  };
  const { error } = await supabase.from('trips').insert(payload);
  return !error;
}
