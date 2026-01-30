'use client';

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  // Parse content for special formatting
  const formatContent = (content: string) => {
    // Remove category markers from display
    let formatted = content.replace(/\[CATEGORY_COMPLETE:\s*\w+\]/gi, '');
    formatted = formatted.replace(/\[ALL_COMPLETE\]/gi, '');

    // Split by bullet points and format
    const lines = formatted.split('\n');

    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Bold text between ** **
      const boldFormatted = trimmed.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-slate-800">$1</strong>'
      );

      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return (
          <li
            key={index}
            className="ml-4 list-disc text-slate-700"
            dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^[•-]\s*/, '') }}
          />
        );
      }

      // Empty lines
      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }

      // Regular text
      return (
        <p
          key={index}
          className="text-slate-700"
          dangerouslySetInnerHTML={{ __html: boldFormatted }}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 animate-fade-in',
        isAssistant ? 'bg-slate-50' : 'bg-white'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAssistant ? 'bg-indigo-100' : 'bg-slate-200'
        )}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4 text-indigo-600" />
        ) : (
          <User className="w-4 h-4 text-slate-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-500 mb-1">
          {isAssistant ? 'Investment Analyst' : 'You'}
        </div>
        <div className="prose prose-sm max-w-none space-y-2">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}
