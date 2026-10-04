import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, FastForward, Compass, Volume2, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

interface CinematicIntroProps {
  onComplete: () => void;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [telemetryStep, setTelemetryStep] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const speedRef = useRef(1.5);

  const telemetryLines = [
    'ALIGNING NEURAL RECALL CORES...',
    'SYNTHESIZING 3D SPATIAL KNOWLEDGE...',
    'QUANTUM STUDY MATRIX ONLINE...',
    'READY FOR HYPERSPACE ABSORPTION'
  ];

  // Telemetry cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryStep(prev => (prev < telemetryLines.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  // 3D Star Warp Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const starColors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#ffffff', '#fbbf24'];
    const starCount = 450;
    const stars: Star3D[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: Math.random() * width,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    const render = () => {
      // Semi-transparent clear for cinematic light streak trails
      ctx.fillStyle = isWarping ? 'rgba(3, 7, 18, 0.25)' : 'rgba(3, 7, 18, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const speed = speedRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 0) {
          s.z = width;
          s.pz = width;
          s.x = (Math.random() - 0.5) * width * 2;
          s.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 280 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        const pk = 280 / s.pz;
        const oldPx = s.x * pk + cx;
        const oldPy = s.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.8, (1 - s.z / width) * (isWarping ? 4.5 : 2.5));
          const alpha = Math.min(1, Math.max(0.1, (1 - s.z / width) * 1.3));

          ctx.beginPath();
          ctx.strokeStyle = s.color;
          ctx.lineWidth = size;
          ctx.globalAlpha = alpha;
          ctx.moveTo(oldPx, oldPy);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Core bright spark
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isWarping]);

  const handleLaunch = () => {
    setIsWarping(true);
    speedRef.current = 28; // Hyperdrive acceleration!

    soundFx.playCinematicWhoosh();
    setTimeout(() => {
      soundFx.playStarChime();
    }, 400);

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 1200);
  };

  const handleSkip = () => {
    soundFx.playClickSound();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: 'blur(16px)' }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#030712] text-white select-none overflow-hidden"
        >
          {/* 3D Starfield Warp Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {/* Optical Lens Flares & Ambient Starlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-violet-600/20 blur-[130px] pointer-events-none" />

          {/* Top HUD Telemetry Bar */}
          <div className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-cyan-500/20 pb-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black italic text-xs shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                AI
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                  AI Study Buddy // Cinematic OS
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  BUILD v2.4.0 • SYSTEM STATUS: OPTIMAL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Audio Engine Armed</span>
              </div>
              <button
                onClick={handleSkip}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Skip</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Stage: Glowing Celestial Star Core */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl px-4 py-8">
            
            {/* Spinning Celestial Rings */}
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 mb-6 flex items-center justify-center">
              {/* Outer Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-cyan-400/40 border-dashed animate-spin"
                style={{ animationDuration: '24s' }}
              />
              {/* Middle Ring */}
              <div 
                className="absolute inset-3 rounded-full border border-violet-500/40 border-dotted animate-spin"
                style={{ animationDuration: '18s', animationDirection: 'reverse' }}
              />
              {/* Inner Glowing Star Core */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 30px rgba(6,182,212,0.4)',
                    '0 0 70px rgba(139,92,246,0.6)',
                    '0 0 30px rgba(6,182,212,0.4)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-violet-600 p-0.5 flex items-center justify-center relative cursor-pointer group"
                onClick={handleLaunch}
              >
                <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center">
                  <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 mt-1 uppercase">
                    Ignite
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 font-black">
                Next-Gen Academic Engine
              </span>
              <h1 className="text-4xl sm:text-6xl font-black italic tracking-tight uppercase bg-gradient-to-r from-cyan-300 via-blue-200 to-violet-400 bg-clip-text text-transparent">
                AI Study Buddy
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-md mx-auto">
                “Your notes. Your AI. Your smarter way to study.”
              </p>
            </motion.div>

            {/* Live Telemetry Readout */}
            <div className="mt-8 px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{telemetryLines[telemetryStep]}</span>
            </div>

            {/* Big Launch Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLaunch}
              disabled={isWarping}
              className="mt-8 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-black italic text-base sm:text-lg tracking-wide shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_55px_rgba(139,92,246,0.7)] transition-all flex items-center gap-3 group cursor-pointer border border-white/30"
            >
              <Play className="w-5 h-5 fill-current text-cyan-200 group-hover:translate-x-1 transition-transform" />
              <span>{isWarping ? 'WARP INITIATED...' : 'ENTER STUDY MATRIX'}</span>
              <Volume2 className="w-4 h-4 text-cyan-200 opacity-80" />
            </motion.button>

          </div>

          {/* Bottom Telemetry Bar */}
          <div className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-cyan-500/20 pt-4 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span>LATENCY: 0.12ms</span>
              <span>•</span>
              <span>SYNAPSE: FULL COHERENCE</span>
              <span>•</span>
              <span className="text-cyan-400">STARFIELD ENGINE ACTIVE</span>
            </div>
            <div>
              <span>CLICK ENTER TO UNLOCK CINEMATIC AUDIO & 3D MATRIX</span>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
