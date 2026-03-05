import React from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  text,
  className = '',
  staggerDelay = 0.04,
  as: Tag = 'h1',
}) => {
  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.25em]"
        >
          <span
            className="animated-title-word inline-block"
            style={{ animationDelay: `${i * staggerDelay}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
};
