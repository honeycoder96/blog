import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

type Category = 'All' | 'Architecture' | 'Deep Dive' | 'Engineering';

interface Post {
  slug: string;
  data: {
    title: string;
    date: string;
    category: string;
    summary: string;
    readingTime?: number;
    tags: string[];
  };
}

interface PostsGridProps {
  posts: Post[];
}

const CATEGORIES: Category[] = ['All', 'Architecture', 'Deep Dive', 'Engineering'];

const categoryColors: Record<string, string> = {
  Architecture: 'text-blue-400 border-blue-800',
  'Deep Dive': 'text-purple-400 border-purple-800',
  Engineering: 'text-green-400 border-green-800',
  JavaScript: 'text-yellow-400 border-yellow-800',
};

function getInitialCategory(): Category {
  if (typeof window === 'undefined') return 'All';
  const param = new URLSearchParams(window.location.search).get('category');
  if (param && (CATEGORIES as string[]).includes(param)) return param as Category;
  return 'All';
}

export const PostsGrid: React.FC<PostsGridProps> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState<Category>(getInitialCategory);
  const prefersReducedMotion = useReducedMotion();

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.data.category === activeCategory);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full border font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-fg text-surface border-fg'
                : 'border-line text-fg-muted hover:border-line-strong hover:text-fg-default'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="w-full flex flex-col border-t border-line">
        <AnimatePresence mode="popLayout">
          {filtered.map((post) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              variants={prefersReducedMotion ? undefined : cardVariants}
              initial={prefersReducedMotion ? undefined : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              exit={prefersReducedMotion ? undefined : 'exit'}
              className="group border-b border-line py-8 md:py-10 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-fg-muted transition-colors w-full"
            >
              <div className="md:w-1/4 flex flex-col gap-3">
                <time className="text-fg-faint font-mono text-xs">{post.data.date}</time>
                <span
                  className={`self-start px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider ${
                    categoryColors[post.data.category] ?? 'text-fg-muted border-line'
                  }`}
                >
                  {post.data.category}
                </span>
              </div>

              <div className="md:w-2/4 flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-display font-bold text-fg-default group-hover:text-fg transition-colors duration-300">
                  {post.data.title}
                </h3>
                <p className="text-sm text-fg-faint line-clamp-2 leading-relaxed">
                  {post.data.summary}
                </p>
                {post.data.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-1">
                    {post.data.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs font-mono text-fg-ghost">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:w-1/4 flex justify-end items-center gap-3">
                {post.data.readingTime && (
                  <span className="text-fg-ghost font-mono text-xs">
                    {post.data.readingTime}m read
                  </span>
                )}
                <ArrowRight
                  size={24}
                  className="text-fg-ghost group-hover:text-fg group-hover:-rotate-45 transition-all duration-300"
                />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-fg-faint font-mono">
          No posts in this category yet.
        </div>
      )}
    </div>
  );
};
