import React, { useEffect } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export const ReadingProgress: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-fg origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};
