import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Award, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Plus,
  ArrowUpRight,
  FileText,
  HelpCircle,
  MessageSquare,
  Share2,
  ChevronRight,
  Play
} from 'lucide-react';
import { StudyMaterial, StudySession, UserStats } from '../../types';
import { Interactive3DCard } from '../ui/Interactive3DCard';
import { ThreeDClayShape } from '../ui/ThreeDClayShape';
import { CourseStudioModal } from '../study/CourseStudioModal';
import { soundFx } from '../../lib/soundFx';

interface FuturisticProgressViewProps {
  stats: UserStats;
  recentSessions: StudySession[];
  activeMaterial: StudyMaterial | null;
  onAddMaterial: () => void;
  onSelectSession: (session: StudySession) => void;
  onQuickAction: (action: string) => void;
  onTryDemo: () => void;
}

export const FuturisticProgressView: React.FC<FuturisticProgressViewProps> = ({
  stats,
  recentSessions,
  activeMaterial,
  onAddMaterial,
  onSelectSession,
  onQuickAction,
  onTryDemo,
}) => {
  const [animatedSessions, setAnimatedSessions] = useState(0);
  const [animatedQuizzes, setAnimatedQuizzes] = useState(0);
  const [animatedCards, setAnimatedCards] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('cognisphere_student_name') || 'Andrea Brown';
  });

  // Selected course modal for 1:1 video recreation
  const [activeCourseModal, setActiveCourseModal] = useState<string | null>(null);

  // Calendar filter state
  const [calendarView, setCalendarView] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedDay, setSelectedDay] = useState(3); // Wednesday

  useEffect(() => {
    const targetSessions = stats.studySessions || 3;
    const targetQuizzes = stats.quizzesCompleted || 5;
    const targetCards = stats.flashcardsReviewed || 28;
    const targetScore = stats.averageQuizScore || 88;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        setAnimatedSessions(targetSessions);
        setAnimatedQuizzes(targetQuizzes);
        setAnimatedCards(targetCards);
        setAnimatedScore(targetScore);
        clearInterval(interval);
      } else {
        setAnimatedSessions(Math.round(targetSessions * progress));
        setAnimatedQuizzes(Math.round(targetQuizzes * progress));
        setAnimatedCards(Math.round(targetCards * progress));
        setAnimatedScore(Math.round(targetScore * progress));
      }
    }, 25);

    return () => clearInterval(interval);
  }, [stats]);

  const courses = [
    {
      id: 'js',
      title: 'JavaScript Basics',
      lessons: '12/20 lessons',
      progress: 45,
      shape: 'torus-pink' as const,
      color: 'from-pink-500/20 to-rose-500/20',
      tagColor: 'text-pink-500 bg-pink-500/10',
    },
    {
      id: 'html',
      title: 'HTML Basics',
      lessons: '13/20 lessons',
      progress: 55,
      shape: 'spiral-orange' as const,
      color: 'from-amber-500/20 to-orange-500/20',
      tagColor: 'text-orange-500 bg-orange-500/10',
    },
    {
      id: 'uiux',
      title: 'UI/UX design',
      lessons: '10/25 lessons',
      progress: 40,
      shape: 'ribbon-purple' as const,
      color: 'from-violet-500/20 to-purple-500/20',
      tagColor: 'text-purple-500 bg-purple-500/10',
    },
  ];

  const calendarDays = [
    { day: 'Mon', num: 1 },
    { day: 'Tue', num: 2 },
    { day: 'Wed', num: 3 },
    { day: 'Thu', num: 4 },
    { day: 'Fri', num: 5 },
    { day: 'Sat', num: 6 },
    { day: 'Sun', num: 7 },
  ];

  const handleOpenCourse = (title: string) => {
    soundFx.playStarChime();
    setActiveCourseModal(title);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
      
      {/* 1. TOP GREETING HEADER (from Video: Andrea Brown / Welcome Back) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Welcome back,
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight text-slate-900 dark:text-white">
            {studentName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClickSound();
              onTryDemo();
            }}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-xs font-mono font-bold italic shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>Load Demo Material</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClickSound();
              onAddMaterial();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-mono font-bold italic shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Notes</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD GRID: Left Side (Banner, Stats, Active Courses) & Right Side (Calendar & Homework) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* LEFT 2 COLUMNS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* VIDEO-INSPIRED HERO BANNER: "Learn today, succeed tomorrow!" */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#17382d] via-[#1a4435] to-[#122e23] p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-emerald-600/30">
            {/* Background 3D Clay Shapes Floating (Sphere, Crystal) */}
            <div className="absolute right-4 -top-6 pointer-events-none opacity-90 hidden sm:block">
              <ThreeDClayShape type="sphere-bumpy" size={130} />
            </div>
            <div className="absolute right-28 bottom-1 pointer-events-none opacity-80 hidden md:block">
              <ThreeDClayShape type="crystal-cyan" size={75} />
            </div>

            <div className="relative z-10 max-w-md space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight leading-tight">
                Learn today, <br /> succeed tomorrow!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-medium">
                Discover a new features for smart learning platform designed to help you grow and achieve your goals.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundFx.playStarChime();
                    handleOpenCourse('JavaScript Basics');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-white text-slate-950 font-black italic text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 VIBRANT STAT CARDS (from Video: Yellow New Courses, Cyan Course Progress, Purple Assignments) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. Golden Yellow Card: New Courses */}
            <Interactive3DCard glowColor="#eab308">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-sans shadow-lg flex flex-col justify-between h-36 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold italic">
                    <BookOpen className="w-4 h-4" />
                    <span>New courses</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/30 text-[10px] font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+40%</span>
                  </span>
                </div>
                <div>
                  <div className="text-4xl font-black italic tracking-tight">
                    +{animatedSessions}
                  </div>
                  <span className="text-[11px] font-medium opacity-90 block mt-0.5">
                    {animatedSessions} new courses started
                  </span>
                </div>
              </div>
            </Interactive3DCard>

            {/* 2. Cyan / Sky Blue Card: Course Progress */}
            <Interactive3DCard glowColor="#0284c7">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-sans shadow-lg flex flex-col justify-between h-36 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold italic">
                    <Layers className="w-4 h-4" />
                    <span>Course progress</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18%</span>
                  </span>
                </div>
                <div>
                  <div className="text-4xl font-black italic tracking-tight">
                    50%
                  </div>
                  <span className="text-[11px] font-medium opacity-90 block mt-0.5">
                    of your courses are done
                  </span>
                </div>
              </div>
            </Interactive3DCard>

            {/* 3. Deep Purple Card: Assignments */}
            <Interactive3DCard glowColor="#8b5cf6">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 text-white font-sans shadow-lg flex flex-col justify-between h-36 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold italic">
                    <Award className="w-4 h-4" />
                    <span>Assignments</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+10%</span>
                  </span>
                </div>
                <div>
                  <div className="text-4xl font-black italic tracking-tight">
                    {animatedScore}%
                  </div>
                  <span className="text-[11px] font-medium opacity-90 block mt-0.5">
                    Based on recent tasks
                  </span>
                </div>
              </div>
            </Interactive3DCard>

          </div>

          {/* ACTIVE COURSES SHELF WITH 3D CLAY OBJECTS (from Video) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black italic text-slate-900 dark:text-white">
                  Active courses
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                  5 courses
                </span>
              </div>

              <button
                onClick={() => handleOpenCourse('JavaScript Basics')}
                className="text-xs font-mono font-bold text-slate-500 hover:text-cyan-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Active Courses Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleOpenCourse(course.title)}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between h-56 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black italic text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                        {course.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {course.lessons}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-cyan-500 transition-all">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* 3D Clay Shape Centerpiece */}
                  <div className="my-auto flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                    <ThreeDClayShape type={course.shape} size={90} />
                  </div>

                  {/* Course Progress */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                      <span className="text-slate-500 dark:text-slate-400">{course.progress}% complete</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CALENDAR & HOMEWORK PROGRESS (from Video) */}
        <div className="space-y-6">
          
          {/* Calendar Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
            {/* View Switcher: Weekly / Monthly */}
            <div className="flex items-center justify-between">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                <button
                  onClick={() => setCalendarView('weekly')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    calendarView === 'weekly'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setCalendarView('monthly')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    calendarView === 'monthly'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400">
                2026
              </span>
            </div>

            {/* Big Month Header */}
            <div>
              <h3 className="text-3xl font-black italic text-slate-900 dark:text-white tracking-tight">
                September 22
              </h3>
            </div>

            {/* Days Row */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono">
              {calendarDays.map((item) => {
                const isSelected = selectedDay === item.num;
                return (
                  <button
                    key={item.num}
                    onClick={() => {
                      soundFx.playClickSound();
                      setSelectedDay(item.num);
                    }}
                    className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-white font-bold shadow-md scale-105'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] opacity-75">{item.day}</span>
                    <span className="text-sm font-bold mt-0.5">{item.num}</span>
                  </button>
                );
              })}
            </div>

            {/* Note & New Event Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => soundFx.playClickSound()}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Add a note</span>
              </button>
              <button
                onClick={() => soundFx.playClickSound()}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New event</span>
              </button>
            </div>
          </div>

          {/* Homework Progress Widget (from Video) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black italic text-slate-900 dark:text-white">
                Homework progress
              </h4>
              <button className="text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {/* Task 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">JavaScript lesson 1</span>
                  <span className="font-mono font-bold text-emerald-500">35%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="w-[35%] h-full rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Deadline: September 24
                </span>
              </div>

              {/* Task 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">HTML basics lesson 13</span>
                  <span className="font-mono font-bold text-emerald-500">65%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="w-[65%] h-full rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Deadline: September 28
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="mb-10">
        <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-3">
          Instant Neural Study Tools:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Interactive3DCard glowColor="#0284c7" onClick={() => onQuickAction('summary')}>
            <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl h-full flex flex-col justify-between group shadow-md hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black italic text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-200 transition-colors">
                    Summarize Notes
                  </h3>
                  <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 font-bold">Overview & Key Points</span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                <span>Launch Summary</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Interactive3DCard>

          <Interactive3DCard glowColor="#7c3aed" onClick={() => onQuickAction('quiz')}>
            <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl h-full flex flex-col justify-between group shadow-md hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black italic text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-200 transition-colors">
                    Generate Quiz
                  </h3>
                  <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold">5, 10, or 15 Questions</span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors flex items-center gap-1">
                <span>Start Active Recall</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Interactive3DCard>

          <Interactive3DCard glowColor="#2563eb" onClick={() => onQuickAction('flashcards')}>
            <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl h-full flex flex-col justify-between group shadow-md hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-blue-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black italic text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-blue-200 transition-colors">
                    Create Flashcards
                  </h3>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-blue-400 font-bold">3D Interactive Deck</span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors flex items-center gap-1">
                <span>Flip & Master</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Interactive3DCard>

          <Interactive3DCard glowColor="#059669" onClick={() => onQuickAction('chat')}>
            <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 backdrop-blur-xl h-full flex flex-col justify-between group shadow-md hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black italic text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition-colors">
                    Ask AI
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Neural Tutor Companion</span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                <span>Open Chat</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Interactive3DCard>
        </div>
      </div>

      {/* Course Studio Modal */}
      <CourseStudioModal
        isOpen={Boolean(activeCourseModal)}
        onClose={() => setActiveCourseModal(null)}
        courseTitle={activeCourseModal || 'JavaScript Basics'}
        onStartQuiz={() => {
          setActiveCourseModal(null);
          onQuickAction('quiz');
        }}
        onOpenFlashcards={() => {
          setActiveCourseModal(null);
          onQuickAction('flashcards');
        }}
      />

    </div>
  );
};
