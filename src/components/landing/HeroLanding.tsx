import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Layers, 
  HelpCircle, 
  Share2, 
  CheckCircle2,
  BookmarkCheck,
  Play
} from 'lucide-react';
import { KnowledgeOrb } from '../orb/KnowledgeOrb';
import { Interactive3DCard } from '../ui/Interactive3DCard';
import { ThreeDClayShape } from '../ui/ThreeDClayShape';
import { soundFx } from '../../lib/soundFx';

interface HeroLandingProps {
  onStartLearning: () => void;
  onTryDemo: () => void;
  onOpenKnowledgeMap: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartLearning,
  onTryDemo,
  onOpenKnowledgeMap,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);

  const handleStartLearningClick = () => {
    soundFx.playCinematicWhoosh();
    setIsExpanding(true);
    setTimeout(() => {
      onStartLearning();
    }, 600);
  };

  const handleDemoClick = () => {
    soundFx.playStarChime();
    onTryDemo();
  };

  const handleMapClick = () => {
    soundFx.playClickSound();
    onOpenKnowledgeMap();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Floating 3D Background Sculptures (from Video) */}
      <div className="absolute left-6 top-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity hidden xl:block">
        <ThreeDClayShape type="torus-pink" size={110} />
      </div>
      <div className="absolute right-8 top-32 pointer-events-none opacity-40 hover:opacity-100 transition-opacity hidden xl:block">
        <ThreeDClayShape type="crystal-cyan" size={90} />
      </div>
      <div className="absolute left-16 bottom-32 pointer-events-none opacity-30 hover:opacity-100 transition-opacity hidden xl:block">
        <ThreeDClayShape type="spiral-orange" size={80} />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Left Column: Oversized Typography & Educational Identity */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-400/30 text-xs font-mono font-bold italic text-blue-700 dark:text-cyan-300 shadow-sm"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 animate-pulse" />
            <span className="tracking-wider uppercase">Next-Gen AI Study Companion</span>
          </motion.div>

          {/* Oversized Hero Typography in Bold Italics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-1 sm:space-y-2 select-none"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none text-slate-950 dark:text-white drop-shadow-sm">
              AI
            </h1>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-blue-400 dark:to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
              STUDY
            </h1>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none text-slate-950 dark:text-white drop-shadow-sm">
              BUDDY
            </h1>
          </motion.div>

          {/* Official Tagline in Bold Italics */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl sm:text-2xl font-bold italic text-slate-800 dark:text-slate-200 tracking-tight font-sans"
          >
            “Your notes. Your AI. Your smarter way to study.”
          </motion.p>

          {/* Value Prop Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl"
          >
            Transform lectures, textbook chapters, and study notes into realistic 3D flashcards, difficulty-tiered active recall quizzes, interactive SVG knowledge maps, and an intelligent academic tutor.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <button
              onClick={handleStartLearningClick}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-black italic text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer border border-white/20"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={handleDemoClick}
              className="px-6 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-sm font-bold italic transition-all duration-300 flex items-center gap-2 backdrop-blur-xl shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Load Cloud Computing Demo</span>
            </button>

            <button
              onClick={handleMapClick}
              className="px-5 py-4 rounded-2xl bg-slate-100/90 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 backdrop-blur-lg cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>SVG Knowledge Map</span>
            </button>
          </motion.div>

          {/* Live Academic Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/10"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Zero WebGL Glitches
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              100% Offline Ready Demo
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Active Recall & Spaced Repetition
            </span>
          </motion.div>

        </div>

        {/* Right Column: Central Interactive Knowledge Orb */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <KnowledgeOrb
            onStartLearning={handleStartLearningClick}
            isExpanding={isExpanding}
          />
        </div>

      </div>

      {/* Feature Pillars Preview with Interactive 3D Cards */}
      <div className="relative z-10 max-w-6xl w-full mx-auto mt-20 sm:mt-24 pt-12 border-t border-slate-200 dark:border-white/10">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            Cognitive Acceleration Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black italic text-slate-900 dark:text-white">
            Engineered For Rapid Knowledge Absorption
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Interactive3DCard glowColor="#0284c7" onClick={handleStartLearningClick}>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-400/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black italic text-slate-900 dark:text-white mb-2">Lecture Ingestion</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Multi-stage neural parsing that deconstructs raw notes into structured concepts, formulas, and definitions.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold italic text-blue-600 dark:text-cyan-400 mt-4 flex items-center gap-1.5">
                <span>Stage 1: Disassembly</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Interactive3DCard>

          <Interactive3DCard glowColor="#7c3aed" onClick={handleDemoClick}>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 dark:bg-violet-500/10 border border-violet-500/20 dark:border-violet-400/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black italic text-slate-900 dark:text-white mb-2">Active Recall Arena</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Difficulty-tiered interactive quizzes with radial score telemetry and energy feedback pulses.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold italic text-violet-600 dark:text-violet-400 mt-4 flex items-center gap-1.5">
                <span>Stage 2: Retention</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Interactive3DCard>

          <Interactive3DCard glowColor="#2563eb" onClick={handleStartLearningClick}>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-blue-500/10 border border-indigo-500/20 dark:border-blue-400/30 flex items-center justify-center text-indigo-600 dark:text-blue-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black italic text-slate-900 dark:text-white mb-2">3D Flashcard Deck</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Physically stacked 3D flashcards with shuffle algorithms and spaced repetition state tracking.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold italic text-indigo-600 dark:text-blue-400 mt-4 flex items-center gap-1.5">
                <span>Stage 3: Memorization</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Interactive3DCard>

          <Interactive3DCard glowColor="#059669" onClick={handleMapClick}>
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-400/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black italic text-slate-900 dark:text-white mb-2">Neural SVG Map</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  Explore hierarchical concept linkages and dependency flows with interactive glowing nodes.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold italic text-emerald-600 dark:text-emerald-400 mt-4 flex items-center gap-1.5">
                <span>Stage 4: Synthesis</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Interactive3DCard>

        </div>
      </div>

    </div>
  );
};
