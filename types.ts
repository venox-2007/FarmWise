
export type Language = 'en' | 'hi' | 'mr' | 'pa' | 'bn' | 'gu' | 'ta' | 'te' | 'kn' | 'ml' | 'or';

export type UserRole = 'farmer' | 'consumer';

export interface User {
  name: string;
  phone: string;
  location: string;
  role: UserRole;
}

export interface DiagnosisResult {
  diseaseName: string;
  marathiName: string; // Kept for backward compat
  confidence: number;
  symptoms: string[];
  explanation: string;
  treatment: string[];
  fertilizerAdvice: string;
}

export interface MarketItem {
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
}

export interface InputProduct {
  id: string;
  name: string;
  category: 'Fertilizer' | 'Pesticide' | 'Seeds' | 'Tools' | 'Vegetables' | 'Grains' | 'Fruits';
  price: number;
  image: string;
  description: string;
  unit: string;
}

export interface CartItem extends InputProduct {
  quantity: number;
}

export interface FarmerListing {
  id: string;
  crop: string;
  quantity: string;
  price: string;
  date: string;
}

export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  code: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  alert?: string;
  rainfallProbability: number;
  forecast: ForecastDay[];
}

export enum AppView {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  CAMERA = 'CAMERA',
  ANALYSIS = 'ANALYSIS',
  MARKET = 'MARKET',
  SCHEMES = 'SCHEMES',
  CART = 'CART',
  LIVE = 'LIVE'
}

export interface Scheme {
  name: string;
  localName: string;
  benefits: string;
  eligibility: string;
  link: string;
}
