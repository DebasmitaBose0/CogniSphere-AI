import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StudyMaterial, StudySession, Flashcard, QuizQuestion } from '../types';
import { 
  getSavedSessions, 
  saveSession as saveLocalSession, 
  deleteSession as deleteLocalSession,
  clearAllSessions as clearAllLocalSessions,
  getActiveMaterial,
  setActiveMaterial
} from './storage';

/**
 * Backend Service Layer for AI Study Buddy
 * Interacts with Supabase PostgreSQL & Storage if configured,
 * or gracefully falls back to localStorage.
 */

// 1. Study Materials API
export async function fetchAllStudyMaterials(): Promise<StudyMaterial[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          title: row.title,
          content: row.content,
          createdAt: row.created_at,
          wordCount: row.word_count || 0,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local material:', err);
    }
  }

  const active = getActiveMaterial();
  return active ? [active] : [];
}

export async function saveStudyMaterialBackend(material: StudyMaterial): Promise<void> {
  // Always save locally for instant caching & offline support
  setActiveMaterial(material);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('study_materials')
        .upsert({
          id: material.id,
          title: material.title,
          content: material.content,
          word_count: material.wordCount,
          created_at: material.createdAt,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to sync study material to Supabase:', err);
    }
  }
}

// 2. Study Sessions API
export async function fetchStudySessionsBackend(): Promise<StudySession[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(row => ({
          id: row.id,
          title: row.title,
          date: row.date,
          materialPreview: row.material_preview,
          hasSummary: row.has_summary,
          quizScore: row.quiz_score,
          quizTotal: row.quiz_total,
          flashcardCount: row.flashcard_count,
          flashcardMastered: row.flashcard_mastered,
        }));
      }
    } catch (err) {
      console.warn('Supabase sessions fetch failed, using local:', err);
    }
  }

  return getSavedSessions();
}

export async function saveStudySessionBackend(session: StudySession): Promise<void> {
  saveLocalSession(session);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .upsert({
          id: session.id,
          title: session.title,
          date: session.date,
          material_preview: session.materialPreview,
          has_summary: session.hasSummary,
          quiz_score: session.quizScore,
          quiz_total: session.quizTotal,
          flashcard_count: session.flashcardCount,
          flashcard_mastered: session.flashcardMastered,
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to sync session to Supabase:', err);
    }
  }
}

export async function deleteStudySessionBackend(sessionId: string): Promise<void> {
  deleteLocalSession(sessionId);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete session from Supabase:', err);
    }
  }
}

// 3. Document / PDF Storage API
export async function uploadStudyDocument(file: File): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase Storage not configured. File kept locally.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('study-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('study-documents')
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (err) {
    console.error('Error uploading document to Supabase Storage:', err);
    return null;
  }
}
