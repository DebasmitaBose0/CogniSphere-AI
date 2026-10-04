export interface SubjectDemo {
  id: string;
  title: string;
  subject: string;
  badge: string;
  waterPreset: 'deep-ocean' | 'tidepool' | 'golden-hour' | 'ink-bath' | 'alien-pool';
  summaryDescription: string;
  content: string;
}

export const SUBJECT_DEMOS: SubjectDemo[] = [
  {
    id: 'oceanography',
    title: 'Marine Oceanography — Hydrodynamics & Deep Ocean Zones',
    subject: 'Earth Science & Oceanography',
    badge: 'Fluid Dynamics',
    waterPreset: 'deep-ocean',
    summaryDescription: 'Wave equations, oceanic thermal layers, light attenuation, and benthic pressure zones.',
    content: `Marine Oceanography: Hydrodynamics, Pelagic Zones, and Oceanic Circulation

1. Oceanic Depth Layers and Light Attenuation
The oceanic water column is stratified into distinct vertical zones governed by light penetration, pressure, and temperature:
- Epipelagic Zone (Sunlight Zone, 0–200m): Highest primary productivity through phytoplankton photosynthesis. Light penetration permits complex visual ecosystems and surface wave mechanics.
- Mesopelagic Zone (Twilight Zone, 200–1,000m): Solar penetration drops exponentially. Thermoclines cause rapid temperature drops from 20°C down to 4°C.
- Bathypelagic Zone (Midnight Zone, 1,000–4,000m): Total absence of sunlight; hydrostatic pressure reaches up to 400 atmospheres. Organisms rely heavily on bioluminescence and marine snow.
- Abyssopelagic & Hadal Zones (4,000m to trench trenches up to 11,000m): Perpetual darkness, near-freezing temperatures (1–4°C), and extreme hydrostatic pressures exceeding 1,000 atmospheres.

2. Optical Caustics and Light Refraction Mechanics
As sunlight strikes the open sea, surface capillary and gravitational waves act as dynamic optical lenses. Convex wave crests focus incident sunlight into high-intensity refracted rays, projecting moving web-like illumination patterns known as optical caustics onto shallow continental shelves and reef beds. The intensity is governed by the Jacobian determinant of the refracted ray field.

3. Thermohaline Global Circulation (The Great Ocean Conveyor)
Deep-ocean currents are driven by density differences governed by temperature (thermo) and salinity (haline). High-salinity cold water sinks in the North Atlantic and circulates along ocean basins over millennia, regulating global planetary climate and distributing dissolved oxygen to abyssal plains.`
  },
  {
    id: 'fluid_mechanics',
    title: 'Physics: Wave Mechanics, Snell’s Law & Light Refraction',
    subject: 'Classical & Computational Physics',
    badge: 'Wave Mechanics',
    waterPreset: 'tidepool',
    summaryDescription: 'Refraction indices, wave propagation equations, Jacobian caustics, and damping coefficients.',
    content: `Computational Wave Physics and Optics: Refraction, Caustics, and PDE Simulation

1. The Classical 2D Wave Equation
Wave propagation on shallow liquid surfaces is modeled by the second-order partial differential equation:
  ∂²h/∂t² = c² (∂²h/∂x² + ∂²h/∂y²) - γ(∂h/∂t)
where h(x,y,t) is surface elevation, c is wave propagation speed, and γ represents hydrodynamic damping. In numerical simulations, float textures are ping-ponged using leapfrog integration to resolve discrete finite differences across local neighbor texels (left, right, up, down).

2. Snell’s Law and Boundary Refraction
When incident electromagnetic rays pass across media interfaces of differing refractive indices (air n₁ ≈ 1.0003 to water n₂ ≈ 1.333), the propagation vector bends according to Snell's Law:
  n₁ sin(θ₁) = n₂ sin(θ₂)
The surface gradient (∂h/∂x, ∂h/∂y) establishes the surface normal vector N, driving parallax shifts and refracted angle transformations.

3. Area Compression & Caustic Jacobian Determinants
Optical caustics occur at envelopes of focused rays where ray mapping produces singularities. Mathematically, the brightness of light projected onto the floor corresponds to the reciprocal of the determinant of the Jacobian transformation matrix J:
  Intensity ∝ 1 / |det(J)|
Where det(J) approaches zero, infinite geometric light concentration occurs, generating the characteristic luminous veins observed under perturbed fluid surfaces.`
  },
  {
    id: 'cloud_computing',
    title: 'Cloud Computing — Architecture, Models & Virtualization',
    subject: 'Computer Science & Distributed Systems',
    badge: 'System Architecture',
    waterPreset: 'ink-bath',
    summaryDescription: 'NIST 5-4-3 models, IaaS, PaaS, SaaS, Type-1 bare-metal hypervisors, and multi-tenancy.',
    content: `Cloud Computing: Fundamental Architecture, Service Models, and Virtualization

1. Definition of Cloud Computing
Cloud computing is the on-demand availability of computer system resources, especially data storage (cloud storage) and computing power, without direct active management by the user. Large clouds often have functions distributed over multiple locations, each of which is a data center. Cloud computing relies on sharing of resources to achieve coherence and economies of scale.

2. Essential Characteristics (NIST Guidelines)
- On-demand self-service: Consumers can provision computing capabilities automatically without human intervention.
- Broad network access: Capabilities are available over the network through heterogeneous client devices.
- Resource pooling: Multi-tenant computing resources pooled to serve multiple consumers with dynamic allocation.
- Rapid elasticity: Capabilities scale rapidly outward and inward commensurate with demand.
- Measured service: Metered resource monitoring and usage-based billing.

3. Cloud Service Models (SPI Model)
- Infrastructure as a Service (IaaS): Fundamental compute, network, and storage on-demand. Tenant manages OS, middleware, and runtime (e.g. AWS EC2, Azure VMs).
- Platform as a Service (PaaS): Runtime environments and deployment frameworks for software engineering without infrastructure management (e.g. AWS Elastic Beanstalk, Heroku).
- Software as a Service (SaaS): Complete applications delivered over the browser (e.g. Google Workspace, Microsoft 365).

4. Hypervisors & Virtualization
Virtualization abstracts physical hardware:
- Type-1 (Bare-Metal): Runs directly on host hardware for near-native performance (VMware ESXi, KVM, Hyper-V).
- Type-2 (Hosted): Operates inside a conventional guest OS (VirtualBox, VMware Workstation).`
  },
  {
    id: 'environmental_science',
    title: 'Limnology & Wetlands: Shallow Water Ecosystems',
    subject: 'Environmental & Biological Sciences',
    badge: 'Limnology',
    waterPreset: 'golden-hour',
    summaryDescription: 'Aquatic ecology, wetland bio-filters, dissolved oxygen kinetics, and trophic cascades.',
    content: `Limnology and Wetland Ecology: Shallow Water Biogeochemical Dynamics

1. Wetland Hydrology and Sediment Interactions
Wetlands and shallow inland waters act as the planet's primary bio-filters. Shallow aquatic basins feature high surface-area-to-volume ratios, where light penetration reaches the benthic substrate, driving microphytobenthos photosynthesis and intense nutrient recycling between the water column and organic sediment layers.

2. Dissolved Oxygen (DO) Kinetics and Thermal Stratification
Shallow ponds undergo diurnal dissolved oxygen fluctuations:
- Daytime Peak: Intensive macrophyte and phytoplankton photosynthesis produces supersaturated oxygen levels.
- Nighttime Depletion: Ceasing photosynthesis combined with biological respiration drives nocturnal hypoxia risks in eutrophic water bodies.

3. Ecosystem Services and Environmental Resilience
- Natural Flood Mitigation: Wetlands attenuate hydraulic peak storm surges through vegetated friction.
- Biogeochemical Carbon Sequestration: Anaerobic benthic sediments trap organic carbon, acting as high-capacity carbon sinks.`
  }
];
