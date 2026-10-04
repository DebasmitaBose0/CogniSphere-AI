import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  History, 
  Moon, 
  Sun, 
  Menu, 
  X,
  GraduationCap,
  Timer,
  User,
  Atom,
  Share2,
  BookMarked,
  Volume2,
  VolumeX,
  Clapperboard,
  Compass
} from 'lucide-react';
import { soundFx } from '../../lib/soundFx';
import { isSupabaseConfigured } from '../../lib/supabase';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onTriggerCinematic?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  onTriggerCinematic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'study', label: 'Ingest Notes', icon: BookOpen },
    { id: 'summary', label: 'Summary', icon: BookMarked },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards', label: '3D Flashcards', icon: Layers },
    { id: 'chat', label: 'Ask AI', icon: MessageSquare },
    { id: 'map', label: 'Knowledge Map', icon: Share2 },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playClickSound();
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const handleToggleSound = () => {
    const newMuted = soundFx.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundFx.playStarChime();
    }
  };

  const handleCinematicClick = () => {
    soundFx.playCinematicWhoosh();
    if (onTriggerCinematic) {
      onTriggerCinematic();
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-md dark:shadow-lg py-1 border-b border-slate-200 dark:border-white/10' 
        : 'bg-white/85 dark:bg-slate-950/75 backdrop-blur-lg py-2 border-b border-slate-200/60 dark:border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className={`rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-violet-600 text-white flex items-center justify-center font-black italic shadow-md group-hover:scale-105 border border-cyan-400/40 transition-all duration-300 ${
              isScrolled ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
            }`}>
              CS
            </div>
            <div className="flex flex-col">
              <span className={`font-sans font-black italic tracking-tight text-slate-900 dark:text-white leading-none transition-all duration-300 ${
                isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
              }`}>
                Cogni<span className="text-cyan-600 dark:text-cyan-400">Sphere</span>
              </span>
              <span className={`tracking-widest uppercase font-mono font-bold italic text-cyan-700 dark:text-cyan-400/80 transition-all duration-300 ${
                isScrolled ? 'text-[8px] scale-95 origin-left' : 'text-[9px]'
              }`}>
                Spatial 3D AI Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 rounded-full font-mono transition-all duration-200 cursor-pointer ${
                    isScrolled ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
                  } ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={isScrolled ? "w-3 h-3 text-cyan-500 dark:text-cyan-400" : "w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400"} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Utilities (Sound Toggle, Theme, Dashboard) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Supabase Cloud / Local Engine Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-mono text-cyan-600 dark:text-cyan-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'} animate-pulse`} />
              <span>{isSupabaseConfigured ? 'Supabase Synced' : 'Local Offline Engine'}</span>
            </div>

            {/* Sound FX & Music Equalizer Toggle */}
            <button
              onClick={handleToggleSound}
              aria-label="Toggle Sound Effects"
              className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 ${
                !isMuted 
                  ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-600 dark:text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]' 
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-400'
              }`}
              title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-cyan-500" />
                  {/* Dancing equalizer bars */}
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={() => {
                soundFx.playClickSound();
                onToggleTheme();
              }}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-white/10"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* User Profile Icon */}
            <button
              onClick={() => handleNavClick('dashboard')}
              aria-label="User Profile"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Student Dashboard"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-400/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
