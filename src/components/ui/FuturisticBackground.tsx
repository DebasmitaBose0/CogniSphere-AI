import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
}

export const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

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

    // Mouse movement
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initialize stars
    const starCount = 140;
    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#ffffff', '#fbbf24'];
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      alpha: Math.random() * 0.7 + 0.2,
      alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Meteors
    const meteors: Meteor[] = [];
    const spawnMeteor = () => {
      if (Math.random() < 0.02 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * width * 1.2 - width * 0.1,
          y: -20,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 9 + 12,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: 1,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.alphaSpeed;
        if (star.alpha <= 0.15 || star.alpha >= 0.85) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.shadowBlur = 4;
        ctx.shadowColor = star.color;
        ctx.fill();

        // Constellation lines to mouse cursor
        const dx = mousePos.current.x - star.x;
        const dy = mousePos.current.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = (1 - dist / 110) * 0.4;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // 2. Spawn and update meteors (shooting stars)
      spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.018;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        grad.addColorStop(0.3, `rgba(56, 189, 248, ${m.alpha * 0.8})`);
        grad.addColorStop(1, 'rgba(129, 140, 248, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.globalAlpha = m.alpha;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Background Floor */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#030612] transition-colors duration-500" />

      {/* Gentle Ambient Cosmic Auras */}
      <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full bg-cyan-500/10 dark:bg-cyan-600/[0.12] blur-[150px] transition-all duration-500" />
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-violet-500/10 dark:bg-violet-600/[0.12] blur-[160px] transition-all duration-500" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-blue-500/8 dark:bg-blue-600/[0.1] blur-[170px] transition-all duration-500" />

      {/* Interactive Mouse-Following Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/[0.08] dark:bg-cyan-400/[0.08] blur-[100px] will-change-transform pointer-events-none"
        style={{
          transform: 'translate3d(-1000px, -1000px, 0)',
        }}
      />

      {/* Interactive Canvas Starfield, Shooting Stars & Cursor Constellations */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Subtle Knowledge Grid Blueprint */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
