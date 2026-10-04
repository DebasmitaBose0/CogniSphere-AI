import { StudySession, UserStats, StudyMaterial } from '../types';

const SESSIONS_KEY = 'astralearn_sessions';
const STATS_KEY = 'astralearn_stats';
const ACTIVE_MATERIAL_KEY = 'astralearn_active_material';

// Legacy keys migration helper
function migrateLegacyKeys() {
  try {
    if (!localStorage.getItem(SESSIONS_KEY) && localStorage.getItem('noetica_sessions')) {
      localStorage.setItem(SESSIONS_KEY, localStorage.getItem('noetica_sessions')!);
    }
    if (!localStorage.getItem(STATS_KEY) && localStorage.getItem('noetica_stats')) {
      localStorage.setItem(STATS_KEY, localStorage.getItem('noetica_stats')!);
    }
    if (!localStorage.getItem(ACTIVE_MATERIAL_KEY) && localStorage.getItem('noetica_active_material')) {
      localStorage.setItem(ACTIVE_MATERIAL_KEY, localStorage.getItem('noetica_active_material')!);
    }
  } catch {
    // Ignore migration failures
  }
}
migrateLegacyKeys();

export function getSavedSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: StudySession): void {
  try {
    const existing = getSavedSessions();
    const filtered = existing.filter(s => s.id !== session.id);
    const updated = [session, ...filtered];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    updateStatsFromSessions(updated);
  } catch (err) {
    console.error("Failed to save session to localStorage", err);
  }
}

export function deleteSession(id: string): void {
  try {
    const existing = getSavedSessions();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    updateStatsFromSessions(updated);
  } catch (err) {
    console.error("Failed to delete session", err);
  }
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (err) {
    console.error("Failed to clear sessions", err);
  }
}

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const sessions = getSavedSessions();
  return calculateStats(sessions);
}

function calculateStats(sessions: StudySession[]): UserStats {
  if (sessions.length === 0) {
    return {
      studySessions: 0,
      quizzesCompleted: 0,
      flashcardsReviewed: 0,
      averageQuizScore: 0,
    };
  }

  let quizzesCount = 0;
  let totalScorePercentage = 0;
  let flashcardsReviewed = 0;

  sessions.forEach(s => {
    if (s.quizScore !== undefined && s.quizTotal !== undefined && s.quizTotal > 0) {
      quizzesCount++;
      totalScorePercentage += (s.quizScore / s.quizTotal) * 100;
    }
    if (s.flashcardMastered !== undefined) {
      flashcardsReviewed += s.flashcardMastered;
    }
  });

  return {
    studySessions: sessions.length,
    quizzesCompleted: quizzesCount,
    flashcardsReviewed: flashcardsReviewed,
    averageQuizScore: quizzesCount > 0 ? Math.round(totalScorePercentage / quizzesCount) : 0,
  };
}

function updateStatsFromSessions(sessions: StudySession[]) {
  const stats = calculateStats(sessions);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getActiveMaterial(): StudyMaterial | null {
  try {
    const raw = localStorage.getItem(ACTIVE_MATERIAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveMaterial(mat: StudyMaterial | null): void {
  try {
    if (mat) {
      localStorage.setItem(ACTIVE_MATERIAL_KEY, JSON.stringify(mat));
    } else {
      localStorage.removeItem(ACTIVE_MATERIAL_KEY);
    }
  } catch (err) {
    console.error("Failed to set active material", err);
  }
}
