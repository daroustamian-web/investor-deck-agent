'use client';

import { useState } from 'react';
import { FileDown, Loader2, Sparkles, Check, Mail, ExternalLink, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

interface GenerationResult {
  gammaUrl?: string;
  exportUrl?: string;
  error?: string;
}

export function GenerateButton() {
  const { brand, projectData, completedCategories } = useAppStore();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Check if we have enough data to generate
  const canGenerate = completedCategories.length >= 2 || Object.keys(projectData).length >= 4;

  const handleGenerate = async () => {
    if (!canGenerate || status === 'generating') return;

    setStatus('generating');
    setResult(null);

    try {
      const response = await fetch('/api/generate-gamma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData,
          companyName: brand.companyName,
          email: email || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setResult({
          gammaUrl: data.gammaUrl,
          exportUrl: data.exportUrl,
        });
      } else {
        setStatus('error');
        setResult({ error: data.error || 'Failed to generate deck' });
      }
    } catch (error) {
      console.error('Failed to generate deck:', error);
      setStatus('error');
      setResult({ error: 'Failed to connect to server' });
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
  };

  // Success state
  if (status === 'success' && result) {
    return (
      <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-green-800">Deck Generated!</p>
            <p className="text-xs text-green-600">Your professional investor deck is ready</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {result.gammaUrl && (
            <a
              href={result.gammaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Gamma (Edit & Download)
            </a>
          )}

          {result.exportUrl && (
            <a
              href={result.exportUrl}
              download
              className="w-full py-2.5 px-4 rounded-lg font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              <FileDown className="w-4 h-4" />
              Download PowerPoint
            </a>
          )}

          <button
            onClick={handleReset}
            className="w-full py-2 px-4 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-all"
          >
            Generate Another Deck
          </button>
        </div>

        {email && (
          <p className="text-xs text-green-600 text-center mt-2">
            <Mail className="w-3 h-3 inline mr-1" />
            Email sent to {email}
          </p>
        )}
      </div>
    );
  }

  // Error state
  if (status === 'error' && result?.error) {
    return (
      <div className="p-4 border-t border-slate-200 bg-red-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-800">Generation Failed</p>
            <p className="text-xs text-red-600">{result.error}</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Default/generating state
  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50">
      {/* Email input toggle */}
      {canGenerate && status === 'idle' && (
        <div className="mb-3">
          <button
            onClick={() => setShowEmailInput(!showEmailInput)}
            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            {showEmailInput ? 'Hide email option' : 'Send copy to email (optional)'}
          </button>

          {showEmailInput && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          )}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate || status === 'generating'}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all',
          canGenerate && status !== 'generating'
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
            : 'bg-slate-300 cursor-not-allowed'
        )}
      >
        {status === 'generating' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating with AI... (30-60 sec)
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Professional Deck
          </>
        )}
      </button>

      {!canGenerate && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Answer more questions to generate your deck
        </p>
      )}

      {canGenerate && status === 'idle' && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Powered by Gamma AI • Professional design with charts & images
        </p>
      )}

      {status === 'generating' && (
        <div className="mt-3">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse w-2/3" />
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            Creating your 10-slide investor deck with AI-generated images...
          </p>
        </div>
      )}
    </div>
  );
}
