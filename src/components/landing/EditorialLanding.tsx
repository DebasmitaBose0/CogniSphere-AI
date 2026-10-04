import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Compass, 
  GraduationCap, 
  Brain, 
  CheckCircle2, 
  Plane,
  Gauge,
  Play,
  Pause,
  Sliders,
  Wand2,
  Copy,
  Check,
  Minimize2,
  Cloud,
  MapPin,
  ChevronDown
} from 'lucide-react';

import { SUBJECT_DEMOS, SubjectDemo } from '../../data/subjectDemos';

interface EditorialLandingProps {
  onStartLearning: () => void;
  onTryDemo: () => void;
  onSelectSubject?: (subject: SubjectDemo) => void;
  onExploreSection: (tab: string) => void;
}

interface StorylinePreset {
  id: string;
  name: string;
  category: string;
  k1Title: string;
  k2Title: string;
  k3Title: string;
}

const STORYLINE_PRESETS: StorylinePreset[] = [
  {
    id: 'paris-voyage',
    name: 'Paris Flight Journey',
    category: 'Travel & Motion',
    k1Title: 'Departure Above the Morning Horizon',
    k2Title: 'Surfing Through Volumetric Cloud Banks',
    k3Title: 'Golden Arrival at the Eiffel Tower Horizon',
  },
  {
    id: 'astralearn-academic',
    name: 'AstraLearn Intellectual Flight',
    category: 'Study Architecture',
    k1Title: 'Elevate Your Notes Above the Horizon',
    k2Title: 'Active Recall in the Cognitive Stratosphere',
    k3Title: 'Touchdown at Intellectual Clarity',
  },
  {
    id: 'cosmic-odyssey',
    name: 'Cosmic Nebula Odyssey',
    category: 'Deep Space',
    k1Title: 'Leaving Earth Atmospheric Boundary',
    k2Title: 'Traversing the Luminous Dust Veil',
    k3Title: 'Approach to the Core Star System',
  }
];

export const EditorialLanding: React.FC<EditorialLandingProps> = ({
  onStartLearning,
  onTryDemo,
  onSelectSubject,
  onExploreSection,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Telemetry & Flight state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(10500);
  const [speed, setSpeed] = useState<number>(860);
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

  // All-in-One Studio Drawer state
  const [studioDrawerOpen, setStudioDrawerOpen] = useState<boolean>(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'story' | 'engine' | 'glass' | 'export'>('story');
  const [activePreset, setActivePreset] = useState<StorylinePreset>(STORYLINE_PRESETS[1]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Live Studio Shader & UI tweaks
  const [particleDensity, setParticleDensity] = useState<number>(1400);
  const [cloudScale, setCloudScale] = useState<number>(1.2);
  const [cameraSpeedMult, setCameraSpeedMult] = useState<number>(1.0);
  const [glassBlur, setGlassBlur] = useState<number>(20);
  const [glassOpacity, setGlassOpacity] = useState<number>(65);
  const [glassGlow, setGlassGlow] = useState<'emerald' | 'amber' | 'cyan' | 'violet'>('emerald');
  const [windowBezelOn, setWindowBezelOn] = useState<boolean>(true);

  // Target and current scroll lerping
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  const titleLetters = "ASTRALEARN".split("");

  const interactiveFeatures = [
    {
      num: "01",
      title: "Synthesize Notes",
      desc: "Turn dense lecture slides, textbook chapters, and syllabus outlines into layered, exam-focused summaries with key definitions.",
      tab: "summary",
      icon: BookOpen,
      tag: "Deep Comprehension"
    },
    {
      num: "02",
      title: "Active Recall Quizzes",
      desc: "Generate targeted 5, 10, or 15 multiple-choice questions with full explanations for every single option.",
      tab: "quiz",
      icon: HelpCircle,
      tag: "Testing Effect"
    },
    {
      num: "03",
      title: "3D Flashcard Decks",
      desc: "Master critical terminology and technical mechanisms through smooth, interactive spaced-repetition card decks.",
      tab: "flashcards",
      icon: Layers,
      tag: "Spaced Repetition"
    },
    {
      num: "04",
      title: "Grounded Chat Companion",
      desc: "Ask anything about your notes with custom study modes: Exam 5-Marker Answers, Deep Explanations, or Simplified analogies.",
      tab: "chat",
      icon: Sparkles,
      tag: "Socratic AI"
    },
  ];

  // --- THREE.JS WEBGL LIVING CANVAS SCENE ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07110d, 0.014);

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
    renderer.toneMappingExposure = 1.15;

    // Atmospheric lighting
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.4);
    sunLight.position.set(20, 35, 20);
    scene.add(sunLight);

    const emeraldHorizonLight = new THREE.DirectionalLight(0x34d399, 1.3);
    emeraldHorizonLight.position.set(-20, -10, 10);
    scene.add(emeraldHorizonLight);

    // Procedural 3D Volumetric Cloud Group
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(1, 1);
    
    const cloudMats = [
      new THREE.MeshStandardMaterial({
        color: 0xf0fdf4,
        roughness: 0.9,
        transparent: true,
        opacity: 0.72,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xdcfce7,
        roughness: 0.85,
        transparent: true,
        opacity: 0.62,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.7,
        transparent: true,
        opacity: 0.68,
      }),
    ];

    const cloudPuffs: { mesh: THREE.Mesh; baseZ: number; rotSpeed: number }[] = [];
    const totalClouds = 75;

    for (let i = 0; i < totalClouds; i++) {
      const mat = cloudMats[i % cloudMats.length];
      const mesh = new THREE.Mesh(cloudGeo, mat);

      const sx = (2.2 + Math.random() * 4.2) * cloudScale;
      const sy = (1.4 + Math.random() * 2.8) * cloudScale;
      const sz = (2.2 + Math.random() * 3.8) * cloudScale;
      mesh.scale.set(sx, sy, sz);

      const x = (Math.random() - 0.5) * 70;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 140 - 20;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      cloudGroup.add(mesh);
      cloudPuffs.push({
        mesh,
        baseZ: z,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      });
    }
    scene.add(cloudGroup);

    // Floating Atmospheric Stardust / Vapor Motes
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleDensity * 3);

    for (let i = 0; i < particleDensity * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 85;
      particlePos[i + 1] = (Math.random() - 0.5) * 65;
      particlePos[i + 2] = (Math.random() - 0.5) * 180;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.18,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animated 3D Horizon Grid (Destination Arrival)
    const grid = new THREE.GridHelper(220, 45, 0x10b981, 0x064e3b);
    grid.position.y = -22;
    grid.position.z = -55;
    scene.add(grid);

    // Scroll progress handler
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      targetScrollRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const clock = new THREE.Clock();

    const render = () => {
      animFrameId.current = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp (60fps dampening)
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.08;
      const p = currentScrollRef.current;

      setScrollProgress(Math.round(p * 100));

      // Telemetry updates
      if (p < 0.33) {
        setActivePhase(1);
        setAltitude(Math.round(10500 - p * 3200));
        setSpeed(860);
      } else if (p < 0.66) {
        setActivePhase(2);
        setAltitude(Math.round(7300 - (p - 0.33) * 8500));
        setSpeed(790);
      } else {
        setActivePhase(3);
        setAltitude(Math.max(Math.round(1800 - (p - 0.66) * 4500), 280));
        setSpeed(340);
      }

      // Camera flight position along Z, X, Y
      camera.position.z = 15 - p * 62 * cameraSpeedMult;
      camera.position.y = Math.sin(elapsedTime * 0.5) * 0.35 + (1 - p * 1.5);
      camera.position.x = Math.sin(p * Math.PI * 1.5) * 3.2;

      // Camera tilt / banking
      camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.1;
      camera.rotation.x = -p * 0.16 + Math.sin(elapsedTime * 0.8) * 0.02;

      // Drift clouds
      cloudPuffs.forEach((puff, idx) => {
        puff.mesh.rotation.y += puff.rotSpeed;
        puff.mesh.position.y += Math.sin(elapsedTime * 0.6 + idx) * 0.007;
      });

      // Drift particles
      particles.rotation.y = elapsedTime * 0.025;

      // Atmospheric color shifts
      if (scene.fog) {
        if (p < 0.33) {
          // Dawn / Sunrise
          scene.fog.color.setHex(0x07110d);
          ambientLight.color.setHex(0xdcfce7);
          sunLight.color.setHex(0xfef08a);
        } else if (p < 0.66) {
          // Stratospheric Cloud Vapor
          scene.fog.color.setHex(0x0d2319);
          ambientLight.color.setHex(0xa7f3d0);
          sunLight.color.setHex(0x6ee7b7);
        } else {
          // Golden Destination Horizon
          scene.fog.color.setHex(0x181410);
          ambientLight.color.setHex(0xfde68a);
          sunLight.color.setHex(0xf59e0b);
        }
      }

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      cloudGeo.dispose();
      cloudMats.forEach(m => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [particleDensity, cloudScale, cameraSpeedMult]);

  // Auto-cruise automated flight
  useEffect(() => {
    let cruiseInterval: any = null;
    if (isAutoCruising) {
      cruiseInterval = setInterval(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const next = window.scrollY + 6;
        if (next >= max) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: 6, behavior: 'auto' });
        }
      }, 20);
    }
    return () => clearInterval(cruiseInterval);
  }, [isAutoCruising]);

  const handleCopyCode = () => {
    const snippet = `// Three.js & WebGL 3D Flight Scroll Engine
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function WebGLFlightExperience() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07110d, 0.015);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Volumetric Atmospheric Particle Array (${particleDensity} particles)
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(${particleDensity} * 3);
    for (let i = 0; i < ${particleDensity} * 3; i++) positions[i] = (Math.random() - 0.5) * 80;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x6ee7b7, size: 0.18, transparent: true });
    scene.add(new THREE.Points(particleGeo, particleMat));

    let targetP = 0, currentP = 0;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetP = window.scrollY / maxScroll;
    };
    window.addEventListener('scroll', onScroll);

    const render = () => {
      requestAnimationFrame(render);
      currentP += (targetP - currentP) * 0.08;
      camera.position.z = 15 - currentP * 62;
      camera.position.x = Math.sin(currentP * Math.PI * 1.5) * 3.2;
      renderer.render(scene, camera);
    };
    render();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />;
}`;

    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getBorderGlowClass = () => {
    switch (glassGlow) {
      case 'amber': return 'border-amber-500/40 shadow-amber-950/40';
      case 'cyan': return 'border-cyan-500/40 shadow-cyan-950/40';
      case 'violet': return 'border-violet-500/40 shadow-violet-950/40';
      default: return 'border-emerald-500/40 shadow-emerald-950/40';
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col relative text-forest-50 overflow-x-hidden font-sans">
      
      {/* --- THREE.JS WEBGL LIVING 3D BACKGROUND CANVAS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Simulated Airplane Window Bezel Vignette */}
      {windowBezelOn && (
        <div className="fixed inset-0 pointer-events-none z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] border-[14px] sm:border-[24px] border-[#070d0b]/80 rounded-[44px] m-1 sm:m-2 transition-all" />
      )}

      {/* --- FLOATING FLIGHT TELEMETRY HUD & STUDIO LAUNCHER --- */}
      <div className="fixed top-20 left-4 right-4 sm:left-8 sm:right-8 z-40 flex items-center justify-between pointer-events-auto transition-all">
        {/* Left Telemetry Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/65 backdrop-blur-xl border border-emerald-500/30 text-xs font-mono shadow-2xl">
          <Plane className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-white tracking-widest uppercase">
            FLIGHT AL-2026
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-emerald-300 hidden sm:inline">
            {activePhase === 1 ? '1 // WINDOW TAKEOFF' : activePhase === 2 ? '2 // CLOUD STRATOSPHERE' : '3 // GOLDEN ARRIVAL'}
          </span>
        </div>

        {/* Right HUD Gauges & Studio Drawer Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Altitude & Velocity */}
          <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/65 backdrop-blur-xl border border-white/15 text-[11px] font-mono text-white/85 shadow-lg">
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

          {/* Auto Fly Button */}
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

          {/* 3D Studio Tools Button */}
          <button
            type="button"
            onClick={() => setStudioDrawerOpen(!studioDrawerOpen)}
            className="px-4 py-1.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-400/50 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xl"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Studio Tools</span>
          </button>
        </div>
      </div>

      {/* --- SCENE 1 (KEYFRAME 1): HERO OVERSIZED ASTRALEARN OVER 3D CLOUDS --- */}
      <section className="relative z-20 min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Top Academic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-black/60 backdrop-blur-xl text-xs font-mono tracking-widest uppercase text-emerald-300 mb-8 shadow-xl">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>AI-Powered Learning • Three.js WebGL Engine</span>
          <span className="text-white/40">•</span>
          <span>Keyframe 1: Departure</span>
        </div>

        {/* Large Oversized Interactive Typography: ASTRALEARN */}
        <div className="relative w-full my-4 select-none">
          <h1 
            aria-label="ASTRALEARN"
            className="flex justify-center items-center flex-wrap font-serif text-[13vw] sm:text-[12vw] md:text-[11vw] lg:text-[8.5rem] font-bold tracking-tight text-white leading-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.7)]"
          >
            {titleLetters.map((char, index) => (
              <span
                key={index}
                onMouseEnter={() => setSelectedLetter(index)}
                onMouseLeave={() => setSelectedLetter(null)}
                className={`cursor-pointer transition-all duration-300 transform inline-block hover:-translate-y-3 ${
                  selectedLetter === index
                    ? 'text-emerald-300 scale-110 drop-shadow-[0_10px_35px_rgba(52,211,153,0.65)]'
                    : 'text-white/95 hover:text-white'
                }`}
              >
                {char}
              </span>
            ))}
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-emerald-300/85 uppercase mt-3 drop-shadow">
            Turn your study material into smarter learning • Interactive 3D Journey
          </p>
        </div>

        {/* Subtitle & Value Proposition Card */}
        <div 
          style={{
            backdropFilter: `blur(${glassBlur}px)`,
            backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
          }}
          className={`max-w-2xl mt-8 p-6 sm:p-8 rounded-3xl border ${getBorderGlowClass()} shadow-2xl text-center space-y-4`}
        >
          <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal italic tracking-tight">
            “Learn smarter. Not harder.”
          </h2>
          <p className="text-sm sm:text-base text-forest-100/90 leading-relaxed font-light">
            Turn your notes into executive summaries, active-recall quizzes, 3D flashcards, and a grounded AI study companion.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 z-20">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white font-medium text-sm flex items-center justify-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Try Demo</span>
          </button>

          <button
            onClick={() => setStudioDrawerOpen(true)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Open 3D Studio</span>
          </button>
        </div>

        {/* Scroll Cue */}
        <div className="mt-14 flex items-center gap-2 text-xs font-mono text-emerald-300/80 uppercase tracking-widest animate-bounce">
          <span>Scroll down into the 3D clouds</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>

      </section>

      {/* --- SCENE 2 (KEYFRAME 2): CLOUD STRATOSPHERE & THE ACADEMIC LOOP --- */}
      <section className="relative z-20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div 
            style={{
              backdropFilter: `blur(${glassBlur}px)`,
              backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
            }}
            className={`p-8 sm:p-12 rounded-3xl border ${getBorderGlowClass()} shadow-2xl mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6`}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                <Brain className="w-3.5 h-3.5" />
                <span>Keyframe 2 // Cognitive Stratosphere</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-white mt-2 font-bold">
                The AstraLearn Academic Loop
              </h3>
            </div>
            <p className="text-sm text-forest-200/90 max-w-md font-light leading-relaxed">
              As you surf through dense 3D cloud clusters, dense lecture notes dissolve into crystal-clear cognitive retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interactiveFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.num}
                  onClick={() => onExploreSection(feat.tab)}
                  style={{
                    backdropFilter: `blur(${glassBlur}px)`,
                    backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
                  }}
                  className={`group cursor-pointer p-6 rounded-3xl border ${getBorderGlowClass()} hover:border-emerald-400/80 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1.5`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                        {feat.tag}
                      </span>
                      <div className="p-2 rounded-xl bg-white/10 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="font-serif text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-forest-200/80 leading-relaxed font-light">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- SCENE 3 (KEYFRAME 3): DESTINATION TOUCHDOWN & CURRICULUMS --- */}
      <section className="relative z-20 py-24 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div 
            style={{
              backdropFilter: `blur(${glassBlur}px)`,
              backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
            }}
            className={`p-8 sm:p-12 rounded-3xl border ${getBorderGlowClass()} shadow-2xl flex flex-col sm:flex-row sm:items-end justify-between gap-4`}
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                Keyframe 3 // Touchdown at Intellectual Clarity
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white mt-2 font-bold">
                Higher-Ed Curriculum Modules
              </h3>
            </div>
            <p className="text-xs text-emerald-300/80 font-mono">
              Instant interactive study demonstration across 4 disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUBJECT_DEMOS.map((demo) => (
              <div
                key={demo.id}
                onClick={() => onSelectSubject ? onSelectSubject(demo) : onTryDemo()}
                style={{
                  backdropFilter: `blur(${glassBlur}px)`,
                  backgroundColor: `rgba(0, 0, 0, ${glassOpacity / 100})`,
                }}
                className={`p-6 rounded-3xl border ${getBorderGlowClass()} hover:border-emerald-400 transition-all cursor-pointer group flex flex-col justify-between shadow-xl hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                      {demo.subject}
                    </span>
                    <span className="text-[10px] font-mono text-white/50">
                      {demo.badge}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {demo.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-forest-200/80 leading-relaxed font-light">
                    {demo.summaryDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-300">
                  <span>Load & Synthesize Notes</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- ALL-IN-ONE 3D STUDIO TOOLS DRAWER --- */}
      {studioDrawerOpen && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 w-80 sm:w-96 max-h-[85vh] overflow-y-auto rounded-3xl bg-[#07110d]/95 backdrop-blur-2xl border border-emerald-500/40 p-6 shadow-2xl space-y-5 text-white font-sans transition-all">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-serif font-bold text-lg text-white">All-in-One Studio</h3>
            </div>
            <button
              onClick={() => setStudioDrawerOpen(false)}
              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Tab buttons */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-center">
            <button
              onClick={() => setActiveStudioTab('story')}
              className={`py-1.5 rounded-lg transition-all ${
                activeStudioTab === 'story' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Story
            </button>
            <button
              onClick={() => setActiveStudioTab('engine')}
              className={`py-1.5 rounded-lg transition-all ${
                activeStudioTab === 'engine' ? 'bg-emerald-500 text-black font-bold' : 'text-white/70 hover:text-white'
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
              Glass UI
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

          {/* TAB 1: STORYLINE PRESETS */}
          {activeStudioTab === 'story' && (
            <div className="space-y-3">
              <label className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                3-Keyframe Presets (Flow AI)
              </label>
              <div className="space-y-2">
                {STORYLINE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      activePreset.id === p.id
                        ? 'bg-emerald-950/70 border-emerald-400 text-white'
                        : 'bg-black/30 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{p.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1 line-clamp-1 flex items-center gap-1">
                      <span>{p.k1Title}</span>
                      <ArrowRight className="w-2.5 h-2.5 inline text-emerald-400/80 shrink-0" />
                      <span>{p.k3Title}</span>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: THREE.JS ENGINE */}
          {activeStudioTab === 'engine' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Particle Dust Field</span>
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

              <div className="space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>Camera Z Flight Speed</span>
                  <span className="text-emerald-400">{cameraSpeedMult.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.2"
                  value={cameraSpeedMult}
                  onChange={(e) => setCameraSpeedMult(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <span className="text-white/80">Airplane Window Bezel</span>
                <button
                  onClick={() => setWindowBezelOn(!windowBezelOn)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    windowBezelOn ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {windowBezelOn ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GLASSMORPHISM UI */}
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
                  Border Glow Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['emerald', 'amber', 'cyan', 'violet'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setGlassGlow(color)}
                      className={`py-2 rounded-xl border capitalize text-center transition-all ${
                        glassGlow === color
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

          {/* TAB 4: CODE EXPORT */}
          {activeStudioTab === 'export' && (
            <div className="space-y-3 text-xs font-mono">
              <p className="text-white/70 leading-relaxed font-sans">
                Export your current Three.js & WebGL scroll animation configuration as a production-ready component.
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
                <div>• ACESFilmic Tone Mapping</div>
                <div>• Interpolated 60 FPS Camera</div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default EditorialLanding;
