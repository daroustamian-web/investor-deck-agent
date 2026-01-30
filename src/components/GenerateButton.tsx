'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Check, Mail, Send, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type GenerationStatus = 'idle' | 'email-prompt' | 'submitting' | 'submitted' | 'error';

export function GenerateButton() {
  const { brand, projectData, completedCategories } = useAppStore();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if we have enough data to generate
  const canGenerate = completedCategories.length >= 2 || Object.keys(projectData).length >= 4;

  const handleStartGenerate = () => {
    if (!canGenerate) return;
    setStatus('email-prompt');
  };

  const handleSubmit = async () => {
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
    setStatus('submitting');

    try {
      const response = await fetch('/api/generate-deck-async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          projectData,
          companyName: brand.companyName,
        }),
      });

      const data = await response.json();

      if (response.ok && data.queued) {
        setStatus('submitted');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to start generation');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      setStatus('error');
      setErrorMessage('Failed to connect to server');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setEmail('');
    setEmailError('');
    setErrorMessage('');
  };

  // Submitted - check your email
  if (status === 'submitted') {
    return (
      <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Check Your Email!</h3>
          <p className="text-green-700 mb-1">Your deck is being created and will be sent to:</p>
          <p className="font-medium text-green-800 text-lg mb-4">{email}</p>
          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-700">
              <span className="font-semibold">Expected delivery:</span> ~2 minutes
            </p>
            <p className="text-xs text-green-600 mt-1">
              Check your spam folder if you don't see it
            </p>
          </div>
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

  // Email prompt
  if (status === 'email-prompt' || status === 'submitting') {
    return (
      <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-1">Where should we send it?</h3>
          <p className="text-slate-600 text-sm">
            We'll email your professional investor deck in about 2 minutes
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
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={status === 'submitting'}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 text-center">{emailError}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Create & Send My Deck
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={status === 'submitting'}
            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="p-4 border-t border-slate-200 bg-red-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-800">Something went wrong</p>
            <p className="text-xs text-red-600">{errorMessage}</p>
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

  // Default state
  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50">
      <button
        onClick={handleStartGenerate}
        disabled={!canGenerate}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all',
          canGenerate
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
            : 'bg-slate-300 cursor-not-allowed'
        )}
      >
        <Sparkles className="w-5 h-5" />
        Generate Investor Deck
      </button>

      {!canGenerate && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Answer more questions to generate your deck
        </p>
      )}

      {canGenerate && (
        <p className="text-xs text-slate-500 text-center mt-2">
          Professional design with charts & images
        </p>
      )}
    </div>
  );
}
