import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  type = 'button',
  href,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const childX = useTransform(springX, (v) => v * 0.5);
  const childY = useTransform(springY, (v) => v * 0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const intensity = 0.4;
    x.set((clientX - (left + width / 2)) * intensity);
    y.set((clientY - (top + height / 2)) * intensity);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const sharedProps = {
    ref: ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: () => setIsHovered(true),
    style: { x: springX, y: springY },
    whileTap: { scale: 0.95 },
    className: `cursor-pointer magnetic ${className}`,
  };

  const inner = (
    <motion.div
      style={{
        x: isHovered ? childX : 0,
        y: isHovered ? childY : 0,
      }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <motion.a href={href} {...sharedProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...sharedProps}>
      {inner}
    </motion.button>
  );
};
