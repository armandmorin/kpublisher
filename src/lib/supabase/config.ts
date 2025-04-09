import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string;
  subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  subscription_plan?: 'monthly' | 'yearly' | null;
};

export type Book = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type BookCover = {
  id: string;
  image_url: string;
  prompt: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type ApiKey = {
  id: string;
  service: 'openai' | 'ideogram' | 'stripe';
  api_key: string;
  created_at: string;
  updated_at: string;
};

export type Assistant = {
  id: string;
  name: string;
  openai_assistant_id: string;
  created_at: string;
  updated_at: string;
};
