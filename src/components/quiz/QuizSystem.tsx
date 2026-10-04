import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizDifficulty, StudyMaterial } from '../../types';
import { generateQuiz } from '../../services/ai';

interface QuizSystemProps {
  material: StudyMaterial | null;
  onSaveQuizResult: (score: number, total: number) => void;
  onNavigateToStudy: () => void;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({
  material,
  onSaveQuizResult,
  onNavigateToStudy,
}) => {
  // Quiz configuration
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('medium');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const startNewQuiz = async () => {
    if (!material?.content) return;
    setIsLoading(true);
    setQuizSubmitted(false);
    setUserAnswers({});
    setCurrentIdx(0);

    try {
      const generated = await generateQuiz(material.content, questionCount, difficulty);
      setQuestions(generated);
      setQuizStarted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qId: string, optionIndex: number) => {
    if (quizSubmitted) return; // locked once submitted
    setUserAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const score = calculateScore();
    const pct = Math.round((score / questions.length) * 100);
    if (pct >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    onSaveQuizResult(score, questions.length);
  };

  if (!material?.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-10 rounded-3xl border border-dashed border-forest-900/20 dark:border-forest-600/30 bg-white/40 dark:bg-forest-950/20 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-forest-700 dark:text-forest-400 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-normal text-ink-900 dark:text-forest-50">
            No Study Material Loaded
          </h3>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-forest-300/70 mt-2 mb-6">
            Please add study notes or launch the Cloud Computing demo to generate interactive quizzes.
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

  // Quiz Configuration View
  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400">
            Active Recall Assessment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink-900 dark:text-forest-50 mt-1">
            Interactive Quiz Generator
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-forest-200/70 mt-2">
            Configure your testing parameters based on: <strong>{material.title}</strong>
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-forest-900/15 dark:border-forest-700/40 bg-white/80 dark:bg-forest-950/40 shadow-sm space-y-8">
          {/* Question Count Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 dark:text-forest-300">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([5, 10, 15] as const).map(count => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 rounded-xl border text-xs sm:text-sm font-mono font-medium transition-all ${
                    questionCount === count
                      ? 'bg-forest-900 text-white dark:bg-forest-200 dark:text-forest-950 border-transparent shadow-sm'
                      : 'border-forest-900/10 dark:border-forest-700/40 text-ink-800 dark:text-forest-200 hover:bg-forest-900/5'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-700 dark:text-forest-300">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-3 rounded-xl border text-xs sm:text-sm font-mono font-medium capitalize transition-all ${
                    difficulty === diff
                      ? 'bg-forest-900 text-white dark:bg-forest-200 dark:text-forest-950 border-transparent shadow-sm'
                      : 'border-forest-900/10 dark:border-forest-700/40 text-ink-800 dark:text-forest-200 hover:bg-forest-900/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={startNewQuiz}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-forest-900 hover:bg-forest-950 dark:bg-forest-200 dark:hover:bg-white text-forest-50 dark:text-forest-950 font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Formulating questions…</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>Start Quiz Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View / Result View
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length;
  const finalScore = calculateScore();
  const percentage = Math.round((finalScore / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Quiz Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-forest-900/10 dark:border-forest-500/20">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400">
            {quizSubmitted ? 'Quiz Evaluation' : `Question ${currentIdx + 1} of ${questions.length}`}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-900 dark:text-forest-50 font-semibold">
            {material.title}
          </h2>
        </div>

        <button
          onClick={() => setQuizStarted(false)}
          className="text-xs font-mono text-ink-500 dark:text-forest-400 hover:text-ink-900 dark:hover:text-forest-200 underline"
        >
          Exit Quiz
        </button>
      </div>

      {/* Results View */}
      {quizSubmitted ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Score Card */}
          <div className="p-8 rounded-3xl bg-forest-950 text-forest-50 border border-forest-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Quiz Completed
            </span>
            <div className="font-serif text-5xl font-bold">
              {percentage}%
            </div>
            <p className="text-xs sm:text-sm text-forest-200/80">
              You scored <strong>{finalScore}</strong> out of <strong>{questions.length}</strong> questions correct.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setUserAnswers({});
                  setCurrentIdx(0);
                }}
                className="px-5 py-2.5 rounded-full bg-forest-100 hover:bg-white text-forest-950 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => setQuizStarted(false)}
                className="px-5 py-2.5 rounded-full bg-forest-900 border border-forest-700 text-forest-200 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
              >
                Generate New Quiz
              </button>
              <button
                onClick={onNavigateToStudy}
                className="px-5 py-2.5 rounded-full bg-forest-900 border border-forest-700 text-forest-200 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
              >
                Back to Notes
              </button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown with Explanations */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-ink-900 dark:text-forest-50 font-medium">
              Detailed Question Breakdown
            </h3>
            {questions.map((q, qIndex) => {
              const userChoice = userAnswers[q.id];
              const isCorrect = userChoice === q.correctAnswerIndex;
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-2xl border ${
                    isCorrect
                      ? 'border-emerald-600/30 bg-emerald-500/5 dark:bg-emerald-950/20'
                      : 'border-red-600/30 bg-red-500/5 dark:bg-red-950/20'
                  } space-y-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif font-medium text-sm sm:text-base text-ink-900 dark:text-forest-100">
                      <strong>0{qIndex + 1}.</strong> {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 shrink-0 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-mono text-red-600 dark:text-red-400 shrink-0 font-semibold">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                    {q.options.map((opt, optIndex) => {
                      const wasSelected = userChoice === optIndex;
                      const isTargetCorrect = optIndex === q.correctAnswerIndex;
                      let badgeStyle = "border-forest-900/10 dark:border-forest-700/30 bg-white/40 dark:bg-forest-900/20 text-ink-700 dark:text-forest-300";
                      
                      if (isTargetCorrect) {
                        badgeStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-medium";
                      } else if (wasSelected && !isCorrect) {
                        badgeStyle = "border-red-500 bg-red-500/15 text-red-900 dark:text-red-200";
                      }

                      return (
                        <div key={optIndex} className={`p-3 rounded-xl border flex items-center gap-3 ${badgeStyle}`}>
                          <span className="font-mono text-xs font-bold w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation */}
                  <div className="p-3.5 rounded-xl bg-forest-900/5 dark:bg-forest-900/40 text-xs text-ink-700 dark:text-forest-200/90 leading-relaxed">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Question Answering View */
        <div className="space-y-6 animate-fadeIn">
          {/* Progress Bar */}
          <div className="w-full bg-forest-900/10 dark:bg-forest-800/40 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-forest-900 dark:bg-forest-300 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-forest-900/15 dark:border-forest-700/40 bg-white/80 dark:bg-forest-950/40 shadow-sm space-y-6">
            
            <h3 className="font-serif text-lg sm:text-xl text-ink-900 dark:text-forest-50 font-normal leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options A, B, C, D */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 text-xs sm:text-sm transition-all ${
                      isSelected
                        ? 'border-forest-900 bg-forest-900 text-forest-50 dark:border-forest-200 dark:bg-forest-200 dark:text-forest-950 shadow-sm'
                        : 'border-forest-900/10 dark:border-forest-700/40 bg-white/50 dark:bg-forest-900/20 text-ink-800 dark:text-forest-100 hover:bg-forest-50 dark:hover:bg-forest-900/40'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'border-current' 
                        : 'border-forest-900/20 dark:border-forest-500/40 text-forest-700 dark:text-forest-300'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-normal">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submission Controls */}
            <div className="pt-4 flex items-center justify-between border-t border-forest-900/10 dark:border-forest-700/30">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-ink-600 dark:text-forest-300 hover:text-ink-900 dark:hover:text-forest-50 disabled:opacity-30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={!isAllAnswered}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                  >
                    <span>Submit & Score</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
