import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  ArrowRight, 
  Lightbulb, 
} from 'lucide-react';
import { ChatMessage, StudyMaterial } from '../../types';
import { askNotes } from '../../services/ai';
import { MagneticButton } from '../ui/MagneticButton';

interface FuturisticAIChatViewProps {
  material: StudyMaterial | null;
  onNavigateToStudy: () => void;
}

export const FuturisticAIChatView: React.FC<FuturisticAIChatViewProps> = ({
  material,
  onNavigateToStudy,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: material 
        ? `I am your AI Study Buddy academic companion. I have absorbed "${material.title}". Ask me for exam 5-mark structures, simplified intuitive analogies, step-by-step mathematical proofs, or conceptual quizzes.`
        : 'Welcome to the AI Study Buddy Academic Assistant. Please load or upload your study notes so I can ground all answers in your syllabus.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (questionText?: string) => {
    const query = (questionText || input).trim();
    if (!query || !material) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await askNotes(material.content, query, 'explain_simply', messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isGroundedInNotes: response.isGrounded,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const promptPills = [
    { label: 'Explain simply', query: 'Explain the core principles in very simple, beginner-friendly terms with an intuitive analogy.' },
    { label: 'Give me a 5-mark answer', query: 'Structure a comprehensive 5-mark university exam answer with concise headings and bullet points.' },
    { label: 'Summarize this', query: 'Provide a concise, high-yield summary of the most critical takeaways from this material.' },
    { label: 'Give me an example', query: 'Give me a concrete, real-world industry example illustrating this principle.' },
    { label: 'Quiz me', query: 'Ask me a challenging conceptual question based on this material to test my active recall.' },
  ];

  if (!material) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black italic text-slate-900 dark:text-white">No Study Material Loaded</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
          Please upload or paste your study material on the Ingest Notes page to converse with your grounded AI tutor.
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
      
      {/* Header with Animated AI Tutor Avatar Core */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-4">
          
          {/* Animated AI Orb */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <div 
              className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
                isThinking 
                  ? 'bg-gradient-to-tr from-violet-600 via-indigo-500 to-blue-400 opacity-80 scale-125' 
                  : 'bg-blue-500/20 dark:bg-cyan-500/20 opacity-50 scale-100'
              }`} 
            />

            {/* Orbiting particles ring */}
            <div 
              className={`absolute inset-0 rounded-full border border-dashed transition-all ${
                isThinking 
                  ? 'border-violet-500/80 animate-spin duration-1000' 
                  : 'border-blue-400/40 dark:border-cyan-400/30 animate-spin duration-6000'
              }`} 
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-500" />
            </div>

            {/* Central glowing orb core */}
            <div 
              className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                isThinking
                  ? 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 border-violet-300 shadow-md scale-110'
                  : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 border-blue-300/60 shadow-sm'
              }`}
            >
              <Bot className={`w-5 h-5 text-white transition-transform ${isThinking ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black italic text-slate-950 dark:text-white tracking-tight">
                AI Study Assistant
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold italic border transition-colors ${
                isThinking
                  ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/40 animate-pulse'
                  : 'bg-blue-500/20 text-blue-700 dark:text-cyan-300 border-blue-500/30'
              }`}>
                {isThinking ? 'Synthesizing...' : 'Grounded Tutor'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
              Knowledge Base: <span className="text-blue-600 dark:text-cyan-300 font-bold">{material.title}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[11px] font-mono font-bold italic text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          Quick Prompts:
        </span>
        {promptPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.query)}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-white/10 hover:border-blue-400 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-cyan-200 font-mono font-bold italic transition-all backdrop-blur-xl shadow-sm cursor-pointer"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log Panel */}
      <div className="rounded-3xl bg-white/95 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 backdrop-blur-2xl p-6 shadow-md dark:shadow-2xl min-h-[420px] max-h-[520px] overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isUser
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gradient-to-tr from-blue-600 to-violet-600 border-blue-400 text-white shadow-sm'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                isUser
                  ? 'bg-blue-600 text-white shadow-sm rounded-tr-none font-medium'
                  : 'bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-sm rounded-tl-none font-normal whitespace-pre-wrap'
              }`}>
                {msg.text}
                <div className={`text-[10px] font-mono font-semibold mt-2 ${isUser ? 'text-blue-200 text-right' : 'text-slate-500 dark:text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* AI Thinking Indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 border border-blue-400 text-white flex items-center justify-center shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-blue-300 dark:border-cyan-500/30 text-slate-700 dark:text-slate-300 rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce delay-200" />
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-cyan-300 ml-1">
                Synthesizing academic answer...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Textarea & Send Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 backdrop-blur-2xl focus-within:border-blue-500 shadow-md dark:shadow-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your notes (e.g. 'Explain the difference between Type-1 & Type-2 hypervisors')..."
          className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-sans"
        />

        <MagneticButton
          variant="primary"
          type="submit"
          className="p-3 text-white shrink-0 rounded-xl font-bold"
        >
          <Send className="w-4 h-4" />
        </MagneticButton>
      </form>

    </div>
  );
};
