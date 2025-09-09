-- Supabase Database Setup for Polly Polling App
-- Run this SQL in your Supabase SQL Editor

-- Note: auth.users table already has RLS enabled by default in Supabase

-- Clean slate: Drop everything first (only if they exist)
-- Drop triggers first (only if tables exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'votes' AND table_schema = 'public') THEN
        DROP TRIGGER IF EXISTS on_vote_change ON public.votes;
    END IF;
    
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
END $$;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_poll_vote_counts();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.poll_options CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table to extend auth.users
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create polls table
CREATE TABLE public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    allow_multiple_choices BOOLEAN DEFAULT FALSE,
    total_votes INTEGER DEFAULT 0
);

-- Create poll_options table
CREATE TABLE public.poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table to track user votes
CREATE TABLE public.votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, user_id, option_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for polls table
CREATE POLICY "Anyone can view polls" ON public.polls
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create polls" ON public.polls
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own polls" ON public.polls
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON public.polls
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for poll_options table
CREATE POLICY "Anyone can view poll options" ON public.poll_options
    FOR SELECT USING (TRUE);

CREATE POLICY "Poll creators can manage options" ON public.poll_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- RLS Policies for votes table
CREATE POLICY "Anyone can view votes" ON public.votes
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can vote" ON public.votes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.votes
    FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update poll vote counts
CREATE OR REPLACE FUNCTION public.update_poll_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update option vote count
    IF TG_OP = 'INSERT' THEN
        UPDATE public.poll_options 
        SET votes = votes + 1 
        WHERE id = NEW.option_id;
        
        UPDATE public.polls 
        SET total_votes = total_votes + 1 
        WHERE id = NEW.poll_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.poll_options 
        SET votes = votes - 1 
        WHERE id = OLD.option_id;
        
        UPDATE public.polls 
        SET total_votes = total_votes - 1 
        WHERE id = OLD.poll_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update vote counts
CREATE OR REPLACE TRIGGER on_vote_change
    AFTER INSERT OR DELETE ON public.votes
    FOR EACH ROW EXECUTE FUNCTION public.update_poll_vote_counts();

-- Database setup complete!
-- You can now:
-- 1. Register users through your app
-- 2. Create polls through your app  
-- 3. Vote on polls through your app
-- All data will be stored in these tables with proper security policies.
