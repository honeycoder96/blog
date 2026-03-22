import React, { useState, useRef } from 'react';
import {
  motion,
  useSpring,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
} from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || prefersReducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const activePost = posts.find((p) => p.slug === hoveredPost);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredPost(null)}
      className="relative"
    >
      {/* Floating preview card */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute top-0 left-0 w-[400px] h-[240px] rounded-2xl overflow-hidden pointer-events-none z-20 hidden md:block shadow-2xl shadow-black/60 bg-surface-raised border border-line"
          style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
          animate={{ opacity: hoveredPost ? 1 : 0, scale: hoveredPost ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activePost && (
              <motion.div
                key={activePost.slug}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-surface-raised to-surface"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
