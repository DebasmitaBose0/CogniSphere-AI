import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  RotateCw, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Flashcard, StudyMaterial } from '../../types';
import { generateFlashcards } from '../../services/ai';
import { MagneticButton } from '../ui/MagneticButton';

interface FuturisticFlashcardViewProps {
  material: StudyMaterial | null;
  onNavigateToStudy: () => void;
  onNavigateToChat?: () => void;
  onUpdateFlashcardStats?: (count: number) => void;
}

export const FuturisticFlashcardView: React.FC<FuturisticFlashcardViewProps> = ({
  material,
  onNavigateToStudy,
  onNavigateToChat,
  onUpdateFlashcardStats,
}) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (material?.content) {
      loadCards();
    }
  }, [material?.content]);

  const loadCards = async () => {
    if (!material?.content) return;
    setIsLoading(true);
    try {
      const generated = await generateFlashcards(material.content);
      setCards(generated);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownCards(new Set());
      setReviewCards(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection('next');
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleMarkAsKnown = (cardId: string) => {
    const updatedKnown = new Set(knownCards);
    updatedKnown.add(cardId);
    setKnownCards(updatedKnown);

    const updatedReview = new Set(reviewCards);
    updatedReview.delete(cardId);
    setReviewCards(updatedReview);

    if (onUpdateFlashcardStats) {
      onUpdateFlashcardStats(updatedKnown.size);
    }

    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  const handleReviewAgain = (cardId: string) => {
    const updatedReview = new Set(reviewCards);
    updatedReview.add(cardId);
    setReviewCards(updatedReview);

    const updatedKnown = new Set(knownCards);
    updatedKnown.delete(cardId);
    setKnownCards(updatedKnown);

    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  const currentCard = cards[currentIndex];

  if (!material) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black italic text-slate-900 dark:text-white">No Study Material Loaded</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
          Please upload or paste your study material on the Ingest Notes page to generate 3D flashcards.
        </p>
        <MagneticButton variant="primary" onClick={onNavigateToStudy} className="px-6 py-3 text-sm mx-auto font-bold italic">
          <span>Go to Ingest Notes</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-bold italic uppercase tracking-widest text-indigo-600 dark:text-blue-400">
            Spatial Spaced Repetition
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 dark:text-white tracking-tight mt-1">
            3D Flashcard Deck
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Topic: <span className="text-blue-600 dark:text-cyan-300 font-bold">{material.title}</span>
          </p>
        </div>

        {/* Counter Badge */}
        {cards.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              Card {currentIndex + 1} of {cards.length}
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{knownCards.size} Mastered</span>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 dark:border-blue-400/20 dark:border-t-blue-400 animate-spin mx-auto shadow-md" />
          <p className="text-xs font-mono font-bold text-indigo-600 dark:text-blue-400 uppercase tracking-widest animate-pulse">
            Generating 3D Flashcard Stack...
          </p>
        </div>
      ) : currentCard ? (
        <div className="relative flex flex-col items-center">
          
          {/* Top Status & Controls Bar */}
          <div className="w-full max-w-lg flex items-center justify-between mb-4 px-2">
            <div className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-blue-400/40 dark:border-cyan-400/40 text-xs font-mono text-blue-700 dark:text-cyan-300 shadow-sm font-black italic">
              Card {currentIndex + 1} of {cards.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Shuffle Flashcard Deck"
              >
                <Shuffle className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-violet-400 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Flip Flashcard"
              >
                <RotateCw className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>Flip</span>
              </button>
            </div>
          </div>

          {/* 3D Stack Container */}
          <div className="relative w-full max-w-lg h-80 sm:h-96 perspective-2000 my-2">
            
            {/* Background Stack Card #2 (Deep) */}
            {currentIndex + 2 < cards.length && (
              <div 
                className="absolute inset-0 rounded-3xl bg-slate-200/50 dark:bg-slate-900/40 border border-slate-300/40 dark:border-white/5 shadow-md pointer-events-none transition-transform duration-500"
                style={{
                  transform: 'translate3d(0, 16px, -40px) rotate(-3deg) scale(0.92)',
                  filter: 'blur(1px)',
                }}
              />
            )}

            {/* Background Stack Card #1 (Mid) */}
            {currentIndex + 1 < cards.length && (
              <div 
                className="absolute inset-0 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300/60 dark:border-white/10 shadow-md pointer-events-none transition-transform duration-500"
                style={{
                  transform: 'translate3d(0, 8px, -20px) rotate(2deg) scale(0.96)',
                }}
              />
            )}

            {/* Foreground Interactive 3D Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ 
                  opacity: 0, 
                  x: direction === 'next' ? 70 : -70, 
                  rotateY: direction === 'next' ? 12 : -12, 
                  scale: 0.92 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  rotateY: 0, 
                  scale: 1 
                }}
                exit={{ 
                  opacity: 0, 
                  x: direction === 'next' ? -70 : 70, 
                  rotateY: direction === 'next' ? -12 : 12, 
                  scale: 0.92 
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-full cursor-pointer relative transform-style-3d"
              >
                {/* 3D Flip Wrapper */}
                <div
                  className="w-full h-full relative transform-style-3d transition-transform duration-700"
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Card FRONT (Question / Term) */}
                  <div className="absolute inset-0 rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/30 p-8 sm:p-10 flex flex-col justify-between backface-hidden shadow-xl dark:shadow-2xl backdrop-blur-2xl group hover:border-blue-400 dark:hover:border-cyan-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Term / Question
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                        <RotateCw className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
                        <span>Click to Flip</span>
                      </span>
                    </div>

                    <div className="text-center my-auto px-2">
                      <h3 className="text-2xl sm:text-3xl font-black italic text-slate-900 dark:text-white tracking-tight">
                        {currentCard.term}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                      <span>Question Side</span>
                      <span className="text-blue-600 dark:text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Tap to reveal answer</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Card BACK (Answer / Explanation) */}
                  <div 
                    className="absolute inset-0 rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-violet-500/40 p-8 sm:p-10 flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl dark:shadow-2xl backdrop-blur-2xl group hover:border-violet-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Answer / Explanation
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                        <RotateCw className="w-3 h-3 text-violet-500 dark:text-violet-400" />
                        <span>Click to Flip</span>
                      </span>
                    </div>

                    <div className="my-auto px-2">
                      <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                        {currentCard.definition}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        Concept Mastered?
                      </span>
                      <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-300">
                        Card {currentIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Complete Controls Dock */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-400 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono font-bold shadow-sm"
              title="Previous Card"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => handleReviewAgain(currentCard.id)}
              className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                reviewCards.has(currentCard.id)
                  ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-200'
              }`}
              title="Flag to review this card again"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Review Again</span>
            </button>

            <button
              onClick={() => handleMarkAsKnown(currentCard.id)}
              className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                knownCards.has(currentCard.id)
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200'
              }`}
              title="Mark this card as known"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mark as Known</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-400 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono font-bold shadow-sm"
              title="Next Card"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Retention Stats Bar */}
          <div className="flex items-center gap-3 mt-4 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">Known: {knownCards.size}</span>
            <Sparkles className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600" />
            <span className="text-amber-600 dark:text-amber-400">Review: {reviewCards.size}</span>
            <Sparkles className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600" />
            <span>Unstudied: {cards.length - (knownCards.size + reviewCards.size)}</span>
          </div>

          {/* Next Module Actions */}
          {onNavigateToChat && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 w-full flex justify-end">
              <MagneticButton
                variant="primary"
                onClick={onNavigateToChat}
                className="px-6 py-3 text-xs sm:text-sm font-black italic"
              >
                <span>Ask AI Tutor Questions</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
