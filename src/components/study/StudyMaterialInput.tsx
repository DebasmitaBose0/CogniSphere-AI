import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { StudyMaterial } from '../../types';
import { countWords } from '../../lib/utils';
import { CLOUD_COMPUTING_DEMO_TITLE, CLOUD_COMPUTING_DEMO_CONTENT } from '../../data/cloudComputingDemo';
import { SUBJECT_DEMOS, SubjectDemo } from '../../data/subjectDemos';

interface StudyMaterialInputProps {
  currentMaterial: StudyMaterial | null;
  onProcessMaterial: (title: string, content: string) => void;
  onNavigateNext: (destination: string) => void;
}

export const StudyMaterialInput: React.FC<StudyMaterialInputProps> = ({
  currentMaterial,
  onProcessMaterial,
  onNavigateNext,
}) => {
  const [title, setTitle] = useState(currentMaterial?.title || '');
  const [content, setContent] = useState(currentMaterial?.content || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const wordCount = countWords(content);
  const charCount = content.length;

  const handleLoadDemo = () => {
    setTitle(CLOUD_COMPUTING_DEMO_TITLE);
    setContent(CLOUD_COMPUTING_DEMO_CONTENT);
    setError(null);
    setSuccess(false);
  };

  const handleLoadSubject = (subject: SubjectDemo) => {
    setTitle(subject.title);
    setContent(subject.content);
    setError(null);
    setSuccess(false);
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setError(null);
    setSuccess(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file types
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
        setError(null);
      };
      reader.readAsText(file);
    } else {
      // Gracefully communicate document types
      setError(`Uploaded "${file.name}": AstraLearn client-side reader currently parses raw text (.txt, .md). For PDF/DOCX, please copy and paste the text directly into the editor below for instant processing.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide study material text before processing.');
      return;
    }
    if (content.trim().length < 50) {
      setError('Your study material is a bit too short (under 50 characters). Please provide a fuller section or chapter so the AI can generate accurate insights.');
      return;
    }

    const finalTitle = title.trim() || 'Untitled Study Notes';
    onProcessMaterial(finalTitle, content);
    setError(null);
    setSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400">
          Source Material
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink-900 dark:text-forest-50 mt-1">
          Study Material Workspace
        </h1>
        <p className="text-sm text-ink-600 dark:text-forest-200/70 mt-2">
          Paste lecture notes, syllabi, or book chapters. The AI will immediately formulate summaries, interactive quizzes, flashcards, and tutor chat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title input & Demo quick actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-2/3">
            <label className="block text-xs font-mono text-ink-700 dark:text-forest-300 mb-1.5 uppercase tracking-wider">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your notes a name (e.g. Wave Optics & Ocean Caustics)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-mono text-slate-500 mr-1">Load Subject:</span>
              {SUBJECT_DEMOS.map((subj) => (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => handleLoadSubject(subj)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/50 text-[11px] font-mono text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {subj.badge}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-6 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Demo Notes</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              title="Clear text"
              className="p-2.5 rounded-xl border border-forest-900/10 dark:border-forest-700/40 text-ink-500 hover:text-red-500 dark:text-forest-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Large Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-500 dark:text-forest-400">
            <label className="uppercase tracking-wider">Notes & Content Body</label>
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-forest-900/15 dark:border-forest-700/40 bg-white dark:bg-forest-950/60 overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-forest-600/50">
            <textarea
              rows={14}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
                if (success) setSuccess(false);
              }}
              placeholder="Paste your study material here... or click 'Try Demo Notes' above to automatically load the Cloud Computing study set."
              className="w-full p-5 bg-transparent text-ink-900 dark:text-forest-100 text-sm sm:text-base leading-relaxed resize-y focus:outline-none placeholder:text-ink-400 dark:placeholder:text-forest-600 font-sans"
            />

            {/* Document upload drop zone helper */}
            <div className="px-5 py-3 bg-forest-50/50 dark:bg-forest-900/30 border-t border-forest-900/10 dark:border-forest-700/30 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-600 dark:text-forest-300">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-forest-700 dark:text-forest-400" />
                <span>Upload document (.txt, .md):</span>
                <label className="cursor-pointer font-medium text-forest-800 dark:text-emerald-400 underline hover:opacity-80">
                  <span>Browse files</span>
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-[11px] font-mono text-ink-400 dark:text-forest-400">
                UTF-8 text supported
              </span>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success / Ready indicator */}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span><strong>Success!</strong> Notes processed and ready for learning modules.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateNext('summary')}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 hover:bg-emerald-800"
              >
                <span>View Summary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateNext('quiz')}
                className="px-3 py-1.5 rounded-lg bg-forest-900 text-white font-medium text-xs flex items-center gap-1 hover:bg-forest-950"
              >
                <span>Take Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-950 dark:bg-forest-200 dark:hover:bg-white text-forest-50 dark:text-forest-950 font-medium text-sm flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Process Study Material</span>
          </button>
        </div>

      </form>
    </div>
  );
};
