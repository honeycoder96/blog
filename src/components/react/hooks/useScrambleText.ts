import { useState, useEffect, useRef } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

export const useScrambleText = (initialText = '') => {
  const [displayText, setDisplayText] = useState(initialText);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = (targetText: string, duration = 800) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const maxIterations = targetText.length;
    const tickTime = Math.max(30, duration / maxIterations);

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

      iteration += 1 / 3;

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
};
