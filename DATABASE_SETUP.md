# Database Setup Instructions

This document provides instructions for setting up the database for the KPublisher application.

## Prerequisites

- Access to your Supabase project dashboard
- Basic knowledge of SQL

## Step 1: Run the SQL Script

1. Go to your Supabase project dashboard: https://app.supabase.com/project/tvzpyrzrmcbkibanfbdb
2. Navigate to "SQL Editor"
3. Create a new query
4. Open the file `setup-database.sql` from this project
5. Copy the entire contents of the file
6. Paste it into the SQL Editor
7. Click "Run" to execute the SQL script

This script will:
- Create all necessary tables (users, books, book_covers, api_keys, assistants, subscription_plans)
- Drop existing policies to avoid conflicts
- Set up Row Level Security (RLS) policies
- Create triggers and functions
- Insert initial data for API keys, assistants, and subscription plans

## Step 2: Create an Admin User

### Option 1: Using the HTML Tool (Recommended)

1. Open the file `create-admin-user.html` in a web browser
2. The default email and password are:
   - Email: armandmorin@gmail.com
   - Password: 1armand
3. You can change these if desired
4. If the user doesn't exist yet:
   - Click "Create Admin User"
5. If the user already exists:
   - Click "Update Existing User to Admin"
6. Wait for the process to complete
7. You should see a success message if everything worked correctly

The tool now provides three options:
- **Create Admin User**: Creates a new user and sets them as admin
- **Update Existing User to Admin**: Finds an existing user by email and sets them as admin
- **Sync Auth User to Database**: Fixes the issue where a user exists in the auth system but not in the users table

### Option 2: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Users"
3. Click "Add User"
4. Enter:
   - Email: armandmorin@gmail.com
   - Password: 1armand
5. Click "Create User"
6. After creating the user, run the following SQL in the SQL Editor:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'armandmorin@gmail.com';
```

## Step 3: Verify Setup

1. Go to your deployed application: https://kpublisher.netlify.app/auth/login
2. Log in with the admin credentials:
   - Email: armandmorin@gmail.com
   - Password: 1armand
3. You should be redirected to the dashboard
4. Navigate to the admin sections to verify you have admin access

## Troubleshooting

### Error: "relation 'users' does not exist"

This means the database tables haven't been created yet. Make sure you've run the SQL script in Step 1.

### Error: "Invalid credentials"

This could be due to:
1. The user doesn't exist in the auth system
2. The password is incorrect
3. Email confirmation is required (check Authentication > Providers > Email settings)

### Error: "500 Internal Server Error" when accessing users table

This could be due to:
1. The users table doesn't exist
2. The RLS policies are not set up correctly
3. The user doesn't have permission to access the table

Try running the SQL script again to ensure all tables and policies are created correctly.

### Error: "Cannot access 'supabase' before initialization"

If you're using the HTML tool and see this error, try refreshing the page. The Supabase client might not have loaded correctly.

### Error: "duplicate key value violates unique constraint"

This error occurs when trying to create a user that already exists. Use the "Update Existing User to Admin" button instead of "Create Admin User".

### Error: "infinite recursion detected in policy for relation"

This error has been fixed in the latest version of the SQL script. The script now uses a simpler approach for admin policies that doesn't cause recursion. If you encounter this error, make sure you're using the latest version of the setup-database.sql file.

### Error: "JSON object requested, multiple (or no) rows returned"

This error has been fixed in the latest version of the HTML tool. The tool now properly handles cases where multiple users with the same email exist or no users are found. If you encounter this error, make sure you're using the latest version of the create-admin-user.html file.

### Error: User exists in auth but not in the database

If you encounter a situation where the "Update Existing User to Admin" button says the user doesn't exist in the users table, but the "Create Admin User" button says the user already exists, this means the user exists in the auth system but not in the users table. Use the "Sync Auth User to Database" button to fix this issue.

### Error: "Could not find the function public.execute_sql(sql_query) in the schema cache"

This error has been fixed in the latest version of the HTML tool. The tool now uses a simpler approach that doesn't rely on the `execute_sql` function. If you encounter this error, make sure you're using the latest version of the create-admin-user.html file.

### Error: "Invalid login credentials"

This error occurs when trying to sign in with incorrect credentials. The latest version of the HTML tool now uses a manual approach that prompts you for the user's UUID instead of trying to sign in. If you encounter this error, make sure you're using the latest version of the create-admin-user.html file.

To use the manual approach:
1. Go to your Supabase dashboard > Authentication > Users
2. Find the user you want to sync
3. Copy the UUID of the user
4. When prompted by the tool, paste the UUID

### Error: "new row violates row-level security policy for table 'users'"

This error occurs when trying to insert a user into the users table but the RLS policy prevents it. The latest version of the SQL script now includes a policy that allows inserting users. If you encounter this error, make sure you're using the latest version of the setup-database.sql file and run it again.

### Error: "GET https://tvzpyrzrmcbkibanfbdb.supabase.co/rest/v1/users?select=*&id=eq.[UUID] 406 (Not Acceptable)"

This error occurs when the Supabase client is not properly configured with the correct headers. The latest version of the application includes proper configuration for the Supabase client. If you encounter this error, make sure you're using the latest version of the code.

### Error: "Module not found: Can't resolve 'react-quill/dist/quill.snow.css'"

This error occurs during the build process when the CSS file for react-quill can't be found. The latest version of the application includes:
1. An updated version of react-quill (^2.0.0 instead of ^0.0.2)
2. Configuration in next.config.js to handle CSS imports
3. Additional dependencies (css-loader and style-loader) to process CSS files

If you encounter this error, make sure you're using the latest version of the code and run `npm install --legacy-peer-deps` before building.

## Database Schema

The database consists of the following tables:

1. **users** - Stores user information and links to auth.users
2. **books** - Stores book content created by users
3. **book_covers** - Stores book cover images generated by users
4. **api_keys** - Stores API keys for external services
5. **assistants** - Stores OpenAI assistant configurations
6. **subscription_plans** - Stores subscription plan details

Each table has appropriate RLS policies to ensure data security.
