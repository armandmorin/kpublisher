import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase URL and key for deployment
const supabaseUrl = 'https://tvzpyrzrmcbkibanfbdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2enB5cnpybWNia2liYW5mYmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDU5NTIsImV4cCI6MjA1OTcyMTk1Mn0.NBf3hFHMxbbcorULSBuuVw8XQY_9Zw3nqrydKDLFWUA';

// Create a single supabase client for the browser with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

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
