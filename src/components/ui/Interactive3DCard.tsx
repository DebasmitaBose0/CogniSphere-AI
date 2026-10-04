import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
  intensity?: number;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  onClick,
  glowColor = '#0284c7',
  intensity = 12,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // High-performance Framer Motion values (0 React re-renders during mouse tracking)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth physical damping - zero jitter
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 24 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 transform-style-3d cursor-pointer will-change-transform"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.2 }}
        className={`relative overflow-hidden rounded-3xl transition-shadow duration-300 will-change-transform ${className}`}
      >
        {/* Subtle Ambient Hover Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(500px circle at center, ${glowColor}15, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
