import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  BookOpen,
  X
} from 'lucide-react';
import { StudyMaterial } from '../../types';

interface KnowledgeNode {
  id: string;
  label: string;
  category: 'core' | 'principle' | 'mechanism' | 'definition';
  x: number;
  y: number;
  description: string;
  connections: string[];
}

interface KnowledgeGraphViewProps {
  material: StudyMaterial | null;
  onNavigateToStudy: () => void;
  onNavigateToQuiz?: () => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  material,
  onNavigateToQuiz,
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const isCloud = material?.title.includes('Cloud') || !material;

  const defaultNodes: KnowledgeNode[] = isCloud ? [
    {
      id: 'root',
      label: 'Cloud Computing',
      category: 'core',
      x: 400,
      y: 120,
      description: 'On-demand delivery of computing resources over the internet with pay-as-you-go pricing model defined by NIST.',
      connections: ['iaas', 'paas', 'saas', 'virt'],
    },
    {
      id: 'iaas',
      label: 'IaaS (Infrastructure)',
      category: 'principle',
      x: 180,
      y: 250,
      description: 'Provides virtualized computing resources over the internet (VMs, storage, firewalls). E.g. AWS EC2, Azure VMs.',
      connections: ['root', 'hypervisor'],
    },
    {
      id: 'paas',
      label: 'PaaS (Platform)',
      category: 'principle',
      x: 400,
      y: 260,
      description: 'Provides hardware and software tools over the internet, typically for application development. E.g. AWS Elastic Beanstalk.',
      connections: ['root', 'containers'],
    },
    {
      id: 'saas',
      label: 'SaaS (Software)',
      category: 'principle',
      x: 620,
      y: 250,
      description: 'Delivers software applications over the internet on a subscription basis. E.g. Google Workspace, Salesforce.',
      connections: ['root'],
    },
    {
      id: 'virt',
      label: 'Virtualization & Hypervisors',
      category: 'mechanism',
      x: 270,
      y: 390,
      description: 'Technology that lets you create multiple simulated environments or dedicated resources from a single physical hardware system.',
      connections: ['root', 'hypervisor'],
    },
    {
      id: 'hypervisor',
      label: 'Type-1 vs Type-2',
      category: 'definition',
      x: 150,
      y: 490,
      description: 'Type-1 (Bare Metal) runs directly on hardware (ESXi). Type-2 (Hosted) runs on top of host OS (VirtualBox).',
      connections: ['iaas', 'virt'],
    },
    {
      id: 'containers',
      label: 'Containerization & Microservices',
      category: 'mechanism',
      x: 450,
      y: 410,
      description: 'OS-level virtualization bundling code with dependencies. Lighter than VMs, enabling rapid deployment.',
      connections: ['paas'],
    },
    {
      id: 'elasticity',
      label: 'Rapid Elasticity & Scalability',
      category: 'definition',
      x: 650,
      y: 390,
      description: 'The ability to dynamically provision and de-provision computing, memory, and storage resources on-demand.',
      connections: ['saas', 'root'],
    },
  ] : [
    {
      id: 'root',
      label: material?.title || 'Core Subject',
      category: 'core',
      x: 400,
      y: 120,
      description: 'The primary conceptual discipline extracted by AI Study Buddy neural parser.',
      connections: ['n1', 'n2', 'n3'],
    },
    {
      id: 'n1',
      label: 'Key Principles & Postulates',
      category: 'principle',
      x: 200,
      y: 260,
      description: 'Fundamental axioms and behavioral laws governing this study domain.',
      connections: ['root', 'n4'],
    },
    {
      id: 'n2',
      label: 'Mechanisms & Dynamics',
      category: 'mechanism',
      x: 400,
      y: 280,
      description: 'How individual components interact dynamically to produce system behaviors.',
      connections: ['root'],
    },
    {
      id: 'n3',
      label: 'Applied Methodologies',
      category: 'mechanism',
      x: 600,
      y: 260,
      description: 'Practical real-world implementations and case studies.',
      connections: ['root', 'n5'],
    },
    {
      id: 'n4',
      label: 'Mathematical Foundations',
      category: 'definition',
      x: 260,
      y: 420,
      description: 'Formal equations, proofs, and quantitative models underpinning the concepts.',
      connections: ['n1'],
    },
    {
      id: 'n5',
      label: 'Standard Terminology',
      category: 'definition',
      x: 540,
      y: 420,
      description: 'Essential vocabulary and definitions expected in exam evaluations.',
      connections: ['n3'],
    },
  ];

  const getNodeColor = (cat: KnowledgeNode['category']) => {
    switch (cat) {
      case 'core':
        return { stroke: '#0284c7', glow: '#0284c7', bg: 'fill-blue-50 dark:fill-cyan-950' };
      case 'principle':
        return { stroke: '#7c3aed', glow: '#7c3aed', bg: 'fill-purple-50 dark:fill-violet-950' };
      case 'mechanism':
        return { stroke: '#2563eb', glow: '#2563eb', bg: 'fill-indigo-50 dark:fill-blue-950' };
      case 'definition':
        return { stroke: '#059669', glow: '#059669', bg: 'fill-emerald-50 dark:fill-emerald-950' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            Interactive Topology Visualizer
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 dark:text-white tracking-tight mt-1">
            Knowledge Map & Neural Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Active concepts mapped into dynamic interconnected synaptic nodes. Click any node to reveal foundational proofs.
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-1 shadow-sm backdrop-blur-xl">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Main Interactive Graph Canvas Frame */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-lg dark:shadow-2xl overflow-hidden min-h-[520px]">
        
        {/* Optical Glow Auras */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/5 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-3xl pointer-events-none" />

        {/* Interactive SVG Diagram */}
        <div 
          className="w-full h-full min-h-[520px] flex items-center justify-center p-4 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 800 560"
            className="w-full max-w-[800px] h-[520px] select-none"
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Connecting Circuit Lines */}
            {defaultNodes.map((source) =>
              source.connections.map((targetId) => {
                const target = defaultNodes.find((n) => n.id === targetId);
                if (!target || source.id > target.id) return null;
                const isLineActive = hoveredNode === source.id || hoveredNode === target.id;

                return (
                  <g key={`${source.id}-${target.id}`}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isLineActive ? '#0284c7' : 'rgba(148, 163, 184, 0.35)'}
                      strokeWidth={isLineActive ? 2.5 : 1.2}
                      strokeDasharray={isLineActive ? '4 2' : 'none'}
                    />
                  </g>
                );
              })
            )}

            {/* Interactive Concept Nodes */}
            {defaultNodes.map((node) => {
              const colorInfo = getNodeColor(node.category);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredNode(node.id);
                    setSelectedNode(node);
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                >
                  {(isSelected || isHovered) && (
                    <circle
                      r={node.category === 'core' ? 44 : 36}
                      fill="none"
                      stroke={colorInfo.glow}
                      strokeWidth="2"
                      opacity="0.4"
                    />
                  )}

                  <circle
                    r={node.category === 'core' ? 32 : 25}
                    className={`${colorInfo.bg} transition-all duration-200`}
                    stroke={colorInfo.stroke}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  <circle
                    r={node.category === 'core' ? 6 : 4}
                    fill={colorInfo.glow}
                  />

                  <text
                    y={node.category === 'core' ? 48 : 38}
                    textAnchor="middle"
                    className="fill-slate-900 dark:fill-slate-100 text-[12px] font-sans font-bold tracking-wide pointer-events-none"
                  >
                    {node.label}
                  </text>
                  <text
                    y={node.category === 'core' ? 62 : 50}
                    textAnchor="middle"
                    className="fill-blue-600 dark:fill-cyan-400 text-[9px] font-mono font-bold uppercase tracking-widest pointer-events-none"
                  >
                    {node.category}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Drawer */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/40 backdrop-blur-2xl shadow-xl z-20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                    Concept Node: {selectedNode.category}
                  </span>
                  <h3 className="text-lg font-black italic text-slate-900 dark:text-white mt-0.5">
                    {selectedNode.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Close Node Details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-normal">
                {selectedNode.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  {selectedNode.connections.length} Synaptic Links
                </span>
                {onNavigateToQuiz && (
                  <button
                    onClick={onNavigateToQuiz}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-cyan-300 hover:text-blue-800 cursor-pointer"
                  >
                    <span>Test on this</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
          <span>Core Domain</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400" />
          <span>Key Principles</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-blue-400" />
          <span>Mechanisms</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          <span>Definitions</span>
        </div>
      </div>

    </div>
  );
};
