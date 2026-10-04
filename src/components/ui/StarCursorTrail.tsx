import React, { useEffect, useRef } from 'react';

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotSpeed: number;
}

export const StarCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<StarParticle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#38bdf8', // sky cyan
      '#818cf8', // indigo
      '#c084fc', // purple
      '#f472b6', // pink
      '#fbbf24', // amber star
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (speed > 3) {
        // Spawn 1 to 3 stardust particles depending on speed
        const spawnCount = Math.min(3, Math.floor(speed / 10) + 1);
        for (let i = 0; i < spawnCount; i++) {
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 12,
            y: e.clientY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 1.5 - dx * 0.05,
            vy: (Math.random() - 0.5) * 1.5 - dy * 0.05 + 0.3, // slight drift downward
            size: Math.random() * 3 + 1.5,
            alpha: 0.9,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1,
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Draw 4-point sparkling star
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number,
      color: string,
      alpha: number
    ) => {
      let rotStep = (Math.PI / spikes);
      let angle = rot;
      c.save();
      c.beginPath();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.shadowBlur = 6;
      c.shadowColor = color;

      for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(angle) * outerRadius;
        let y = cy + Math.sin(angle) * outerRadius;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
        angle += rotStep;

        x = cx + Math.cos(angle) * innerRadius;
        y = cy + Math.sin(angle) * innerRadius;
        c.lineTo(x, y);
        angle += rotStep;
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.022;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0.01) {
          particles.splice(i, 1);
          continue;
        }

        drawStar(
          ctx,
          p.x,
          p.y,
          4,
          p.size * 2,
          p.size * 0.4,
          p.rotation,
          p.color,
          p.alpha
        );
      }

      // Limit particle array size
      if (particles.length > 80) {
        particles.splice(0, particles.length - 80);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
