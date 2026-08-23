import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import type { ChatMessage } from '@/lib/types';
import { searchKnowledgeBase, DISCLAIMER } from '@/lib/ragEngine';

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your CivicSahaaya assistant. Ask me any follow-up question about your civic or legal issue.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const generateResponse = (query: string): string => {
    const docs = searchKnowledgeBase(query);
    if (docs.length === 0) {
      return "I don't have enough verified information to answer this confidently. Please try rephrasing your question, or describe your problem in the Rights Navigator for a more detailed analysis.\n\n" + DISCLAIMER;
    }
    const doc = docs[0];
    const relevant = doc.important_notes?.find((n) =>
      query.toLowerCase().includes('document') || query.toLowerCase().includes('keep') || query.toLowerCase().includes('evidence')
    );
    if (relevant) {
      return `For this issue (${doc.title}), here's what you should know:\n\n${relevant}\n\nRequired documents: ${(doc.required_documents || []).join(', ')}.\n\nSource: ${doc.official_source}`;
    }
    return `Based on our knowledge base regarding "${doc.title}":\n\n${doc.summary}\n\nRecommended steps: ${(doc.procedure || []).slice(0, 2).join('; ')}\n\nYou can use the Rights Navigator for a full action plan.\n\n${DISCLAIMER}`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages((m) => [...m, { role: 'assistant', content: response, timestamp: Date.now() }]);
      setThinking(false);
    }, 800);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all hover:scale-105 group"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm hidden sm:block group-hover:inline">Ask CivicSahaaya</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[28rem] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm">CivicSahaaya Assistant</span>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-primary-700 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-800">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            rows={1}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            style={{ maxHeight: '80px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
