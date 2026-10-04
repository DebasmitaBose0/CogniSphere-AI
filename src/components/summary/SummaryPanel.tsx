import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RotateCw, 
  Download, 
  Sparkles, 
  BookMarked, 
  FileCheck, 
  Lightbulb, 
  GraduationCap,
  Volume2,
  Square
} from 'lucide-react';
import { SummaryData, SummaryLength, StudyMaterial } from '../../types';
import { generateSummary } from '../../services/ai';

interface SummaryPanelProps {
  material: StudyMaterial | null;
  onNavigateToStudy: () => void;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  material,
  onNavigateToStudy,
}) => {
  const [length, setLength] = useState<SummaryLength>('medium');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  const handleCopy = () => {
    if (!summary) return;
    const textToCopy = `ASTRALEARN STUDY SYNTHESIS: ${material?.title}
    
OVERVIEW:
${summary.overview}

KEY CONCEPTS:
${summary.keyConcepts.join(', ')}

IMPORTANT POINTS:
${summary.importantPoints.map(p => `• ${p}`).join('\n')}

DEFINITIONS:
${summary.definitions.map(d => `• ${d.term}: ${d.definition}`).join('\n')}

EXAM REVISION NOTES:
${summary.examRevisionNotes.map(e => `• ${e}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    const markdownContent = `# AstraLearn Study Synthesis
**Document:** ${material?.title || 'Study Material'}
**Generated:** ${new Date().toLocaleDateString()}
**Length Mode:** ${length.toUpperCase()}

---

## 1. Quick Overview
${summary.overview}

---

## 2. Key Concepts
${summary.keyConcepts.map(c => `- \`${c}\``).join('\n')}

---

## 3. Important Points
${summary.importantPoints.map(p => `- ${p}`).join('\n')}

---

## 4. Important Definitions
${summary.definitions.map(d => `### ${d.term}\n${d.definition}`).join('\n\n')}

---

## 5. Exam Revision Notes
${summary.examRevisionNotes.map(e => `- ${e}`).join('\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(material?.title || 'study_summary').replace(/\s+/g, '_')}_Summary.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!material?.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-10 rounded-3xl border border-dashed border-forest-900/20 dark:border-forest-600/30 bg-white/40 dark:bg-forest-950/20 max-w-md mx-auto">
          <BookMarked className="w-10 h-10 text-forest-700 dark:text-forest-400 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-normal text-ink-900 dark:text-forest-50">
            No Study Material Loaded
          </h3>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-forest-300/70 mt-2 mb-6">
            Please add your notes or load the Cloud Computing demo to synthesize smart summaries.
          </p>
          <button
            onClick={onNavigateToStudy}
            className="px-6 py-2.5 rounded-full bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 text-xs font-mono uppercase tracking-wider hover:opacity-90"
          >
            Open Notes Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header & Length Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-forest-900/10 dark:border-forest-500/20">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400">
            Synthesized Intelligence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink-900 dark:text-forest-50 mt-1">
            AI Study Summary
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-forest-200/70 mt-1">
            Material: <strong>{material.title}</strong>
          </p>
        </div>

        {/* Controls: Length, Copy, Download, Regenerate */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Length Pills */}
          <div className="p-1 rounded-xl bg-forest-900/5 dark:bg-forest-900/40 border border-forest-900/10 dark:border-forest-700/40 flex items-center gap-1">
            {(['short', 'medium', 'detailed'] as SummaryLength[]).map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  length === len
                    ? 'bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 shadow-sm'
                    : 'text-ink-600 dark:text-forest-300 hover:text-ink-900 dark:hover:text-forest-50'
                }`}
              >
                {len}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadSummary(length)}
            disabled={isLoading}
            title="Regenerate"
            className="p-2 rounded-xl border border-forest-900/10 dark:border-forest-700/40 text-ink-700 dark:text-forest-300 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 transition-colors"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleReadAloud}
            title={isSpeaking ? "Stop speech" : "Read summary aloud"}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-mono ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 animate-pulse'
                : 'border-forest-900/10 dark:border-forest-700/40 text-ink-700 dark:text-forest-300 hover:bg-forest-900/5 dark:hover:bg-forest-500/10'
            }`}
          >
            {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Listening' : 'Listen'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy summary"
            className="p-2 rounded-xl border border-forest-900/10 dark:border-forest-700/40 text-ink-700 dark:text-forest-300 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            title="Download markdown notes"
            className="p-2 rounded-xl border border-forest-900/10 dark:border-forest-700/40 text-ink-700 dark:text-forest-300 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Loading state animation */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-900/10 dark:bg-forest-400/10 border border-forest-600/30 flex items-center justify-center mx-auto animate-pulse text-forest-700 dark:text-forest-300">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-ink-900 dark:text-forest-50">
              Reading your notes…
            </h4>
            <p className="text-xs font-mono text-ink-500 dark:text-forest-400">
              Extracting core architecture, definitions, and exam points
            </p>
          </div>
        </div>
      ) : summary ? (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 1. Quick Overview */}
          <div className="p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-700/30 bg-white/80 dark:bg-forest-950/40 backdrop-blur shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>1. Quick Overview</span>
            </div>
            <p className="text-ink-800 dark:text-forest-100 text-sm sm:text-base leading-relaxed font-light">
              {summary.overview}
            </p>
          </div>

          {/* 2. Key Concepts Tags */}
          <div className="p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-700/30 bg-white/80 dark:bg-forest-950/40 backdrop-blur shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 text-xs font-mono uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>2. Key Concepts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl border border-forest-900/15 dark:border-forest-600/30 bg-forest-50 dark:bg-forest-900/50 text-ink-900 dark:text-forest-200 text-xs font-mono font-medium shadow-2xs"
                >
                  #{concept}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Important Points */}
          <div className="p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-700/30 bg-white/80 dark:bg-forest-950/40 backdrop-blur shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 text-xs font-mono uppercase tracking-wider">
              <FileCheck className="w-4 h-4" />
              <span>3. Important Points</span>
            </div>
            <ul className="space-y-3">
              {summary.importantPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-ink-800 dark:text-forest-100 leading-relaxed font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-700 dark:bg-emerald-400 mt-2 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Important Definitions */}
          <div className="p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-700/30 bg-white/80 dark:bg-forest-950/40 backdrop-blur shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-forest-700 dark:text-forest-400 text-xs font-mono uppercase tracking-wider">
              <BookMarked className="w-4 h-4" />
              <span>4. Important Definitions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.definitions.map((def, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl border border-forest-900/10 dark:border-forest-700/40 bg-forest-50/50 dark:bg-forest-900/30 space-y-1.5"
                >
                  <h4 className="font-serif font-semibold text-sm text-forest-900 dark:text-emerald-300">
                    {def.term}
                  </h4>
                  <p className="text-xs text-ink-700 dark:text-forest-200/80 leading-relaxed font-light">
                    {def.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Exam Revision Notes */}
          <div className="p-6 sm:p-8 rounded-3xl border border-emerald-600/30 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-mono uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>5. Exam Revision Notes</span>
            </div>
            <ul className="space-y-2.5">
              {summary.examRevisionNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-ink-900 dark:text-forest-100 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      ) : null}

    </div>
  );
};
