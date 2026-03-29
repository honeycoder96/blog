import { useEffect, useRef } from 'react';
import { lerp } from '../../../lib/animation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { markPostRead } from '../../../lib/readPosts';

/** Threshold (0–1) at which a post is considered read. */
const READ_THRESHOLD = 0.8;

interface ReadingProgressProps {
  /** Estimated reading time in minutes — enables the "~X min left" indicator. */
  readingTime?: number;
  /** Slug of the current post — enables marking it read in localStorage at 80%. */
  postSlug?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({ readingTime, postSlug }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const markedRead = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let rafId: number;
    let current = 0;

    const update = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const target = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;

      current = prefersReducedMotion ? target : lerp(current, target, 0.12);
      bar.style.transform = `scaleX(${current})`;

      // Time remaining — direct DOM update, no setState in RAF loop
      const timeEl = timeRef.current;
      if (timeEl && readingTime) {
        const minsLeft = Math.max(1, Math.ceil((1 - target) * readingTime));
        const show = target > 0.05 && target < 0.95;
        timeEl.style.opacity = show ? '1' : '0';
        timeEl.style.transform = show ? 'translateY(0)' : 'translateY(-6px)';
        timeEl.textContent = minsLeft <= 1 ? '~1 min left' : `~${minsLeft} min left`;
      }

      // Mark as read once when threshold is crossed
      if (postSlug && !markedRead.current && target >= READ_THRESHOLD) {
        markedRead.current = true;
        markPostRead(postSlug);
      }

      rafId = requestAnimationFrame(update);
    };

    bar.style.opacity = '1';
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, readingTime, postSlug]);

  return (
    <>
      {/* Thin progress bar at the very top of the viewport */}
      <div
        ref={barRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-fg origin-left z-[130] opacity-0"
        style={{ transform: 'scaleX(0)', transition: 'none' }}
      />

      {/* Time remaining pill — only when readingTime is provided */}
      {readingTime && (
        <div
          ref={timeRef}
          className="fixed top-[72px] right-6 z-[99] font-mono text-[11px] text-fg-faint bg-surface/80 backdrop-blur-sm border border-line rounded-full px-3 py-1 pointer-events-none select-none"
          style={{
            opacity: 0,
            transform: 'translateY(-6px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        />
      )}
    </>
  );
};
