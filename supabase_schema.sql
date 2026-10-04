-- ==========================================================
-- AI Study Buddy: Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ==========================================================

-- 1. Enable Vector Extension for AI Semantic Search (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Study Materials Table
CREATE TABLE IF NOT EXISTS public.study_materials (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID DEFAULT auth.uid()
);

-- 3. Study Sessions Tracking Table
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    material_preview TEXT,
    has_summary BOOLEAN DEFAULT true,
    quiz_score INTEGER,
    quiz_total INTEGER,
    flashcard_count INTEGER,
    flashcard_mastered INTEGER,
    user_id UUID DEFAULT auth.uid()
);

-- 4. 3D Flashcards Table
CREATE TABLE IF NOT EXISTS public.flashcards (
    id TEXT PRIMARY KEY,
    material_id TEXT REFERENCES public.study_materials(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    status TEXT DEFAULT 'unseen', -- 'unseen', 'known', 'review'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Quizzes & Active Recall Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY,
    material_id TEXT REFERENCES public.study_materials(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of 4 options [A, B, C, D]
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium'
);

-- 6. Vector Embeddings Table for AI Semantic Search (RAG)
CREATE TABLE IF NOT EXISTS public.document_embeddings (
    id BIGSERIAL PRIMARY KEY,
    material_id TEXT REFERENCES public.study_materials(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(768), -- Dimensions for Gemini embedding-004
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow public access for development (or replace with user_id based RLS when auth is configured)
CREATE POLICY "Public full access on study_materials" ON public.study_materials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on study_sessions" ON public.study_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on flashcards" ON public.flashcards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on quizzes" ON public.quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on document_embeddings" ON public.document_embeddings FOR ALL USING (true) WITH CHECK (true);

-- 8. Storage Bucket for PDF and Lecture Slide Uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-documents', 'study-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access to study-documents" ON storage.objects 
FOR ALL USING (bucket_id = 'study-documents') WITH CHECK (bucket_id = 'study-documents');
