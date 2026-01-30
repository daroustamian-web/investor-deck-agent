'use client';

import { useState } from 'react';
import { PanelRightOpen, PanelRightClose, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { Chat } from '@/components/Chat';
import { BrandingPanel } from '@/components/BrandingPanel';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function Home() {
  const [showBranding, setShowBranding] = useState(true);
  const { reset, projectData } = useAppStore();

  const handleReset = () => {
    if (confirm('Are you sure you want to start over? All progress will be lost.')) {
      reset();
      window.location.reload();
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              Investor Deck Generator
            </h1>
            <p className="text-xs text-slate-500">
              {projectData.projectName
                ? `Working on: ${projectData.projectName}`
                : 'Create professional pitch decks for real estate investments'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Start Over</span>
          </button>

          {/* Toggle branding panel */}
          <button
            onClick={() => setShowBranding(!showBranding)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors',
              showBranding
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {showBranding ? (
              <>
                <PanelRightClose className="w-4 h-4" />
                <span className="hidden sm:inline">Hide Branding</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Show Branding</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div
          className={cn(
            'flex-1 min-w-0 transition-all duration-300',
            showBranding ? 'mr-0' : ''
          )}
        >
          <Chat />
        </div>

        {/* Branding panel */}
        <div
          className={cn(
            'w-80 flex-shrink-0 transition-all duration-300 transform',
            showBranding ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'
          )}
          style={{ display: showBranding ? 'block' : 'none' }}
        >
          <BrandingPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-center text-xs text-slate-500 flex-shrink-0">
        <span>
          Powered by Claude AI • Your data is processed securely and not stored
        </span>
      </footer>
    </div>
  );
}
