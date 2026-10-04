import * as THREE from 'three';

export class SpatialSceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private animId: number | null = null;
  private clock: THREE.Clock;

  // Camera 3D Z-Flight Trajectory
  public targetCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0, 18);
  public targetLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, -20);
  public currentCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0, 18);
  public currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, -20);
  public mouseOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  public targetMouseOffset: THREE.Vector2 = new THREE.Vector2(0, 0);

  // Computer Science & Tech 3D Groups
  public cyberGridsGroup: THREE.Group = new THREE.Group();
  public cpuChipsGroup: THREE.Group = new THREE.Group();
  public dataCubesGroup: THREE.Group = new THREE.Group();
  public neuralGraphGroup: THREE.Group = new THREE.Group();
  public codeStreamGroup: THREE.Group = new THREE.Group();
  public serverModulesGroup: THREE.Group = new THREE.Group();
  public circuitBusGroup: THREE.Group = new THREE.Group();

  private scrollVelocity: number = 0;
  private lastScrollProgress: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // 1. Scene & Clean Cyber Dark Environment
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020617, 0.007); // Clean high-clarity fog

    // 2. Wide FOV Perspective Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 1000);
    this.camera.position.copy(this.currentCameraPos);

    // 3. WebGL Renderer with High Precision
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;

    // 4. Studio Tech Lighting
    this.initTechLighting();

    // 5. Build Computer Science & Tech 3D Architecture
    this.initCyberMatrixGrids();
    this.initSiliconMicroprocessors();
    this.initDataCubes();
    this.initNeuralNetworkGraph();
    this.initServerMemoryModules();
    this.initCircuitDataStreams();

    // 6. Bind Events and Start Animation Loop
    this.bindEvents();
    this.startLoop();
  }

  private initTechLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    // Cyan Key Tech Light
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 4.0);
    cyanLight.position.set(20, 30, 20);
    this.scene.add(cyanLight);

    // Violet Secondary Light
    const violetLight = new THREE.PointLight(0xa855f7, 5.0, 150);
    violetLight.position.set(-20, -15, -60);
    this.scene.add(violetLight);

    // Electric Blue Fill Light
    const blueLight = new THREE.PointLight(0x3b82f6, 4.5, 150);
    blueLight.position.set(20, -20, -130);
    this.scene.add(blueLight);

    // Matrix Emerald Spot
    const greenSpot = new THREE.SpotLight(0x10b981, 6.0, 120, Math.PI / 4, 0.3);
    greenSpot.position.set(-15, 25, -190);
    this.scene.add(greenSpot);
  }

  // --- 1. CYBER MATRIX PERSPECTIVE GRIDS (Floor & Ceiling Tech Grid) ---
  private initCyberMatrixGrids(): void {
    this.scene.add(this.cyberGridsGroup);

    // Floor Cyber Grid
    const gridHelperFloor = new THREE.GridHelper(300, 60, 0x00f0ff, 0x1e293b);
    gridHelperFloor.position.set(0, -9, -110);
    (gridHelperFloor.material as THREE.Material).transparent = true;
    (gridHelperFloor.material as THREE.Material).opacity = 0.25;
    this.cyberGridsGroup.add(gridHelperFloor);

    // Ceiling Tech Bus Grid
    const gridHelperCeil = new THREE.GridHelper(300, 60, 0x8b5cf6, 0x0f172a);
    gridHelperCeil.position.set(0, 9, -110);
    (gridHelperCeil.material as THREE.Material).transparent = true;
    (gridHelperCeil.material as THREE.Material).opacity = 0.2;
    this.cyberGridsGroup.add(gridHelperCeil);
  }

  // --- 2. 3D SILICON MICROPROCESSORS & CPU CHIPS (Clear Hardware Pop-out) ---
  private initSiliconMicroprocessors(): void {
    this.scene.add(this.cpuChipsGroup);

    const chipConfigs = [
      { x: -6.5, y: 2.2, z: -25, labelColor: 0x00f0ff, title: 'AI_NPU' },
      { x: 6.8, y: -2.4, z: -55, labelColor: 0x8b5cf6, title: 'QUANTUM_CORE' },
      { x: -6.2, y: -2.0, z: -95, labelColor: 0x3b82f6, title: 'MEM_CACHE' },
      { x: 6.5, y: 2.5, z: -140, labelColor: 0x10b981, title: 'NEURAL_BUS' },
      { x: -6.0, y: 2.0, z: -185, labelColor: 0xf59e0b, title: 'LLM_ENGINE' },
    ];

    chipConfigs.forEach((cfg, idx) => {
      const chipGroup = new THREE.Group();
      chipGroup.position.set(cfg.x, cfg.y, cfg.z);
      chipGroup.rotation.y = cfg.x > 0 ? -0.4 : 0.4;
      chipGroup.rotation.x = 0.2;
      chipGroup.name = `chip_${idx}`;

      // 1. Ceramic PCB Substrate
      const pcbGeo = new THREE.BoxGeometry(4.8, 4.8, 0.35);
      const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.2,
        metalness: 0.9,
      });
      const pcb = new THREE.Mesh(pcbGeo, pcbMat);
      chipGroup.add(pcb);

      // 2. Central Metallic Silicon Heat Spreader / Die
      const dieGeo = new THREE.BoxGeometry(3.2, 3.2, 0.2);
      const dieMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: cfg.labelColor,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.95,
      });
      const die = new THREE.Mesh(dieGeo, dieMat);
      die.position.set(0, 0, 0.22);
      chipGroup.add(die);

      // 3. Glowing Circuit Traces on Die
      const circuitGeo = new THREE.PlaneGeometry(2.6, 2.6);
      const circuitMat = new THREE.MeshBasicMaterial({
        color: cfg.labelColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const circuit = new THREE.Mesh(circuitGeo, circuitMat);
      circuit.position.set(0, 0, 0.33);
      chipGroup.add(circuit);

      // 4. Gold / Metallic Contact Pins along edges
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 1.0,
        roughness: 0.1,
      });
      for (let p = 0; p < 8; p++) {
        const pinGeo = new THREE.BoxGeometry(0.18, 0.4, 0.15);
        // Top and Bottom Pins
        const pinTop = new THREE.Mesh(pinGeo, pinMat);
        pinTop.position.set(-2.0 + p * 0.57, 2.45, 0);
        chipGroup.add(pinTop);

        const pinBot = new THREE.Mesh(pinGeo, pinMat);
        pinBot.position.set(-2.0 + p * 0.57, -2.45, 0);
        chipGroup.add(pinBot);
      }

      this.cpuChipsGroup.add(chipGroup);
    });
  }

  // --- 3. 3D FLOATING DATA CUBES & BINARY MODULES (Fly past on scroll) ---
  private initDataCubes(): void {
    this.scene.add(this.dataCubesGroup);

    const cubePositions = [
      { x: -4.8, y: -2.8, z: -35, size: 2.2, color: 0x00f0ff },
      { x: 5.2, y: 3.0, z: -75, size: 2.4, color: 0xa855f7 },
      { x: -5.5, y: 3.2, z: -120, size: 2.0, color: 0x3b82f6 },
      { x: 5.0, y: -2.8, z: -165, size: 2.3, color: 0x10b981 },
      { x: -4.5, y: -3.0, z: -205, size: 2.1, color: 0xec4899 },
    ];

    cubePositions.forEach((cp, idx) => {
      const cubeGroup = new THREE.Group();
      cubeGroup.position.set(cp.x, cp.y, cp.z);
      cubeGroup.name = `datacube_${idx}`;

      // Translucent Cyber Cube
      const boxGeo = new THREE.BoxGeometry(cp.size, cp.size, cp.size);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0x020617,
        emissive: cp.color,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.85,
        thickness: 1.2,
        transparent: true,
        opacity: 0.8,
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      cubeGroup.add(box);

      // Glowing Wireframe Edge Cage
      const wireGeo = new THREE.BoxGeometry(cp.size * 1.02, cp.size * 1.02, cp.size * 1.02);
      const wireMat = new THREE.MeshBasicMaterial({
        color: cp.color,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      cubeGroup.add(wire);

      // Inner Floating Tech Core (Octahedron)
      const innerGeo = new THREE.OctahedronGeometry(cp.size * 0.4, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: cp.color,
        emissive: cp.color,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      cubeGroup.add(inner);

      this.dataCubesGroup.add(cubeGroup);
    });
  }

  // --- 4. 3D INTERCONNECTED NEURAL COMPUTATION GRAPH ---
  private initNeuralNetworkGraph(): void {
    this.scene.add(this.neuralGraphGroup);
    this.neuralGraphGroup.position.set(0, 0, -110);

    const nodeCoords = [
      new THREE.Vector3(-4.5, 2.5, 0),
      new THREE.Vector3(4.5, 2.2, -5),
      new THREE.Vector3(-3.8, -2.5, -8),
      new THREE.Vector3(4.0, -2.2, 5),
      new THREE.Vector3(0, 3.5, -12),
      new THREE.Vector3(0, -3.2, 8),
      new THREE.Vector3(-2.5, 0, -15),
      new THREE.Vector3(2.5, 0, 12),
    ];

    // Node Spheres
    nodeCoords.forEach((coord, i) => {
      const nodeGeo = new THREE.SphereGeometry(0.7, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0xa855f7,
        emissive: i % 2 === 0 ? 0x0284c7 : 0x7c3aed,
        emissiveIntensity: 1.0,
        roughness: 0.2,
        metalness: 0.8,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(coord);
      node.name = `neuralNode_${i}`;
      this.neuralGraphGroup.add(node);
    });

    // Connecting Synapse Circuit Beams
    for (let i = 0; i < nodeCoords.length; i++) {
      for (let j = i + 1; j < nodeCoords.length; j++) {
        if (nodeCoords[i].distanceTo(nodeCoords[j]) < 9) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodeCoords[i], nodeCoords[j]]);
          const lineMat = new THREE.LineBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.45,
          });
          const line = new THREE.Line(lineGeo, lineMat);
          this.neuralGraphGroup.add(line);
        }
      }
    }
  }

  // --- 5. 3D SERVER RACKS & HIGH-DENSITY MEMORY MODULES ---
  private initServerMemoryModules(): void {
    this.scene.add(this.serverModulesGroup);

    const rackPositions = [
      { x: -7.5, y: 0, z: -50 },
      { x: 7.5, y: 0, z: -130 },
      { x: -7.5, y: 0, z: -170 },
    ];

    rackPositions.forEach((rp, idx) => {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(rp.x, rp.y, rp.z);
      rackGroup.rotation.y = rp.x > 0 ? -0.5 : 0.5;

      // Chassis
      const chassisGeo = new THREE.BoxGeometry(2.5, 9.0, 3.5);
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.9,
      });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      rackGroup.add(chassis);

      // Server Blade Slots & LED Status Lights
      for (let b = 0; b < 7; b++) {
        const bladeGeo = new THREE.BoxGeometry(2.2, 0.8, 3.3);
        const bladeMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.4,
          metalness: 0.8,
        });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(0, -3.5 + b * 1.15, 0.15);
        rackGroup.add(blade);

        // Green / Blue Activity LED
        const ledGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const ledMat = new THREE.MeshBasicMaterial({
          color: b % 2 === 0 ? 0x10b981 : 0x00f0ff,
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(1.15, -3.5 + b * 1.15, 1.7);
        rackGroup.add(led);
      }

      this.serverModulesGroup.add(rackGroup);
    });
  }

  // --- 6. HIGH-SPEED CIRCUIT DATA PACKETS (Binary Bus Highway) ---
  private initCircuitDataStreams(): void {
    this.scene.add(this.circuitBusGroup);

    // Glowing Data Packets traveling down Z bus
    const packetCount = 140;
    const packetGeo = new THREE.BoxGeometry(0.2, 0.2, 1.4);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
    });

    const instancedMesh = new THREE.InstancedMesh(packetGeo, packetMat, packetCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < packetCount; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = (4.5 + Math.random() * 5.0) * side;
      const y = (Math.random() - 0.5) * 8.0;
      const z = 15 - Math.random() * 240;

      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    this.circuitBusGroup.add(instancedMesh);
  }

  // --- REAL 3D SCROLL TRAVEL: CAMERA SOARS THROUGH CYBER MATRIX ---
  public updateScrollProgress(progress: number): void {
    // True Z-axis navigation: from z = 18 down to z = -220
    const zTarget = 18 - progress * 235;
    
    // Smooth cyber corridor wave
    const xTarget = Math.sin(progress * Math.PI * 4) * 2.2;
    const yTarget = Math.cos(progress * Math.PI * 3) * 1.2;

    this.targetCameraPos.set(xTarget, yTarget, zTarget);
    this.targetLookAt.set(0, yTarget * 0.4, zTarget - 25);

    const deltaProgress = Math.abs(progress - this.lastScrollProgress);
    this.scrollVelocity = Math.min(deltaProgress * 80, 5.0);
    this.lastScrollProgress = progress;
  }

  public updateMousePosition(clientX: number, clientY: number): void {
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    this.targetMouseOffset.set(x * 2.0, y * 1.4);
  }

  private bindEvents(): void {
    const onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
  }

  private startLoop(): void {
    const dummy = new THREE.Object3D();
    const matrix = new THREE.Matrix4();

    const render = () => {
      this.animId = requestAnimationFrame(render);
      const elapsed = this.clock.getElapsedTime();

      // Camera smooth interpolation
      this.currentCameraPos.lerp(this.targetCameraPos, 0.08);
      this.currentLookAt.lerp(this.targetLookAt, 0.08);
      this.mouseOffset.lerp(this.targetMouseOffset, 0.06);

      this.camera.position.set(
        this.currentCameraPos.x + this.mouseOffset.x,
        this.currentCameraPos.y + this.mouseOffset.y,
        this.currentCameraPos.z
      );
      this.camera.lookAt(
        this.currentLookAt.x + this.mouseOffset.x * 0.4,
        this.currentLookAt.y + this.mouseOffset.y * 0.4,
        this.currentLookAt.z
      );

      // Animate Microprocessor Chips (Gentle floating & circuit scan)
      this.cpuChipsGroup.children.forEach((chip, i) => {
        chip.rotation.y += 0.006;
        chip.rotation.x = Math.sin(elapsed * 1.2 + i) * 0.12;
        chip.position.y += Math.sin(elapsed * 2 + i) * 0.005;
      });

      // Animate Data Cubes (Multi-axis rotation & inner core spin)
      this.dataCubesGroup.children.forEach((cube, i) => {
        cube.rotation.x += 0.01 + i * 0.002;
        cube.rotation.y += 0.015;
      });

      // Animate Neural Network Graph
      this.neuralGraphGroup.rotation.y = elapsed * 0.12;

      // Animate Fast Circuit Data Packets
      const packetMesh = this.circuitBusGroup.children[0] as THREE.InstancedMesh;
      if (packetMesh) {
        const count = packetMesh.count;
        const speed = 0.4 + this.scrollVelocity;

        for (let i = 0; i < count; i++) {
          packetMesh.getMatrixAt(i, matrix);
          dummy.matrix.copy(matrix);
          dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

          // Fly data packet towards camera
          dummy.position.z += speed;
          if (dummy.position.z > this.camera.position.z + 10) {
            dummy.position.z = this.camera.position.z - 220;
          }

          dummy.updateMatrix();
          packetMesh.setMatrixAt(i, dummy.matrix);
        }
        packetMesh.instanceMatrix.needsUpdate = true;
      }

      this.scrollVelocity *= 0.92;
      this.renderer.render(this.scene, this.camera);
    };

    render();
  }

  public dispose(): void {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
    }
    this.renderer.dispose();
  }
}
