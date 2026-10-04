import React, { useRef, useEffect } from 'react';
import { BookOpen, Brain, GraduationCap, Layers, Share2, CheckCircle2, Sparkles } from 'lucide-react';

interface KnowledgeOrbProps {
  onStartLearning: () => void;
  isExpanding?: boolean;
}

interface StudyNodeData {
  id: number;
  label: string;
  category: string;
  icon: React.ElementType;
  color: string;
  radius: number;
  speed: number;
  initialAngle: number;
}

export const KnowledgeOrb: React.FC<KnowledgeOrbProps> = ({
  onStartLearning,
  isExpanding = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  // Smooth mouse interpolation ref (0 React re-renders on mousemove)
  const mouseRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
  });

  // Educational Knowledge Nodes
  const nodes: StudyNodeData[] = [
    { id: 1, label: 'Active Recall', category: 'Testing', icon: CheckCircle2, color: '#0284c7', radius: 175, speed: 0.007, initialAngle: 0 },
    { id: 2, label: 'Spaced Repetition', category: 'Memory', icon: Layers, color: '#7c3aed', radius: 195, speed: -0.005, initialAngle: 1.8 },
    { id: 3, label: 'Concept Synthesis', category: 'Analysis', icon: Brain, color: '#059669', radius: 155, speed: 0.009, initialAngle: 3.5 },
    { id: 4, label: 'Knowledge Graph', category: 'Structure', icon: Share2, color: '#d97706', radius: 185, speed: -0.007, initialAngle: 4.8 },
    { id: 5, label: 'Exam Mastery', category: 'Preparation', icon: GraduationCap, color: '#2563eb', radius: 145, speed: 0.011, initialAngle: 2.7 },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
    mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // High-performance animation loop: Runs once, 0 React re-renders, 0 state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particleCount = 38;
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      return {
        angle,
        distance: dist,
        speed: (Math.random() * 0.006 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        radius: Math.random() * 1.8 + 1,
        color: Math.random() > 0.5 ? 'rgba(2, 132, 199,' : 'rgba(124, 58, 237,',
        alpha: Math.random() * 0.4 + 0.2,
      };
    });

    const nodeAngles = nodes.map(n => n.initialAngle);

    const render = () => {
      // 1. Smoothly interpolate mouse tilt (damped lerp for silky smoothness)
      mouseRef.current.currentX += (mouseRef.current.targetX - mouseRef.current.currentX) * 0.06;
      mouseRef.current.currentY += (mouseRef.current.targetY - mouseRef.current.currentY) * 0.06;

      const curX = mouseRef.current.currentX;
      const curY = mouseRef.current.currentY;

      // 2. Direct DOM transform on orb root
      if (orbRootRef.current) {
        orbRootRef.current.style.transform = `rotateX(${-curY * 16}deg) rotateY(${curX * 20}deg)`;
      }

      // 3. Clear canvas & draw particles smoothly
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach(p => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.distance + curX * 15;
        const py = cy + Math.sin(p.angle) * (p.distance * 0.48) + curY * 15;

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
      });

      // 4. Update orbiting nodes directly via DOM refs (ZERO React re-renders)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        nodeAngles[i] += node.speed;
        const ang = nodeAngles[i];

        const px = Math.cos(ang) * node.radius;
        const py = Math.sin(ang) * (node.radius * 0.48);
        const zDepth = Math.sin(ang) * 35;

        const nodeEl = nodeRefs.current[i];
        if (nodeEl) {
          nodeEl.style.transform = `translate3d(${px}px, ${py}px, ${zDepth}px)`;
          nodeEl.style.opacity = zDepth > 0 ? '1' : '0.75';
        }

        const lineEl = lineRefs.current[i];
        if (lineEl) {
          lineEl.setAttribute('x2', `${cx + px * 0.9}`);
          lineEl.setAttribute('y2', `${cy + py * 0.9}`);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []); // Run ONCE on mount — completely stable, no tear-downs

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[480px] h-[480px] sm:max-w-[540px] sm:h-[540px] mx-auto flex items-center justify-center transition-all duration-700 select-none will-change-transform ${
        isExpanding ? 'scale-150 opacity-0 blur-xl pointer-events-none' : 'scale-100 opacity-100'
      }`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Study Matrix Root with GPU Acceleration */}
      <div
        ref={orbRootRef}
        className="relative w-full h-full flex items-center justify-center transform-style-3d will-change-transform"
      >
        {/* Soft Ambient Core Halo */}
        <div 
          className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-500/15 to-violet-500/15 blur-2xl pointer-events-none"
        />

        {/* Orbiting Study Sparks Canvas */}
        <canvas
          ref={canvasRef}
          width={520}
          height={520}
          className="absolute inset-0 pointer-events-none z-0"
        />

        {/* Outer Study Ring 1: Conceptual Ring */}
        <div
          className="absolute w-[390px] h-[390px] rounded-full border border-cyan-500/30 dark:border-cyan-400/30 pointer-events-none transform-style-3d shadow-sm animate-spin will-change-transform"
          style={{
            transform: 'rotateX(68deg) rotateY(12deg)',
            animationDuration: '40s',
          }}
        />

        {/* Study Ring 2: Memory Ring */}
        <div
          className="absolute w-[340px] h-[340px] rounded-full border border-violet-500/30 dark:border-violet-400/30 pointer-events-none transform-style-3d shadow-sm animate-spin will-change-transform"
          style={{
            transform: 'rotateX(52deg) rotateY(-35deg)',
            animationDuration: '32s',
            animationDirection: 'reverse',
          }}
        />

        {/* Study Ring 3: Mastery Ring */}
        <div
          className="absolute w-[290px] h-[290px] rounded-full border border-emerald-500/25 dark:border-emerald-400/25 pointer-events-none transform-style-3d shadow-sm animate-spin will-change-transform"
          style={{
            transform: 'rotateX(75deg) rotateY(40deg)',
            animationDuration: '48s',
          }}
        />

        {/* SVG Dynamic Knowledge Vector Ribbons */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="studyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {nodes.map((node, i) => (
            <line
              key={`line-${node.id}`}
              ref={el => lineRefs.current[i] = el}
              x1="260"
              y1="260"
              x2="260"
              y2="260"
              stroke="url(#studyGrad)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.6"
            />
          ))}
        </svg>

        {/* Central Holographic Study Core */}
        <div 
          onClick={onStartLearning}
          className="relative z-20 w-44 h-44 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 backdrop-blur-2xl shadow-xl dark:shadow-2xl flex flex-col items-center justify-center p-4 cursor-pointer group hover:scale-105 transition-all duration-300 transform-style-3d will-change-transform"
          style={{
            transform: 'translate3d(0, 0, 30px)',
          }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-violet-500/10 group-hover:opacity-100 transition-opacity" />

          <div className="relative mb-2 w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold italic">
            Neural Study Matrix
          </span>
          <span className="text-xs font-black italic text-slate-900 dark:text-white mt-0.5 text-center leading-tight">
            Click to Synthesize
          </span>

          <div className="mt-2 flex items-center gap-1.5 text-[9px] font-mono text-slate-500 dark:text-slate-400">
            <Sparkles className="w-2.5 h-2.5 text-blue-500 dark:text-cyan-400" />
            <span>5 Learning Modules</span>
          </div>
        </div>

        {/* Orbiting Study Feature Nodes (Direct GPU updates, zero re-renders) */}
        {nodes.map((node, i) => {
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              ref={el => nodeRefs.current[i] = el}
              onClick={onStartLearning}
              className="absolute cursor-pointer z-20 will-change-transform"
              style={{
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <div className="group flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/15 backdrop-blur-xl shadow-md hover:shadow-lg hover:scale-108 transition-transform duration-200">
                <div 
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs shadow-sm shrink-0"
                  style={{ backgroundColor: node.color }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                    {node.category}
                  </span>
                  <span className="text-xs font-bold italic text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
