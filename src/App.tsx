import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { SpatialCanvas } from './components/spatial/SpatialCanvas';
import { HomePageView } from './components/home/HomePageView';
import { FuturisticUploadPedestal } from './components/study/FuturisticUploadPedestal';
import { FuturisticSummaryView } from './components/summary/FuturisticSummaryView';
import { FuturisticQuizView } from './components/quiz/FuturisticQuizView';
import { FuturisticFlashcardView } from './components/flashcards/FuturisticFlashcardView';
import { FuturisticAIChatView } from './components/chat/FuturisticAIChatView';
import { KnowledgeGraphView } from './components/graph/KnowledgeGraphView';
import { FuturisticProgressView } from './components/dashboard/FuturisticProgressView';
import { HistoryManager } from './components/history/HistoryManager';
import { StudyPomodoro } from './components/tools/StudyPomodoro';
import { CinematicIntro } from './components/cinematic/CinematicIntro';

import { StudyMaterial, StudySession, UserStats } from './types';
import { 
  getUserStats, 
  getActiveMaterial, 
} from './services/storage';
import {
  saveStudyMaterialBackend,
  fetchStudySessionsBackend,
  saveStudySessionBackend,
  deleteStudySessionBackend,
} from './services/studyBackend';
import { 
  CLOUD_COMPUTING_DEMO_TITLE, 
  CLOUD_COMPUTING_DEMO_CONTENT 
} from './data/cloudComputingDemo';
import { countWords } from './lib/utils';
import { soundFx } from './lib/soundFx';
import { Sparkles } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [showCinematic, setShowCinematic] = useState<boolean>(false);

  // App state
  const [activeMaterial, setActiveMatState] = useState<StudyMaterial | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState<UserStats>({
    studySessions: 0,
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    averageQuizScore: 0,
  });

  // Initialize theme and local storage
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const loadedMaterial = getActiveMaterial();
    if (loadedMaterial) {
      setActiveMatState(loadedMaterial);
    }
    refreshData();
  }, []);

  const refreshData = async () => {
    const loadedSessions = await fetchStudySessionsBackend();
    setSessions(loadedSessions);
    setStats(getUserStats());
  };

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleCompleteCinematic = () => {
    setShowCinematic(false);
    sessionStorage.setItem('study_buddy_intro_seen', 'true');
  };

  const handleTriggerCinematic = () => {
    setShowCinematic(true);
  };

  // Processing new study material
  const handleProcessMaterial = (title: string, content: string) => {
    soundFx.playLaserPulse();
    const newMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toISOString(),
      wordCount: countWords(content),
    };

    setActiveMatState(newMaterial);
    saveStudyMaterialBackend(newMaterial);

    // Save session record
    const sessionRecord: StudySession = {
      id: `sess-${Date.now()}`,
      title,
      date: new Date().toISOString(),
      materialPreview: content.slice(0, 140) + '...',
      hasSummary: true,
    };
    saveStudySessionBackend(sessionRecord);
    refreshData();
  };

  // 1-Click Cloud Computing Demo Loader
  const handleTryDemo = () => {
    soundFx.playStarChime();
    handleProcessMaterial(CLOUD_COMPUTING_DEMO_TITLE, CLOUD_COMPUTING_DEMO_CONTENT);
  };

  // Callback when a quiz finishes
  const handleSaveQuizResult = (score: number, total: number) => {
    if (!activeMaterial) return;
    soundFx.playSuccessChord();
    const sessionRecord: StudySession = {
      id: `sess-${Date.now()}`,
      title: activeMaterial.title,
      date: new Date().toISOString(),
      materialPreview: activeMaterial.content.slice(0, 140) + '...',
      hasSummary: true,
      quizScore: score,
      quizTotal: total,
    };
    saveStudySessionBackend(sessionRecord);
    refreshData();
  };

  // Callback when flashcards are reviewed
  const handleUpdateFlashcardStats = (masteredCount: number) => {
    if (!activeMaterial) return;
    soundFx.playStarChime();
    const sessionRecord: StudySession = {
      id: `sess-${Date.now()}`,
      title: activeMaterial.title,
      date: new Date().toISOString(),
      materialPreview: activeMaterial.content.slice(0, 140) + '...',
      hasSummary: true,
      flashcardMastered: masteredCount,
    };
    saveStudySessionBackend(sessionRecord);
    refreshData();
  };

  // Resuming session from History or Dashboard
  const handleSelectSession = (session: StudySession) => {
    soundFx.playClickSound();
    if (session.title.includes('Cloud Computing')) {
      handleProcessMaterial(CLOUD_COMPUTING_DEMO_TITLE, CLOUD_COMPUTING_DEMO_CONTENT);
    }
  };

  const handleDeleteSession = (id: string) => {
    soundFx.playClickSound();
    deleteStudySessionBackend(id);
    refreshData();
  };

  const handleClearAllHistory = () => {
    soundFx.playClickSound();
    refreshData();
  };

  const handleNavbarSelectTab = (tab: string) => {
    soundFx.playClickSound();
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render clean dedicated workspace page based on tab
  const renderActivePage = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <HomePageView
            activeMaterial={activeMaterial}
            sessions={sessions}
            stats={stats}
            onNavigateTab={handleNavbarSelectTab}
            onTryDemo={handleTryDemo}
          />
        );
      case 'study':
        return (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <FuturisticUploadPedestal
              currentTitle={activeMaterial?.title}
              currentContent={activeMaterial?.content}
              onProcessMaterial={(title, content) => {
                handleProcessMaterial(title, content);
                setCurrentTab('summary');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateNext={(dest) => {
                setCurrentTab(dest);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        );
      case 'summary':
        return (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <FuturisticSummaryView
              material={activeMaterial}
              onNavigateToStudy={() => handleNavbarSelectTab('study')}
              onNavigateToQuiz={() => handleNavbarSelectTab('quiz')}
            />
          </div>
        );
      case 'quiz':
        return (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <FuturisticQuizView
              material={activeMaterial}
              onSaveQuizResult={handleSaveQuizResult}
              onNavigateToStudy={() => handleNavbarSelectTab('study')}
              onNavigateToFlashcards={() => handleNavbarSelectTab('flashcards')}
            />
          </div>
        );
      case 'flashcards':
        return (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <FuturisticFlashcardView
              material={activeMaterial}
              onUpdateFlashcardStats={handleUpdateFlashcardStats}
              onNavigateToStudy={() => handleNavbarSelectTab('study')}
              onNavigateToChat={() => handleNavbarSelectTab('chat')}
            />
          </div>
        );
      case 'chat':
        return (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <FuturisticAIChatView
              material={activeMaterial}
              onNavigateToStudy={() => handleNavbarSelectTab('study')}
            />
          </div>
        );
      case 'map':
        return (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <KnowledgeGraphView
              material={activeMaterial}
              onNavigateToStudy={() => handleNavbarSelectTab('study')}
              onNavigateToQuiz={() => handleNavbarSelectTab('quiz')}
            />
          </div>
        );
      case 'dashboard':
        return (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <FuturisticProgressView
              stats={stats}
              recentSessions={sessions}
              activeMaterial={activeMaterial}
              onAddMaterial={() => handleNavbarSelectTab('study')}
              onSelectSession={(sess) => {
                handleSelectSession(sess);
                handleNavbarSelectTab('summary');
              }}
              onQuickAction={(action) => handleNavbarSelectTab(action)}
              onTryDemo={() => {
                handleTryDemo();
                handleNavbarSelectTab('summary');
              }}
            />
          </div>
        );
      case 'history':
        return (
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
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
                  handleSelectSession(sess);
                  handleNavbarSelectTab('summary');
                }}
                onDeleteSession={handleDeleteSession}
                onClearAll={handleClearAllHistory}
                onNavigateToStudy={() => handleNavbarSelectTab('study')}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 transition-colors duration-500 font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Fullscreen Cinematic Opening Intro Sequence */}
      {showCinematic && (
        <CinematicIntro onComplete={handleCompleteCinematic} />
      )}

      {/* Unified Persistent Three.js Spatial Canvas */}
      <SpatialCanvas />

      {/* Floating Minimalist Capsule Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavbarSelectTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onTriggerCinematic={handleTriggerCinematic}
      />

      {/* Clean Dedicated Page View */}
      <main className="flex-1 relative z-10">
        {renderActivePage()}
      </main>

      {/* Global Spatial Glass Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 bg-slate-950/90 backdrop-blur-2xl text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm tracking-wider">
              COGNISPHERE <span className="text-cyan-400">AI</span>
            </span>
            <span>—</span>
            <span>“Your notes. Your AI. The smarter, 3D interactive way to study.”</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-cyan-300">Spatial Three.js CS Matrix</span>
            <Sparkles className="w-2.5 h-2.5 text-cyan-400/60" />
            <span className="text-violet-300">Modular Workspace</span>
            <Sparkles className="w-2.5 h-2.5 text-violet-400/60" />
            <span className="text-emerald-300">Supabase Cloud Sync</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
