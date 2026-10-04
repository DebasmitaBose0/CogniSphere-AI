import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  Award, 
  BookCheck, 
  TrendingUp,
  Plus,
  Timer
} from 'lucide-react';
import { StudySession, UserStats, StudyMaterial } from '../../types';
import { formatDate } from '../../lib/utils';

interface DashboardProps {
  stats: UserStats;
  recentSessions: StudySession[];
  activeMaterial: StudyMaterial | null;
  onAddMaterial: () => void;
  onSelectSession: (session: StudySession) => void;
  onQuickAction: (action: 'summary' | 'quiz' | 'flashcards' | 'chat' | 'focus') => void;
  onTryDemo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentSessions,
  activeMaterial,
  onAddMaterial,
  onSelectSession,
  onQuickAction,
  onTryDemo,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Editorial Top Greeting Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#091611] text-forest-100 border border-forest-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-forest-400">
              Workspace Overview
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Ready to learn something new?
            </h1>
            <p className="text-sm sm:text-base text-forest-200/90 font-light leading-relaxed">
              Transform your study material into an interactive learning experience with personalized summaries, quizzes, flashcards, and notes chat.
            </p>

            {activeMaterial && (
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Notes: <strong>{activeMaterial.title}</strong> ({activeMaterial.wordCount} words)</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAddMaterial}
              className="px-6 py-3.5 rounded-2xl bg-forest-100 hover:bg-white text-forest-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study Material</span>
            </button>
            <button
              onClick={onTryDemo}
              className="px-5 py-3.5 rounded-2xl bg-forest-900/80 hover:bg-forest-850 border border-forest-700 text-forest-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Load Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-forest-900/10 dark:border-forest-700/30 bg-white/70 dark:bg-forest-950/40 backdrop-blur shadow-sm">
          <div className="flex items-center justify-between text-forest-700 dark:text-forest-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Study Sessions</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-forest-50">
            {stats.studySessions}
          </div>
          <p className="text-[11px] font-mono text-ink-500 dark:text-forest-400/70 mt-1">
            Materials imported & analyzed
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-forest-900/10 dark:border-forest-700/30 bg-white/70 dark:bg-forest-950/40 backdrop-blur shadow-sm">
          <div className="flex items-center justify-between text-forest-700 dark:text-forest-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Quizzes Taken</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-forest-50">
            {stats.quizzesCompleted}
          </div>
          <p className="text-[11px] font-mono text-ink-500 dark:text-forest-400/70 mt-1">
            Completed test evaluations
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-forest-900/10 dark:border-forest-700/30 bg-white/70 dark:bg-forest-950/40 backdrop-blur shadow-sm">
          <div className="flex items-center justify-between text-forest-700 dark:text-forest-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Cards Mastered</span>
            <BookCheck className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-forest-50">
            {stats.flashcardsReviewed}
          </div>
          <p className="text-[11px] font-mono text-ink-500 dark:text-forest-400/70 mt-1">
            Marked as known terms
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-forest-900/10 dark:border-forest-700/30 bg-white/70 dark:bg-forest-950/40 backdrop-blur shadow-sm">
          <div className="flex items-center justify-between text-forest-700 dark:text-forest-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Average Score</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900 dark:text-forest-50">
            {stats.averageQuizScore}%
          </div>
          <p className="text-[11px] font-mono text-ink-500 dark:text-forest-400/70 mt-1">
            Across all quiz assessments
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl text-ink-900 dark:text-forest-50 font-medium">
            Quick Actions
          </h2>
          <span className="text-xs font-mono text-ink-500 dark:text-forest-400">
            Current Material Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => onQuickAction('summary')}
            className="p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 bg-white/70 dark:bg-forest-950/50 hover:bg-forest-50/70 dark:hover:bg-forest-900/40 hover:border-forest-600/40 transition-all text-left flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-900/70 text-forest-800 dark:text-forest-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-forest-600 dark:text-forest-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-ink-900 dark:text-forest-50 text-base">
                Summarize Notes
              </h3>
              <p className="text-xs text-ink-500 dark:text-forest-300/70 mt-1 font-light">
                Layered overviews, definitions & exam notes
              </p>
            </div>
          </button>

          <button
            onClick={() => onQuickAction('quiz')}
            className="p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 bg-white/70 dark:bg-forest-950/50 hover:bg-forest-50/70 dark:hover:bg-forest-900/40 hover:border-forest-600/40 transition-all text-left flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-900/70 text-forest-800 dark:text-forest-300">
                <HelpCircle className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-forest-600 dark:text-forest-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-ink-900 dark:text-forest-50 text-base">
                Generate Quiz
              </h3>
              <p className="text-xs text-ink-500 dark:text-forest-300/70 mt-1 font-light">
                Active recall MCQs with explanation feedback
              </p>
            </div>
          </button>

          <button
            onClick={() => onQuickAction('flashcards')}
            className="p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 bg-white/70 dark:bg-forest-950/50 hover:bg-forest-50/70 dark:hover:bg-forest-900/40 hover:border-forest-600/40 transition-all text-left flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-900/70 text-forest-800 dark:text-forest-300">
                <Layers className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-forest-600 dark:text-forest-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-ink-900 dark:text-forest-50 text-base">
                Flashcards
              </h3>
              <p className="text-xs text-ink-500 dark:text-forest-300/70 mt-1 font-light">
                3D flip cards for spaced repetition
              </p>
            </div>
          </button>

          <button
            onClick={() => onQuickAction('chat')}
            className="p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 bg-white/70 dark:bg-forest-950/50 hover:bg-forest-50/70 dark:hover:bg-forest-900/40 hover:border-forest-600/40 transition-all text-left flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-900/70 text-forest-800 dark:text-forest-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-forest-600 dark:text-forest-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-ink-900 dark:text-forest-50 text-base">
                Ask My Notes
              </h3>
              <p className="text-xs text-ink-500 dark:text-forest-300/70 mt-1 font-light">
                Conversational study companion with exam modes
              </p>
            </div>
          </button>

          <button
            onClick={() => onQuickAction('focus')}
            className="p-5 rounded-2xl border border-forest-600/30 dark:border-forest-700/40 bg-forest-100/40 dark:bg-forest-950/40 hover:bg-forest-100/70 dark:hover:bg-forest-900/50 hover:border-forest-600/50 transition-all text-left flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-forest-200/60 dark:bg-forest-800/60 text-forest-800 dark:text-forest-300">
                <Timer className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-forest-700 dark:text-forest-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-ink-900 dark:text-forest-50 text-base">
                Focus Timer
              </h3>
              <p className="text-xs text-ink-500 dark:text-forest-300/70 mt-1 font-light">
                25m Pomodoro deep work with chime & streaks
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Study Sessions */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl text-ink-900 dark:text-forest-50 font-medium">
          Recent Study Sessions
        </h2>

        {recentSessions.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-dashed border-forest-900/20 dark:border-forest-600/30 bg-white/30 dark:bg-forest-950/20">
            <div className="w-12 h-12 rounded-full bg-forest-900/5 dark:bg-forest-600/10 flex items-center justify-center mx-auto mb-3 text-forest-700 dark:text-forest-300">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-medium text-ink-900 dark:text-forest-100">
              No study history yet
            </h3>
            <p className="text-xs sm:text-sm text-ink-500 dark:text-forest-300/70 max-w-sm mx-auto mt-1 mb-6 font-light">
              Add your notes or launch the Cloud Computing demo to begin logging study milestones and performance scores.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onTryDemo}
                className="px-5 py-2.5 rounded-full bg-forest-900 dark:bg-forest-200 text-forest-50 dark:text-forest-950 text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Load Cloud Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session)}
                className="p-5 rounded-2xl border border-forest-900/10 dark:border-forest-700/30 bg-white/70 dark:bg-forest-950/40 hover:bg-forest-50 dark:hover:bg-forest-900/30 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 dark:text-forest-400 mb-2">
                    <span>{formatDate(session.date)}</span>
                    {session.quizScore !== undefined && session.quizTotal && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                        Score: {session.quizScore}/{session.quizTotal}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-semibold text-ink-900 dark:text-forest-50 text-base group-hover:text-forest-700 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {session.title}
                  </h4>
                  <p className="text-xs text-ink-600 dark:text-forest-200/70 mt-2 line-clamp-2 font-light">
                    {session.materialPreview}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-forest-900/5 dark:border-forest-700/20 flex items-center justify-between text-xs font-mono text-forest-700 dark:text-forest-400">
                  <span>Resume Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
