import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { countWords } from '../../lib/utils';
import { CLOUD_COMPUTING_DEMO_TITLE, CLOUD_COMPUTING_DEMO_CONTENT } from '../../data/cloudComputingDemo';
import { SUBJECT_DEMOS, SubjectDemo } from '../../data/subjectDemos';
import { MagneticButton } from '../ui/MagneticButton';

interface FuturisticUploadPedestalProps {
  currentTitle?: string;
  currentContent?: string;
  onProcessMaterial: (title: string, content: string) => void;
  onNavigateNext: (destination: string) => void;
}

type ScanStage = 'idle' | 'reading' | 'understanding' | 'organizing' | 'generating' | 'completed';

export const FuturisticUploadPedestal: React.FC<FuturisticUploadPedestalProps> = ({
  currentTitle = '',
  currentContent = '',
  onProcessMaterial,
  onNavigateNext,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [isDragging, setIsDragging] = useState(false);
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger Multi-stage scanning & node generation
  const startScanningProcess = (docTitle: string, docContent: string) => {
    if (!docContent.trim() || docContent.trim().length < 40) {
      setErrorMessage('Please provide study text with at least 40 characters so the AI neural engine can extract concepts.');
      return;
    }
    setErrorMessage(null);
    setScanStage('reading');
    setScanProgress(25);

    setTimeout(() => {
      setScanStage('understanding');
      setScanProgress(50);
    }, 700);

    setTimeout(() => {
      setScanStage('organizing');
      setScanProgress(75);
    }, 1400);

    setTimeout(() => {
      setScanStage('generating');
      setScanProgress(95);
    }, 2100);

    setTimeout(() => {
      setScanStage('completed');
      setScanProgress(100);
      onProcessMaterial(docTitle.trim() || 'Untitled Study Module', docContent);
    }, 2800);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    setTitle(fileName);

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setContent(text);
        startScanningProcess(fileName, text);
      };
      reader.readAsText(file);
    } else {
      setContent(CLOUD_COMPUTING_DEMO_CONTENT);
      startScanningProcess(`${fileName} (Cloud Computing Study Set)`, CLOUD_COMPUTING_DEMO_CONTENT);
    }
  };

  const handleLoadDemo = () => {
    setTitle(CLOUD_COMPUTING_DEMO_TITLE);
    setContent(CLOUD_COMPUTING_DEMO_CONTENT);
    startScanningProcess(CLOUD_COMPUTING_DEMO_TITLE, CLOUD_COMPUTING_DEMO_CONTENT);
  };

  const handleLoadSubject = (subj: SubjectDemo) => {
    setTitle(subj.title);
    setContent(subj.content);
    startScanningProcess(subj.title, subj.content);
  };

  const wordCount = countWords(content);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative">
      
      {/* Header with High-Contrast Typography */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-blue-600 dark:text-cyan-400">
          Holographic Ingestion Pedestal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 dark:text-white tracking-tight font-sans">
          Feed Your Study Notes
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
          Drop lecture notes, syllabi, or textbook chapters. Watch our neural engine scan, disassemble, and reconstruct your knowledge.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold italic transition-all ${
            activeTab === 'upload'
              ? 'bg-blue-500/20 text-blue-700 dark:text-cyan-300 border border-blue-500/40 dark:border-cyan-500/40 shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Study Document Drop Zone
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold italic transition-all ${
            activeTab === 'paste'
              ? 'bg-blue-500/20 text-blue-700 dark:text-cyan-300 border border-blue-500/40 dark:border-cyan-500/40 shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Text Editor (Direct Paste)
        </button>
      </div>

      {/* Main Interactive Pedestal Card */}
      <div className="relative rounded-3xl bg-white/95 dark:bg-slate-950/75 border border-slate-200 dark:border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-lg dark:shadow-2xl overflow-hidden">
        
        {/* Soft Ambient Core Glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-violet-500/10 dark:bg-violet-500/10 blur-3xl pointer-events-none" />

        {scanStage === 'idle' ? (
          <>
            {activeTab === 'upload' ? (
              /* Holographic Document Drop Zone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 perspective-1000 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10 shadow-md scale-[1.01]'
                    : 'border-slate-300 dark:border-white/15 hover:border-blue-500/50 dark:hover:border-cyan-400/50 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.pdf,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Floating 3D Study Document Graphic */}
                <div className="w-20 h-24 mx-auto rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-md flex flex-col items-center justify-center p-3 relative mb-5">
                  <FileText className="w-8 h-8 text-cyan-400 mb-2" />
                  <div className="w-10 h-1 bg-cyan-400/30 rounded-full mb-1" />
                  <div className="w-6 h-1 bg-cyan-400/20 rounded-full" />
                </div>

                <h3 className="text-xl font-black italic text-slate-900 dark:text-white mb-1">
                  Drag & Drop Your Study Document
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4 font-normal">
                  Drop your notes, lecture slides, or textbook excerpts to commence neural comprehension.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-500/30 dark:border-cyan-500/30 text-xs font-mono font-bold group-hover:bg-blue-500/20 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Browse Local Notes</span>
                </div>
              </div>
            ) : (
              /* Direct Text Editor Mode */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document Title (e.g. Operating Systems: Virtual Memory & Paging)"
                    className="w-full sm:w-2/3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                  />
                  <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    <span>{wordCount} words</span>
                  </div>
                </div>

                <div className="relative rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/60 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50">
                  <textarea
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your lecture notes, textbook chapters, or study questions here..."
                    className="w-full p-4 bg-transparent text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans"
                  />
                </div>

                <div className="flex justify-end">
                  <MagneticButton
                    variant="primary"
                    onClick={() => startScanningProcess(title, content)}
                    className="px-6 py-3 text-sm font-bold italic"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Commence AI Synthesis</span>
                  </MagneticButton>
                </div>
              </div>
            )}

            {/* Quick 1-Click Curriculums */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  Instant Pre-Loaded Study Sets:
                </span>
                <button
                  onClick={handleLoadDemo}
                  className="text-xs font-mono font-bold italic text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Load Cloud Computing Demo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {SUBJECT_DEMOS.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => handleLoadSubject(subj)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-white/5 hover:border-blue-400 dark:hover:border-cyan-400/40 text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                      {subj.badge}
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-200 line-clamp-1">
                      {subj.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : scanStage !== 'completed' ? (
          /* AI Processing Visualization */
          <div className="py-12 px-4 text-center relative">
            
            {/* Visual Flow Indicator */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              <span className="text-blue-600 dark:text-cyan-400 font-black italic">Document</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className={scanStage === 'reading' ? 'text-blue-600 dark:text-cyan-400 font-black italic animate-pulse' : 'text-slate-400'}>Scanning</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className={scanStage === 'understanding' || scanStage === 'organizing' ? 'text-blue-600 dark:text-cyan-400 font-black italic animate-pulse' : 'text-slate-400'}>Understanding</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className={scanStage === 'generating' ? 'text-blue-600 dark:text-cyan-400 font-black italic animate-pulse' : 'text-slate-400'}>Knowledge Generated</span>
            </div>

            {/* Prominent Stage Title */}
            <motion.div
              key={scanStage}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-blue-400 dark:to-violet-400 uppercase font-mono">
                {scanStage === 'reading' && 'READING YOUR NOTES'}
                {scanStage === 'understanding' && 'UNDERSTANDING'}
                {scanStage === 'organizing' && 'ORGANIZING KNOWLEDGE'}
                {scanStage === 'generating' && 'GENERATING YOUR STUDY MATERIAL'}
              </h2>
              <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mt-2">
                Neural parsing and multi-depth concept extraction in progress...
              </p>
            </motion.div>
            
            {/* Animated Scanning Beam & Holographic Core with SVG Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-white/10"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  stroke="url(#progressGrad)"
                  strokeWidth="6"
                  strokeDasharray="528"
                  strokeDashoffset={528 - (528 * scanProgress) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="w-24 h-24 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-400/40 backdrop-blur-xl flex flex-col items-center justify-center shadow-lg">
                <Cpu className="w-10 h-10 text-blue-600 dark:text-cyan-300 animate-pulse" />
                <span className="text-xs font-mono text-blue-700 dark:text-cyan-300 mt-1 font-bold">
                  {scanProgress}%
                </span>
              </div>
            </div>

            {/* Neural Stage Pipeline Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <span className={scanStage === 'reading' ? 'text-blue-600 dark:text-cyan-400 font-black' : ''}>1. Reading</span>
                <span className={scanStage === 'understanding' ? 'text-blue-600 dark:text-cyan-400 font-black' : ''}>2. Understanding</span>
                <span className={scanStage === 'organizing' ? 'text-blue-600 dark:text-cyan-400 font-black' : ''}>3. Organizing</span>
                <span className={scanStage === 'generating' ? 'text-blue-600 dark:text-cyan-400 font-black' : ''}>4. Generating</span>
              </div>

              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-blue-500 dark:to-violet-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${scanProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.5 }}
                />
              </div>
            </div>

            {/* Concept Extraction Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 text-xs font-mono font-bold text-blue-700 dark:text-cyan-300">
                Parsing Syntax Trees...
              </span>
              <span className="px-3 py-1 rounded-lg bg-violet-500/10 dark:bg-violet-500/10 border border-violet-500/30 dark:border-violet-500/30 text-xs font-mono font-bold text-violet-700 dark:text-violet-300">
                Extracting Key Principles...
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/30 dark:border-emerald-500/30 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Constructing Active Recall Nodes...
              </span>
            </div>

          </div>
        ) : (
          /* Material Understood -> Document Transforms into 4 Floating Cards */
          <div className="py-8 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>MATERIAL UNDERSTOOD</span>
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>COGNITIVE SYNTHESIS READY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black italic text-slate-950 dark:text-white">
              "{title}" Disassembled Into 4 Spatial Modules
            </h2>

            {/* 4 Interactive Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              
              {/* Card 1: Summary */}
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => onNavigateNext('summary')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-blue-500/30 hover:border-blue-500 text-left transition-all shadow-md hover:shadow-xl group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-cyan-400">Module 01</div>
                <div className="text-base font-black italic text-slate-900 dark:text-white mt-1">Executive Summary</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-normal">
                  Layered concepts, key definitions, and exam-focused revision notes.
                </p>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-cyan-300 mt-4">
                  <span>Enter Summary</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Card 2: Quiz */}
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => onNavigateNext('quiz')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-violet-500/30 hover:border-violet-500 text-left transition-all shadow-md hover:shadow-xl group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold uppercase text-violet-600 dark:text-violet-400">Module 02</div>
                <div className="text-base font-black italic text-slate-900 dark:text-white mt-1">Active Recall Quiz</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-normal">
                  Gamified testing with spatial feedback and explanation telemetry.
                </p>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-violet-600 dark:text-violet-300 mt-4">
                  <span>Start Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Card 3: 3D Flashcards */}
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => onNavigateNext('flashcards')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500 text-left transition-all shadow-md hover:shadow-xl group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-blue-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold uppercase text-indigo-600 dark:text-blue-400">Module 03</div>
                <div className="text-base font-black italic text-slate-900 dark:text-white mt-1">3D Flashcard Stack</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-normal">
                  Physics-based flips, depth layering, and spaced-repetition mastery.
                </p>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-600 dark:text-blue-300 mt-4">
                  <span>Open Cards</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Card 4: AI Chat Tutor */}
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => onNavigateNext('chat')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all shadow-md hover:shadow-xl group cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">Module 04</div>
                <div className="text-base font-black italic text-slate-900 dark:text-white mt-1">Grounded AI Chat</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-normal">
                  Pulsing 3D AI companion with instant prompt pills and exam analogies.
                </p>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-300 mt-4">
                  <span>Ask Tutor</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setScanStage('idle')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Another Document</span>
              </button>
            </div>

          </div>
        )}

        {/* Error notice */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-200 text-xs font-mono font-bold text-center">
            {errorMessage}
          </div>
        )}

      </div>
    </div>
  );
};
