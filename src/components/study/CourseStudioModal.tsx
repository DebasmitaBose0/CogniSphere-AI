import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Layers, 
  MessageSquare,
  Volume2,
  Maximize2
} from 'lucide-react';
import { soundFx } from '../../lib/soundFx';
import { ThreeDClayShape } from '../ui/ThreeDClayShape';

interface CourseStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  onStartQuiz?: () => void;
  onOpenFlashcards?: () => void;
}

export const CourseStudioModal: React.FC<CourseStudioModalProps> = ({
  isOpen,
  onClose,
  courseTitle = 'JavaScript Basics',
  onStartQuiz,
  onOpenFlashcards,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'instructor' | 'faq'>('overview');
  const [activeLesson, setActiveLesson] = useState(1);
  const [progressPercent, setProgressPercent] = useState(45);

  if (!isOpen) return null;

  const lessons = [
    { id: 1, title: 'Introduction to JavaScript', duration: '14:43', completed: true },
    { id: 2, title: 'Variables, Types & Operators', duration: '18:20', completed: true },
    { id: 3, title: 'Functions & Scope Basics', duration: '22:15', completed: false },
    { id: 4, title: 'DOM Manipulation & Events', duration: '25:40', completed: false },
    { id: 5, title: 'Async JS, Promises & Fetch', duration: '30:10', completed: false },
  ];

  const aiNotes = [
    { time: '6:12', note: 'Variables let/const, when not to use var in ES6+' },
    { time: '5:14', note: 'Primitives vs objects, type conversion & coercion' },
    { time: '3:10', note: 'Functions: declarations, expressions & arrow funcs' },
    { time: '2:10', note: 'Arrays: map, filter, reduce — real-world examples' },
  ];

  const handlePlayToggle = () => {
    soundFx.playClickSound();
    setIsPlaying(!isPlaying);
  };

  const handleSelectTab = (tab: 'overview' | 'review' | 'instructor' | 'faq') => {
    soundFx.playClickSound();
    setActiveTab(tab);
  };

  const handleSelectLesson = (id: number) => {
    soundFx.playLaserPulse();
    setActiveLesson(id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-5xl rounded-3xl bg-[#f8fafc] dark:bg-[#0c101c] border border-slate-300 dark:border-white/10 shadow-2xl overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              soundFx.playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-md cursor-pointer border border-white/20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Emerald Green Header Banner (Direct from Video) */}
          <div className="relative bg-[#1e4635] text-white p-6 sm:p-8 overflow-hidden">
            {/* Floating 3D Pink Torus & Green ribbon in top corner */}
            <div className="absolute right-4 -bottom-6 pointer-events-none opacity-85 hidden sm:block">
              <ThreeDClayShape type="torus-pink" size={130} />
            </div>

            <div className="relative z-10 max-w-2xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-200/90 mb-2">
                <span>My courses</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-100 font-bold">{courseTitle}</span>
              </div>

              {/* Course Title */}
              <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight mb-3">
                {courseTitle}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl font-medium">
                This course will help you quickly get started with JS: setting up the environment, project structure,
                syntax, data types, functions, DOM, and basic debugging. Learn with AI teacher.
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-4 mt-5">
                <div className="w-48 sm:w-64 h-2.5 rounded-full bg-black/30 overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                  />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-200">
                  {progressPercent}% complete
                </span>
                <span className="text-xs font-mono text-emerald-300/70 hidden sm:inline">
                  • 4 hours left
                </span>
              </div>
            </div>
          </div>

          {/* Main Course Studio Layout: Video & AI Assistant */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Video Player & Tabs */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Video Player Box */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-700/60 overflow-hidden shadow-lg group aspect-video flex flex-col justify-between">
                
                {/* Simulated Video Feed */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/40 flex items-center justify-center">
                  <div className="text-center space-y-2 select-none">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 mx-auto flex items-center justify-center text-emerald-300">
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                      Interactive Lecture Module
                    </span>
                    <span className="text-sm font-bold text-white block">
                      Lesson {activeLesson}: {lessons[activeLesson - 1]?.title}
                    </span>
                  </div>
                </div>

                {/* Top Video Header */}
                <div className="relative z-10 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-xs text-white/80 font-mono">
                  <span>Introduction to JavaScript</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>HD 1080p</span>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2">
                  {/* Scrubber */}
                  <div className="w-full h-1.5 rounded-full bg-white/20 relative cursor-pointer group/scrub">
                    <div className="w-2/5 h-full rounded-full bg-emerald-400 group-hover/scrub:bg-emerald-300 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover/scrub:scale-100 transition-transform" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/90 font-mono pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayToggle}
                        className="p-2 rounded-xl bg-white/15 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                      <span>06:12 / 14:43</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-white/70" />
                      <Maximize2 className="w-4 h-4 text-white/70 hover:text-white cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs (Overview, Review, Instructor, FAQ) */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                {(['overview', 'review', 'instructor', 'faq'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleSelectTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold italic font-mono transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content: About Module */}
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <h3 className="font-black italic text-slate-900 dark:text-white text-base mb-1">
                  About this module
                </h3>
                <p>
                  This module shows how to apply JavaScript in real-world tasks: setting up the environment,
                  organizing project structure, writing and debugging code. After viewing it, you will be able to
                  create simple interactivity without frameworks.
                </p>
              </div>

              {/* Quick Action Buttons for Recall & Flashcards */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {onStartQuiz && (
                  <button
                    onClick={() => {
                      soundFx.playStarChime();
                      onStartQuiz();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-mono font-bold italic shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Take Module Quiz</span>
                  </button>
                )}
                {onOpenFlashcards && (
                  <button
                    onClick={() => {
                      soundFx.playClickSound();
                      onOpenFlashcards();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-mono font-bold italic transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-pink-500" />
                    <span>Review 3D Flashcards</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Column: AI Assistant & Course Content */}
            <div className="space-y-6">
              
              {/* AI Assistant Live Widget (from Video) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-500">
                      <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                    <div>
                      <span className="text-xs font-black italic text-slate-900 dark:text-white block">
                        AI Assistant
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        Analyzing lecture stream...
                      </span>
                    </div>
                  </div>

                  {/* Audio Equalizer Bars */}
                  <div className="flex items-end gap-1 h-4">
                    {[12, 16, 8, 14, 10].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, h, 6] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1 rounded-full bg-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {/* AI Notes */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    AI Notes:
                  </span>
                  <div className="space-y-2">
                    {aiNotes.map((note, idx) => (
                      <div
                        key={idx}
                        onClick={() => soundFx.playClickSound()}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-slate-200 dark:border-white/5 hover:border-amber-400/30 transition-all cursor-pointer flex items-start gap-2.5 group"
                      >
                        <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                          {note.time}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                          {note.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Content Accordion (from Video) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                <span className="text-xs font-black italic text-slate-900 dark:text-white block">
                  Course content
                </span>

                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const isCurrent = activeLesson === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-amber-400/15 border-amber-400 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            lesson.completed
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {lesson.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : lesson.id}
                          </div>
                          <span className="text-xs font-bold leading-tight line-clamp-1">
                            {lesson.title}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {lesson.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
