import React from 'react';

interface ErrorRetryProps {
  message: string;
  onRetry: () => void;
}

/**
 * Inline error display with a retry button.
 * Used by PostsGrid and SeriesAccordion when a paginated fetch fails.
 */
export const ErrorRetry: React.FC<ErrorRetryProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <p className="font-mono text-sm text-fg-muted">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
    >
      Retry
    </button>
  </div>
);
