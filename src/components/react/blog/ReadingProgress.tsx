import { useEffect, useRef } from 'react';
import { lerp } from '../../../lib/animation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const ReadingProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const bar = barRef.current;
    if (!bar) return;

    let rafId: number;
    let current = 0;

    const update = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const target = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;

      current = lerp(current, target, 0.12);
      bar.style.transform = `scaleX(${current})`;

      rafId = requestAnimationFrame(update);
    };

    bar.style.opacity = '1';
    rafId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-fg origin-left z-[100] opacity-0"
      style={{ transform: 'scaleX(0)', transition: 'none' }}
    />
  );
};
