# KPublisher - AI-Powered Book Creation Platform

KPublisher is a comprehensive SaaS platform that leverages AI to help users create, edit, and manage books and book covers. The platform integrates with OpenAI for content generation and Ideogram for AI-powered image generation.

## Features

- **AI-Powered Content Creation**: Generate book content using OpenAI's assistant API
- **AI Book Cover Generation**: Create stunning book covers with Ideogram's image generation API
- **Rich Text Editor**: Edit content with a powerful WYSIWYG editor
- **Export Options**: Download books as text or Word documents
- **User Management**: Admin panel for managing users and subscriptions
- **Stripe Integration**: Process payments and manage subscription plans

## Tech Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payment Processing**: Stripe
- **AI Integration**: OpenAI API, Ideogram API

## Project Structure

```
kpublisher/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Marketing pages
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── admin/          # Admin-only pages
│   │   │   ├── books/          # Book management
│   │   │   ├── covers/         # Cover management
│   │   │   └── ...
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── ui/                 # UI components
│   │   ├── editor/             # Editor components
│   │   ├── chat/               # Chat components
│   │   ├── images/             # Image components
│   │   └── dashboard/          # Dashboard components
│   └── lib/                    # Utility functions
│       ├── supabase/           # Supabase client and utilities
│       ├── openai/             # OpenAI client and utilities
│       ├── stripe/             # Stripe client and utilities
│       ├── ideogram/           # Ideogram client and utilities
│       └── documents/          # Document generation utilities
└── ...
```

## Implemented Features

### Authentication
- Complete Supabase authentication system with login, signup, and password reset
- Middleware for route protection and role-based access control
- User context provider for easy access to user data throughout the application

### Database
- Fully configured Supabase database with the following tables:
  - users: User profiles with subscription information
  - books: User-created books with content
  - book_covers: AI-generated book covers
  - api_keys: Secure storage for third-party API keys
  - assistants: OpenAI assistants configuration
- Row Level Security (RLS) policies for data protection
- Database triggers for automatic user creation and timestamp updates

### User Interface
- Dashboard with sidebar navigation
- Book management (listing, viewing, editing)
- Cover gallery with image preview
- Admin panels for user management and subscription plans
- WYSIWYG editor for book content creation and editing

### API Integration
- Stripe webhook handler for subscription management
- OpenAI integration for content generation
- Ideogram integration for cover image generation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Ideogram API key
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kpublisher.git
   cd kpublisher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env.local` and fill in your API keys and configuration:
   ```bash
   cp .env.example .env.local
   ```

4. Set up the Supabase database:
   - Run the SQL migration script in `supabase/migrations/20250408_initial_schema.sql`
   - Set up authentication providers in the Supabase dashboard
   - Configure storage buckets for book covers

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The application can be deployed to Vercel:

```bash
npm run build
vercel deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
