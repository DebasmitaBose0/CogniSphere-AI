import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Brain, 
  Atom, 
  Dna, 
  GraduationCap, 
  Compass, 
  RotateCcw,
  Zap,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

interface KnowledgeOrbHeroProps {
  onStartLearning: () => void;
  onTryDemo: () => void;
  onOpenKnowledgeMap?: () => void;
}

type StudySubjectFocus = 'all' | 'codex' | 'atom' | 'dna' | 'math' | 'cap';

interface SubjectInfo {
  id: StudySubjectFocus;
  label: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  title: string;
  formula: string;
  description: string;
  keyConcepts: string[];
}

const STUDY_SUBJECTS: SubjectInfo[] = [
  {
    id: 'all',
    label: 'All Disciplines',
    icon: Sparkles,
    color: '#38bdf8',
    badge: 'COGNITIVE UNIVERSE',
    title: 'Integrated AI Study World',
    formula: 'Cognition = Σ (Active Recall + Spaced Synthesis)',
    description: 'A multi-dimensional 3D learning atmosphere combining humanities codex, quantum mechanics, genetics, and mathematical logic.',
    keyConcepts: ['Layered Summaries', 'Active-Recall Quizzes', '3D Spatial Memory', 'Socratic Companion'],
  },
  {
    id: 'codex',
    label: 'Open AI Codex',
    icon: BookOpen,
    color: '#38bdf8',
    badge: 'HUMANITIES & LITERATURE',
    title: 'The Living Neural Manuscript',
    formula: 'H(X) = - ∑ P(x) log₂ P(x)',
    description: 'An open holographic codex with illuminated theorems, Shannon entropy formulations, and ascending knowledge light streams.',
    keyConcepts: ['Structured Reading', 'Key Point Extraction', 'Cross-Disciplinary Indexing', 'Feynman Clarification'],
  },
  {
    id: 'atom',
    label: 'Quantum Physics',
    icon: Atom,
    color: '#a855f7',
    badge: 'PHYSICS & CHEMISTRY',
    title: 'Atomic Orbitals & Quantum States',
    formula: 'ψ(r, t) = A e^{i(k•r - ωt)} • E = mc²',
    description: 'Orbital electron shells revolving around a clustered atomic nucleus with dynamic electromagnetic resonance.',
    keyConcepts: ['Electron Shell Energy', 'Wave-Particle Duality', 'Quantum Superposition', 'Thermodynamics'],
  },
  {
    id: 'dna',
    label: 'Molecular Biology',
    icon: Dna,
    color: '#34d399',
    badge: 'GENETICS & LIFE SCIENCES',
    title: 'DNA Double Helix & Gene Expression',
    formula: 'Base Pairing: [A ══ T] • [G ≡≡ C]',
    description: 'Intertwined nucleotide helical strands bound by hydrogen base-pair rungs, illustrating molecular architecture.',
    keyConcepts: ['Double Helix Geometry', 'Transcription & Translation', 'Genetic Code Transcription', 'Cellular Respiration'],
  },
  {
    id: 'math',
    label: 'Mathematics & Logic',
    icon: Compass,
    color: '#fbbf24',
    badge: 'PURE MATHEMATICS',
    title: 'Sacred Polyhedra & Topological Forms',
    formula: 'V - E + F = 2 • Euler-Poincaré Characteristic',
    description: 'Golden-ratio dodecahedron and nested crystalline icosahedra representing mathematical beauty and abstract theorem proofs.',
    keyConcepts: ['Platonic Polyhedra', 'Differential Calculus', 'Linear Algebra & Tensors', 'Discrete Structures'],
  },
  {
    id: 'cap',
    label: 'Scholarship & Mastery',
    icon: GraduationCap,
    color: '#f43f5e',
    badge: 'ACADEMIC EXCELLENCE',
    title: 'Degree Achievement & Spaced Mastery',
    formula: 'Retention = e^{-t / S} • Spaced Retrieval Curve',
    description: 'The iconic scholar’s mortarboard with swaying golden tassel levitating in anti-gravity equilibrium.',
    keyConcepts: ['Exam Simulation', 'Flashcard Spacing Intervals', 'Confidence Tracking', 'Curriculum Graduation'],
  },
];

// Helper to create glowing procedural texture for book pages with real academic formulas
function createBookPageTexture(isLeft: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian parchment
  ctx.fillStyle = '#060a17';
  ctx.fillRect(0, 0, 512, 720);

  // Border frame
  ctx.strokeStyle = isLeft ? 'rgba(56, 189, 248, 0.35)' : 'rgba(168, 85, 247, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 472, 680);

  // Corner accents
  ctx.fillStyle = isLeft ? '#38bdf8' : '#c084fc';
  ctx.fillRect(16, 16, 12, 12);
  ctx.fillRect(484, 16, 12, 12);
  ctx.fillRect(16, 692, 12, 12);
  ctx.fillRect(484, 692, 12, 12);

  // Header Title
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText(isLeft ? '// NEURAL CODEX : CHAPTER IV' : '// KNOWLEDGE SYNTHESIS ENGINE', 40, 56);

  // Divider
  ctx.strokeStyle = isLeft ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 70);
  ctx.lineTo(472, 70);
  ctx.stroke();

  if (isLeft) {
    // Left Page: Computer Science & Information Theory
    ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('§ 1.1 SHANNON INFORMATION ENTROPY', 40, 105);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('Quantifying the fundamental limits of signal', 40, 130);
    ctx.fillText('processing and lossless data compression:', 40, 148);

    // Formula Box
    ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.fillRect(40, 170, 432, 85);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.strokeRect(40, 170, 432, 85);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('H(X) = - ∑ P(x) log₂ P(x)', 60, 210);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('Expected value of information contained in message', 60, 235);

    // Neural Network Diagram
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.5;
    const nodes = [
      { x: 100, y: 330 }, { x: 100, y: 380 }, { x: 100, y: 430 },
      { x: 256, y: 310 }, { x: 256, y: 360 }, { x: 256, y: 410 }, { x: 256, y: 460 },
      { x: 412, y: 355 }, { x: 412, y: 405 }
    ];
    // Draw Connections
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 7; j++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    for (let j = 3; j < 7; j++) {
      for (let k = 7; k < 9; k++) {
        ctx.beginPath();
        ctx.moveTo(nodes[j].x, nodes[j].y);
        ctx.lineTo(nodes[k].x, nodes[k].y);
        ctx.stroke();
      }
    }
    // Draw Node Spheres
    nodes.forEach((n, idx) => {
      ctx.fillStyle = idx < 3 ? '#38bdf8' : idx < 7 ? '#818cf8' : '#34d399';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('Feedforward Deep Network Representation (1536d)', 75, 495);

    // Study Principles bullet points
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('• Active Retrieval: 3.8x memory retention multiplier', 40, 540);
    ctx.fillText('• Spaced Intervals: Algorithmic SM-2 scheduling', 40, 565);
    ctx.fillText('• Socratic Synthesis: Context-grounded validation', 40, 590);
    ctx.fillText('• Multi-Modal Ingestion: Text, Slides, PDFs, Notes', 40, 615);
  } else {
    // Right Page: Quantum Mechanics & Biology
    ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('§ 2.3 QUANTUM WAVE-PARTICLE EQUATIONS', 40, 105);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('Time-Dependent Schrödinger Formulation in 3D:', 40, 130);
    ctx.fillText('Energy Eigenstates and Probability Density:', 40, 148);

    // Formula Box
    ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
    ctx.fillRect(40, 170, 432, 85);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.strokeRect(40, 170, 432, 85);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('iℏ ∂/∂t Ψ(r,t) = Ĥ Ψ(r,t)', 60, 210);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('State vector evolution in complex Hilbert space', 60, 235);

    // Bar Chart / Retention Metrics Diagram
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.fillRect(80, 430, 40, -90);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.75)';
    ctx.fillRect(160, 430, 40, -140);
    ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
    ctx.fillRect(240, 430, 40, -180);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.fillRect(320, 430, 40, -210);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.fillRect(400, 430, 40, -240);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(60, 430); ctx.lineTo(460, 430);
    ctx.stroke();

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('Day 1', 85, 450);
    ctx.fillText('Day 3', 165, 450);
    ctx.fillText('Day 7', 245, 450);
    ctx.fillText('Day 14', 320, 450);
    ctx.fillText('Day 30', 400, 450);
    ctx.fillText('Spaced Repetition Mastery Retention: +94.8%', 90, 480);

    // Bottom highlights
    ctx.fillStyle = '#c084fc';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('• Watson-Crick Base Pairs: Adenine-Thymine (2H)', 40, 540);
    ctx.fillText('• Guanine-Cytosine Complementarity (3H-Bonds)', 40, 565);
    ctx.fillText('• Dodecahedron Euler Characteristic: V - E + F = 2', 40, 590);
    ctx.fillText('• High-Impact Cognitive Synthesis Complete', 40, 615);
  }

  // Footer page number
  ctx.fillStyle = '#64748b';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillText(isLeft ? 'PAGE 108 // AI STUDY BUDDY' : 'PAGE 109 // ASTRALEARN AI', 40, 665);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

export const KnowledgeOrbHero: React.FC<KnowledgeOrbHeroProps> = ({
  onStartLearning,
  onTryDemo,
  onOpenKnowledgeMap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSubject, setActiveSubject] = useState<StudySubjectFocus>('all');
  const [isRotatingManually, setIsRotatingManually] = useState(false);

  // References for camera target manipulation
  const cameraTargetRef = useRef<{ pos: THREE.Vector3; lookAt: THREE.Vector3 }>({
    pos: new THREE.Vector3(0, 2, 40),
    lookAt: new THREE.Vector3(0, 0, 0),
  });

  // Keep camera position updated on subject change
  useEffect(() => {
    switch (activeSubject) {
      case 'codex':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(0, 1.2, 19),
          lookAt: new THREE.Vector3(0, -0.6, 0),
        };
        break;
      case 'atom':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(-15, 4.5, 17),
          lookAt: new THREE.Vector3(-16, 4, 2),
        };
        break;
      case 'dna':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(15, 4.5, 17),
          lookAt: new THREE.Vector3(16, 4, 2),
        };
        break;
      case 'math':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(12, 11.5, 12),
          lookAt: new THREE.Vector3(12, 11, -3),
        };
        break;
      case 'cap':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(-12, 11.5, 12),
          lookAt: new THREE.Vector3(-12, 11, -3),
        };
        break;
      case 'all':
      default:
        cameraTargetRef.current = {
          pos: new THREE.Vector3(0, 2, 40),
          lookAt: new THREE.Vector3(0, 0, 0),
        };
        break;
    }
  }, [activeSubject]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040711, 0.0014);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 2, 40);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. High-Tech Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const keyLightCyan = new THREE.PointLight(0x06b6d4, 3.5, 80);
    keyLightCyan.position.set(12, 16, 25);
    scene.add(keyLightCyan);

    const fillLightViolet = new THREE.PointLight(0x8b5cf6, 3.0, 75);
    fillLightViolet.position.set(-16, -10, 22);
    scene.add(fillLightViolet);

    const rimLightEmerald = new THREE.DirectionalLight(0x10b981, 1.2);
    rimLightEmerald.position.set(0, 25, -20);
    scene.add(rimLightEmerald);

    // Root Group for all 3D study models
    const universeGroup = new THREE.Group();
    scene.add(universeGroup);

    // =========================================================================
    // 3. MODEL 1: THE HOLOGRAPHIC OPEN CODEX (CENTRAL AI STUDY BOOK)
    // =========================================================================
    const codexGroup = new THREE.Group();
    codexGroup.position.set(0, -1.2, 0);
    codexGroup.rotation.x = 0.52; // Tilted toward user for optimal viewing
    universeGroup.add(codexGroup);

    const leftPageTex = createBookPageTexture(true);
    const rightPageTex = createBookPageTexture(false);

    // 3a. Hardcovers (Left & Right with metallic trim)
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x070c1e,
      roughness: 0.25,
      metalness: 0.8,
    });
    const coverTrimMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
    });

    const coverWidth = 4.8;
    const coverHeight = 6.4;
    const coverThickness = 0.18;
    const bookAngle = 0.24; // V-shape open angle

    // Left Cover
    const leftCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverHeight, coverThickness),
      coverMaterial
    );
    leftCover.position.set(-coverWidth / 2 - 0.1, 0, -0.25);
    leftCover.rotation.y = bookAngle;
    codexGroup.add(leftCover);

    // Right Cover
    const rightCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverHeight, coverThickness),
      coverMaterial
    );
    rightCover.position.set(coverWidth / 2 + 0.1, 0, -0.25);
    rightCover.rotation.y = -bookAngle;
    codexGroup.add(rightCover);

    // Spine
    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, coverHeight, 16, 1, false, -Math.PI / 2, Math.PI),
      coverMaterial
    );
    spine.position.set(0, 0, -0.5);
    codexGroup.add(spine);

    // 3b. Thick Page Stacks (Left & Right)
    const pageBlockMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.85,
    });

    // Left Page Block with texture on top face
    const leftPageGeo = new THREE.BoxGeometry(coverWidth - 0.2, coverHeight - 0.3, 0.35);
    const leftMaterials = [
      pageBlockMat,
      pageBlockMat,
      pageBlockMat,
      pageBlockMat,
      new THREE.MeshBasicMaterial({ map: leftPageTex }), // Top face
      pageBlockMat,
    ];
    const leftPageMesh = new THREE.Mesh(leftPageGeo, leftMaterials);
    leftPageMesh.position.set(-coverWidth / 2 + 0.05, 0, 0.05);
    leftPageMesh.rotation.y = bookAngle;
    codexGroup.add(leftPageMesh);

    // Right Page Block with texture on top face
    const rightPageGeo = new THREE.BoxGeometry(coverWidth - 0.2, coverHeight - 0.3, 0.35);
    const rightMaterials = [
      pageBlockMat,
      pageBlockMat,
      pageBlockMat,
      pageBlockMat,
      new THREE.MeshBasicMaterial({ map: rightPageTex }), // Top face
      pageBlockMat,
    ];
    const rightPageMesh = new THREE.Mesh(rightPageGeo, rightMaterials);
    rightPageMesh.position.set(coverWidth / 2 - 0.05, 0, 0.05);
    rightPageMesh.rotation.y = -bookAngle;
    codexGroup.add(rightPageMesh);

    // 3c. Floating Turning Page (Gently billowing in anti-gravity)
    const turningPageGeo = new THREE.PlaneGeometry(coverWidth - 0.3, coverHeight - 0.4, 16, 16);
    const turningPageMat = new THREE.MeshBasicMaterial({
      map: leftPageTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const turningPageMesh = new THREE.Mesh(turningPageGeo, turningPageMat);
    turningPageMesh.position.set(0, 0, 0.25);
    codexGroup.add(turningPageMesh);

    // 3d. Crimson / Gold Silk Ribbon Bookmark
    const ribbonGeo = new THREE.BoxGeometry(0.35, coverHeight + 1.2, 0.04);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
      metalness: 0.4,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0, -0.3, 0.1);
    codexGroup.add(ribbon);

    // 3e. Knowledge Light Fountain (Particles ascending from the pages)
    const fountainParticleCount = 140;
    const fountainGeo = new THREE.BufferGeometry();
    const fountainPositions = new Float32Array(fountainParticleCount * 3);
    const fountainSpeeds: number[] = [];
    const fountainInitialX: number[] = [];
    const fountainInitialZ: number[] = [];

    for (let i = 0; i < fountainParticleCount; i++) {
      const fx = (Math.random() - 0.5) * 6.5;
      const fz = (Math.random() - 0.5) * 3.5;
      const fy = Math.random() * 8.0;
      fountainPositions[i * 3] = fx;
      fountainPositions[i * 3 + 1] = fy;
      fountainPositions[i * 3 + 2] = fz;
      fountainInitialX.push(fx);
      fountainInitialZ.push(fz);
      fountainSpeeds.push(0.03 + Math.random() * 0.04);
    }
    fountainGeo.setAttribute('position', new THREE.BufferAttribute(fountainPositions, 3));

    // Particle sprite texture
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const gctx = glowCanvas.getContext('2d')!;
    const ggrad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    ggrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    ggrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.9)');
    ggrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.3)');
    ggrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gctx.fillStyle = ggrad;
    gctx.fillRect(0, 0, 64, 64);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    const fountainMat = new THREE.PointsMaterial({
      size: 0.5,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
      depthWrite: false,
    });
    const fountainPoints = new THREE.Points(fountainGeo, fountainMat);
    fountainPoints.position.set(0, 0, 0.2);
    codexGroup.add(fountainPoints);

    // =========================================================================
    // 4. MODEL 2: 3D QUANTUM ATOM (PHYSICS & CHEMISTRY)
    // =========================================================================
    const atomGroup = new THREE.Group();
    atomGroup.position.set(-16, 4, 2);
    universeGroup.add(atomGroup);

    // 4a. Nucleus (Multi-sphere cluster of protons & neutrons)
    const nucleusGroup = new THREE.Group();
    const nucleonGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      roughness: 0.2,
      metalness: 0.4,
    });
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      roughness: 0.2,
      metalness: 0.4,
    });

    const clusterOffsets = [
      [0, 0, 0], [0.35, 0.2, 0], [-0.35, -0.2, 0.1],
      [0.1, -0.35, -0.2], [-0.2, 0.35, 0.15], [0, 0.1, 0.4],
      [0.2, -0.1, -0.4], [-0.25, -0.25, -0.25]
    ];
    clusterOffsets.forEach((pos, idx) => {
      const nMesh = new THREE.Mesh(nucleonGeo, idx % 2 === 0 ? protonMat : neutronMat);
      nMesh.position.set(pos[0], pos[1], pos[2]);
      nucleusGroup.add(nMesh);
    });
    atomGroup.add(nucleusGroup);

    // 4b. Three Elliptical Electron Orbitals
    const orbitRadius = 3.2;
    const ringMatA = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ringMatB = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45 });
    const ringMatC = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.45 });

    const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(orbitRadius, 0.04, 16, 80), ringMatA);
    atomGroup.add(orbitRingA);

    const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(orbitRadius, 0.04, 16, 80), ringMatB);
    orbitRingB.rotation.x = Math.PI / 3;
    orbitRingB.rotation.y = Math.PI / 6;
    atomGroup.add(orbitRingB);

    const orbitRingC = new THREE.Mesh(new THREE.TorusGeometry(orbitRadius, 0.04, 16, 80), ringMatC);
    orbitRingC.rotation.x = -Math.PI / 3;
    orbitRingC.rotation.y = -Math.PI / 5;
    atomGroup.add(orbitRingC);

    // 4c. Electrons
    const electronGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const electronMatA = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const electronMatB = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    const electronMatC = new THREE.MeshBasicMaterial({ color: 0x6ee7b7 });

    const electronA = new THREE.Mesh(electronGeo, electronMatA);
    const electronB = new THREE.Mesh(electronGeo, electronMatB);
    const electronC = new THREE.Mesh(electronGeo, electronMatC);
    atomGroup.add(electronA);
    atomGroup.add(electronB);
    atomGroup.add(electronC);

    // =========================================================================
    // 5. MODEL 3: 3D DNA DOUBLE HELIX (BIOLOGY & GENETICS)
    // =========================================================================
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(16, 4, 2);
    universeGroup.add(dnaGroup);

    const helixHeight = 9.0;
    const helixRadius = 1.7;
    const rungsCount = 18;
    const strandSpheresA: THREE.Mesh[] = [];
    const strandSpheresB: THREE.Mesh[] = [];

    const nodeGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const nodeMatCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, roughness: 0.3 });
    const nodeMatViolet = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, roughness: 0.3 });
    const rungMatAT = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
    const rungMatGC = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.4 });

    for (let r = 0; r < rungsCount; r++) {
      const progress = r / rungsCount;
      const angle = progress * Math.PI * 4; // 2 complete turns
      const y = (progress - 0.5) * helixHeight;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      // Node A
      const nA = new THREE.Mesh(nodeGeo, nodeMatCyan);
      nA.position.set(x1, y, z1);
      dnaGroup.add(nA);
      strandSpheresA.push(nA);

      // Node B
      const nB = new THREE.Mesh(nodeGeo, nodeMatViolet);
      nB.position.set(x2, y, z2);
      dnaGroup.add(nB);
      strandSpheresB.push(nB);

      // Connecting Base-Pair Rung
      const rungDist = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
      const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, rungDist, 8);
      const rungMesh = new THREE.Mesh(rungGeo, r % 2 === 0 ? rungMatAT : rungMatGC);
      rungMesh.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);

      // Align cylinder horizontally between the two points
      rungMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(x2 - x1, 0, z2 - z1).normalize()
      );
      dnaGroup.add(rungMesh);
    }

    // =========================================================================
    // 6. MODEL 4: 3D GRADUATION MORTARBOARD (ACADEMIC MASTERY)
    // =========================================================================
    const capGroup = new THREE.Group();
    capGroup.position.set(-12, 11, -3);
    capGroup.rotation.set(0.3, 0.4, -0.15);
    universeGroup.add(capGroup);

    // Skullcap base
    const capBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.45, 0.75, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.2 })
    );
    capBase.position.y = -0.35;
    capGroup.add(capBase);

    // Diamond Board
    const capBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.14, 3.6),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.3 })
    );
    capBoard.rotation.y = Math.PI / 4;
    capGroup.add(capBoard);

    // Center Gold Button
    const capButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 })
    );
    capButton.position.y = 0.12;
    capGroup.add(capButton);

    // Swaying Tassel Group
    const tasselGroup = new THREE.Group();
    tasselGroup.position.set(0, 0.12, 0);

    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.2, 0.05, 0.5),
      new THREE.Vector3(2.1, -0.4, 0.8),
      new THREE.Vector3(2.2, -1.6, 0.8),
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 20, 0.04, 8, false);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.25 });
    const cordMesh = new THREE.Mesh(cordGeo, goldMat);
    tasselGroup.add(cordMesh);

    // Tassel Fringe Bell
    const tasselBell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.22, 0.6, 12),
      goldMat
    );
    tasselBell.position.set(2.2, -1.9, 0.8);
    tasselGroup.add(tasselBell);
    capGroup.add(tasselGroup);

    // =========================================================================
    // 7. MODEL 5: 3D SACRED POLYHEDRON (MATHEMATICS & LOGIC)
    // =========================================================================
    const mathGroup = new THREE.Group();
    mathGroup.position.set(12, 11, -3);
    universeGroup.add(mathGroup);

    // Outer Wireframe Golden-Ratio Dodecahedron
    const dodecaGeo = new THREE.DodecahedronGeometry(2.4);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    mathGroup.add(dodecaMesh);

    // Inner Glowing Crystalline Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    mathGroup.add(icoMesh);

    // Core Spark
    const mathCoreLight = new THREE.PointLight(0xfbbf24, 2, 8);
    mathGroup.add(mathCoreLight);

    // =========================================================================
    // 8. MODEL 6: 3D KNOWLEDGE SCROLL & DIPLOMA
    // =========================================================================
    const scrollGroup = new THREE.Group();
    scrollGroup.position.set(0, -9.5, 4);
    scrollGroup.rotation.set(0.3, 0.2, 0.4);
    universeGroup.add(scrollGroup);

    const scrollParchment = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 4.4, 32),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 })
    );
    scrollParchment.rotation.z = Math.PI / 2;
    scrollGroup.add(scrollParchment);

    // Golden Ribbon Ring
    const ribbonRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.08, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.3 })
    );
    ribbonRing.rotation.y = Math.PI / 2;
    scrollGroup.add(ribbonRing);

    // Wax Seal
    const waxSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
    );
    waxSeal.position.set(0, 0, 0.65);
    waxSeal.rotation.x = Math.PI / 2;
    scrollGroup.add(waxSeal);

    // =========================================================================
    // 9. AMBIENT CELESTIAL CONSTELLATION PARTICLES
    // =========================================================================
    const cosmicParticleCount = 900;
    const cosmicPositions = new Float32Array(cosmicParticleCount * 3);
    for (let i = 0; i < cosmicParticleCount; i++) {
      cosmicPositions[i * 3] = (Math.random() - 0.5) * 70;
      cosmicPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      cosmicPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    const cosmicGeo = new THREE.BufferGeometry();
    cosmicGeo.setAttribute('position', new THREE.BufferAttribute(cosmicPositions, 3));
    const cosmicMat = new THREE.PointsMaterial({
      size: 0.45,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0x60a5fa,
      depthWrite: false,
    });
    const cosmicSystem = new THREE.Points(cosmicGeo, cosmicMat);
    scene.add(cosmicSystem);

    // =========================================================================
    // 10. MOUSE INTERACTION & DRAG ORBIT
    // =========================================================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Only drag if clicking on background canvas, not on UI buttons
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isDragging = true;
      setIsRotatingManually(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.004;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // =========================================================================
    // 11. BUTTERY-SMOOTH 60FPS ANIMATION LOOP
    // =========================================================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera Smooth Lerp Interpolation towards Target
      camera.position.lerp(cameraTargetRef.current.pos, 0.045);
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      camera.lookAt(cameraTargetRef.current.lookAt);

      // Manual drag rotation lerp
      universeGroup.rotation.y += (targetRotationY - universeGroup.rotation.y) * 0.06;
      universeGroup.rotation.x += (targetRotationX - universeGroup.rotation.x) * 0.06;

      // 1. Animate Central Codex
      const codexBreath = 1.0 + Math.sin(elapsed * 1.6) * 0.015;
      codexGroup.scale.set(codexBreath, codexBreath, codexBreath);
      // Turning page soft wave
      turningPageMesh.rotation.y = Math.sin(elapsed * 0.9) * 0.35;
      // Ascending Knowledge Fountain particles
      const fPos = fountainGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < fountainParticleCount; i++) {
        fPos[i * 3 + 1] += fountainSpeeds[i];
        if (fPos[i * 3 + 1] > 7.5) {
          fPos[i * 3 + 1] = 0.2;
          fPos[i * 3] = fountainInitialX[i];
          fPos[i * 3 + 2] = fountainInitialZ[i];
        }
      }
      fountainGeo.attributes.position.needsUpdate = true;

      // 2. Animate Quantum Atom
      nucleusGroup.rotation.y = elapsed * 0.6;
      nucleusGroup.rotation.z = elapsed * 0.4;
      orbitRingA.rotation.z = elapsed * 0.4;
      orbitRingB.rotation.z = -elapsed * 0.5;
      orbitRingC.rotation.y = elapsed * 0.6;

      // Orbiting electrons
      const eSpeed = elapsed * 3.5;
      electronA.position.set(Math.cos(eSpeed) * orbitRadius, Math.sin(eSpeed) * orbitRadius, 0);
      electronB.position.set(
        Math.cos(eSpeed + 2) * orbitRadius * Math.cos(Math.PI / 6),
        Math.sin(eSpeed + 2) * orbitRadius,
        Math.sin(eSpeed + 2) * orbitRadius * Math.sin(Math.PI / 3)
      );
      electronC.position.set(
        Math.sin(eSpeed + 4) * orbitRadius * Math.cos(-Math.PI / 5),
        Math.cos(eSpeed + 4) * orbitRadius,
        Math.sin(eSpeed + 4) * orbitRadius * Math.sin(-Math.PI / 3)
      );

      // 3. Animate DNA Helix
      dnaGroup.rotation.y = elapsed * 0.45;
      dnaGroup.position.y = 4 + Math.sin(elapsed * 1.5) * 0.35;

      // 4. Animate Graduation Cap
      capGroup.rotation.y = 0.4 + Math.sin(elapsed * 0.8) * 0.12;
      capGroup.position.y = 11 + Math.cos(elapsed * 1.2) * 0.4;
      tasselGroup.rotation.z = Math.sin(elapsed * 2.5) * 0.1;

      // 5. Animate Polyhedron (Math)
      dodecaMesh.rotation.x = elapsed * 0.25;
      dodecaMesh.rotation.y = elapsed * 0.35;
      icoMesh.rotation.x = -elapsed * 0.4;
      icoMesh.rotation.z = elapsed * 0.3;

      // 6. Animate Scroll
      scrollGroup.rotation.y = Math.sin(elapsed * 0.9) * 0.2 + 0.2;
      scrollGroup.position.y = -9.5 + Math.sin(elapsed * 1.4) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      leftPageTex.dispose();
      rightPageTex.dispose();
      glowTexture.dispose();
      fountainGeo.dispose();
      fountainMat.dispose();
      dodecaGeo.dispose();
      dodecaMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      cosmicGeo.dispose();
      cosmicMat.dispose();
      renderer.dispose();
    };
  }, []);

  const activeSubjectInfo = STUDY_SUBJECTS.find((s) => s.id === activeSubject) || STUDY_SUBJECTS[0];

  return (
    <div className="relative min-h-[96vh] w-full flex items-center justify-center overflow-hidden select-none">
      
      {/* 3D WebGL Canvas (Behind the UI) */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        title="Click & Drag to rotate 3D Study Universe"
      />

      {/* Main Overlay Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center mt-2 pointer-events-none">
        
        {/* Top High-Tech Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_20px_rgba(6,182,212,0.25)] pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span>AI STUDY BUDDY • 3D INTERACTIVE STUDY UNIVERSE</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight select-none text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] font-sans">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              AI STUDY
            </span>{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              BUDDY
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-light tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            “Turn your study material into smarter learning.”
          </p>
        </motion.div>

        {/* Interactive 3D Study Disciplines Selector Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 pointer-events-auto max-w-3xl mx-auto"
        >
          {STUDY_SUBJECTS.map((subj) => {
            const Icon = subj.icon;
            const isSelected = activeSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setActiveSubject(subj.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] font-semibold scale-105'
                    : 'bg-slate-950/70 text-slate-300 border border-white/10 hover:border-cyan-500/30 hover:text-white backdrop-blur-md'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{subj.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Dynamic Holographic Subject Info Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubjectInfo.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="mt-5 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] pointer-events-auto text-left relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400"
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shrink-0">
                  <activeSubjectInfo.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    {activeSubjectInfo.badge}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {activeSubjectInfo.title}
                  </h3>
                </div>
              </div>

              {activeSubject !== 'all' && (
                <button
                  onClick={() => setActiveSubject('all')}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors p-1"
                  title="Reset to Full 3D Universe View"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Overview</span>
                </button>
              )}
            </div>

            {/* Formula / Principle Banner */}
            <div className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 font-mono text-xs text-cyan-300 font-medium">
              {activeSubjectInfo.formula}
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {activeSubjectInfo.description}
            </p>

            {/* Key Concept Pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeSubjectInfo.keyConcepts.map((concept, cIdx) => (
                <span
                  key={cIdx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  {concept}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto"
        >
          <MagneticButton
            variant="primary"
            onClick={onStartLearning}
            className="px-7 py-3.5 text-sm sm:text-base font-bold shadow-[0_0_25px_rgba(6,182,212,0.45)]"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            variant="glass"
            onClick={onTryDemo}
            className="px-6 py-3.5 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Try Demo Notes</span>
          </MagneticButton>

          {onOpenKnowledgeMap && (
            <MagneticButton
              variant="secondary"
              onClick={onOpenKnowledgeMap}
              className="px-5 py-3.5 text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Knowledge Map</span>
            </MagneticButton>
          )}
        </motion.div>

        {/* 3D Interaction Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-5 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400"
        >
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Click & Drag in 3D Space to Orbit
          </span>
          <span>•</span>
          <span className="text-violet-300">
            Click Subject Pills to Inspect 3D Models
          </span>
        </motion.div>
      </div>
    </div>
  );
};
