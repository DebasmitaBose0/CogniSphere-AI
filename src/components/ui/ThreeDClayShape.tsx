import React, { useState } from 'react';
import { motion } from 'framer-motion';

export type ShapeType = 'torus-pink' | 'crystal-cyan' | 'spiral-orange' | 'ribbon-purple' | 'sphere-bumpy';

interface ThreeDClayShapeProps {
  type: ShapeType;
  size?: number;
  className?: string;
  interactive?: boolean;
}

export const ThreeDClayShape: React.FC<ThreeDClayShapeProps> = ({
  type,
  size = 90,
  className = '',
  interactive = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 35;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -35;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 600,
      }}
    >
      <motion.div
        animate={{
          rotateX: tilt.y,
          rotateY: tilt.x,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full h-full flex items-center justify-center will-change-transform drop-shadow-xl"
      >
        {/* Shape 1: Hot-Pink Torus (Donut) from Video */}
        {type === 'torus-pink' && (
          <motion.div
            animate={{
              rotateZ: [0, 360],
              y: [-4, 4, -4],
            }}
            transition={{
              rotateZ: { duration: 20, repeat: Infinity, ease: 'linear' },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <radialGradient id="pinkTorusGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="35%" stopColor="#ec4899" />
                  <stop offset="75%" stopColor="#be185d" />
                  <stop offset="100%" stopColor="#831843" />
                </radialGradient>
                <filter id="clayShadow" x="-20%" y="-20%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#831843" floodOpacity="0.35" />
                </filter>
                <linearGradient id="highlightPink" x1="0%" y1="0%" x2="50%" y2="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Outer torus ring */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="url(#pinkTorusGrad)"
                strokeWidth="20"
                filter="url(#clayShadow)"
              />
              
              {/* Specular gloss highlight */}
              <ellipse
                cx="38"
                cy="28"
                rx="18"
                ry="8"
                transform="rotate(-25 38 28)"
                fill="url(#highlightPink)"
              />
            </svg>
          </motion.div>
        )}

        {/* Shape 2: Cyan Floating Crystal Prism from Video */}
        {type === 'crystal-cyan' && (
          <motion.div
            animate={{
              rotateZ: [0, -15, 0, 15, 0],
              y: [-5, 5, -5],
            }}
            transition={{
              rotateZ: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="cyanFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="cyanFacet2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#164e63" />
                </linearGradient>
                <linearGradient id="cyanFacet3" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
              </defs>
              {/* Crystal faces */}
              <polygon points="50,12 82,34 50,56 18,34" fill="url(#cyanFacet1)" opacity="0.95" />
              <polygon points="18,34 50,56 50,90 18,66" fill="url(#cyanFacet2)" />
              <polygon points="82,34 50,56 50,90 82,66" fill="url(#cyanFacet3)" />
              
              {/* Glowing core edge */}
              <polyline points="18,34 50,56 82,34" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
              <line x1="50" y1="56" x2="50" y2="90" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
            </svg>
          </motion.div>
        )}

        {/* Shape 3: Orange & Coral Spiral Helix from Video */}
        {type === 'spiral-orange' && (
          <motion.div
            animate={{
              rotateZ: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1],
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
                <linearGradient id="whiteCapsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
              {/* Outer orange loop */}
              <rect x="24" y="20" width="52" height="60" rx="26" fill="none" stroke="url(#orangeGrad)" strokeWidth="16" />
              {/* Inner intertwined white pill */}
              <rect x="36" y="32" width="28" height="36" rx="14" fill="url(#whiteCapsuleGrad)" stroke="#cbd5e1" strokeWidth="2" opacity="0.95" />
              {/* Gloss highlight */}
              <path d="M 32 30 Q 50 16 68 30" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        {/* Shape 4: Lavender Ribbon Helix from Video */}
        {type === 'ribbon-purple' && (
          <motion.div
            animate={{
              rotateZ: [0, -8, 0, 8, 0],
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lavenderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </linearGradient>
              </defs>
              <path
                d="M 25 35 C 20 60, 45 75, 75 65 C 85 45, 60 20, 35 30 Z"
                fill="url(#lavenderGrad)"
                stroke="#d8b4fe"
                strokeWidth="2"
              />
              <ellipse cx="48" cy="46" rx="14" ry="8" fill="#581c87" opacity="0.4" />
              <path d="M 30 38 Q 50 26 70 42" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.65" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        {/* Shape 5: Bumpy 3D Sphere from Video Hero Banner */}
        {type === 'sphere-bumpy' && (
          <motion.div
            animate={{
              rotateZ: [0, 360],
              scale: [0.97, 1.03, 0.97],
            }}
            transition={{
              rotateZ: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-full h-full flex items-center justify-center relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <radialGradient id="bumpyGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="60%" stopColor="#db2777" />
                  <stop offset="100%" stopColor="#9d174d" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="38" fill="url(#bumpyGrad)" />
              {/* Bumpy nodes */}
              {[
                { cx: 35, cy: 35, r: 8 },
                { cx: 55, cy: 30, r: 7 },
                { cx: 45, cy: 50, r: 9 },
                { cx: 65, cy: 50, r: 7 },
                { cx: 35, cy: 62, r: 8 },
                { cx: 55, cy: 68, r: 7 },
              ].map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  fill="#fbcfe8"
                  opacity="0.8"
                  stroke="#be185d"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
