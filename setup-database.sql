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

-- Drop this policy to avoid infinite recursion
DROP POLICY IF EXISTS "Admins can view all user data" ON public.users;

-- Drop this policy to avoid infinite recursion
DROP POLICY IF EXISTS "Admins can update user data" ON public.users;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Admins can update user data" ON public.users
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Add a temporary policy to allow public access to users table
CREATE POLICY "Allow public access to users table" ON public.users
  FOR SELECT
  USING (true);

-- Add a policy to allow inserting users
CREATE POLICY "Allow inserting users" ON public.users
  FOR INSERT
  WITH CHECK (true);

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

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own books" ON public.books;
DROP POLICY IF EXISTS "Users can insert their own books" ON public.books;
DROP POLICY IF EXISTS "Users can update their own books" ON public.books;
DROP POLICY IF EXISTS "Users can delete their own books" ON public.books;

DROP POLICY IF EXISTS "Users can view their own book covers" ON public.book_covers;
DROP POLICY IF EXISTS "Users can insert their own book covers" ON public.book_covers;
DROP POLICY IF EXISTS "Users can update their own book covers" ON public.book_covers;
DROP POLICY IF EXISTS "Users can delete their own book covers" ON public.book_covers;

DROP POLICY IF EXISTS "Anyone can view API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Admins can insert API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Admins can update API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Admins can delete API keys" ON public.api_keys;

DROP POLICY IF EXISTS "Anyone can view assistants" ON public.assistants;
DROP POLICY IF EXISTS "Admins can insert assistants" ON public.assistants;
DROP POLICY IF EXISTS "Admins can update assistants" ON public.assistants;
DROP POLICY IF EXISTS "Admins can delete assistants" ON public.assistants;

DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can insert subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can update subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can delete subscription plans" ON public.subscription_plans;

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

-- Use a simpler approach for admin policies to avoid recursion
CREATE POLICY "Admins can insert API keys" ON public.api_keys
  FOR INSERT WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update API keys" ON public.api_keys
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete API keys" ON public.api_keys
  FOR DELETE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Assistants table policies
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view assistants" ON public.assistants
  FOR SELECT USING (true);

-- Use a simpler approach for admin policies to avoid recursion
CREATE POLICY "Admins can insert assistants" ON public.assistants
  FOR INSERT WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update assistants" ON public.assistants
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete assistants" ON public.assistants
  FOR DELETE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Subscription plans table policies
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (true);

-- Use a simpler approach for admin policies to avoid recursion
CREATE POLICY "Admins can insert subscription plans" ON public.subscription_plans
  FOR INSERT WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update subscription plans" ON public.subscription_plans
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete subscription plans" ON public.subscription_plans
  FOR DELETE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Create triggers for updated_at columns for other tables
DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_book_covers_updated_at ON public.book_covers;
CREATE TRIGGER update_book_covers_updated_at
  BEFORE UPDATE ON public.book_covers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_assistants_updated_at ON public.assistants;
CREATE TRIGGER update_assistants_updated_at
  BEFORE UPDATE ON public.assistants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data

-- Insert API keys
INSERT INTO public.api_keys (service, api_key)
VALUES 
  ('openai', 'sk-openai-12345678901234567890abcdefghijklmnopqrstuvwxyz'),
  ('ideogram', 'api_org_12345678901234567890abcdefghijklmnopqrstuvwxyz'),
  ('stripe', 'sk_test_51OxYzLCRMb5PN61234567890abcdefghijklmnopqrstuvwxyz')
ON CONFLICT (service) DO UPDATE
SET api_key = EXCLUDED.api_key;

-- Insert a default assistant
INSERT INTO public.assistants (name, openai_assistant_id)
VALUES ('Book Writer', 'asst_12345678901234567890abcdefghijklmnopqrstuvwxyz')
ON CONFLICT DO NOTHING;

-- Insert subscription plans
INSERT INTO public.subscription_plans (
  name, 
  description, 
  price, 
  interval, 
  features, 
  active, 
  stripe_price_id
)
VALUES 
  (
    'Basic Monthly', 
    'Basic plan with essential features', 
    999, 
    'month', 
    ARRAY['Create up to 5 books', 'Generate up to 10 covers', 'Basic AI assistance'], 
    true, 
    'price_1234567890abcdefghijklmn'
  ),
  (
    'Premium Monthly', 
    'Premium plan with advanced features', 
    1999, 
    'month', 
    ARRAY['Create unlimited books', 'Generate unlimited covers', 'Advanced AI assistance', 'Priority support'], 
    true, 
    'price_2345678901abcdefghijklmn'
  )
ON CONFLICT DO NOTHING;

-- Note: You'll need to create a user in the Supabase Authentication system
-- and then run the following SQL to set the user as an admin:

/*
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@example.com';
*/
