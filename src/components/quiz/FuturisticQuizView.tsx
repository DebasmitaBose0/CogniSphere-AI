import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  FastForward,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, StudyMaterial } from '../../types';
import { generateQuiz } from '../../services/ai';
import { MagneticButton } from '../ui/MagneticButton';

interface FuturisticQuizViewProps {
  material: StudyMaterial | null;
  onSaveQuizResult?: (score: number, total: number) => void;
  onNavigateToStudy: () => void;
  onNavigateToFlashcards?: () => void;
}

export const FuturisticQuizView: React.FC<FuturisticQuizViewProps> = ({
  material,
  onSaveQuizResult,
  onNavigateToStudy,
  onNavigateToFlashcards,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [correctPulse, setCorrectPulse] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (material?.content) {
      loadQuiz(questionCount);
    }
  }, [material?.content, questionCount, difficulty]);

  const loadQuiz = async (count: 5 | 10 | 15) => {
    if (!material?.content) return;
    setIsLoading(true);
    try {
      const generated = await generateQuiz(material.content, count);
      setQuestions(generated);
      setSelectedAnswers(new Array(generated.length).fill(null));
      setCurrentIndex(0);
      setIsFinished(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentIndex] !== null) return;

    const currentQ = questions[currentIndex];
    const isCorrect = optIndex === currentQ.correctAnswerIndex;

    const updated = [...selectedAnswers];
    updated[currentIndex] = optIndex;
    setSelectedAnswers(updated);

    if (isCorrect) {
      setCorrectPulse(true);
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
        disableForReducedMotion: true,
      });
      setTimeout(() => setCorrectPulse(false), 800);
    } else {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 600);
    }
  };

  const handleSkip = () => {
    if (selectedAnswers[currentIndex] !== null) return;
    const updated = [...selectedAnswers];
    updated[currentIndex] = -1;
    setSelectedAnswers(updated);
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    const score = selectedAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx]?.correctAnswerIndex ? (acc ?? 0) + 1 : (acc ?? 0);
    }, 0);

    if (onSaveQuizResult) {
      onSaveQuizResult(score ?? 0, questions.length);
    }

    if (score && score / questions.length >= 0.7) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#818cf8', '#10b981'],
      });
    }

    const targetPercent = Math.round(((score ?? 0) / questions.length) * 100);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 2;
      if (curr >= targetPercent) {
        setAnimatedScore(targetPercent);
        clearInterval(interval);
      } else {
        setAnimatedScore(curr);
      }
    }, 25);
  };

  if (!material) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black italic text-slate-900 dark:text-white">No Study Material Loaded</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
          Please upload or paste your study material on the Ingest Notes page to generate active recall quizzes.
        </p>
        <MagneticButton variant="primary" onClick={onNavigateToStudy} className="px-6 py-3 text-sm mx-auto font-bold italic">
          <span>Go to Ingest Notes</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const userSelected = selectedAnswers[currentIndex];
  const hasAnswered = userSelected !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
      
      {/* Quiz Topbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Active Recall Arena
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 dark:text-white tracking-tight mt-1">
            Spatial Assessment Engine
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Testing on: <span className="text-blue-600 dark:text-cyan-300 font-bold">{material.title}</span>
          </p>
        </div>

        {/* Controls: Difficulty & Question Count */}
        {!isFinished && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs font-mono font-bold shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 px-2">Level:</span>
              {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-black italic'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Question Count Selector */}
            <div className="flex items-center bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl p-1 text-xs font-mono font-bold shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 px-2">Count:</span>
              {([5, 10, 15] as const).map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    questionCount === cnt
                      ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300 font-black italic'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-600 dark:border-violet-400/20 dark:border-t-violet-400 animate-spin mx-auto shadow-md" />
          <p className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest animate-pulse">
            Formulating Spatial Questions...
          </p>
        </div>
      ) : isFinished ? (
        /* QUIZ RESULT VISUALIZATION */
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl dark:shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-500/5 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Animated Circular Progress Visualizer */}
          <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-white/10"
                strokeWidth="6"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * animatedScore) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Percentage & Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-black italic text-slate-900 dark:text-white font-mono tracking-tighter">
                {animatedScore}%
              </span>
              <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-blue-600 dark:text-cyan-300 mt-1">
                {animatedScore >= 80 ? 'Mastery Achieved' : animatedScore >= 50 ? 'Strong Foundation' : 'Revision Required'}
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black italic text-slate-900 dark:text-white mb-2">
            Assessment Completed
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-8 font-medium">
            You scored {selectedAnswers.filter((a, i) => a === questions[i]?.correctAnswerIndex).length} out of {questions.length} questions correctly.
          </p>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
              <div className="text-xl font-black italic text-emerald-700 dark:text-emerald-300 font-mono">
                {selectedAnswers.filter((a, i) => a === questions[i]?.correctAnswerIndex).length}
              </div>
              <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">Correct</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30">
              <div className="text-xl font-black italic text-rose-700 dark:text-rose-300 font-mono">
                {selectedAnswers.filter((a, i) => a !== null && a !== -1 && a !== questions[i]?.correctAnswerIndex).length}
              </div>
              <div className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">Incorrect</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
              <div className="text-xl font-black italic text-amber-700 dark:text-amber-300 font-mono">
                {selectedAnswers.filter((a) => a === null || a === -1).length}
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">Skipped</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => loadQuiz(questionCount)}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-mono font-bold hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            {onNavigateToFlashcards && (
              <MagneticButton
                variant="primary"
                onClick={onNavigateToFlashcards}
                className="px-6 py-3 text-xs sm:text-sm font-black italic"
              >
                <span>Solidify with 3D Flashcards</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            )}
          </div>
        </motion.div>
      ) : currentQ ? (
        /* QUIZ EXPERIENCE */
        <div className="space-y-6">
          
          {/* Progress Tracker Bar */}
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-500 dark:to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Animated Spatial Question Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: shakeTrigger ? [-8, 8, -6, 6, 0] : 0 
            }}
            transition={{ duration: 0.4 }}
            className={`p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-950/70 border backdrop-blur-2xl shadow-md dark:shadow-xl transition-all duration-300 ${
              correctPulse
                ? 'border-emerald-500 shadow-md'
                : 'border-slate-200 dark:border-white/10'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-2">
              Question {currentIndex + 1}
            </div>
            <h2 className="text-lg sm:text-xl font-bold italic text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userSelected === optIdx;
                const isCorrect = optIdx === currentQ.correctAnswerIndex;
                const showSuccess = hasAnswered && isCorrect;
                const showError = hasAnswered && isSelected && !isCorrect;

                return (
                  <motion.button
                    key={optIdx}
                    whileHover={!hasAnswered ? { y: -2, scale: 1.005 } : {}}
                    whileTap={!hasAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnswered}
                    className={`w-full p-4 rounded-2xl text-left text-sm transition-all duration-200 border flex items-center justify-between cursor-pointer perspective-1000 ${
                      showSuccess
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-sm'
                        : showError
                        ? 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold shadow-sm'
                        : isSelected
                        ? 'bg-blue-50 dark:bg-cyan-500/20 border-blue-500 dark:border-cyan-400 text-blue-900 dark:text-cyan-200'
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-cyan-400/50 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${
                        showSuccess
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : showError
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-white/10 shadow-sm'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>

                    {showSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />}
                    {showError && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation Telemetry */}
            <AnimatePresence>
              {hasAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
                >
                  <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-mono font-bold uppercase text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Neural Explanation</span>
                  </div>
                  {currentQ.explanation}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions: Skip or Next */}
            <div className="mt-6 flex items-center justify-between">
              {!hasAnswered ? (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Skip Question</span>
                  <FastForward className="w-3.5 h-3.5 text-amber-500" />
                </button>
              ) : (
                <div />
              )}

              {hasAnswered && (
                <MagneticButton
                  variant="primary"
                  onClick={handleNext}
                  className="px-6 py-3 text-xs sm:text-sm font-black italic"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}

    </div>
  );
};
