import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  Share2, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Play, 
  ChevronRight,
  Flame,
  Zap,
  TrendingUp,
  FileText,
  RotateCw,
  Send,
  Atom,
  Eye,
  Award
} from 'lucide-react';
import { StudyMaterial, StudySession, UserStats, Flashcard, QuizQuestion, SummaryData } from '../../types';
import { FuturisticUploadPedestal } from '../study/FuturisticUploadPedestal';
import { FuturisticSummaryView } from '../summary/FuturisticSummaryView';
import { FuturisticQuizView } from '../quiz/FuturisticQuizView';
import { FuturisticFlashcardView } from '../flashcards/FuturisticFlashcardView';
import { FuturisticAIChatView } from '../chat/FuturisticAIChatView';
import { KnowledgeGraphView } from '../graph/KnowledgeGraphView';
import { FuturisticProgressView } from '../dashboard/FuturisticProgressView';
import { HistoryManager } from '../history/HistoryManager';
import { StudyPomodoro } from '../tools/StudyPomodoro';
import { soundFx } from '../../lib/soundFx';

interface SpatialStudyExperienceProps {
  activeMaterial: StudyMaterial | null;
  sessions: StudySession[];
  stats: UserStats;
  onProcessMaterial: (title: string, content: string) => void;
  onTryDemo: () => void;
  onSaveQuizResult: (score: number, total: number) => void;
  onUpdateFlashcardStats: (mastered: number) => void;
  onSelectSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onClearAllHistory: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const SpatialStudyExperience: React.FC<SpatialStudyExperienceProps> = ({
  activeMaterial,
  sessions,
  stats,
  onProcessMaterial,
  onTryDemo,
  onSaveQuizResult,
  onUpdateFlashcardStats,
  onSelectSession,
  onDeleteSession,
  onClearAllHistory,
  onScrollToSection,
}) => {
  return (
    <div className="relative w-full text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* ========================================================================= */}
      {/* 1. HERO STAGE: 3D KNOWLEDGE CORE */}
      {/* ========================================================================= */}
      <section 
        id="hero-stage"
        className="min-h-screen flex flex-col justify-between items-center px-4 sm:px-8 py-20 relative z-10 select-none"
      >
        <div className="h-6" />

        {/* Central Stage Hero Overlay with Two-Column Spatial Framing */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 my-auto">
          
          {/* Left Column: Typography & CTAs */}
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Three.js Spatial Engine</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tight bg-gradient-to-r from-cyan-300 via-white to-violet-400 bg-clip-text text-transparent drop-shadow-2xl">
              AI STUDY BUDDY
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-300 tracking-tight max-w-xl">
              “Your notes. Your AI. Your smarter way to study.”
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundFx.playLaserPulse();
                  onScrollToSection('study-stage');
                }}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black italic text-sm shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-white/20"
              >
                <span>Ingest Notes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFx.playStarChime();
                  onTryDemo();
                  onScrollToSection('summary-stage');
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-bold backdrop-blur-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Cloud Computing Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: STUDENT SVG Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex items-center justify-center p-2">
              <img 
                src="/STUDENT.svg" 
                alt="Student studying with AI" 
                className="w-full h-auto max-h-[420px] object-contain drop-shadow-[0_12px_40px_rgba(6,182,212,0.2)] select-none pointer-events-none"
              />
            </div>
          </div>

        </div>

        {/* Clean Scroll Callout without bounce */}
        <div 
          className="flex flex-col items-center gap-1.5 text-xs font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors cursor-pointer pb-4" 
          onClick={() => onScrollToSection('study-stage')}
        >
          <span className="tracking-wider uppercase text-[11px]">Scroll to explore modules</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STUDY MATERIAL INGESTION PEDESTAL & 3D SCANNER STAGE */}
      {/* ========================================================================= */}
      <section 
        id="study-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-400 mb-6">
          <span>STAGE 01</span>
          <span>•</span>
          <span>INGESTION</span>
        </div>

        <div className="w-full max-w-5xl">
          <FuturisticUploadPedestal
            currentTitle={activeMaterial?.title}
            currentContent={activeMaterial?.content}
            onProcessMaterial={(title, content) => {
              onProcessMaterial(title, content);
              setTimeout(() => onScrollToSection('summary-stage'), 400);
            }}
            onNavigateNext={(dest) => onScrollToSection(`${dest}-stage`)}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. AI SUMMARY SPATIAL DECK */}
      {/* ========================================================================= */}
      <section 
        id="summary-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-400 mb-6">
          <span>STAGE 02</span>
          <span>•</span>
          <span>AI SYNTHESIS</span>
        </div>

        <div className="w-full max-w-6xl">
          <FuturisticSummaryView
            material={activeMaterial}
            onNavigateToStudy={() => onScrollToSection('study-stage')}
            onNavigateToQuiz={() => onScrollToSection('quiz-stage')}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ACTIVE RECALL QUIZ ARENA */}
      {/* ========================================================================= */}
      <section 
        id="quiz-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold text-violet-400 mb-6">
          <span>STAGE 03</span>
          <span>•</span>
          <span>ACTIVE RECALL QUIZ</span>
        </div>

        <div className="w-full max-w-6xl">
          <FuturisticQuizView
            material={activeMaterial}
            onSaveQuizResult={onSaveQuizResult}
            onNavigateToStudy={() => onScrollToSection('study-stage')}
            onNavigateToFlashcards={() => onScrollToSection('flashcards-stage')}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 3D FLASHCARD DECK & PERSPECTIVE STACK */}
      {/* ========================================================================= */}
      <section 
        id="flashcards-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs font-mono font-bold text-fuchsia-400 mb-6">
          <span>STAGE 04</span>
          <span>•</span>
          <span>SPATIAL FLASHCARDS</span>
        </div>

        <div className="w-full max-w-6xl">
          <FuturisticFlashcardView
            material={activeMaterial}
            onUpdateFlashcardStats={onUpdateFlashcardStats}
            onNavigateToStudy={() => onScrollToSection('study-stage')}
            onNavigateToChat={() => onScrollToSection('chat-stage')}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOLOGRAPHIC ASK AI SANCTUARY */}
      {/* ========================================================================= */}
      <section 
        id="chat-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-400 mb-6">
          <span>STAGE 05</span>
          <span>•</span>
          <span>NEURAL AI TUTOR</span>
        </div>

        <div className="w-full max-w-5xl">
          <FuturisticAIChatView
            material={activeMaterial}
            onNavigateToStudy={() => onScrollToSection('study-stage')}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 3D INTERACTIVE KNOWLEDGE GRAPH */}
      {/* ========================================================================= */}
      <section 
        id="map-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-400 mb-6">
          <span>STAGE 06</span>
          <span>•</span>
          <span>KNOWLEDGE GRAPH</span>
        </div>

        <div className="w-full max-w-6xl">
          <KnowledgeGraphView
            material={activeMaterial}
            onNavigateToStudy={() => onScrollToSection('study-stage')}
            onNavigateToQuiz={() => onScrollToSection('quiz-stage')}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. STUDY PROGRESS CONSTELLATION & DASHBOARD SUITE */}
      {/* ========================================================================= */}
      <section 
        id="dashboard-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400 mb-6">
          <span>STAGE 07</span>
          <span>•</span>
          <span>STUDY TELEMETRY</span>
        </div>

        <div className="w-full max-w-7xl">
          <FuturisticProgressView
            stats={stats}
            recentSessions={sessions}
            activeMaterial={activeMaterial}
            onAddMaterial={() => onScrollToSection('study-stage')}
            onSelectSession={(sess) => {
              onSelectSession(sess);
              onScrollToSection('summary-stage');
            }}
            onQuickAction={(action) => onScrollToSection(`${action}-stage`)}
            onTryDemo={() => {
              onTryDemo();
              onScrollToSection('summary-stage');
            }}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. DEEP WORK FOCUS INTERVAL & HISTORY RECORDS */}
      {/* ========================================================================= */}
      <section 
        id="focus-history-stage"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 relative z-10 space-y-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold text-indigo-400">
          <span>STAGE 08</span>
          <span>•</span>
          <span>DEEP WORK & HISTORY</span>
        </div>

        <div className="w-full max-w-4xl space-y-12">
          {/* Deep Work Focus Interval */}
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Cognitive Productivity</span>
              <h2 className="text-2xl font-bold text-white mt-1">Deep Work Focus Interval</h2>
            </div>
            <StudyPomodoro />
          </div>

          {/* History Manager */}
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl">
            <HistoryManager
              sessions={sessions}
              onSelectSession={(sess) => {
                onSelectSession(sess);
                onScrollToSection('summary-stage');
              }}
              onDeleteSession={onDeleteSession}
              onClearAll={onClearAllHistory}
              onNavigateToStudy={() => onScrollToSection('study-stage')}
            />
          </div>
        </div>
      </section>

    </div>
  );
};
