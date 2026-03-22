import React, { useEffect, useRef } from 'react';

export const ReadingProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bar = barRef.current;
    if (!bar) return;

    let rafId: number;
    let current = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[2px] bg-fg origin-left z-[100] opacity-0"
      style={{ transform: 'scaleX(0)', transition: 'none' }}
    />
  );
};
