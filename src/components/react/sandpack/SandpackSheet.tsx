import React, { useState, useEffect, useCallback, Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SandpackLoadingSkeleton } from './SandpackLoadingSkeleton';

const SandpackEditor = React.lazy(() => import('./SandpackEditor'));

class SandpackErrorBoundary extends Component<
  { children: ReactNode; onClose: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-fg-muted">
          <p className="text-sm">Failed to load the code playground.</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg border border-line-strong text-fg-muted hover:text-fg font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={this.props.onClose}
              className="px-4 py-2 rounded-lg border border-line-strong text-fg-muted hover:text-fg font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const SandpackSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [demoId, setDemoId] = useState<string | null>(null);
  const [hasEverOpened, setHasEverOpened] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      setDemoId(id);
      setIsOpen(true);
      setHasEverOpened(true);
    };
    window.addEventListener('sandpack:open', handler);
    return () => window.removeEventListener('sandpack:open', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] h-[75vh] md:h-[50vh] rounded-t-2xl border-t border-line bg-surface flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Code playground"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-line-strong" />
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {hasEverOpened && demoId && (
                <SandpackErrorBoundary onClose={handleClose}>
                  <Suspense fallback={<SandpackLoadingSkeleton />}>
                    <SandpackEditor demoId={demoId} onClose={handleClose} />
                  </Suspense>
                </SandpackErrorBoundary>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
