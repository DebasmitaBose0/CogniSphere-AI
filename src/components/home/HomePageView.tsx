import React, { useState, useEffect } from 'react';
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
  Cpu,
  Brain,
  History,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  BookMarked,
  Edit3,
  Cloud,
  Check,
  ChevronRight,
  ExternalLink,
  Save,
  BarChart3,
  Copy,
  FolderGit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyMaterial, StudySession, UserStats } from '../../types';
import { InteractiveStudySphere } from '../three/InteractiveStudySphere';
import { Interactive3DCard } from '../ui/Interactive3DCard';
import { soundFx } from '../../lib/soundFx';

interface HomePageViewProps {
  activeMaterial: StudyMaterial | null;
  sessions: StudySession[];
  stats: UserStats;
  onNavigateTab: (tab: string) => void;
  onTryDemo: () => void;
}

interface StudyTarget {
  id: string;
  text: string;
  completed: boolean;
  category: 'quiz' | 'pomodoro' | 'notes' | 'flashcards' | 'map';
}

interface SubjectTopic {
  id: string;
  subject: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  mastery: number;
  status: 'Mastered' | 'In Progress' | 'Upcoming';
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  activeMaterial,
  sessions,
  stats,
  onNavigateTab,
  onTryDemo,
}) => {
  // 1. STUDENT PROFILE STATE
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('cognisphere_student_name') || 'Andrea Brown';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(studentName);

  // 2. TODAY'S STUDY TARGETS STATE
  const [targets, setTargets] = useState<StudyTarget[]>(() => {
    const saved = localStorage.getItem('cognisphere_study_targets');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: '1', text: 'Complete 25m Deep Work Pomodoro session', completed: true, category: 'pomodoro' },
      { id: '2', text: 'Master Cloud Computing & Distributed Consensus (Demo)', completed: true, category: 'notes' },
      { id: '3', text: 'Review 15 Spaced Repetition 3D Flashcards', completed: false, category: 'flashcards' },
      { id: '4', text: 'Score >= 85% in Active Recall Exam Quiz', completed: false, category: 'quiz' },
      { id: '5', text: 'Explore Knowledge Graph Concept Topology', completed: false, category: 'map' },
    ];
  });
  const [newTargetText, setNewTargetText] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('cognisphere_study_targets', JSON.stringify(targets));
  }, [targets]);

  const handleToggleTarget = (id: string) => {
    soundFx.playSuccessChord();
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetText.trim()) return;
    soundFx.playClickSound();
    const newTarget: StudyTarget = {
      id: `target-${Date.now()}`,
      text: newTargetText.trim(),
      completed: false,
      category: 'notes',
    };
    setTargets(prev => [...prev, newTarget]);
    setNewTargetText('');
  };

  const handleDeleteTarget = (id: string) => {
    soundFx.playClickSound();
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const completedTargetsCount = targets.filter(t => t.completed).length;
  const targetProgressPercent = targets.length > 0 ? Math.round((completedTargetsCount / targets.length) * 100) : 0;

  // 3. INTEGRATED POMODORO TIMER STATE
  type PomodoroMode = 'focus' | 'short_break' | 'long_break';
  const MODE_TIMES: Record<PomodoroMode, number> = {
    focus: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };
  const [pomoMode, setPomoMode] = useState<PomodoroMode>('focus');
  const [pomoTimeLeft, setPomoTimeLeft] = useState<number>(MODE_TIMES.focus);
  const [pomoIsRunning, setPomoIsRunning] = useState<boolean>(false);
  const [pomoCompleted, setPomoCompleted] = useState<number>(() => {
    return Number(localStorage.getItem('cognisphere_pomodoros') || 4);
  });

  useEffect(() => {
    let interval: any = null;
    if (pomoIsRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (pomoTimeLeft === 0) {
      setPomoIsRunning(false);
      soundFx.playSuccessChord();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      const nextCount = pomoCompleted + 1;
      setPomoCompleted(nextCount);
      localStorage.setItem('cognisphere_pomodoros', String(nextCount));
      if (pomoMode === 'focus') {
        setPomoMode('short_break');
        setPomoTimeLeft(MODE_TIMES.short_break);
      } else {
        setPomoMode('focus');
        setPomoTimeLeft(MODE_TIMES.focus);
      }
    }
    return () => clearInterval(interval);
  }, [pomoIsRunning, pomoTimeLeft, pomoMode]);

  const switchPomoMode = (mode: PomodoroMode) => {
    soundFx.playClickSound();
    setPomoMode(mode);
    setPomoTimeLeft(MODE_TIMES[mode]);
    setPomoIsRunning(false);
  };

  const pomoMinutes = Math.floor(pomoTimeLeft / 60);
  const pomoSeconds = pomoTimeLeft % 60;
  const pomoPercent = 100 - (pomoTimeLeft / MODE_TIMES[pomoMode]) * 100;

  // 4. STUDY NOTES SCRATCHPAD STATE
  const [scratchpadNote, setScratchpadNote] = useState<string>(() => {
    return localStorage.getItem('cognisphere_scratchpad') || 
`// COGNISPHERE STUDY SCRATCHPAD
• Information Entropy: H(X) = -Σ P(x) log2 P(x)
• Raft Consensus: Leader election requires strict majority (⌊N/2⌋ + 1)
• Cloud Resiliency: Deploy across min 3 Availability Zones with circuit breakers
• Spaced Repetition: Review intervals at 1d, 3d, 7d, 16d, 35d.`;
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSaveScratchpad = (text: string) => {
    setScratchpadNote(text);
    localStorage.setItem('cognisphere_scratchpad', text);
  };

  const handleCopyScratchpad = () => {
    navigator.clipboard.writeText(scratchpadNote);
    soundFx.playClickSound();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // 5. SUBJECT TOPICS SYLLABUS STATE
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const allTopics: SubjectTopic[] = [
    { id: 't1', subject: 'Cloud', title: 'CAP Theorem & Distributed Partitioning', difficulty: 'Advanced', duration: '45m', mastery: 92, status: 'Mastered' },
    { id: 't2', subject: 'Cloud', title: 'Kubernetes Pod Scheduling & Ingress Meshes', difficulty: 'Intermediate', duration: '35m', mastery: 78, status: 'In Progress' },
    { id: 't3', subject: 'Architecture', title: 'Virtual Memory & Page Table Walkers', difficulty: 'Advanced', duration: '50m', mastery: 85, status: 'Mastered' },
    { id: 't4', subject: 'Architecture', title: 'Cache Coherence Protocols (MESI & MOESI)', difficulty: 'Advanced', duration: '40m', mastery: 65, status: 'In Progress' },
    { id: 't5', subject: 'Algorithms', title: 'B-Trees & LSM-Tree Storage Engines', difficulty: 'Intermediate', duration: '30m', mastery: 88, status: 'Mastered' },
    { id: 't6', subject: 'Algorithms', title: 'Dijkstra & A* Graph Pathfinding', difficulty: 'Beginner', duration: '25m', mastery: 95, status: 'Mastered' },
    { id: 't7', subject: 'AI', title: 'Backpropagation & Gradient Clipping', difficulty: 'Intermediate', duration: '40m', mastery: 72, status: 'In Progress' },
    { id: 't8', subject: 'AI', title: 'Transformer Self-Attention Multi-Head Matrix', difficulty: 'Advanced', duration: '55m', mastery: 40, status: 'Upcoming' },
  ];

  const filteredTopics = selectedSubjectFilter === 'all' 
    ? allTopics 
    : allTopics.filter(t => t.subject.toLowerCase() === selectedSubjectFilter.toLowerCase());

  // 6. CALENDAR STATE
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(3); // Wednesday
  const calendarDays = [
    { day: 'Mon', num: 1, sessions: 2, streak: true },
    { day: 'Tue', num: 2, sessions: 3, streak: true },
    { day: 'Wed', num: 3, sessions: 4, streak: true, isToday: true },
    { day: 'Thu', num: 4, sessions: 1, streak: false },
    { day: 'Fri', num: 5, sessions: 2, streak: false },
    { day: 'Sat', num: 6, sessions: 3, streak: false },
    { day: 'Sun', num: 7, sessions: 1, streak: false },
  ];

  // 7. CORE SUBJECT CARDS DATA
  const subjectCards = [
    {
      id: 'cloud',
      title: 'Cloud Computing & Distributed Systems',
      lessons: '16/20 Lessons',
      progress: 80,
      topicsCount: 14,
      gradient: 'from-cyan-500/25 via-blue-500/20 to-indigo-500/10',
      borderGlow: '#00f0ff',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-400/30',
      icon: Cloud,
      tags: ['Consensus', 'Docker', 'AWS/GCP', 'Sharding'],
    },
    {
      id: 'arch',
      title: 'Computer Architecture & OS Internals',
      lessons: '14/18 Lessons',
      progress: 77,
      topicsCount: 12,
      gradient: 'from-blue-500/25 via-indigo-500/20 to-violet-500/10',
      borderGlow: '#3b82f6',
      tagColor: 'text-blue-400 bg-blue-500/10 border-blue-400/30',
      icon: Cpu,
      tags: ['Virtual Memory', 'Micro-Ops', 'Pipelining'],
    },
    {
      id: 'algo',
      title: 'Data Structures & Algorithmic Complexity',
      lessons: '18/20 Lessons',
      progress: 90,
      topicsCount: 16,
      gradient: 'from-violet-500/25 via-purple-500/20 to-fuchsia-500/10',
      borderGlow: '#a855f7',
      tagColor: 'text-violet-400 bg-violet-500/10 border-violet-400/30',
      icon: Layers,
      tags: ['B-Trees', 'Dynamic Prog', 'Graph BFS/DFS'],
    },
    {
      id: 'ai',
      title: 'Artificial Intelligence & Neural Architectures',
      lessons: '12/20 Lessons',
      progress: 60,
      topicsCount: 10,
      gradient: 'from-emerald-500/25 via-teal-500/20 to-cyan-500/10',
      borderGlow: '#10b981',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/30',
      icon: Brain,
      tags: ['Transformers', 'Backprop', 'Loss Functions'],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* =========================================================================
          HERO BANNER: BRAND & THREE.JS INTERACTIVE ROTATING STUDY SPHERE
          ========================================================================= */}
      <section className="space-y-6">
        
        {/* Top High-Tech Brand Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Spatial 3D Neural Learning Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black italic tracking-tight text-white drop-shadow-2xl">
              COGNISPHERE <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Your notes. Your AI. The smarter, 3D interactive way to study. Touch and rotate the knowledge sphere below, or launch straight into your study modules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playLaserPulse();
                onNavigateTab('study');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-white/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest New Notes</span>
            </button>

            <button
              onClick={() => {
                soundFx.playStarChime();
                onTryDemo();
                onNavigateTab('summary');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-mono text-xs font-semibold border border-white/15 backdrop-blur-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo Notes</span>
            </button>
          </div>
        </div>

        {/* 3D INTERACTIVE ROTATING STUDY SPHERE ("I Can Touch It" Three.js experience) */}
        <InteractiveStudySphere
          onIngestNotes={() => onNavigateTab('study')}
          onTryDemo={() => {
            onTryDemo();
            onNavigateTab('summary');
          }}
          onOpenKnowledgeMap={() => onNavigateTab('map')}
        />

      </section>


      {/* =========================================================================
          SECTION 1: WELCOME SECTION WITH STUDENT NAME
          ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Student Profile & Greeting */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black italic text-xl sm:text-2xl">
                  {studentName.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-mono font-black text-[9px] uppercase tracking-wider">
                LVL 12
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Welcome back,
                </span>
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-400 text-white font-bold text-sm font-sans focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        setStudentName(tempName.trim() || 'Andrea Brown');
                        localStorage.setItem('cognisphere_student_name', tempName.trim() || 'Andrea Brown');
                        setIsEditingName(false);
                        soundFx.playClickSound();
                      }}
                      className="p-1 rounded bg-cyan-500 text-slate-950 text-xs font-bold"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setTempName(studentName);
                      setIsEditingName(true);
                    }}
                    className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                    title="Edit Student Name"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black italic text-white tracking-tight">
                {studentName}
              </h2>

              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>Computer Science & Systems Major</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Study Session Active
                </span>
              </p>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>7 Days Active Streak</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-xs font-bold">
              <Award className="w-4 h-4 text-violet-400" />
              <span>Top 5% Cohort Mastery</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>28.5 hrs Total Focus</span>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 2 & 3: OVERALL STUDY PROGRESS & TODAY'S STUDY TARGETS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2: OVERALL STUDY PROGRESS PERCENTAGE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Curriculum Progress</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Overall Study Progress</h3>
            <p className="text-xs text-slate-400 mt-1">Aggregated mastery across all active modules</p>
          </div>

          {/* Glowing Radial Progress Meter */}
          <div className="flex items-center justify-center py-4 relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  className="stroke-slate-800"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  className="stroke-cyan-400 transition-all duration-1000 ease-out"
                  strokeWidth="14"
                  strokeDasharray={452.39}
                  strokeDashoffset={452.39 - (452.39 * 78) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.6))' }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black italic text-white tracking-tight">
                  78%
                </span>
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-semibold mt-0.5">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Topics Mastered</span>
              <span className="text-base font-bold text-white">42 / 54</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Quiz Accuracy</span>
              <span className="text-base font-bold text-emerald-400">88.4%</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: TODAY'S STUDY TARGETS */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Daily Objectives</span>
              <h3 className="text-xl font-bold text-white mt-1">Today's Study Targets</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                {completedTargetsCount} of {targets.length} Done ({targetProgressPercent}%)
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${targetProgressPercent}%` }}
            />
          </div>

          {/* Checklist of study targets */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {targets.map((tgt) => (
              <div
                key={tgt.id}
                onClick={() => handleToggleTarget(tgt.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  tgt.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300' 
                    : 'bg-slate-900/80 hover:bg-slate-900 border-white/10 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                    tgt.completed ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600 bg-slate-950'
                  }`}>
                    {tgt.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${tgt.completed ? 'line-through text-slate-500' : ''}`}>
                    {tgt.text}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTarget(tgt.id);
                  }}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  title="Remove target"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom target form */}
          <form onSubmit={handleAddTarget} className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              placeholder="Add a new daily study target..."
              value={newTargetText}
              onChange={(e) => setNewTargetText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

      </div>


      {/* =========================================================================
          SECTION 4: FLOATING SUBJECT CARDS (3D DEPTH & TACTILE HOVER)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Modular Study Workspaces</span>
            <h2 className="text-2xl sm:text-3xl font-black italic text-white mt-1">Core Subject Cards</h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:block">Interactive 3D Cards • Tilt to inspect</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjectCards.map((card) => {
            const Icon = card.icon;
            return (
              <Interactive3DCard key={card.id} glowColor={card.borderGlow}>
                <div 
                  onClick={() => {
                    soundFx.playClickSound();
                    onNavigateTab('summary');
                  }}
                  className={`p-6 rounded-3xl bg-gradient-to-br ${card.gradient} bg-slate-950/85 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl shadow-xl flex flex-col justify-between h-72 group transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${card.tagColor}`}>
                        {card.lessons}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {card.title}
                    </h3>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {card.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Mastery Level</span>
                      <span className="text-white font-bold">{card.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-400 h-full transition-all duration-500"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Interactive3DCard>
            );
          })}
        </div>
      </section>


      {/* =========================================================================
          SECTION 5: QUICK ACTIONS DOCK
          ========================================================================= */}
      <section className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-2xl shadow-xl">
        <div className="mb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">One-Click Workflows</span>
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'study', label: 'Ingest Notes', icon: BookOpen, color: 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30' },
            { id: 'quiz', label: 'Launch Quiz', icon: HelpCircle, color: 'text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30' },
            { id: 'flashcards', label: '3D Flashcards', icon: Layers, color: 'text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/30' },
            { id: 'chat', label: 'Neural AI Tutor', icon: MessageSquare, color: 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30' },
            { id: 'map', label: 'Knowledge Map', icon: Share2, color: 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30' },
            { id: 'history', label: 'Deep Focus & Log', icon: Timer, color: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30' },
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  soundFx.playClickSound();
                  onNavigateTab(act.id);
                }}
                className={`p-3.5 rounded-2xl border ${act.color} transition-all cursor-pointer flex flex-col items-center text-center gap-2 group hover:scale-105 active:scale-95`}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-mono font-semibold text-white">{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>


      {/* =========================================================================
          SECTION 6 & 7: SUBJECT TOPICS SYLLABUS & STUDY NOTES SCRATCHPAD
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 6: SUBJECT TOPICS BREAKDOWN */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Syllabus Breakdown</span>
                <h3 className="text-xl font-bold text-white mt-1">Subject Topics Explorer</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{filteredTopics.length} Topics</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {['all', 'cloud', 'architecture', 'algorithms', 'ai'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => {
                    soundFx.playClickSound();
                    setSelectedSubjectFilter(flt);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-medium capitalize transition-all cursor-pointer ${
                    selectedSubjectFilter === flt
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          {/* Topic list */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredTopics.map((top) => (
              <div
                key={top.id}
                onClick={() => {
                  soundFx.playStarChime();
                  onNavigateTab('summary');
                }}
                className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {top.title}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${
                      top.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      top.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {top.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>Est: {top.duration}</span>
                    <span>•</span>
                    <span className="text-cyan-400">Mastery: {top.mastery}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 shrink-0">
                  <span className="hidden sm:inline">Practice</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigateTab('summary')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Explore Full Curriculum Ingestion</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* SECTION 7: STUDY NOTES & SCRATCHPAD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Knowledge Notes</span>
              <h3 className="text-xl font-bold text-white mt-1">Study Notes & Scratchpad</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyScratchpad}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                title="Copy note text"
              >
                <Copy className="w-3 h-3" />
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={() => onNavigateTab('summary')}
                className="px-3 py-1.5 rounded-xl bg-violet-500/20 border border-violet-400/40 text-xs font-mono text-violet-300 font-semibold hover:bg-violet-500/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Full Summary</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Active Note Preview Card */}
          {activeMaterial && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Active Extracted Note</span>
                <h4 className="text-xs font-bold text-white truncate max-w-xs">{activeMaterial.title}</h4>
              </div>
              <button
                onClick={() => onNavigateTab('summary')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-mono font-bold text-[10px]"
              >
                Review
              </button>
            </div>
          )}

          {/* Live Scratchpad Textarea */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Quick Scratchpad (Autosaved to Local Storage)</span>
              <span className="text-emerald-400">● Synchronized</span>
            </label>
            <textarea
              value={scratchpadNote}
              onChange={(e) => handleSaveScratchpad(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 transition-all resize-none leading-relaxed"
              placeholder="Type formulas, quick notes, key questions..."
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>{scratchpadNote.split(/\s+/).filter(Boolean).length} words</span>
            <button
              onClick={() => handleSaveScratchpad('')}
              className="text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear Scratchpad
            </button>
          </div>
        </div>

      </div>


      {/* =========================================================================
          SECTION 8 & 9: POMODORO STUDY TIMER & QUIZ SYSTEM SHOWCASE
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 8: POMODORO STUDY TIMER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Deep Work Interval</span>
                <h3 className="text-xl font-bold text-white">Pomodoro Study Timer</h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{pomoCompleted} Pomodoros</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center p-1 rounded-2xl bg-slate-900 border border-white/10 max-w-sm mx-auto w-full">
            <button
              onClick={() => switchPomoMode('focus')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                pomoMode === 'focus' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => switchPomoMode('short_break')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                pomoMode === 'short_break' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Short (5m)
            </button>
            <button
              onClick={() => switchPomoMode('long_break')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                pomoMode === 'long_break' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Long (15m)
            </button>
          </div>

          {/* Clock Display */}
          <div className="text-center py-2 space-y-2">
            <div className="font-mono text-5xl sm:text-6xl font-black italic tracking-tight text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {String(pomoMinutes).padStart(2, '0')}:{String(pomoSeconds).padStart(2, '0')}
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {pomoIsRunning ? (pomoMode === 'focus' ? 'Deep Focus Session In Progress' : 'Recharge Break') : 'Timer Paused'}
            </p>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5 mt-3">
              <div 
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${pomoPercent}%` }}
              />
            </div>
          </div>

          {/* Timer Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFx.playClickSound();
                setPomoIsRunning(prev => !prev);
              }}
              className={`px-8 py-3 rounded-2xl text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                pomoIsRunning 
                  ? 'bg-slate-800 text-amber-300 border border-amber-400/40 hover:bg-slate-700' 
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              {pomoIsRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playClickSound();
                setPomoIsRunning(false);
                setPomoTimeLeft(MODE_TIMES[pomoMode]);
              }}
              title="Reset Timer"
              className="p-3 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 9: QUIZ SYSTEM SHOWCASE & CHALLENGE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-violet-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-violet-400" />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Active Recall Testing</span>
                <h3 className="text-xl font-bold text-white">Interactive Quiz System</h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-xs font-bold">
              Adaptive Multi-Tier
            </span>
          </div>

          {/* Daily Recall Challenge Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-transparent border border-violet-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-300 font-bold">Daily Recall Challenge</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Ready</span>
            </div>
            
            <h4 className="text-base font-bold text-white">
              Cloud Computing & Distributed Partition Tolerance
            </h4>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Test your knowledge on Raft quorum rules, CAP Theorem trade-offs, and multi-region microservices replication.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs font-mono">
              <span className="text-slate-400">5 Questions</span>
              <span>•</span>
              <span className="text-cyan-400">Instant Explanations</span>
              <span>•</span>
              <span className="text-amber-400">+50 XP</span>
            </div>
          </div>

          {/* Recent Quiz Performance Stats */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Quizzes Passed</span>
              <span className="text-base font-bold text-white">{stats.quizzesCompleted || 5}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Avg Score</span>
              <span className="text-base font-bold text-violet-400">{stats.averageQuizScore || 88}%</span>
            </div>
          </div>

          {/* Launch Quiz Button */}
          <button
            onClick={() => {
              soundFx.playLaserPulse();
              onNavigateTab('quiz');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20"
          >
            <span>Launch Active Recall Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>


      {/* =========================================================================
          SECTION 10 & 11: STUDY CALENDAR & PROGRESS ANALYTICS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 10: CALENDAR & DEADLINES */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Study Schedule</span>
                <h3 className="text-lg font-bold text-white">Weekly Calendar</h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">October 2026</span>
          </div>

          {/* Weekday Strip */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {calendarDays.map((d) => (
              <div
                key={d.num}
                onClick={() => {
                  soundFx.playClickSound();
                  setSelectedCalendarDay(d.num);
                }}
                className={`p-2 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedCalendarDay === d.num
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/5'
                }`}
              >
                <span className="text-[10px] font-mono uppercase">{d.day}</span>
                <span className="text-sm font-bold">{d.num}</span>
                {d.streak && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCalendarDay === d.num ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Upcoming Deadlines */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Upcoming Deadlines</span>
            
            <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-white">Cloud Architecture Quiz</h5>
                <p className="text-[10px] font-mono text-rose-400">In 2 days • Friday, 2:00 PM</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">Exam</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-white">Algorithms Problem Set</h5>
                <p className="text-[10px] font-mono text-cyan-400">In 5 days • Monday</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">P-Set</span>
            </div>
          </div>
        </div>

        {/* SECTION 11: PROGRESS ANALYTICS & WEEKLY METRICS */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Cognitive Metrics</span>
                <h3 className="text-lg font-bold text-white">Progress Analytics</h3>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
              +18% Efficiency this week
            </span>
          </div>

          {/* Weekly Study Hours Bar Chart */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">Hours Studied Per Day</span>
            
            <div className="h-40 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
              {[
                { day: 'Mon', hours: 3.5, height: '60%' },
                { day: 'Tue', hours: 4.8, height: '80%' },
                { day: 'Wed', hours: 5.5, height: '95%', isToday: true },
                { day: 'Thu', hours: 2.0, height: '35%' },
                { day: 'Fri', hours: 4.2, height: '70%' },
                { day: 'Sat', hours: 5.0, height: '85%' },
                { day: 'Sun', hours: 3.0, height: '50%' },
              ].map((bar, bIdx) => (
                <div key={bIdx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.hours}h
                  </span>
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      bar.isToday 
                        ? 'bg-gradient-to-t from-cyan-500 to-blue-400 shadow-[0_0_15px_rgba(0,240,255,0.5)]' 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    style={{ height: bar.height }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Distributed Systems</span>
                <span className="text-cyan-400 font-bold">88%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[88%]" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Computer Architecture</span>
                <span className="text-violet-400 font-bold">75%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-violet-400 h-full w-[75%]" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Data Structures</span>
                <span className="text-emerald-400 font-bold">92%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[92%]" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
