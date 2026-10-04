import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Plane, 
  Cloud, 
  MapPin, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw,
  Layers,
  Sliders,
  CheckCircle2,
  Gauge,
  Video,
  Wand2,
  Code,
  Download,
  Copy,
  Check,
  Eye,
  Settings2,
  Upload,
  Palette,
  Film,
  Minimize2,
  Maximize2,
  ChevronDown
} from 'lucide-react';

interface CinematicFlightStudioProps {
  onStartLearning?: () => void;
  onTryDemo?: () => void;
  onClose?: () => void;
}

// Preset Themes for the 3-Keyframe Pipeline
interface StorylinePreset {
  id: string;
  name: string;
  category: string;
  videoUrl?: string;
  k1: { badge: string; title: string; desc: string; alt: string };
  k2: { badge: string; title: string; desc: string; alt: string };
  k3: { badge: string; title: string; desc: string; alt: string };
}

const STORYLINE_PRESETS: StorylinePreset[] = [
  {
    id: 'flight-paris',
    name: 'Paris Flight Journey',
    category: 'Travel & Motion',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    k1: {
      badge: 'Keyframe 1 // Cabin Window View',
      title: 'Departure Above the Morning Horizon',
      desc: 'Looking through the illuminated oval passenger window as dawn breaks over the distant landscape.',
      alt: '10,500 m'
    },
    k2: {
      badge: 'Keyframe 2 // Dense Stratosphere Clouds',
      title: 'Surfing Through Volumetric Vapor',
      desc: 'Dense white mist rolls across the wings as the aircraft cuts through high-altitude cloud banks.',
      alt: '4,800 m'
    },
    k3: {
      badge: 'Keyframe 3 // Eiffel Tower Arrival',
      title: 'Touchdown in the City of Light',
      desc: 'Golden-hour Paris skyline emerges with the iconic Eiffel Tower illuminated against the sunset.',
      alt: '320 m'
    }
  },
  {
    id: 'astralearn-academic',
    name: 'AstraLearn Intellectual Flight',
    category: 'Study Architecture',
    k1: {
      badge: 'Phase 1 // Departure From Noise',
      title: 'Elevate Your Notes Above the Horizon',
      desc: 'Leave behind disorganized syllabus chaos. Your study material ascends into crystalline structure.',
      alt: 'Focus Mode: Active'
    },
    k2: {
      badge: 'Phase 2 // Cognitive Stratosphere',
      title: 'Active Recall & Spaced Retrieval',
      desc: 'Dense textbook chapters dissolve into structured summaries, MCQ evaluations, and 3D flashcards.',
      alt: 'Retention: 2.8x'
    },
    k3: {
      badge: 'Phase 3 // Intellectual Clarity',
      title: 'Welcome to Exam Excellence',
      desc: 'Smooth touchdown with comprehensive notes mastery, instant quizzes, and Socratic study chat.',
      alt: 'Exam Readiness: 100%'
    }
  },
  {
    id: 'deep-cosmos',
    name: 'Cosmic Nebula Odyssey',
    category: 'Space Exploration',
    k1: {
      badge: 'Orbit 1 // Low Earth Orbit',
      title: 'Leaving Earth Atmospheric Boundary',
      desc: 'The curved blue horizon recedes into the silent, star-studded blackness of the cosmos.',
      alt: '400 km'
    },
    k2: {
      badge: 'Orbit 2 // Interstellar Nebula',
      title: 'Traversing the Luminous Dust Veil',
      desc: 'Glowing interstellar hydrogen clouds cast vibrant emerald and violet radiation across the void.',
      alt: '2.4 Light Years'
    },
    k3: {
      badge: 'Orbit 3 // Celestial Destination',
      title: 'Approach to the Core Star System',
      desc: 'A twin-sun system illuminates the final orbital vector in brilliant golden brilliance.',
      alt: 'Vector Lock: Stable'
    }
  }
];

export const CinematicFlightStudio: React.FC<CinematicFlightStudioProps> = ({
  onStartLearning,
  onTryDemo,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Active Storyline Preset
  const [activeStoryline, setActiveStoryline] = useState<StorylinePreset>(STORYLINE_PRESETS[0]);
  
  // Custom Editable Keyframe Text
  const [k1Title, setK1Title] = useState(activeStoryline.k1.title);
  const [k1Desc, setK1Desc] = useState(activeStoryline.k1.desc);
  const [k2Title, setK2Title] = useState(activeStoryline.k2.title);
  const [k2Desc, setK2Desc] = useState(activeStoryline.k2.desc);
  const [k3Title, setK3Title] = useState(activeStoryline.k3.title);
  const [k3Desc, setK3Desc] = useState(activeStoryline.k3.desc);

  // Studio Mode & Controls
  const [studioPanelOpen, setStudioPanelOpen] = useState<boolean>(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'pipeline' | 'shaders' | 'glass' | 'export'>('pipeline');
  const [renderEngine, setRenderEngine] = useState<'webgl' | 'video_scrub'>('webgl');
  
  // Glassmorphism visual settings
  const [glassBlur, setGlassBlur] = useState<number>(20);
  const [glassOpacity, setGlassOpacity] = useState<number>(65);
  const [glassBorderGlow, setGlassBorderGlow] = useState<'emerald' | 'amber' | 'cyan' | 'violet'>('emerald');
  const [windowBezelVisible, setWindowBezelVisible] = useState<boolean>(true);

  // Three.js Shader/Particle parameters
  const [particleDensity, setParticleDensity] = useState<number>(1200);
  const [cloudScale, setCloudScale] = useState<number>(1.2);
  const [flightSpeedMult, setFlightSpeedMult] = useState<number>(1.0);

  // Flight telemetry state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(10500);
  const [speed, setSpeed] = useState<number>(860);
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Animation and Three.js references
  const animationFrameId = useRef<number | null>(null);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);

  // Synchronize storyline text when preset changes
  useEffect(() => {
    setK1Title(activeStoryline.k1.title);
    setK1Desc(activeStoryline.k1.desc);
    setK2Title(activeStoryline.k2.title);
    setK2Desc(activeStoryline.k2.desc);
    setK3Title(activeStoryline.k3.title);
    setK3Desc(activeStoryline.k3.desc);
  }, [activeStoryline]);

  // --- THREE.JS WEBGL RENDER ENGINE ---
  useEffect(() => {
    if (renderEngine !== 'webgl') return;
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1612, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    // Procedural Volumetric Cloud Formations
    const cloudGroup = new THREE.Group();
    const cloudGeometry = new THREE.DodecahedronGeometry(1, 1);
    
    const cloudMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.9,
        transparent: true,
        opacity: 0.75,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xd1fae5,
        roughness: 0.85,
        transparent: true,
        opacity: 0.6,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.7,
        transparent: true,
        opacity: 0.7,
      }),
    ];

    const cloudPuffs: { mesh: THREE.Mesh; baseZ: number; rotSpeed: number }[] = [];
    const totalPuffs = 75;

    for (let i = 0; i < totalPuffs; i++) {
      const mat = cloudMaterials[i % cloudMaterials.length];
      const mesh = new THREE.Mesh(cloudGeometry, mat);
      
      const scaleX = (2 + Math.random() * 4) * cloudScale;
      const scaleY = (1.2 + Math.random() * 2.5) * cloudScale;
      const scaleZ = (2 + Math.random() * 3.5) * cloudScale;
      mesh.scale.set(scaleX, scaleY, scaleZ);

      const x = (Math.random() - 0.5) * 65;
      const y = (Math.random() - 0.5) * 35;
      const z = (Math.random() - 0.5) * 140 - 20;

      mesh.position.set(x, y, z);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      cloudGroup.add(mesh);
      cloudPuffs.push({
        mesh,
        baseZ: z,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      });
    }
    scene.add(cloudGroup);

    // Dynamic Atmospheric Stardust / Vapor
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleDensity * 3);

    for (let i = 0; i < particleDensity * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 85;
      particlePositions[i + 1] = (Math.random() - 0.5) * 65;
      particlePositions[i + 2] = (Math.random() - 0.5) * 190;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xa7f3d0,
      size: 0.18,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Horizon Grid / City Plane
    const gridHelper = new THREE.GridHelper(200, 40, 0x10b981, 0x064e3b);
    gridHelper.position.y = -22;
    gridHelper.position.z = -50;
    scene.add(gridHelper);

    // Scroll Handler
    const handleScroll = () => {
      if (!containerRef.current) return;
      const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      targetScrollRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
      const p = currentScrollRef.current;

      setScrollProgress(Math.round(p * 100));

      if (p < 0.33) {
        setActivePhase(1);
        setAltitude(Math.round(10500 - p * 3000));
        setSpeed(860);
      } else if (p < 0.66) {
        setActivePhase(2);
        setAltitude(Math.round(7500 - (p - 0.33) * 9000));
        setSpeed(790);
      } else {
        setActivePhase(3);
        setAltitude(Math.max(Math.round(1500 - (p - 0.66) * 4500), 280));
        setSpeed(320);
      }

      // Camera motion across flight vector
      camera.position.z = 15 - p * 65 * flightSpeedMult;
      camera.position.y = Math.sin(elapsedTime * 0.5) * 0.4 + (1 - p * 1.6);
      camera.position.x = Math.sin(p * Math.PI * 1.5) * 3.5;

      camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.12;
      camera.rotation.x = -p * 0.18 + Math.sin(elapsedTime * 0.8) * 0.02;

      cloudPuffs.forEach((puff, idx) => {
        puff.mesh.rotation.y += puff.rotSpeed;
        puff.mesh.position.y += Math.sin(elapsedTime * 0.6 + idx) * 0.008;
      });

      particles.rotation.y = elapsedTime * 0.03;

      if (scene.fog) {
        if (p < 0.33) {
          scene.fog.color.setHex(0x0a1612);
          ambientLight.color.setHex(0xdcfce7);
          sunLight.color.setHex(0xfef08a);
        } else if (p < 0.66) {
          scene.fog.color.setHex(0x132a22);
          ambientLight.color.setHex(0xa7f3d0);
          sunLight.color.setHex(0x6ee7b7);
        } else {
          scene.fog.color.setHex(0x1c1917);
          ambientLight.color.setHex(0xfde68a);
          sunLight.color.setHex(0xf59e0b);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      renderer.dispose();
      cloudGeometry.dispose();
      cloudMaterials.forEach(m => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [renderEngine, particleDensity, cloudScale, flightSpeedMult]);

  // Auto-cruise controller
  useEffect(() => {
    let cruiseInterval: any = null;
    if (isAutoCruising) {
      cruiseInterval = setInterval(() => {
        if (!containerRef.current) return;
        const total = containerRef.current.scrollHeight - window.innerHeight;
        const nextY = window.scrollY + 7;
        if (nextY >= total) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: 7, behavior: 'auto' });
        }
      }, 20);
    }
    return () => clearInterval(cruiseInterval);
  }, [isAutoCruising]);

  // Video Scrub scroll sync
  useEffect(() => {
    if (renderEngine !== 'video_scrub') return;
    const handleScrollScrub = () => {
      if (!containerRef.current || !videoRef.current || !videoRef.current.duration) return;
      const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      videoRef.current.currentTime = progress * videoRef.current.duration;
      setScrollProgress(Math.round(progress * 100));
    };

    window.addEventListener('scroll', handleScrollScrub, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollScrub);
  }, [renderEngine]);

  const handleCopyCode = () => {
    const codeSnippet = `// 3D Three.js & WebGL Scroll Engine Export
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CinematicScrollCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1612, 0.015);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particle Cloud formation (${particleDensity} particles)
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(${particleDensity} * 3);
    for (let i = 0; i < ${particleDensity} * 3; i++) positions[i] = (Math.random() - 0.5) * 80;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xa7f3d0, size: 0.18, transparent: true });
    scene.add(new THREE.Points(particleGeo, particleMat));

    let targetP = 0, currentP = 0;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetP = window.scrollY / maxScroll;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = () => {
      requestAnimationFrame(loop);
      currentP += (targetP - currentP) * 0.08;
      camera.position.z = 15 - currentP * 65;
      camera.position.x = Math.sin(currentP * Math.PI * 1.5) * 3.5;
      renderer.render(scene, camera);
    };
    loop();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />;
}`;

    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  // Glass style calculations
  const getGlowBorder = () => {
    switch (glassBorderGlow) {
      case 'amber': return 'border-amber-500/40 shadow-amber-950/40';
      case 'cyan': return 'border-cyan-500/40 shadow-cyan-950/40';
      case 'violet': return 'border-violet-500/40 shadow-violet-950/40';
      default: return 'border-emerald-500/40 shadow-emerald-950/40';
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[380vh] bg-[#070e0b] text-white select-none font-sans"
    >
      {/* --- RENDER ENGINES --- */}
      {renderEngine === 'webgl' ? (
        <div className="fixed inset-0 pointer-events-none z-10">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          <video
            ref={videoRef}
            src={activeStoryline.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4'}
            muted
            playsInline
            className="w-full h-full object-cover opacity-85"
          />
        </div>
      )}

      {/* Airplane Window Vignette Overlay */}
      {windowBezelVisible && (
        <div className="fixed inset-0 pointer-events-none z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] border-[16px] sm:border-[28px] border-[#070d0b]/90 rounded-[48px] m-1 sm:m-3 transition-all" />
      )}

      {/* --- TOP TELEMETRY & STUDIO CONTROLS --- */}
      <div className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between pointer-events-auto">
        
        {/* Flight Identifier & Phase Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono shadow-xl">
          <Plane className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-white tracking-widest uppercase">
            {activeStoryline.name}
          </span>
          <span className="text-white/40">•</span>
          <span className="text-emerald-300">
            {activePhase === 1 ? 'KEYFRAME 1 // START' : activePhase === 2 ? 'KEYFRAME 2 // CLOUDS' : 'KEYFRAME 3 // ARRIVAL'}
          </span>
        </div>

        {/* Right HUD & Studio Launcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Telemetry Gauge */}
          <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>ALT: <strong>{altitude}m</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>VEL: <strong>{speed} km/h</strong></span>
            </div>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{scrollProgress}%</span>
          </div>

          {/* Auto Fly / Cruising Button */}
          <button
            type="button"
            onClick={() => setIsAutoCruising(!isAutoCruising)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border shadow-lg ${
              isAutoCruising
                ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                : 'bg-black/70 text-white/80 border-white/15 hover:text-white'
            }`}
          >
            {isAutoCruising ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoCruising ? 'Cruising' : 'Auto Fly'}</span>
          </button>

          {/* Open Studio Control Panel Drawer */}
          <button
            type="button"
            onClick={() => setStudioPanelOpen(!studioPanelOpen)}
            className="px-4 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Studio Tools</span>
          </button>

          {/* Close / Return to Notes */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-all cursor-pointer"
            >
              Exit
            </button>
          )}

        </div>
      </div>

      {/* --- SCROLL-DRIVEN GLASSMORPHIC UI SECTIONS --- */}
      <div className="relative z-30 pointer-events-none">
        
        {/* PHASE 1 (0% - 25%): WINDOW SEAT DEPARTURE HERO */}
        <section className="h-screen flex flex-col justify-center items-start px-6 sm:px-16 lg:px-24">
          <div 
            style={{
              backdropFilter: `blur(${glassBlur}px)`,
              backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
            }}
            className={`max-w-2xl p-8 sm:p-10 rounded-3xl border ${getGlowBorder()} shadow-2xl space-y-5 pointer-events-auto transition-all`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono uppercase tracking-widest text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeStoryline.k1.badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {k1Title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              {k1Desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartLearning}
                className="px-6 py-3 rounded-full bg-white hover:bg-emerald-50 text-black font-semibold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>Board Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onTryDemo}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm flex items-center gap-2 backdrop-blur transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Cloud Computing Demo</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-emerald-300/80 animate-bounce">
              <span>Scroll down to enter the clouds</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

          </div>
        </section>

        {/* PHASE 2 (33% - 66%): ATMOSPHERIC VOLUMETRIC CLOUD SURFING */}
        <section className="h-screen flex flex-col justify-center items-end px-6 sm:px-16 lg:px-24">
          <div 
            style={{
              backdropFilter: `blur(${glassBlur}px)`,
              backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
            }}
            className={`max-w-xl p-8 sm:p-10 rounded-3xl border ${getGlowBorder()} shadow-2xl space-y-5 pointer-events-auto transition-all text-right`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono uppercase tracking-widest text-emerald-300 ml-auto">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeStoryline.k2.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {k2Title}
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              {k2Desc}
            </p>

            {/* 3 Interactive Learning Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="font-mono text-lg font-bold text-emerald-400">94%</div>
                <div className="text-[10px] font-mono text-white/60 uppercase">Recall Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="font-mono text-lg font-bold text-emerald-400">2.8x</div>
                <div className="text-[10px] font-mono text-white/60 uppercase">Retention</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="font-mono text-lg font-bold text-emerald-400">0s</div>
                <div className="text-[10px] font-mono text-white/60 uppercase">API Friction</div>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-emerald-400">
              Descending towards destination skyline...
            </div>

          </div>
        </section>

        {/* PHASE 3 (66% - 100%): TOUCHDOWN AT DESTINATION */}
        <section className="h-screen flex flex-col justify-center items-center px-6 text-center">
          <div 
            style={{
              backdropFilter: `blur(${glassBlur}px)`,
              backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
            }}
            className={`max-w-2xl p-8 sm:p-12 rounded-3xl border ${getGlowBorder()} shadow-2xl space-y-6 pointer-events-auto transition-all`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-mono uppercase tracking-widest text-amber-300 mx-auto">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{activeStoryline.k3.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none">
              {k3Title}
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-lg mx-auto">
              {k3Desc}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onStartLearning}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enter Study Material Workspace</span>
              </button>

              <button
                type="button"
                onClick={onTryDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm flex items-center justify-center gap-2 backdrop-blur transition-all cursor-pointer"
              >
                <span>Load Cloud Computing Demo</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs font-mono text-white/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Three.js r170 Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                WebGL Shaders Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Interpolated 60 FPS
              </span>
            </div>

          </div>
        </section>

      </div>

      {/* --- STUDIO DRAWER / CONTROL PANEL (ALL-IN-ONE WORKFLOW) --- */}
      {studioPanelOpen && (
        <div className="fixed top-20 right-6 z-50 w-96 max-h-[85vh] overflow-y-auto rounded-3xl bg-[#091611]/95 backdrop-blur-2xl border border-emerald-500/30 p-6 shadow-2xl space-y-6 text-white font-sans transition-all">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif font-bold text-lg text-white">All-in-One 3D Studio</h3>
            </div>
            <button
              onClick={() => setStudioPanelOpen(false)}
              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-center">
            <button
              onClick={() => setActiveStudioTab('pipeline')}
              className={`py-1.5 rounded-lg transition-all ${
                activeStudioTab === 'pipeline' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Story
            </button>
            <button
              onClick={() => setActiveStudioTab('shaders')}
              className={`py-1.5 rounded-lg transition-all ${
                activeStudioTab === 'shaders' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Engine
            </button>
            <button
              onClick={() => setActiveStudioTab('glass')}
              className={`py-1.5 rounded-lg transition-all ${
                activeStudioTab === 'glass' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              UI Glass
            </button>
            <button
              onClick={() => setActiveStudioTab('export')}
              className={`py-1.5 rounded-lg transition-all ${
                activeStudioTab === 'export' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Export
            </button>
          </div>

          {/* TAB 1: STORYLINE & KEYFRAME PIPELINE (ChatGPT + Flow AI emulator) */}
          {activeStudioTab === 'pipeline' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Select 3-Keyframe Storyline
                </label>
                <div className="space-y-2">
                  {STORYLINE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setActiveStoryline(preset)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        activeStoryline.id === preset.id
                          ? 'bg-emerald-950/60 border-emerald-400 text-white'
                          : 'bg-black/30 border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{preset.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-1 line-clamp-1 flex items-center gap-1">
                        <span>{preset.k1.title}</span>
                        <ArrowRight className="w-2.5 h-2.5 inline text-emerald-400/80 shrink-0" />
                        <span>{preset.k3.title}</span>
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Phase Titles */}
              <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-emerald-400">Phase 1: Start Frame Title</span>
                  <input
                    type="text"
                    value={k1Title}
                    onChange={(e) => setK1Title(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-emerald-400">Phase 2: Cloud Frame Title</span>
                  <input
                    type="text"
                    value={k2Title}
                    onChange={(e) => setK2Title(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-emerald-400">Phase 3: Destination Title</span>
                  <input
                    type="text"
                    value={k3Title}
                    onChange={(e) => setK3Title(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THREE.JS & WEBGL SHADERS ENGINE */}
          {activeStudioTab === 'shaders' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-emerald-400 uppercase tracking-wider text-[11px]">
                  Render Core Engine
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRenderEngine('webgl')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      renderEngine === 'webgl'
                        ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                        : 'bg-black/30 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    Three.js WebGL
                  </button>
                  <button
                    onClick={() => setRenderEngine('video_scrub')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      renderEngine === 'video_scrub'
                        ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                        : 'bg-black/30 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    Video Scrubber
                  </button>
                </div>
              </div>

              {/* Particle Density */}
              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Particle Dust Density</span>
                  <span className="text-emerald-400">{particleDensity}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3000"
                  step="200"
                  value={particleDensity}
                  onChange={(e) => setParticleDensity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Cloud Volumetric Scale */}
              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Cloud Cluster Scale</span>
                  <span className="text-emerald-400">{cloudScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={cloudScale}
                  onChange={(e) => setCloudScale(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Flight Speed Multiplier */}
              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Camera Z-Vector Speed</span>
                  <span className="text-emerald-400">{flightSpeedMult.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.2"
                  value={flightSpeedMult}
                  onChange={(e) => setFlightSpeedMult(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Window Vignette Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <span className="text-white/80">Airplane Window Bezel</span>
                <button
                  onClick={() => setWindowBezelVisible(!windowBezelVisible)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    windowBezelVisible ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {windowBezelVisible ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GLASSMORPHISM UI STUDIO (Google AI Studio emulator) */}
          {activeStudioTab === 'glass' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Backdrop Blur Filter</span>
                  <span className="text-emerald-400">{glassBlur}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={glassBlur}
                  onChange={(e) => setGlassBlur(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Card Background Opacity</span>
                  <span className="text-emerald-400">{glassOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={glassOpacity}
                  onChange={(e) => setGlassOpacity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-emerald-400 uppercase tracking-wider text-[11px]">
                  Border Glow Color Accent
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['emerald', 'amber', 'cyan', 'violet'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setGlassBorderGlow(color)}
                      className={`py-2 rounded-xl border capitalize text-center transition-all ${
                        glassBorderGlow === color
                          ? 'bg-white/20 border-white text-white font-bold'
                          : 'bg-black/30 border-white/10 text-white/60'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANTI-GRAVITY CODE EXPORT */}
          {activeStudioTab === 'export' && (
            <div className="space-y-3 text-xs font-mono">
              <p className="text-white/70 leading-relaxed font-sans">
                Export your current Three.js & WebGL scroll animation configuration as a modular React component.
              </p>

              <button
                onClick={handleCopyCode}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Code Copied to Clipboard!' : 'Copy React Component Code'}</span>
              </button>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/60 font-mono space-y-1">
                <div>• Engine: Three.js r170</div>
                <div>• Particles: {particleDensity} Active Motes</div>
                <div>• Shaders: FogExp2 ACESFilmic</div>
                <div>• Frame Sync: Normalized requestAnimationFrame</div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CinematicFlightStudio;
