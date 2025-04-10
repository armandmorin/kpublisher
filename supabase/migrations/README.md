# Supabase Database Migrations

This directory contains SQL migration files for setting up and updating the Supabase database schema for the KPublisher application.

## Initial Schema Setup

The file `20250408_initial_schema.sql` contains the initial database schema setup, including:

- Tables for users, books, book covers, API keys, and assistants
- Row Level Security (RLS) policies for each table
- Triggers for automatic user creation and timestamp updates

## How to Apply Migrations

To apply these migrations to your Supabase project:

1. Log in to your Supabase dashboard at [https://app.supabase.io](https://app.supabase.io)
2. Select your project
3. Go to the SQL Editor
4. Copy the contents of the migration file
5. Paste into the SQL Editor
6. Click "Run" to execute the SQL commands

Alternatively, you can use the Supabase CLI to apply migrations:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Database Schema

### Users Table

Stores user information and subscription details:

- `id`: UUID (references auth.users)
- `email`: User's email address
- `role`: User role ('user' or 'admin')
- `stripe_customer_id`: Stripe customer ID for payments
- `subscription_status`: Current subscription status
- `subscription_plan`: Current subscription plan
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### Books Table

Stores book content created by users:

- `id`: UUID
- `title`: Book title
- `content`: Book content (HTML/rich text)
- `user_id`: UUID of the user who created the book
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### Book Covers Table

Stores book covers generated by users:

- `id`: UUID
- `image_url`: URL to the stored image
- `prompt`: The prompt used to generate the cover
- `user_id`: UUID of the user who created the cover
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### API Keys Table

Stores API keys for external services:

- `id`: UUID
- `service`: Service name ('openai', 'ideogram', 'stripe')
- `api_key`: The API key value
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### Assistants Table

Stores OpenAI assistants:

- `id`: UUID
- `name`: Assistant name
- `openai_assistant_id`: OpenAI assistant ID
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## Row Level Security (RLS)

The migration sets up RLS policies to ensure users can only access their own data, while admins have broader access to manage the application.
