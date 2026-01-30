'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ChatMessage } from './ChatMessage';
import { ProgressIndicator } from './ProgressIndicator';
import { GenerateButton } from './GenerateButton';
import { INITIAL_MESSAGE, getCategoryFromMarker, isAllComplete, detectCategoryFromContent } from '@/lib/questions';
import { cn } from '@/lib/utils';

export function Chat() {
  const {
    messages,
    addMessage,
    projectData,
    setProjectData,
    currentCategory,
    setCurrentCategory,
    markCategoryComplete,
    completedCategories,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: INITIAL_MESSAGE,
      });
    }
  }, [messages.length, addMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Extract data using AI after each exchange
  const extractDataWithAI = async (allMessages: typeof messages) => {
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        if (data && Object.keys(data).length > 0) {
          setProjectData(data);
        }
      }
    } catch (error) {
      console.error('Failed to extract data:', error);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    addMessage({ role: 'user', content: userMessage });

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
          ],
          projectData,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantContent = data.content;

      // Check for category completion markers
      const completedCategory = getCategoryFromMarker(assistantContent);
      if (completedCategory) {
        markCategoryComplete(completedCategory);

        // Move to next category
        const categoryOrder = ['site', 'development', 'market', 'financials', 'team', 'terms'] as const;
        const currentIndex = categoryOrder.indexOf(completedCategory);
        if (currentIndex < categoryOrder.length - 1) {
          setCurrentCategory(categoryOrder[currentIndex + 1]);
        }
      } else {
        // Fallback: detect category from content if no explicit marker
        const detectedCategory = detectCategoryFromContent(assistantContent);
        if (detectedCategory && !completedCategories.includes(detectedCategory)) {
          // Check if assistant is asking about next category (meaning current is complete)
          const categoryOrder = ['site', 'development', 'market', 'financials', 'team', 'terms'] as const;
          const detectedIndex = categoryOrder.indexOf(detectedCategory);
          const currentIndex = categoryOrder.indexOf(currentCategory);

          if (detectedIndex > currentIndex) {
            // Mark previous category as complete
            markCategoryComplete(currentCategory);
            setCurrentCategory(detectedCategory);
          }
        }
      }

      // Check for all complete
      if (isAllComplete(assistantContent)) {
        const allCategories = ['site', 'development', 'market', 'financials', 'team', 'terms'] as const;
        allCategories.forEach((cat) => {
          if (!completedCategories.includes(cat)) {
            markCategoryComplete(cat);
          }
        });
      }

      // Add assistant message
      addMessage({ role: 'assistant', content: assistantContent });

      // Extract data using AI (in background)
      const updatedMessages = [
        ...messages,
        { id: '', role: 'user' as const, content: userMessage, timestamp: new Date() },
        { id: '', role: 'assistant' as const, content: assistantContent, timestamp: new Date() },
      ];
      extractDataWithAI(updatedMessages);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Progress indicator */}
      <ProgressIndicator />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 p-4 bg-slate-50 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-500 mb-1">
                Investment Analyst
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Generate button (when ready) */}
      <GenerateButton />

      {/* Input area */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            rows={1}
            className={cn(
              'flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm',
              'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none',
              'placeholder:text-slate-400 transition-shadow'
            )}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
              input.trim() && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
