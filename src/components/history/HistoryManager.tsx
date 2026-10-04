import React from 'react';
import { 
  History, 
  Trash2, 
  Award, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { StudySession } from '../../types';
import { formatDate } from '../../lib/utils';
import { MagneticButton } from '../ui/MagneticButton';
import { Interactive3DCard } from '../ui/Interactive3DCard';

interface HistoryManagerProps {
  sessions: StudySession[];
  onSelectSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  onNavigateToStudy: () => void;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  onNavigateToStudy,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            LocalStorage Persistent Records
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 dark:text-white tracking-tight mt-1">
            Study History & Telemetry Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Revisit your ingested study materials, review scores, and resume study sessions.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your study history?")) {
                onClearAll();
              }
            }}
            className="px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white/80 dark:bg-slate-950/40 backdrop-blur-xl max-w-md mx-auto my-12 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black italic text-slate-900 dark:text-white">
            No Study Sessions Recorded
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto font-medium">
            Whenever you ingest notes, take quizzes, or review flashcards, your study logs will be preserved here.
          </p>
          <MagneticButton
            variant="primary"
            onClick={onNavigateToStudy}
            className="px-6 py-2.5 text-xs font-mono font-bold italic mx-auto"
          >
            <span>Start a Study Session</span>
          </MagneticButton>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Interactive3DCard key={session.id} glowColor="#0284c7">
              <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-blue-400 dark:hover:border-cyan-400/40 transition-all shadow-md hover:shadow-xl">
                
                {/* Left info */}
                <div 
                  onClick={() => onSelectSession(session)}
                  className="cursor-pointer flex-1 space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-cyan-300 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(session.date)}
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600" />
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      Summary
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600" />
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                      <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
                      Flashcards
                    </span>
                    {session.quizScore !== undefined && session.quizTotal && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-bold flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Score: {Math.round((session.quizScore / session.quizTotal) * 100)}% ({session.quizScore}/{session.quizTotal})
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black italic text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-200 transition-colors">
                    {session.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                    {session.materialPreview}
                  </p>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => onSelectSession(session)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-mono uppercase tracking-wider font-bold italic flex items-center gap-1.5 hover:scale-105 transition-all shadow-md cursor-pointer"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    title="Delete Session"
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-300 dark:hover:border-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </Interactive3DCard>
          ))}
        </div>
      )}

    </div>
  );
};
