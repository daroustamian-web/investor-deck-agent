'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ChatMessage } from './ChatMessage';
import { ProgressIndicator } from './ProgressIndicator';
import { GenerateButton } from './GenerateButton';
import { INITIAL_MESSAGE, getCategoryFromMarker, isAllComplete } from '@/lib/questions';
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
        const categoryOrder = ['site', 'development', 'market', 'financials', 'team', 'terms'];
        const currentIndex = categoryOrder.indexOf(completedCategory);
        if (currentIndex < categoryOrder.length - 1) {
          setCurrentCategory(categoryOrder[currentIndex + 1] as typeof currentCategory);
        }
      }

      // Check for all complete
      if (isAllComplete(assistantContent)) {
        // Mark all remaining categories as complete
        ['site', 'development', 'market', 'financials', 'team', 'terms'].forEach((cat) => {
          if (!completedCategories.includes(cat as typeof currentCategory)) {
            markCategoryComplete(cat as typeof currentCategory);
          }
        });
      }

      // Add assistant message
      addMessage({ role: 'assistant', content: assistantContent });

      // Extract data from user response (simple parsing)
      extractProjectData(userMessage);
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

  // Simple data extraction from user responses
  const extractProjectData = (text: string) => {
    const updates: Partial<typeof projectData> = {};

    // Address patterns
    const addressMatch = text.match(
      /(?:address|located at|property at|at)\s*[:\-]?\s*([^,\n]+(?:,\s*[A-Z]{2}\s*\d{5})?)/i
    );
    if (addressMatch) {
      updates.propertyAddress = addressMatch[1].trim();
    }

    // Lot size
    const lotMatch = text.match(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:acres?|sq\.?\s*ft\.?|square feet)/i);
    if (lotMatch) {
      updates.lotSize = lotMatch[0];
    }

    // Beds
    const bedMatch = text.match(/(\d+)\s*(?:beds?|licensed beds)/i);
    if (bedMatch) {
      updates.bedCount = bedMatch[1];
    }

    // Dollar amounts
    const dollarMatches = Array.from(text.matchAll(/\$\s*([\d,]+(?:\.\d+)?)\s*(?:M|million|K|thousand)?/gi));
    for (const match of dollarMatches) {
      const value = match[0];
      if (value.toLowerCase().includes('m') || parseInt(match[1].replace(/,/g, '')) >= 1000000) {
        if (!updates.totalProjectCost && text.toLowerCase().includes('total')) {
          updates.totalProjectCost = value;
        } else if (!updates.totalRaise && text.toLowerCase().includes('raise')) {
          updates.totalRaise = value;
        }
      }
    }

    // Percentages
    const pctMatches = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*%/g));
    for (const match of pctMatches) {
      const pct = match[0];
      const context = text.substring(Math.max(0, match.index! - 30), match.index! + 10).toLowerCase();
      if (context.includes('irr')) {
        updates.projectedIRR = pct;
      } else if (context.includes('pref') || context.includes('preferred')) {
        updates.preferredReturn = pct;
      } else if (context.includes('cap')) {
        if (!updates.goingInCapRate) {
          updates.goingInCapRate = pct;
        }
      }
    }

    // Update store if we found anything
    if (Object.keys(updates).length > 0) {
      setProjectData(updates);
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
      <div className="flex-1 overflow-y-auto">
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
