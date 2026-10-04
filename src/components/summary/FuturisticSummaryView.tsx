import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Volume2, 
  Square, 
  Copy, 
  Check, 
  RotateCw, 
  BookOpen, 
  GraduationCap, 
  FileCheck, 
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Download
} from 'lucide-react';
import { SummaryData, SummaryLength, StudyMaterial } from '../../types';
import { generateSummary } from '../../services/ai';
import { MagneticButton } from '../ui/MagneticButton';

interface FuturisticSummaryViewProps {
  material: StudyMaterial | null;
  onNavigateToStudy: () => void;
  onNavigateToQuiz?: () => void;
}

export const FuturisticSummaryView: React.FC<FuturisticSummaryViewProps> = ({
  material,
  onNavigateToStudy,
  onNavigateToQuiz,
}) => {
  const [length, setLength] = useState<SummaryLength>('medium');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hoveredConcept, setHoveredConcept] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (material?.content) {
      loadSummary(length);
    }
  }, [material?.content, length]);

  const loadSummary = async (len: SummaryLength) => {
    if (!material?.content) return;
    setIsLoading(true);
    try {
      const data = await generateSummary(material.content, len);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReadAloud = () => {
    if (!('speechSynthesis' in window) || !summary) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${material?.title}. Overview: ${summary.overview}. Key points: ${summary.importantPoints.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleDownload = () => {
    if (!summary || !material) return;
    const textContent = `# AI STUDY BUDDY — ${material.title.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

## OVERVIEW
${summary.overview}

## KEY CONCEPTS
${summary.keyConcepts.map(c => `- ${c}`).join('\n')}

## IMPORTANT POINTS
${summary.importantPoints.map(p => `- ${p}`).join('\n')}

## IMPORTANT DEFINITIONS
${summary.definitions.map(d => `- **${d.term}**: ${d.definition}`).join('\n')}

## EXAM REVISION
${summary.examRevisionNotes.map(e => `- ${e}`).join('\n')}
`;

    const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${material.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!summary) return;
    const textToCopy = `AI STUDY BUDDY: ${material?.title}
    
OVERVIEW:
${summary.overview}

KEY CONCEPTS:
${summary.keyConcepts.join(', ')}

IMPORTANT POINTS:
${summary.importantPoints.map(p => `• ${p}`).join('\n')}

IMPORTANT DEFINITIONS:
${summary.definitions.map(d => `• ${d.term}: ${d.definition}`).join('\n')}

EXAM REVISION:
${summary.examRevisionNotes.map(e => `• ${e}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!material) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black italic text-slate-900 dark:text-white">No Study Material Loaded</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
          Please upload or paste your study material on the Ingest Notes page to generate an AI synthesis.
        </p>
        <MagneticButton variant="primary" onClick={onNavigateToStudy} className="px-6 py-3 text-sm mx-auto font-bold italic">
          <span>Go to Ingest Notes</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative">
      
      {/* Title & Metadata Topbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            Progressive AI Knowledge Synthesis
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 dark:text-white tracking-tight mt-1">
            {material.title}
          </h1>
          <div className="flex items-center gap-3 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 mt-2">
            <span>{material.wordCount} words processed</span>
            <Sparkles className="w-2.5 h-2.5 text-blue-500/60 dark:text-cyan-400/60" />
            <span className="text-blue-600 dark:text-cyan-400">Grounded Cognitive Extraction</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Synthesizer */}
          <button
            onClick={toggleReadAloud}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-mono font-bold cursor-pointer ${
              isSpeaking
                ? 'bg-blue-500/20 text-blue-700 dark:text-cyan-300 border-blue-500 dark:border-cyan-400 shadow-sm'
                : 'bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400'
            }`}
            title={isSpeaking ? 'Stop Read Aloud' : 'Listen with Neural Voice'}
          >
            {isSpeaking ? (
              <>
                <Square className="w-4 h-4 text-blue-600 dark:text-cyan-400 fill-current" />
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-blue-600 dark:bg-cyan-400 animate-bounce" />
                  <span className="w-1 h-4 bg-blue-600 dark:bg-cyan-400 animate-bounce delay-75" />
                  <span className="w-1 h-2 bg-blue-600 dark:bg-cyan-400 animate-bounce delay-150" />
                </span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">Audio Read</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-blue-400 transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Copy Synthesis"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Regenerate Button */}
          <button
            onClick={() => loadSummary(length)}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-blue-400 transition-all text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-sm"
            title="Regenerate Summary"
          >
            <RotateCw className={`w-4 h-4 text-blue-600 dark:text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-blue-400 transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download Study Sheet (.md)"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Length Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs font-mono font-bold shadow-sm">
            {(['short', 'medium', 'comprehensive'] as SummaryLength[]).map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  length === len
                    ? 'bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-black italic'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 dark:border-cyan-400/20 dark:border-t-cyan-400 animate-spin mx-auto shadow-md" />
          <p className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 animate-pulse uppercase tracking-widest">
            Synthesizing Neural Summary...
          </p>
        </div>
      ) : summary ? (
        <div className="space-y-8">
          
          {/* Executive Overview Card */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-950/70 border border-slate-200 dark:border-cyan-500/30 backdrop-blur-2xl shadow-md dark:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/5 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-3 font-black italic">
              <Sparkles className="w-4 h-4" />
              <span>OVERVIEW</span>
            </div>

            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {summary.overview}
            </p>

            {/* Concept Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono font-bold italic text-slate-500 dark:text-slate-400 mr-2 uppercase tracking-wider">KEY CONCEPTS:</span>
              {summary.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  onMouseEnter={() => setHoveredConcept(idx)}
                  onMouseLeave={() => setHoveredConcept(null)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-default ${
                    hoveredConcept === idx
                      ? 'bg-blue-500/20 text-blue-800 dark:text-cyan-200 border border-blue-400 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  #{concept}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Progressive 4 Structured Knowledge Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KEY CONCEPTS Card */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 25 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl transition-all duration-300 hover:border-blue-400 dark:hover:border-cyan-500/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-black italic">
                  KEY CONCEPTS
                </span>
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </div>

              <div className="space-y-3">
                {summary.keyConcepts.map((concept, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200 p-2.5 rounded-xl transition-all duration-200 hover:bg-blue-50 dark:hover:bg-cyan-500/10 hover:text-blue-800 dark:hover:text-cyan-200 border border-transparent hover:border-blue-200 dark:hover:border-cyan-400/20"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
                    <span className="font-semibold">{concept}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* IMPORTANT POINTS Card */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 25 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl transition-all duration-300 hover:border-violet-400 dark:hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-600 dark:text-violet-400 font-black italic">
                  IMPORTANT POINTS
                </span>
                <FileCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>

              <div className="space-y-3">
                {summary.importantPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed font-normal">{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* IMPORTANT DEFINITIONS Card */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 25 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl transition-all duration-300 hover:border-indigo-400 dark:hover:border-blue-500/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-blue-400 font-black italic">
                  IMPORTANT DEFINITIONS
                </span>
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
              </div>

              <div className="space-y-3">
                {summary.definitions.map((def, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 space-y-1 hover:border-indigo-300 dark:hover:border-blue-500/30 transition-colors">
                    <div className="text-xs font-mono font-black italic text-indigo-700 dark:text-blue-300">{def.term}</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{def.definition}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* EXAM REVISION Card */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 25 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white/95 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md dark:shadow-xl transition-all duration-300 hover:border-emerald-400 dark:hover:border-emerald-500/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-black italic">
                  EXAM REVISION
                </span>
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="space-y-3">
                {summary.examRevisionNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed font-normal">{note}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Action Dock */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onNavigateToStudy}
              className="text-xs font-mono font-bold italic text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Source Notes</span>
            </button>

            {onNavigateToQuiz && (
              <MagneticButton
                variant="primary"
                onClick={onNavigateToQuiz}
                className="px-6 py-3 text-sm font-black italic"
              >
                <span>Proceed to Active Recall Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            )}
          </div>

        </div>
      ) : null}

    </div>
  );
};
