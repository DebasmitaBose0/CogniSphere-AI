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
  Share2,
  Globe,
  Maximize2,
  Play,
  Pause,
  Cloud
} from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export type StudySubjectFocus = 'all' | 'codex' | 'atom' | 'dna' | 'math' | 'cloud' | 'cap';

export interface SubjectInfo {
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

export const STUDY_SUBJECTS: SubjectInfo[] = [
  {
    id: 'all',
    label: 'All Disciplines',
    icon: Globe,
    color: '#00f0ff',
    badge: 'COGNITIVE SPHERE',
    title: '3D Neural Knowledge Universe',
    formula: 'Cognition = Σ (Active Recall + Spaced Synthesis + 3D Spatial Maps)',
    description: 'A multi-dimensional 3D learning atmosphere combining CS systems, cloud infrastructure, neural networks, and mathematical logic.',
    keyConcepts: ['Spatial 3D Memory', 'Active-Recall Quizzes', 'Shannon Entropy Synthesis', 'Socratic AI Tutor'],
  },
  {
    id: 'codex',
    label: 'Open AI Codex',
    icon: BookOpen,
    color: '#38bdf8',
    badge: 'COMPUTER SCIENCE & CODEX',
    title: 'The Living Neural Manuscript',
    formula: 'H(X) = - ∑ P(x) log₂ P(x) • Information Entropy',
    description: 'An open holographic codex with illuminated theorems, Shannon entropy formulations, and ascending knowledge light streams.',
    keyConcepts: ['Structured Reading', 'Key Point Extraction', 'Cross-Disciplinary Indexing', 'Feynman Clarification'],
  },
  {
    id: 'cloud',
    label: 'Cloud Networks',
    icon: Cloud,
    color: '#06b6d4',
    badge: 'DISTRIBUTED SYSTEMS',
    title: 'High-Availability Cloud Architecture',
    formula: 'CAP Theorem: Consistency ∩ Availability ∩ Partition Tolerance',
    description: 'Clustered microservices, Kubernetes pods, and distributed consensus mechanisms synchronized across global regions.',
    keyConcepts: ['Raft Consensus', 'Multi-Region Sharding', 'Microservice Meshes', 'Event-Driven Queues'],
  },
  {
    id: 'atom',
    label: 'Quantum Systems',
    icon: Atom,
    color: '#a855f7',
    badge: 'QUANTUM & HARDWARE',
    title: 'Atomic Orbitals & Silicon Architectures',
    formula: 'ψ(r, t) = A e^{i(k•r - ωt)} • Quantum Superposition',
    description: 'Orbital electron shells revolving around a clustered atomic nucleus with dynamic electromagnetic resonance.',
    keyConcepts: ['Electron Shell Energy', 'Wave-Particle Duality', 'Quantum Superposition', 'Silicon Die Logic'],
  },
  {
    id: 'dna',
    label: 'Neural Genetics',
    icon: Dna,
    color: '#10b981',
    badge: 'BIO-COMPUTING & NEURAL',
    title: 'DNA Double Helix & Genetic Algorithms',
    formula: 'Base Pairing: [A ══ T] • [G ≡≡ C] • Fitness(G) = max(P)',
    description: 'Intertwined nucleotide helical strands bound by hydrogen base-pair rungs, illustrating molecular & algorithmic evolution.',
    keyConcepts: ['Double Helix Geometry', 'Genetic Evolution', 'Neural Chromosomes', 'Spurious Mutations'],
  },
  {
    id: 'math',
    label: 'Mathematical Logic',
    icon: Compass,
    color: '#fbbf24',
    badge: 'DISCRETE MATHEMATICS',
    title: 'Sacred Polyhedra & Topology',
    formula: 'V - E + F = 2 • Euler-Poincaré Characteristic',
    description: 'Golden-ratio dodecahedron and nested crystalline icosahedra representing mathematical beauty and abstract theorem proofs.',
    keyConcepts: ['Platonic Polyhedra', 'Differential Calculus', 'Linear Algebra & Tensors', 'Discrete Structures'],
  },
  {
    id: 'cap',
    label: 'Mastery & Degree',
    icon: GraduationCap,
    color: '#f43f5e',
    badge: 'ACADEMIC MASTERY',
    title: 'Degree Achievement & Spaced Mastery',
    formula: 'Retention = e^{-t / S} • Ebbinghaus Spaced Retrieval Curve',
    description: 'The iconic scholar’s mortarboard with swaying golden tassel levitating in anti-gravity equilibrium.',
    keyConcepts: ['Exam Simulation', 'Flashcard Spacing Intervals', 'Confidence Tracking', 'Curriculum Graduation'],
  },
];

// Helper to create glowing procedural texture for book pages
function createBookPageTexture(isLeft: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050814';
  ctx.fillRect(0, 0, 512, 720);

  ctx.strokeStyle = isLeft ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 472, 680);

  ctx.fillStyle = isLeft ? '#00f0ff' : '#c084fc';
  ctx.fillRect(16, 16, 12, 12);
  ctx.fillRect(484, 16, 12, 12);
  ctx.fillRect(16, 692, 12, 12);
  ctx.fillRect(484, 692, 12, 12);

  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText(isLeft ? '// COGNISPHERE CODEX' : '// NEURAL SYNTHESIS', 40, 56);

  ctx.strokeStyle = isLeft ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 70);
  ctx.lineTo(472, 70);
  ctx.stroke();

  if (isLeft) {
    ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('§ 1.1 INFORMATION ENTROPY', 40, 105);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('Fundamental limits of lossless data transmission', 40, 130);
    ctx.fillText('and cognitive knowledge graph compression:', 40, 148);

    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.fillRect(40, 170, 432, 85);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.strokeRect(40, 170, 432, 85);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('H(X) = - ∑ P(x) log₂ P(x)', 60, 210);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('Optimal entropy bound for active recall', 60, 235);

    // Neural diagram
    const nodes = [
      { x: 100, y: 340 }, { x: 100, y: 390 }, { x: 100, y: 440 },
      { x: 256, y: 320 }, { x: 256, y: 370 }, { x: 256, y: 420 }, { x: 256, y: 470 },
      { x: 412, y: 365 }, { x: 412, y: 415 }
    ];
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 1.5;
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
    nodes.forEach((n, idx) => {
      ctx.fillStyle = idx < 3 ? '#00f0ff' : idx < 7 ? '#a855f7' : '#10b981';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText('§ 2.4 DISTRIBUTED SYSTEMS', 40, 105);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('Consensus states across partitioned nodes', 40, 130);
    ctx.fillText('ensuring fault-tolerant linearizability:', 40, 148);

    ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.fillRect(40, 170, 432, 85);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.strokeRect(40, 170, 432, 85);

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('Quorum = ⌊N/2⌋ + 1', 60, 210);

    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('Raft consensus majority boundary', 60, 235);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(40, 280, 432, 170);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.strokeRect(40, 280, 432, 170);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('ACTIVE STUDY SYLLABUS', 60, 310);

    const items = [
      '• Virtual Memory & Page Tables',
      '• Asynchronous Non-Blocking I/O',
      '• Graph Neural Network Topology',
      '• B-Trees & Write-Ahead Logs',
      '• Zero-Knowledge Proofs'
    ];
    items.forEach((txt, i) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(txt, 60, 340 + i * 22);
    });
  }

  ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText(isLeft ? 'PAGE 108 // COGNISPHERE 3D' : 'PAGE 109 // NEURAL ENGINE', 40, 665);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

interface InteractiveStudySphereProps {
  onIngestNotes: () => void;
  onTryDemo: () => void;
  onOpenKnowledgeMap?: () => void;
}

export const InteractiveStudySphere: React.FC<InteractiveStudySphereProps> = ({
  onIngestNotes,
  onTryDemo,
  onOpenKnowledgeMap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSubject, setActiveSubject] = useState<StudySubjectFocus>('all');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // References for camera target and scene rotation
  const cameraTargetRef = useRef<{ pos: THREE.Vector3; lookAt: THREE.Vector3 }>({
    pos: new THREE.Vector3(0, 3, 38),
    lookAt: new THREE.Vector3(0, 0, 0),
  });

  const autoRotateRef = useRef(true);
  autoRotateRef.current = isAutoRotating;

  // Handle camera position per subject
  useEffect(() => {
    switch (activeSubject) {
      case 'codex':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(0, 1.5, 18),
          lookAt: new THREE.Vector3(0, -0.5, 0),
        };
        break;
      case 'cloud':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(12, 3, 20),
          lookAt: new THREE.Vector3(10, 2, 0),
        };
        break;
      case 'atom':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(-14, 4, 18),
          lookAt: new THREE.Vector3(-14, 3.5, 2),
        };
        break;
      case 'dna':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(14, 4, 18),
          lookAt: new THREE.Vector3(14, 3.5, 2),
        };
        break;
      case 'math':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(10, 10, 14),
          lookAt: new THREE.Vector3(10, 9.5, -2),
        };
        break;
      case 'cap':
        cameraTargetRef.current = {
          pos: new THREE.Vector3(-10, 10, 14),
          lookAt: new THREE.Vector3(-10, 9.5, -2),
        };
        break;
      case 'all':
      default:
        cameraTargetRef.current = {
          pos: new THREE.Vector3(0, 3, 38),
          lookAt: new THREE.Vector3(0, 0, 0),
        };
        break;
    }
  }, [activeSubject]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0016);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3, 38);

    // 2. WebGL Renderer with High Precision
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Studio High-Tech Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLightCyan = new THREE.PointLight(0x00f0ff, 4.0, 90);
    keyLightCyan.position.set(15, 20, 25);
    scene.add(keyLightCyan);

    const fillLightViolet = new THREE.PointLight(0xa855f7, 3.5, 80);
    fillLightViolet.position.set(-18, -10, 20);
    scene.add(fillLightViolet);

    const rimLightEmerald = new THREE.DirectionalLight(0x10b981, 1.4);
    rimLightEmerald.position.set(0, 25, -20);
    scene.add(rimLightEmerald);

    // Master Universe Group
    const universeGroup = new THREE.Group();
    scene.add(universeGroup);

    // =========================================================================
    // 4. CENTRAL 3D ROTATING STUDY SPHERE ("COGNISPHERE")
    // =========================================================================
    const sphereGroup = new THREE.Group();
    sphereGroup.position.set(0, 0, 0);
    universeGroup.add(sphereGroup);

    // 4a. Outer Luminous Knowledge Wireframe Sphere
    const sphereRadius = 6.2;
    const wireSphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 3);
    const wireSphereMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.4,
    });
    const wireSphere = new THREE.Mesh(wireSphereGeo, wireSphereMat);
    sphereGroup.add(wireSphere);

    // 4b. Inner Pulsating Energy Core Sphere
    const coreGeo = new THREE.SphereGeometry(3.6, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x060f26,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    sphereGroup.add(coreSphere);

    // 4c. Three Holographic Coordinate Rings (Equator, Polar, Tilted)
    const ringMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.5 });
    const ringMatViolet = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45 });
    const ringMatGold = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.4 });

    const ringEquator = new THREE.Mesh(new THREE.TorusGeometry(sphereRadius + 1.2, 0.05, 16, 100), ringMatCyan);
    ringEquator.rotation.x = Math.PI / 2;
    sphereGroup.add(ringEquator);

    const ringPolar = new THREE.Mesh(new THREE.TorusGeometry(sphereRadius + 1.4, 0.05, 16, 100), ringMatViolet);
    ringPolar.rotation.y = Math.PI / 2;
    sphereGroup.add(ringPolar);

    const ringTilted = new THREE.Mesh(new THREE.TorusGeometry(sphereRadius + 1.6, 0.05, 16, 100), ringMatGold);
    ringTilted.rotation.x = Math.PI / 4;
    ringTilted.rotation.z = Math.PI / 6;
    sphereGroup.add(ringTilted);

    // 4d. Orbiting Satellite Nodes on the Sphere
    const satelliteCount = 12;
    const satGroup = new THREE.Group();
    sphereGroup.add(satGroup);
    const satGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.2,
    });
    for (let s = 0; s < satelliteCount; s++) {
      const phi = Math.acos(-1 + (2 * s) / satelliteCount);
      const theta = Math.sqrt(satelliteCount * Math.PI) * phi;
      const sx = (sphereRadius + 0.3) * Math.cos(theta) * Math.sin(phi);
      const sy = (sphereRadius + 0.3) * Math.sin(theta) * Math.sin(phi);
      const sz = (sphereRadius + 0.3) * Math.cos(phi);
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.set(sx, sy, sz);
      satGroup.add(satMesh);
    }

    // =========================================================================
    // 5. MODEL 1: HOLOGRAPHIC OPEN CODEX (STUDY BOOK IN ORBIT)
    // =========================================================================
    const codexGroup = new THREE.Group();
    codexGroup.position.set(0, -1.5, 1.8);
    codexGroup.rotation.x = 0.52;
    universeGroup.add(codexGroup);

    const leftPageTex = createBookPageTexture(true);
    const rightPageTex = createBookPageTexture(false);

    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x070c1e,
      roughness: 0.25,
      metalness: 0.8,
    });
    const coverWidth = 4.2;
    const coverHeight = 5.6;
    const coverThickness = 0.16;
    const bookAngle = 0.22;

    const leftCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverHeight, coverThickness),
      coverMaterial
    );
    leftCover.position.set(-coverWidth / 2 - 0.08, 0, -0.2);
    leftCover.rotation.y = bookAngle;
    codexGroup.add(leftCover);

    const rightCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverWidth, coverHeight, coverThickness),
      coverMaterial
    );
    rightCover.position.set(coverWidth / 2 + 0.08, 0, -0.2);
    rightCover.rotation.y = -bookAngle;
    codexGroup.add(rightCover);

    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, coverHeight, 16, 1, false, -Math.PI / 2, Math.PI),
      coverMaterial
    );
    spine.position.set(0, 0, -0.4);
    codexGroup.add(spine);

    const pageBlockMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });

    const leftPageGeo = new THREE.BoxGeometry(coverWidth - 0.2, coverHeight - 0.3, 0.3);
    const leftPageMesh = new THREE.Mesh(leftPageGeo, [
      pageBlockMat, pageBlockMat, pageBlockMat, pageBlockMat,
      new THREE.MeshBasicMaterial({ map: leftPageTex }),
      pageBlockMat,
    ]);
    leftPageMesh.position.set(-coverWidth / 2 + 0.05, 0, 0.05);
    leftPageMesh.rotation.y = bookAngle;
    codexGroup.add(leftPageMesh);

    const rightPageGeo = new THREE.BoxGeometry(coverWidth - 0.2, coverHeight - 0.3, 0.3);
    const rightPageMesh = new THREE.Mesh(rightPageGeo, [
      pageBlockMat, pageBlockMat, pageBlockMat, pageBlockMat,
      new THREE.MeshBasicMaterial({ map: rightPageTex }),
      pageBlockMat,
    ]);
    rightPageMesh.position.set(coverWidth / 2 - 0.05, 0, 0.05);
    rightPageMesh.rotation.y = -bookAngle;
    codexGroup.add(rightPageMesh);

    // Turning Page with fluttering wave
    const turningPageGeo = new THREE.PlaneGeometry(coverWidth - 0.3, coverHeight - 0.4, 16, 16);
    const turningPageMat = new THREE.MeshBasicMaterial({
      map: leftPageTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const turningPageMesh = new THREE.Mesh(turningPageGeo, turningPageMat);
    turningPageMesh.position.set(0, 0, 0.22);
    codexGroup.add(turningPageMesh);

    // Ribbon Bookmark
    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, coverHeight + 1.0, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3, metalness: 0.5 })
    );
    ribbon.position.set(0, -0.3, 0.1);
    codexGroup.add(ribbon);

    // Knowledge Fountain Particles ascending from the pages
    const fountainParticleCount = 90;
    const fountainGeo = new THREE.BufferGeometry();
    const fountainPositions = new Float32Array(fountainParticleCount * 3);
    const fountainSpeeds: number[] = [];
    const fountainInitialX: number[] = [];
    const fountainInitialZ: number[] = [];

    for (let i = 0; i < fountainParticleCount; i++) {
      const fx = (Math.random() - 0.5) * 5.5;
      const fz = (Math.random() - 0.5) * 3.0;
      const fy = Math.random() * 6.5;
      fountainPositions[i * 3] = fx;
      fountainPositions[i * 3 + 1] = fy;
      fountainPositions[i * 3 + 2] = fz;
      fountainInitialX.push(fx);
      fountainInitialZ.push(fz);
      fountainSpeeds.push(0.03 + Math.random() * 0.035);
    }
    fountainGeo.setAttribute('position', new THREE.BufferAttribute(fountainPositions, 3));

    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const gctx = glowCanvas.getContext('2d')!;
    const ggrad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    ggrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    ggrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.9)');
    ggrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.3)');
    ggrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    gctx.fillStyle = ggrad;
    gctx.fillRect(0, 0, 64, 64);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    const fountainMat = new THREE.PointsMaterial({
      size: 0.45,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0x00f0ff,
      depthWrite: false,
    });
    const fountainPoints = new THREE.Points(fountainGeo, fountainMat);
    fountainPoints.position.set(0, 0, 0.2);
    codexGroup.add(fountainPoints);

    // =========================================================================
    // 6. MODEL 2: QUANTUM ATOM (PHYSICS & SILICON)
    // =========================================================================
    const atomGroup = new THREE.Group();
    atomGroup.position.set(-14, 3.5, 2);
    universeGroup.add(atomGroup);

    const nucleonGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, roughness: 0.2 });
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, roughness: 0.2 });
    const nucleusGroup = new THREE.Group();
    const clusterOffsets = [
      [0, 0, 0], [0.3, 0.2, 0], [-0.3, -0.2, 0.1],
      [0.1, -0.3, -0.2], [-0.2, 0.3, 0.15], [0, 0.1, 0.35],
      [0.2, -0.1, -0.35]
    ];
    clusterOffsets.forEach((pos, idx) => {
      const nMesh = new THREE.Mesh(nucleonGeo, idx % 2 === 0 ? protonMat : neutronMat);
      nMesh.position.set(pos[0], pos[1], pos[2]);
      nucleusGroup.add(nMesh);
    });
    atomGroup.add(nucleusGroup);

    const orbitRadius = 2.8;
    const orbitRingA = new THREE.Mesh(new THREE.TorusGeometry(orbitRadius, 0.035, 16, 70), ringMatCyan);
    atomGroup.add(orbitRingA);
    const orbitRingB = new THREE.Mesh(new THREE.TorusGeometry(orbitRadius, 0.035, 16, 70), ringMatViolet);
    orbitRingB.rotation.x = Math.PI / 3;
    atomGroup.add(orbitRingB);

    const electronGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const electronA = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({ color: 0x67e8f9 }));
    const electronB = new THREE.Mesh(electronGeo, new THREE.MeshBasicMaterial({ color: 0xc084fc }));
    atomGroup.add(electronA);
    atomGroup.add(electronB);

    // =========================================================================
    // 7. MODEL 3: DNA HELIX (BIOLOGY & GENETICS)
    // =========================================================================
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(14, 3.5, 2);
    universeGroup.add(dnaGroup);

    const helixHeight = 7.5;
    const helixRadius = 1.5;
    const rungsCount = 14;
    const nodeGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const nodeMatCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2 });
    const nodeMatGreen = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669 });
    const rungMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });

    for (let r = 0; r < rungsCount; r++) {
      const progress = r / rungsCount;
      const angle = progress * Math.PI * 4;
      const y = (progress - 0.5) * helixHeight;
      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      const nA = new THREE.Mesh(nodeGeo, nodeMatCyan);
      nA.position.set(x1, y, z1);
      dnaGroup.add(nA);

      const nB = new THREE.Mesh(nodeGeo, nodeMatGreen);
      nB.position.set(x2, y, z2);
      dnaGroup.add(nB);

      const rungDist = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
      const rungMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, rungDist, 8), rungMat);
      rungMesh.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      rungMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(x2 - x1, 0, z2 - z1).normalize()
      );
      dnaGroup.add(rungMesh);
    }

    // =========================================================================
    // 8. MODEL 4: GRADUATION MORTARBOARD (ACADEMIC MASTERY)
    // =========================================================================
    const capGroup = new THREE.Group();
    capGroup.position.set(-10, 9.5, -2);
    capGroup.rotation.set(0.3, 0.35, -0.1);
    universeGroup.add(capGroup);

    const capBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.25, 0.65, 24),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5 })
    );
    capBase.position.y = -0.3;
    capGroup.add(capBase);

    const capBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.12, 3.0),
      new THREE.MeshStandardMaterial({ color: 0x050814, roughness: 0.3 })
    );
    capBoard.rotation.y = Math.PI / 4;
    capGroup.add(capBoard);

    const capButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 })
    );
    capButton.position.y = 0.1;
    capGroup.add(capButton);

    // =========================================================================
    // 9. MODEL 5: SACRED POLYHEDRON (MATHEMATICS & TOPOLOGY)
    // =========================================================================
    const mathGroup = new THREE.Group();
    mathGroup.position.set(10, 9.5, -2);
    universeGroup.add(mathGroup);

    const dodecaMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(2.0),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.45 })
    );
    mathGroup.add(dodecaMesh);

    const icoMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.6 })
    );
    mathGroup.add(icoMesh);

    // =========================================================================
    // 10. MODEL 6: CLOUD DISTRIBUTED NODES (CLUSTER SYSTEM)
    // =========================================================================
    const cloudClusterGroup = new THREE.Group();
    cloudClusterGroup.position.set(10, 2, 0);
    universeGroup.add(cloudClusterGroup);

    const serverNodeGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    const serverNodeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      metalness: 0.8,
    });
    for (let c = 0; c < 5; c++) {
      const serverMesh = new THREE.Mesh(serverNodeGeo, serverNodeMat);
      serverMesh.position.set(
        Math.cos(c * 1.25) * 2.2,
        Math.sin(c * 0.8) * 1.2,
        Math.sin(c * 1.25) * 1.8
      );
      cloudClusterGroup.add(serverMesh);
    }

    // =========================================================================
    // 11. AMBIENT CELESTIAL KNOWLEDGE PARTICLES
    // =========================================================================
    const cosmicParticleCount = 800;
    const cosmicPositions = new Float32Array(cosmicParticleCount * 3);
    for (let i = 0; i < cosmicParticleCount; i++) {
      cosmicPositions[i * 3] = (Math.random() - 0.5) * 65;
      cosmicPositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      cosmicPositions[i * 3 + 2] = (Math.random() - 0.5) * 45 - 8;
    }
    const cosmicGeo = new THREE.BufferGeometry();
    cosmicGeo.setAttribute('position', new THREE.BufferAttribute(cosmicPositions, 3));
    const cosmicMat = new THREE.PointsMaterial({
      size: 0.4,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
      depthWrite: false,
    });
    const cosmicSystem = new THREE.Points(cosmicGeo, cosmicMat);
    scene.add(cosmicSystem);

    // =========================================================================
    // 12. TACTILE TOUCH & DRAG ORBIT INTERACTION ("I CAN TOUCH IT")
    // =========================================================================
    let isMouseDown = false;
    let previousPos = { x: 0, y: 0 };
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'CANVAS') return;
      isMouseDown = true;
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousPos = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousPos.x;
      const deltaY = clientY - previousPos.y;

      targetRotY += deltaX * 0.006;
      targetRotX += deltaY * 0.005;
      previousPos = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      setIsDragging(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // =========================================================================
    // 13. ANIMATION LOOP (60FPS)
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera Smooth Lerp towards Subject Target
      camera.position.lerp(cameraTargetRef.current.pos, 0.045);
      camera.lookAt(cameraTargetRef.current.lookAt);

      // Auto rotation + User drag rotation interpolation
      if (autoRotateRef.current && !isMouseDown) {
        targetRotY += 0.0025;
      }
      universeGroup.rotation.y += (targetRotY - universeGroup.rotation.y) * 0.08;
      universeGroup.rotation.x += (targetRotX - universeGroup.rotation.x) * 0.08;

      // Animate 3D Study Sphere
      wireSphere.rotation.y = elapsed * 0.15;
      wireSphere.rotation.x = Math.sin(elapsed * 0.1) * 0.1;
      const coreBreath = 1.0 + Math.sin(elapsed * 2.0) * 0.04;
      coreSphere.scale.set(coreBreath, coreBreath, coreBreath);
      ringEquator.rotation.z = elapsed * 0.2;
      ringPolar.rotation.x = elapsed * 0.18;
      ringTilted.rotation.y = elapsed * 0.15;
      satGroup.rotation.y = -elapsed * 0.3;

      // Animate Codex Book
      const codexBreath = 1.0 + Math.sin(elapsed * 1.5) * 0.015;
      codexGroup.scale.set(codexBreath, codexBreath, codexBreath);
      turningPageMesh.rotation.y = Math.sin(elapsed * 0.85) * 0.32;

      // Knowledge Fountain particles
      const fPos = fountainGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < fountainParticleCount; i++) {
        fPos[i * 3 + 1] += fountainSpeeds[i];
        if (fPos[i * 3 + 1] > 6.5) {
          fPos[i * 3 + 1] = 0.2;
          fPos[i * 3] = fountainInitialX[i];
          fPos[i * 3 + 2] = fountainInitialZ[i];
        }
      }
      fountainGeo.attributes.position.needsUpdate = true;

      // Animate Quantum Atom
      nucleusGroup.rotation.y = elapsed * 0.7;
      orbitRingA.rotation.z = elapsed * 0.4;
      orbitRingB.rotation.z = -elapsed * 0.5;
      const eSpeed = elapsed * 3.5;
      electronA.position.set(Math.cos(eSpeed) * orbitRadius, Math.sin(eSpeed) * orbitRadius, 0);
      electronB.position.set(
        Math.cos(eSpeed + 2) * orbitRadius * Math.cos(Math.PI / 6),
        Math.sin(eSpeed + 2) * orbitRadius,
        Math.sin(eSpeed + 2) * orbitRadius * Math.sin(Math.PI / 3)
      );

      // Animate DNA
      dnaGroup.rotation.y = elapsed * 0.45;
      dnaGroup.position.y = 3.5 + Math.sin(elapsed * 1.5) * 0.3;

      // Animate Cap & Polyhedron
      capGroup.rotation.y = 0.35 + Math.sin(elapsed * 0.8) * 0.1;
      dodecaMesh.rotation.x = elapsed * 0.25;
      icoMesh.rotation.z = elapsed * 0.3;

      // Animate Cloud Cluster
      cloudClusterGroup.rotation.y = -elapsed * 0.35;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      leftPageTex.dispose();
      rightPageTex.dispose();
      glowTexture.dispose();
      wireSphereGeo.dispose();
      wireSphereMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      fountainGeo.dispose();
      fountainMat.dispose();
      cosmicGeo.dispose();
      cosmicMat.dispose();
      renderer.dispose();
    };
  }, []);

  const activeSubjectInfo = STUDY_SUBJECTS.find((s) => s.id === activeSubject) || STUDY_SUBJECTS[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950/90 border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,240,255,0.15)] backdrop-blur-2xl">
      
      {/* 3D WebGL Canvas ("I Can Touch It" tactile zone) */}
      <div 
        ref={containerRef} 
        className="w-full h-[520px] sm:h-[580px] lg:h-[620px] cursor-grab active:cursor-grabbing relative z-0"
        title="Touch & Drag anywhere to rotate the 3D Study Sphere"
      />

      {/* Top Floating Glass HUD Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-cyan-400/40 text-cyan-300 text-xs font-mono backdrop-blur-xl shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wider">COGNISPHERE • 3D STUDY SPHERE</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </div>

        {/* Right Interactive Orbit Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundFx.playClickSound();
              setIsAutoRotating(prev => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-xl border transition-all cursor-pointer ${
              isAutoRotating 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.3)]' 
                : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle 360 Auto-Rotation"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotating ? 'Auto Orbit' : 'Paused'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playStarChime();
              setActiveSubject('all');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium border border-white/10 backdrop-blur-xl transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset to Full Sphere Overview"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Discipline Selector Pills (Touch-to-Focus) */}
      <div className="absolute top-16 sm:top-18 left-4 right-4 z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pointer-events-none">
        {STUDY_SUBJECTS.map((subj) => {
          const Icon = subj.icon;
          const isSelected = activeSubject === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => {
                soundFx.playLaserPulse();
                setActiveSubject(subj.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all duration-200 cursor-pointer pointer-events-auto backdrop-blur-xl ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)] font-bold scale-105'
                  : 'bg-slate-950/75 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3 text-cyan-400" />
              <span>{subj.label}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Tactical Study HUD Card (Bottom Left / Center) */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-4 pointer-events-none">
        
        {/* Dynamic Holographic Subject Spec Sheet */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubjectInfo.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="w-full md:max-w-lg p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] pointer-events-auto text-left relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <activeSubjectInfo.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    {activeSubjectInfo.badge}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {activeSubjectInfo.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-2.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-white/10 font-mono text-[11px] text-cyan-300 font-medium">
              {activeSubjectInfo.formula}
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeSubjectInfo.description}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
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

        {/* Quick Actions & Tactile Gesture Hint */}
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto shrink-0 w-full md:w-auto">
          
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                soundFx.playLaserPulse();
                onIngestNotes();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
            >
              <span>Ingest Study Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundFx.playStarChime();
                onTryDemo();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-mono text-xs font-semibold border border-white/15 backdrop-blur-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo Notes</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Interactive 3D: Click & Drag in 360° • Touch to Rotate</span>
          </div>

        </div>

      </div>

    </div>
  );
};
