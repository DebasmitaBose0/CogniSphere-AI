import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Bot, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, StudyMode, StudyMaterial } from '../../types';
import { askNotes } from '../../services/ai';

interface AskNotesChatProps {
  material: StudyMaterial | null;
  onNavigateToStudy: () => void;
}

export const AskNotesChat: React.FC<AskNotesChatProps> = ({
  material,
  onNavigateToStudy,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AstraLearn study companion. Ask me any conceptual question, exam preparation request, or definition grounded in your notes.\n\nYou can select specialized study modes below (such as "Exam Answer" or "Explain Simply").`,
      timestamp: new Date().toISOString(),
      isGroundedInNotes: true,
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<StudyMode>('explain_simply');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const studyModes: { id: StudyMode; label: string; desc: string }[] = [
    { id: 'explain_simply', label: 'Explain Simply', desc: 'Beginner-friendly intuitive analogies' },
    { id: 'exam_answer', label: 'Exam Answer', desc: 'Concise 5-mark academic structure' },
    { id: 'deep_explanation', label: 'Deep Explanation', desc: 'Architecture & technical depth' },
    { id: 'quick_revision', label: 'Quick Revision', desc: 'Bullet-point high-yield takeaways' },
  ];

  const suggestedQuestions = [
    "What is virtualization?",
    "Explain IaaS in simple words.",
    "What are the advantages of cloud computing?",
    "Give me a 5-mark answer on SaaS.",
  ];

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || !material?.content || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
      mode: selectedMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askNotes(material.content, query, selectedMode, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toISOString(),
        mode: selectedMode,
        isGroundedInNotes: response.isGrounded,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Chat session refreshed. What concept would you like to explore from "${material?.title || 'your notes'}"?`,
        timestamp: new Date().toISOString(),
        isGroundedInNotes: true,
      }
    ]);
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
            Please load your notes or activate the Cloud Computing demo to begin chatting with your material.
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header & Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-forest-900/10 dark:border-forest-500/20">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest-700 dark:text-forest-400">
            Conversational Study Companion
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink-900 dark:text-forest-50 mt-1">
            Ask Your Notes Anything
          </h1>
          <p className="text-xs text-ink-600 dark:text-forest-200/70 mt-1">
            Strictly grounded in: <strong>{material.title}</strong>
          </p>
        </div>

        <button
          onClick={handleClearChat}
          title="Clear Chat History"
          className="self-start md:self-auto p-2 rounded-xl border border-forest-900/10 dark:border-forest-700/40 text-ink-500 hover:text-red-500 dark:text-forest-400 hover:bg-red-500/10 transition-colors flex items-center gap-1 text-xs font-mono"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* AI Study Modes Bar */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-ink-500 dark:text-forest-400">
          Target Study Mode:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {studyModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedMode === mode.id
                  ? 'border-forest-900 bg-forest-900 text-forest-50 dark:border-forest-200 dark:bg-forest-200 dark:text-forest-950 shadow-xs'
                  : 'border-forest-900/10 dark:border-forest-700/40 bg-white/60 dark:bg-forest-950/30 text-ink-800 dark:text-forest-200 hover:bg-forest-50'
              }`}
            >
              <div className="font-serif font-medium text-xs">
                {mode.label}
              </div>
              <div className={`text-[10px] mt-0.5 leading-tight ${selectedMode === mode.id ? 'opacity-80' : 'text-ink-500 dark:text-forest-400'}`}>
                {mode.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-mono text-ink-400 dark:text-forest-500 mr-1">
          Suggestions:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full border border-forest-900/10 dark:border-forest-700/40 bg-white/50 dark:bg-forest-900/20 hover:bg-forest-50 dark:hover:bg-forest-900/40 text-ink-700 dark:text-forest-300 text-xs transition-colors"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-3xl border border-forest-900/15 dark:border-forest-700/40 bg-white/80 dark:bg-forest-950/40 p-4 sm:p-6 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 shadow-sm flex flex-col">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                isAi ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono ${
                isAi 
                  ? 'bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950' 
                  : 'bg-forest-100 text-forest-900 dark:bg-forest-800 dark:text-forest-100'
              }`}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 relative group ${
                isAi
                  ? 'bg-forest-50/70 dark:bg-forest-900/30 border border-forest-900/10 dark:border-forest-700/40 text-ink-900 dark:text-forest-50 font-light'
                  : 'bg-forest-900 text-white dark:bg-forest-200 dark:text-forest-950 font-normal shadow-sm'
              }`}>
                
                {/* Note Grounding Flag / Mode Flag */}
                {isAi && msg.isGroundedInNotes !== undefined && (
                  <div className="flex items-center gap-1.5 pb-1 border-b border-forest-900/5 dark:border-forest-700/20 text-[10px] font-mono">
                    {msg.isGroundedInNotes ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Grounded in notes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3 h-3" /> Not found in notes
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Copy button for AI message */}
                {isAi && (
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.text)}
                    title="Copy response"
                    className="absolute top-2 right-2 p-1 rounded-lg text-ink-400 hover:text-ink-800 dark:text-forest-400 dark:hover:text-forest-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking loading indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] self-start items-center">
            <div className="w-8 h-8 rounded-xl bg-forest-900 text-forest-50 dark:bg-forest-200 dark:text-forest-950 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-forest-50/70 dark:bg-forest-900/30 border border-forest-900/10 dark:border-forest-700/40 text-xs font-mono text-forest-700 dark:text-forest-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Synthesizing response from notes…</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${material.title.slice(0, 30)}...`}
          disabled={isLoading}
          className="flex-1 px-4 py-3.5 rounded-2xl border border-forest-900/15 dark:border-forest-700/40 bg-white dark:bg-forest-950/60 text-ink-900 dark:text-forest-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-600/50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3.5 rounded-2xl bg-forest-900 hover:bg-forest-950 dark:bg-forest-200 dark:hover:bg-white text-forest-50 dark:text-forest-950 disabled:opacity-40 transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
