import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { lerp } from '../../../lib/animation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Post {
  slug: string;
  data: {
    title: string;
    date: string;
    category: string;
    author: string;
    summary: string;
    readingTime?: number;
  };
}

interface FeaturedPostsListProps {
  posts: Post[];
}

export const FeaturedPostsList: React.FC<FeaturedPostsListProps> = ({ posts }) => {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.12);

      const card = cardRef.current;
      if (card) {
        card.style.transform = `translate(calc(${pos.current.x}px - 50%), calc(${pos.current.y}px - 50%))`;
      }

      requestAnimationFrame(animate);
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const activePost = posts.find((p) => p.slug === hoveredPost);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredPost(null)}
      className="relative"
    >
      {/* Floating preview card — hidden for reduced motion users */}
      {!reducedMotion && (
        <div
          ref={cardRef}
          className="absolute top-0 left-0 w-[400px] h-[240px] rounded-2xl overflow-hidden pointer-events-none z-20 hidden md:block shadow-2xl shadow-black/60 bg-surface-raised border border-line"
          style={{
            opacity: hoveredPost ? 1 : 0,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.2s ease',
          }}
        >
          {activePost && (
            <div className="w-full h-full absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-surface-raised to-surface">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs text-fg-muted">
                  <span className="font-mono tracking-wide">{activePost.data.date}</span>
                  <span className="flex items-center gap-1.5">
                    <Terminal size={12} /> {activePost.data.author}
                  </span>
                </div>
                <h4 className="text-xl font-display font-bold text-fg leading-tight mb-3">
                  {activePost.data.title}
                </h4>
                <p className="text-sm text-fg-muted line-clamp-3 leading-relaxed">
                  {activePost.data.summary}
                </p>
              </div>
              <div className="text-xs font-medium text-fg/50 flex items-center gap-1 mt-4">
                Read article <ArrowRight size={14} className="ml-1" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post rows */}
      <div className="flex flex-col border-t border-line">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            data-astro-prefetch
            onMouseEnter={() => setHoveredPost(post.slug)}
            className="group magnetic relative border-b border-line py-10 flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-fg-muted transition-colors z-10"
          >
            <div className="flex items-center gap-8 md:w-1/3">
              <span className="text-fg-muted font-mono text-sm">{post.data.date}</span>
              <span className="px-3 py-1 rounded-full border border-line text-xs text-fg-muted uppercase tracking-wider group-hover:border-fg-muted transition-colors">
                {post.data.category}
              </span>
            </div>
            <div className="md:w-2/3 flex justify-between items-center">
              <h3 className="text-3xl md:text-5xl font-medium text-fg-muted group-hover:text-fg transition-all duration-300 group-hover:translate-x-4">
                {post.data.title}
              </h3>
              <ArrowRight
                size={32}
                className="text-fg-ghost group-hover:text-fg group-hover:-rotate-45 transition-all duration-300 shrink-0 ml-4"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
