'use client';

import { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export function FeedbackModal({ isOpen, onClose, projectName }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState<string>('formatting');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      // Send feedback to API (you can integrate with your preferred service)
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          feedback,
          projectName,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFeedback('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5" />
            <h2 className="font-semibold">Share Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Thank You!
            </h3>
            <p className="text-slate-600">
              Your feedback helps us improve the deck generator.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What's the issue?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'formatting', label: 'Formatting/Layout' },
                  { id: 'data', label: 'Missing Data' },
                  { id: 'design', label: 'Design Quality' },
                  { id: 'other', label: 'Other' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setCategory(option.id)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      category === option.id
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback text */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tell us more
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe the issue you experienced with the generated deck..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!feedback.trim() || isSubmitting}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all',
                feedback.trim() && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-slate-300 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Submit Feedback'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              We review all feedback and continuously improve the generator.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
