'use client';

import { useState } from 'react';
import { FileDown, Loader2, Sparkles, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { generateInvestorDeck } from '@/lib/deck-generator';
import { cn } from '@/lib/utils';

export function GenerateButton() {
  const { brand, projectData, completedCategories, isGenerating, setIsGenerating } =
    useAppStore();
  const [downloaded, setDownloaded] = useState(false);

  // Check if we have enough data to generate
  const canGenerate = completedCategories.length >= 3 || Object.keys(projectData).length >= 5;

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    setDownloaded(false);

    try {
      const blob = await generateInvestorDeck({
        brand,
        projectData,
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.projectName || 'Investor-Deck'}-${new Date().toISOString().split('T')[0]}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Failed to generate deck:', error);
      alert('Failed to generate deck. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50">
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all',
          canGenerate && !isGenerating
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
            : 'bg-slate-300 cursor-not-allowed'
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Your Deck...
          </>
        ) : downloaded ? (
          <>
            <Check className="w-5 h-5" />
            Downloaded!
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Investor Deck
            <FileDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>

      {!canGenerate && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Complete at least 3 sections to generate your deck
        </p>
      )}

      {canGenerate && !isGenerating && (
        <p className="text-xs text-slate-500 text-center mt-2">
          {completedCategories.length} sections complete • Ready to generate
        </p>
      )}
    </div>
  );
}
