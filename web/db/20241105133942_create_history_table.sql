-- Migration to create the history table
CREATE TABLE public.history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    video_id VARCHAR(11) NOT NULL, -- Assuming YouTube IDs are 11 characters
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
