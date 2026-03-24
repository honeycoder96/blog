import { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/** Appears after 400px of scroll. On mobile sits above MobileSidebar's TOC button (bottom-20). */
export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-20 right-6 xl:bottom-8 xl:right-8 z-40 w-12 h-12 rounded-full bg-fg text-surface flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
};
