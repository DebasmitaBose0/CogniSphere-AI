import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Coffee, 
  Volume2, 
  VolumeX, 
  CheckCircle,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

type TimerMode = 'focus' | 'short_break' | 'long_break';

const MODE_TIMES: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export const StudyPomodoro: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_TIMES.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('astralearn_pomodoros') || localStorage.getItem('noetica_pomodoros') || 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerFinish();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerFinish = () => {
    setIsRunning(false);
    
    // Play celebratory tone via Web Audio API (zero audio file assets required)
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch {
        // audio context fallback
      }
    }

    if (mode === 'focus') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
      const updated = completedSessions + 1;
      setCompletedSessions(updated);
      try {
        localStorage.setItem('astralearn_pomodoros', String(updated));
      } catch {}
      // Auto-switch to short break
      setMode('short_break');
      setTimeLeft(MODE_TIMES.short_break);
    } else {
      // Switch to focus
      setMode('focus');
      setTimeLeft(MODE_TIMES.focus);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
    setIsRunning(false);
  };

  const toggleStart = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = 100 - (timeLeft / MODE_TIMES[mode]) * 100;

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-700/30 bg-white/70 dark:bg-forest-950/40 backdrop-blur shadow-sm space-y-6">
      
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-forest-700 dark:text-forest-400">
          <Timer className="w-5 h-5" />
          <span className="font-serif font-semibold text-lg text-ink-900 dark:text-forest-50">
            Deep Work Focus Timer
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
            <Flame className="w-3.5 h-3.5" />
            <span>{completedSessions} Pomodoros</span>
          </div>

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? "Mute bell" : "Enable bell"}
            className="p-1.5 rounded-lg text-ink-500 dark:text-forest-400 hover:bg-forest-900/5 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center p-1 rounded-2xl bg-forest-900/5 dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-700/40 max-w-sm mx-auto">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
            mode === 'focus'
              ? 'bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 shadow-xs'
              : 'text-ink-600 dark:text-forest-300 hover:text-ink-900'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('short_break')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
            mode === 'short_break'
              ? 'bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 shadow-xs'
              : 'text-ink-600 dark:text-forest-300 hover:text-ink-900'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => switchMode('long_break')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
            mode === 'long_break'
              ? 'bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 shadow-xs'
              : 'text-ink-600 dark:text-forest-300 hover:text-ink-900'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Timer Circular Display & Progress */}
      <div className="text-center py-4 relative">
        <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-ink-900 dark:text-forest-50">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400 mt-2">
          {isRunning ? (mode === 'focus' ? 'Session In Progress' : 'Rest & Recharge') : 'Paused'}
        </p>

        {/* Subtle Progress Bar */}
        <div className="max-w-xs mx-auto mt-4 bg-forest-900/10 dark:bg-forest-800/40 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleStart}
          className={`px-8 py-3 rounded-2xl text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 shadow-md transition-all ${
            isRunning 
              ? 'bg-amber-600 hover:bg-amber-700 text-white' 
              : 'bg-forest-900 hover:bg-forest-950 dark:bg-forest-200 dark:hover:bg-white text-forest-50 dark:text-forest-950'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          title="Reset timer"
          className="p-3 rounded-2xl border border-forest-900/15 dark:border-forest-700/40 text-ink-600 dark:text-forest-300 hover:bg-forest-900/5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
