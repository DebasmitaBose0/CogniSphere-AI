import React, { useEffect, useRef } from 'react';
import { SpatialSceneManager } from './SpatialSceneManager';

interface SpatialCanvasProps {
  onSceneReady?: (manager: SpatialSceneManager) => void;
}

export const SpatialCanvas: React.FC<SpatialCanvasProps> = ({ onSceneReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<SpatialSceneManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize the singleton spatial scene
    const manager = new SpatialSceneManager(canvasRef.current);
    managerRef.current = manager;

    if (onSceneReady) {
      onSceneReady(manager);
    }

    // Scroll listener: map window scroll to camera coordinate journey
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      manager.updateScrollProgress(progress);
    };

    // Mouse listener: parallax tilt
    const handleMouseMove = (e: MouseEvent) => {
      manager.updateMousePosition(e.clientX, e.clientY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      manager.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block will-change-transform"
      />
    </div>
  );
};
