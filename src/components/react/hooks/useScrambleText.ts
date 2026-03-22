import { useState, useEffect, useRef } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

/** Default total animation duration in milliseconds. */
const DEFAULT_SCRAMBLE_DURATION_MS = 800;

/** Minimum time between scramble ticks in milliseconds. */
const MIN_TICK_MS = 30;

/** How many characters are revealed per tick (fractional to control speed). */
const CHAR_REVEAL_RATE = 1 / 3;

export function useScrambleText(initialText = '') {
  const [displayText, setDisplayText] = useState(initialText);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = (targetText: string, duration = DEFAULT_SCRAMBLE_DURATION_MS) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const maxIterations = targetText.length;
    const tickTime = Math.max(MIN_TICK_MS, duration / maxIterations);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) return char;
            if (char === ' ') return ' ';
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('');
      });

      iteration += CHAR_REVEAL_RATE;

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(targetText);
      }
    }, tickTime);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { displayText, scramble, setDisplayText };
}
