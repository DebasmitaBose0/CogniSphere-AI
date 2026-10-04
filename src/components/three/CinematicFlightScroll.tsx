import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Plane, 
  Cloud, 
  MapPin, 
  Compass, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw,
  Layers,
  Sliders,
  CheckCircle2,
  Gauge,
  ChevronDown
} from 'lucide-react';

interface CinematicFlightScrollProps {
  onStartLearning?: () => void;
  onTryDemo?: () => void;
  onClose?: () => void;
}

export const CinematicFlightScroll: React.FC<CinematicFlightScrollProps> = ({
  onStartLearning,
  onTryDemo,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Flight telemetry state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [altitude, setAltitude] = useState<number>(10500);
  const [speed, setSpeed] = useState<number>(860);
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [isAutoCruising, setIsAutoCruising] = useState<boolean>(false);
  const [renderEngine, setRenderEngine] = useState<'webgl' | 'sequence'>('webgl');

  // Animation and Three.js references
  const animationFrameId = useRef<number | null>(null);
  const targetScrollRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // --- THREE.JS INITIALIZATION ---
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

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    const horizonLight = new THREE.DirectionalLight(0x34d399, 1.4);
    horizonLight.position.set(-20, -10, 10);
    scene.add(horizonLight);

    // --- PROCEDURAL ATMOSPHERIC CLOUD FIELD ---
    const cloudGroup = new THREE.Group();
    const cloudGeometry = new THREE.DodecahedronGeometry(1, 1);
    
    // Create stratified clusters of procedural clouds
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

    const cloudPuffs: { mesh: THREE.Mesh; baseZ: number; speed: number; rotSpeed: number }[] = [];
    const totalPuffs = 70;

    for (let i = 0; i < totalPuffs; i++) {
      const mat = cloudMaterials[i % cloudMaterials.length];
      const mesh = new THREE.Mesh(cloudGeometry, mat);
      
      const scaleX = 2 + Math.random() * 4;
      const scaleY = 1.2 + Math.random() * 2.5;
      const scaleZ = 2 + Math.random() * 3.5;
      mesh.scale.set(scaleX, scaleY, scaleZ);

      const x = (Math.random() - 0.5) * 60;
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
        speed: 0.02 + Math.random() * 0.03,
        rotSpeed: (Math.random() - 0.5) * 0.005,
      });
    }
    scene.add(cloudGroup);

    // --- ATMOSPHERIC PARTICLES (STARDUST / CLOUD VAPOR) ---
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 80;
      particlePositions[i + 1] = (Math.random() - 0.5) * 60;
      particlePositions[i + 2] = (Math.random() - 0.5) * 180;
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

    // --- 3D HORIZON GRID / GROUND ILLUMINATION (ARRIVAL PHASE) ---
    const gridHelper = new THREE.GridHelper(200, 40, 0x10b981, 0x064e3b);
    gridHelper.position.y = -22;
    gridHelper.position.z = -50;
    scene.add(gridHelper);

    // --- SCROLL EVENT LISTENER ---
    const handleScroll = () => {
      if (!containerRef.current) return;
      const totalScroll = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      targetScrollRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- RESIZE LISTENER ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerping of scroll progress for buttery-smooth 60fps tracking
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * 0.075;
      const p = currentScrollRef.current;

      // Update state for UI overlay telemetry
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

      // --- DYNAMIC CAMERA CHOREOGRAPHY ACROSS 3 KEYFRAME PHASES ---
      // Phase 1 (0 to 0.33): Looking through passenger window, ascending into clouds
      // Phase 2 (0.33 to 0.66): Diving directly through dense stratospheric cloud vapor
      // Phase 3 (0.66 to 1.0): Banking gently, swooping down towards the illuminated arrival horizon
      camera.position.z = 15 - p * 65;
      camera.position.y = Math.sin(elapsedTime * 0.5) * 0.4 + (1 - p * 1.6);
      camera.position.x = Math.sin(p * Math.PI * 1.5) * 3.5;

      // Camera tilt / banking angles
      camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.12;
      camera.rotation.x = -p * 0.18 + Math.sin(elapsedTime * 0.8) * 0.02;

      // Drift clouds
      cloudPuffs.forEach((puff, idx) => {
        puff.mesh.rotation.y += puff.rotSpeed;
        puff.mesh.position.y += Math.sin(elapsedTime * 0.6 + idx) * 0.008;
      });

      // Drift particle motes
      particles.rotation.y = elapsedTime * 0.03;
      particles.position.z = Math.sin(elapsedTime * 0.2) * 2;

      // Dynamic fog and lighting tone based on phase
      if (p < 0.33) {
        // Sunrise / Dawn tone
        if (scene.fog) scene.fog.color.setHex(0x0a1612);
        ambientLight.color.setHex(0xdcfce7);
        sunLight.color.setHex(0xfef08a);
      } else if (p < 0.66) {
        // Stratospheric White-out Cloud Vapor
        if (scene.fog) scene.fog.color.setHex(0x132a22);
        ambientLight.color.setHex(0xa7f3d0);
        sunLight.color.setHex(0x6ee7b7);
      } else {
        // Golden Hour Paris Arrival Horizon
        if (scene.fog) scene.fog.color.setHex(0x1c1917);
        ambientLight.color.setHex(0xfde68a);
        sunLight.color.setHex(0xf59e0b);
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
  }, []);

  // Auto-cruise automated flythrough
  useEffect(() => {
    let cruiseInterval: any = null;
    if (isAutoCruising) {
      cruiseInterval = setInterval(() => {
        if (!containerRef.current) return;
        const total = containerRef.current.scrollHeight - window.innerHeight;
        const nextY = window.scrollY + 8;
        if (nextY >= total) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: 8, behavior: 'auto' });
        }
      }, 20);
    }
    return () => clearInterval(cruiseInterval);
  }, [isAutoCruising]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[380vh] bg-[#070e0b] text-white select-none font-sans"
    >
      {/* Three.js Full-Viewport WebGL Canvas */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Airplane Window Vignette Overlay (Simulated Viewport) */}
      <div className="fixed inset-0 pointer-events-none z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] border-[16px] sm:border-[28px] border-[#070d0b]/90 rounded-[48px] m-1 sm:m-3 transition-all" />

      {/* Top Telemetry & Flight HUD */}
      <div className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between pointer-events-auto">
        {/* Left Flight Identifier */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-mono">
          <Plane className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-white tracking-widest uppercase">
            FLIGHT AL-2026
          </span>
          <span className="text-white/40">•</span>
          <span className="text-emerald-300">
            {activePhase === 1 ? 'CABIN DEPARTURE' : activePhase === 2 ? 'STRATOSPHERE CLOUDS' : 'DESTINATION TOUCHDOWN'}
          </span>
        </div>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telemetry Gauge */}
          <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80">
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

          {/* Auto Cruise Button */}
          <button
            type="button"
            onClick={() => setIsAutoCruising(!isAutoCruising)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
              isAutoCruising
                ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                : 'bg-black/60 text-white/80 border-white/15 hover:text-white'
            }`}
          >
            {isAutoCruising ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoCruising ? 'Cruising' : 'Auto Fly'}</span>
          </button>

          {/* Close / Return to Notes */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-all cursor-pointer"
            >
              Exit 3D View
            </button>
          )}
        </div>
      </div>

      {/* Floating Scroll Progress Indicator Rail */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
        <div className="w-1 h-36 bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="w-full bg-emerald-400 transition-all duration-100 rounded-full"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-white/60 -rotate-90 origin-center translate-y-3">
          SCROLL
        </span>
      </div>

      {/* --- SCROLL-DRIVEN GLASSMORPHIC UI SECTIONS --- */}
      <div className="relative z-30 pointer-events-none">
        
        {/* PHASE 1 (0% - 25%): WINDOW SEAT DEPARTURE HERO */}
        <section className="h-screen flex flex-col justify-center items-start px-6 sm:px-16 lg:px-24">
          <div className="max-w-2xl p-8 sm:p-10 rounded-3xl bg-black/55 backdrop-blur-xl border border-white/15 shadow-2xl space-y-5 pointer-events-auto transition-all">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono uppercase tracking-widest text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step 1: Visual Keyframe Journey</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Elevate Your Learning Above the Clouds.
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Step aboard AstraLearn’s 3D spatial experience. Powered by Three.js & WebGL shaders, watch study concepts crystallize as you transition from takeoff to intellectual arrival.
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
          <div className="max-w-xl p-8 sm:p-10 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl space-y-5 pointer-events-auto transition-all text-right">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono uppercase tracking-widest text-emerald-300 ml-auto">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step 2: Stratospheric Synthesis</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Dense Notes Dissolve Into Crystal Logic.
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Just like piercing through turbulent weather into calm skies, AstraLearn’s AI filters noisy textbook chapters into structured 5-tier summaries, MCQ quiz evaluations, and 3D flashcards.
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

        {/* PHASE 3 (66% - 100%): TOUCHDOWN AT DESTINATION (PARIS / MASTERY) */}
        <section className="h-screen flex flex-col justify-center items-center px-6 text-center">
          <div className="max-w-2xl p-8 sm:p-12 rounded-3xl bg-black/65 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-6 pointer-events-auto transition-all">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-mono uppercase tracking-widest text-amber-300 mx-auto">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Step 3: Destination Reached • Full Mastery</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none">
              Welcome to Exam Excellence.
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-lg mx-auto">
              You have completed the flight from raw lecture confusion to crystalline comprehension. Launch the AstraLearn study suite now to begin your session.
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
                WebGL 2.0 Shaders
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Three.js r170
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

    </div>
  );
};

export default CinematicFlightScroll;
