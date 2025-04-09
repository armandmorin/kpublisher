const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with the service role key for admin access
const supabaseUrl = 'https://tvzpyrzrmcbkibanfbdb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2enB5cnpybWNia2liYW5mYmRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNDU5NTIsImV4cCI6MjA1OTcyMTk1Mn0.NBf3hFHMxbbcorULSBuuVw8XQY_9Zw3nqrydKDLFWUA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Step 1: Drop and recreate the users table
    console.log('Setting up users table...');
    const { error: dropUsersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Drop the users table if it exists
        DROP TABLE IF EXISTS public.users CASCADE;

        -- Create users table
        CREATE TABLE public.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          stripe_customer_id TEXT,
          subscription_status TEXT CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', NULL)),
          subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly', NULL)),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Set up RLS for the users table
        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        -- Create policies for the users table
        CREATE POLICY "Users can view their own data" ON public.users
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Admins can view all user data" ON public.users
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can update user data" ON public.users
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        -- Add a temporary policy to allow public access to users table
        CREATE POLICY "Allow public access to users table" ON public.users
          FOR SELECT
          USING (true);
      `
    });

    if (dropUsersError) {
      console.error('Error setting up users table:', dropUsersError);
      return;
    }

    // Step 2: Create function to handle user creation
    console.log('Setting up user creation function and trigger...');
    const { error: createFunctionError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create function to handle user creation
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.users (id, email, role)
          VALUES (NEW.id, NEW.email, 'user');
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create trigger for new user creation
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

        -- Create function to update the updated_at timestamp
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger for updated_at column
        DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON public.users
          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
      `
    });

    if (createFunctionError) {
      console.error('Error setting up functions and triggers:', createFunctionError);
      return;
    }

    // Step 3: Create other tables
    console.log('Setting up other tables...');
    const { error: createTablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create books table
        CREATE TABLE IF NOT EXISTS public.books (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Create book_covers table
        CREATE TABLE IF NOT EXISTS public.book_covers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          image_url TEXT NOT NULL,
          prompt TEXT NOT NULL,
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Create api_keys table
        CREATE TABLE IF NOT EXISTS public.api_keys (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          service TEXT NOT NULL CHECK (service IN ('openai', 'ideogram', 'stripe')),
          api_key TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          UNIQUE (service)
        );

        -- Create assistants table
        CREATE TABLE IF NOT EXISTS public.assistants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          openai_assistant_id TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );

        -- Create subscription_plans table
        CREATE TABLE IF NOT EXISTS public.subscription_plans (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price INTEGER NOT NULL,
          interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
          features TEXT[] NOT NULL,
          active BOOLEAN NOT NULL DEFAULT true,
          stripe_price_id TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    });

    if (createTablesError) {
      console.error('Error setting up other tables:', createTablesError);
      return;
    }

    // Step 4: Set up RLS for other tables
    console.log('Setting up RLS for other tables...');
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Books table policies
        ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own books" ON public.books
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own books" ON public.books
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own books" ON public.books
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own books" ON public.books
          FOR DELETE USING (auth.uid() = user_id);

        -- Book covers table policies
        ALTER TABLE public.book_covers ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own book covers" ON public.book_covers
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own book covers" ON public.book_covers
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own book covers" ON public.book_covers
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own book covers" ON public.book_covers
          FOR DELETE USING (auth.uid() = user_id);

        -- API keys table policies
        ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Anyone can view API keys" ON public.api_keys
          FOR SELECT USING (true);

        CREATE POLICY "Admins can insert API keys" ON public.api_keys
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can update API keys" ON public.api_keys
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can delete API keys" ON public.api_keys
          FOR DELETE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        -- Assistants table policies
        ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Anyone can view assistants" ON public.assistants
          FOR SELECT USING (true);

        CREATE POLICY "Admins can insert assistants" ON public.assistants
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can update assistants" ON public.assistants
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can delete assistants" ON public.assistants
          FOR DELETE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        -- Subscription plans table policies
        ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
          FOR SELECT USING (true);

        CREATE POLICY "Admins can insert subscription plans" ON public.subscription_plans
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can update subscription plans" ON public.subscription_plans
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );

        CREATE POLICY "Admins can delete subscription plans" ON public.subscription_plans
          FOR DELETE USING (
            EXISTS (
              SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
            )
          );
      `
    });

    if (rlsError) {
      console.error('Error setting up RLS for other tables:', rlsError);
      return;
    }

    // Step 5: Create a new admin user
    console.log('Creating admin user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'Password123!',
    });

    if (signUpError) {
      console.error('Error creating admin user:', signUpError);
      return;
    }

    console.log('Admin user created with ID:', signUpData.user.id);

    // Step 6: Set the user as admin
    console.log('Setting user as admin...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', signUpData.user.id);

    if (updateError) {
      console.error('Error setting user as admin:', updateError);
      return;
    }

    // Step 7: Add initial data
    console.log('Adding initial data...');
    const { error: apiKeysError } = await supabase
      .from('api_keys')
      .insert([
        { service: 'openai', api_key: 'sk-openai-12345678901234567890abcdefghijklmnopqrstuvwxyz' },
        { service: 'ideogram', api_key: 'api_org_12345678901234567890abcdefghijklmnopqrstuvwxyz' },
        { service: 'stripe', api_key: 'sk_test_51OxYzLCRMb5PN61234567890abcdefghijklmnopqrstuvwxyz' }
      ]);

    if (apiKeysError) {
      console.error('Error adding API keys:', apiKeysError);
      return;
    }

    const { error: assistantError } = await supabase
      .from('assistants')
      .insert([
        { name: 'Book Writer', openai_assistant_id: 'asst_12345678901234567890abcdefghijklmnopqrstuvwxyz' }
      ]);

    if (assistantError) {
      console.error('Error adding assistant:', assistantError);
      return;
    }

    const { error: plansError } = await supabase
      .from('subscription_plans')
      .insert([
        {
          name: 'Basic Monthly',
          description: 'Basic plan with essential features',
          price: 999,
          interval: 'month',
          features: ['Create up to 5 books', 'Generate up to 10 covers', 'Basic AI assistance'],
          active: true,
          stripe_price_id: 'price_1234567890abcdefghijklmn'
        },
        {
          name: 'Premium Monthly',
          description: 'Premium plan with advanced features',
          price: 1999,
          interval: 'month',
          features: ['Create unlimited books', 'Generate unlimited covers', 'Advanced AI assistance', 'Priority support'],
          active: true,
          stripe_price_id: 'price_2345678901abcdefghijklmn'
        }
      ]);

    if (plansError) {
      console.error('Error adding subscription plans:', plansError);
      return;
    }

    console.log('Database setup completed successfully!');
    console.log('You can now log in with:');
    console.log('Email: admin@example.com');
    console.log('Password: Password123!');

  } catch (error) {
    console.error('Unexpected error during database setup:', error);
  }
}

setupDatabase();
