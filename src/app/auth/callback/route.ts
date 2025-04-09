import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabaseUrl = 'https://tvzpyrzrmcbkibanfbdb.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2enB5cnpybWNia2liYW5mYmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDU5NTIsImV4cCI6MjA1OTcyMTk1Mn0.NBf3hFHMxbbcorULSBuuVw8XQY_9Zw3nqrydKDLFWUA';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
