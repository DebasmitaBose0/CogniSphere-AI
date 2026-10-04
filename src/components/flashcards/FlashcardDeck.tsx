import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RefreshCcw, 
  Layers,
  BookOpen
} from 'lucide-react';
import { Flashcard, StudyMaterial } from '../../types';
import { generateFlashcards } from '../../services/ai';

interface FlashcardDeckProps {
  material: StudyMaterial | null;
  onUpdateFlashcardStats: (masteredCount: number) => void;
  onNavigateToStudy: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  material,
  onUpdateFlashcardStats,
  onNavigateToStudy,
}) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (material?.content) {
      loadDeck();
    }
  }, [material?.content]);

  const loadDeck = async () => {
    if (!material?.content) return;
    setIsLoading(true);
    setIsFlipped(false);
    setCurrentIdx(0);

    try {
      const generated = await generateFlashcards(material.content);
      setCards(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx(prev => (prev + 1 < cards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx(prev => (prev - 1 >= 0 ? prev - 1 : cards.length - 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIdx(0);
  };

  const handleReset = () => {
    setIsFlipped(false);
    const resetCards = cards.map(c => ({ ...c, status: 'unseen' as const }));
    setCards(resetCards);
    setCurrentIdx(0);
    onUpdateFlashcardStats(0);
  };

  const markCardStatus = (status: 'known' | 'review') => {
    const updated = [...cards];
    updated[currentIdx].status = status;
    setCards(updated);

    const mastered = updated.filter(c => c.status === 'known').length;
    onUpdateFlashcardStats(mastered);

    // Automatically transition to next card after marking
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cards.length === 0) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, currentIdx]);

  if (!material?.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-10 rounded-3xl border border-dashed border-forest-900/20 dark:border-forest-600/30 bg-white/40 dark:bg-forest-950/20 max-w-md mx-auto">
          <Layers className="w-10 h-10 text-forest-700 dark:text-forest-400 mx-auto mb-3" />
          <h3 className="font-serif text-2xl font-normal text-ink-900 dark:text-forest-50">
            No Study Material Loaded
          </h3>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-forest-300/70 mt-2 mb-6">
            Please add your notes or load the Cloud Computing demo to build 3D flashcard decks.
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

  const currentCard = cards[currentIdx];
  const knownCount = cards.filter(c => c.status === 'known').length;
  const reviewCount = cards.filter(c => c.status === 'review').length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Top Header & Deck Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-forest-900/10 dark:border-forest-500/20">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400">
            Spaced Repetition Flashcards
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink-900 dark:text-forest-50 mt-1">
            {material.title}
          </h1>
        </div>

        {cards.length > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              Known: {knownCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              Review: {reviewCount}
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-forest-700 dark:text-forest-300 animate-spin mx-auto" />
          <h3 className="font-serif text-lg text-ink-900 dark:text-forest-50">
            Forming flashcard deck…
          </h3>
        </div>
      ) : cards.length > 0 && currentCard ? (
        <div className="space-y-6">
          
          {/* Deck Counter & Utility Actions */}
          <div className="flex items-center justify-between text-xs font-mono text-ink-500 dark:text-forest-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink-900 dark:text-forest-100">
                Card {currentIdx + 1} of {cards.length}
              </span>
              <Sparkles className="w-2.5 h-2.5 text-forest-400" />
              <span className="text-[11px]">Press Space to flip, Arrows to browse</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                title="Shuffle Deck"
                className="p-1.5 rounded-lg border border-forest-900/10 dark:border-forest-700/40 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 text-ink-700 dark:text-forest-300"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                title="Reset Deck Progress"
                className="p-1.5 rounded-lg border border-forest-900/10 dark:border-forest-700/40 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 text-ink-700 dark:text-forest-300"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Perspective Flashcard Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-80 sm:h-96 cursor-pointer select-none perspective-1000"
          >
            <div 
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT: Question / Term */}
              <div className="absolute inset-0 backface-hidden rounded-3xl border border-forest-900/15 dark:border-forest-700/50 bg-white dark:bg-forest-950 p-8 sm:p-10 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono text-forest-700 dark:text-forest-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span>Front</span>
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Term / Concept</span>
                  </span>
                  <span className="text-[11px] text-ink-400 dark:text-forest-500">Click to flip</span>
                </div>

                <div className="text-center my-auto px-4">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ink-900 dark:text-forest-50 font-normal leading-snug">
                    {currentCard.term}
                  </h3>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-ink-400 dark:text-forest-400">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reveal Definition</span>
                </div>
              </div>

              {/* BACK: Answer / Definition */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border border-forest-700/40 bg-[#0c1f18] text-forest-50 p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span>Back</span>
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Detailed Definition</span>
                  </span>
                  <span className="text-[11px] text-forest-400">Click to flip back</span>
                </div>

                <div className="text-center my-auto px-4 sm:px-8">
                  <p className="text-base sm:text-lg text-forest-100 leading-relaxed font-light font-sans">
                    {currentCard.definition}
                  </p>
                </div>

                <div className="text-center text-xs font-mono text-forest-400">
                  <span>{currentCard.term}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mastery Review Buttons & Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Nav Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl border border-forest-900/15 dark:border-forest-700/40 text-ink-700 dark:text-forest-300 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 transition-colors"
                aria-label="Previous Card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl border border-forest-900/15 dark:border-forest-700/40 text-ink-700 dark:text-forest-300 hover:bg-forest-900/5 dark:hover:bg-forest-500/10 transition-colors"
                aria-label="Next Card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Mark as Known / Review */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => markCardStatus('review')}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl border border-amber-600/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono uppercase tracking-wider transition-all"
              >
                Review Again
              </button>

              <button
                onClick={() => markCardStatus('known')}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-forest-900 hover:bg-forest-950 dark:bg-forest-200 dark:hover:bg-white text-forest-50 dark:text-forest-950 text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4 text-emerald-400 dark:text-forest-950" />
                <span>Mark as Known</span>
              </button>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
