'use client';

import { Check, Circle, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CATEGORY_PROGRESS } from '@/lib/questions';
import { cn } from '@/lib/utils';

export function ProgressIndicator() {
  const { currentCategory, completedCategories } = useAppStore();

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-700">Progress</h3>
        <span className="text-xs text-slate-500">
          {completedCategories.length} of {CATEGORY_PROGRESS.length} sections
        </span>
      </div>
      <div className="flex items-center gap-1">
        {CATEGORY_PROGRESS.map((category, index) => {
          const isCompleted = completedCategories.includes(category.category);
          const isCurrent = currentCategory === category.category;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div key={category.category} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center transition-all',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-indigo-500 text-white',
                    isPending && 'bg-slate-200 text-slate-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1 text-center leading-tight',
                    isCompleted && 'text-green-600 font-medium',
                    isCurrent && 'text-indigo-600 font-medium',
                    isPending && 'text-slate-400'
                  )}
                >
                  {category.label.split(' ')[0]}
                </span>
              </div>

              {/* Connector line */}
              {index < CATEGORY_PROGRESS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-full -mt-4',
                    completedCategories.includes(CATEGORY_PROGRESS[index + 1]?.category) ||
                      currentCategory === CATEGORY_PROGRESS[index + 1]?.category
                      ? 'bg-indigo-300'
                      : 'bg-slate-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
