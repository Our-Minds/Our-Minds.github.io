
# Supabase Database Setup Guide

This document provides guidance for setting up the database in Supabase once connected to the Lovable project.

## Tables Created

1. `consultants` - Contains consultant-specific information
2. `stories` - Mental health stories/blogs
3. `chat_threads` - Conversation threads
4. `chat_messages` - Individual messages
5. `sessions` - Booked consultation sessions
6. `transactions` - Payment history
7. `reviews` - Consultant reviews

## Users Table Missing

⚠️ **Important**: The initial SQL setup does not include a `users` table, which is required for the application to work correctly. You need to create this table manually.

Run the following SQL to create the users table:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'consultant', 'admin', 'owner')),
  profile_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all user profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Row Level Security

For security purposes, you should enable Row Level Security on all tables and create appropriate policies.

```sql
-- Enable RLS on all tables
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Example policies for consultants
CREATE POLICY "Everyone can view consultant profiles" ON public.consultants
  FOR SELECT USING (true);

CREATE POLICY "Consultants can update their own profile" ON public.consultants
  FOR UPDATE USING (auth.uid() = id);

-- Add policies for other tables as needed
```

## Creating Test Users

In a development environment, you need to:
1. Create users through Supabase Auth (Sign up via UI or API).
2. Then create entries in the `users` table with the corresponding IDs.
3. If they are consultants, create entries in the `consultants` table.

For production environments, the registration flow in the application will handle this for you.
