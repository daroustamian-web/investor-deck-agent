'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Check, Mail, Send, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'sending' | 'sent' | 'error';

interface GenerationResult {
  exportUrl?: string;
  error?: string;
}

export function GenerateButton() {
  const { brand, projectData, completedCategories } = useAppStore();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setResult({
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

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setStatus('sending');

    try {
      const response = await fetch('/api/send-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          exportUrl: result?.exportUrl,
          projectData,
          companyName: brand.companyName,
        }),
      });

      if (response.ok) {
        setStatus('sent');
      } else {
        setEmailError('Failed to send email. Please try again.');
        setStatus('success');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailError('Failed to send email. Please try again.');
      setStatus('success');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setEmail('');
    setEmailError('');
  };

  // Email sent confirmation
  if (status === 'sent') {
    return (
      <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">You're All Set!</h3>
          <p className="text-green-700 mb-1">Your investor deck has been sent to:</p>
          <p className="font-medium text-green-800 mb-4">{email}</p>
          <p className="text-sm text-green-600 mb-6">
            Check your inbox (and spam folder) for the download link.
          </p>
          <button
            onClick={handleReset}
            className="text-sm text-green-700 hover:text-green-800 underline"
          >
            Generate another deck
          </button>
        </div>
      </div>
    );
  }

  // Success state - ask for email (also handles 'sending' state)
  if ((status === 'success' || status === 'sending') && result) {
    return (
      <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-1">Your Deck is Ready!</h3>
          <p className="text-slate-600 text-sm">
            Enter your email to receive your professional investor deck
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="your@email.com"
              className={cn(
                "w-full px-4 py-3 border rounded-xl text-center text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all",
                emailError ? "border-red-300 bg-red-50" : "border-slate-300"
              )}
              onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 text-center">{emailError}</p>
            )}
          </div>

          <button
            onClick={handleSendEmail}
            disabled={status === 'sending'}
            className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send My Deck
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center">
            We'll email you a link to download your PowerPoint deck
          </p>
        </div>
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
            Creating Your Deck...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Investor Deck
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
          Professional design with charts & images
        </p>
      )}

      {status === 'generating' && (
        <div className="mt-3">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse w-2/3" />
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            Building your 10-slide investor deck...
          </p>
        </div>
      )}
    </div>
  );
}
