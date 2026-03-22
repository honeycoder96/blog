import React, { useEffect, useRef } from 'react';
import { lerp } from '../../../lib/animation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Skip animation loop for users who prefer reduced motion
    if (prefersReducedMotion) return;

    const el = cursorRef.current;
    if (!el) return;

    // Current smoothed position and scale (lerped each frame)
    const pos = { x: 0, y: 0 };
    const scale = { current: 1 };
    const bgOpacity = { current: 0 };
    let target = { x: 0, y: 0 };
    let hovering = false;
    let rafId: number;
    let started = false;

    const animate = () => {
      pos.x = lerp(pos.x, target.x, 0.15);
      pos.y = lerp(pos.y, target.y, 0.15);
      scale.current = lerp(scale.current, hovering ? 1.5 : 1, 0.15);
      bgOpacity.current = lerp(bgOpacity.current, hovering ? 1 : 0, 0.15);

      el.style.transform = `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%)) scale(${scale.current})`;
      el.style.backgroundColor = `rgba(255,255,255,${bgOpacity.current})`;

      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      target = { x: e.clientX, y: e.clientY };
      if (!started) {
        // Snap to position on first move so cursor doesn't fly in from (0,0)
        pos.x = e.clientX;
        pos.y = e.clientY;
        el.style.opacity = '1';
        started = true;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      hovering = !!(e.target as Element).closest('button, a, .magnetic, input, textarea');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={cursorRef}
      // Hidden until first mousemove (opacity set to 1 in handler)
      // CSS media query hides it entirely for reduced-motion users
      className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white pointer-events-none z-[200] mix-blend-difference opacity-0"
    />
  );
};
