import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categoryMeta: Record<string, { description: string; border: string; borderHover: string; accent: string }> = {
  Architecture: {
    description: 'System design, distributed systems, and the decisions that define your platform.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg',
  },
  'Deep Dive': {
    description: 'Implementation details, internals, and the "how it actually works" explanations.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg-default',
  },
  Engineering: {
    description: 'Process, tooling, team dynamics, and building software at scale.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg-muted',
  },
};

interface Props {
  categoryCounts: Record<string, number>;
}

export const CategoriesSection: React.FC<Props> = ({ categoryCounts }) => {
  const prefersReducedMotion = useReducedMotion();

  const categories = Object.entries(categoryMeta).map(([name, meta]) => ({
    name,
    count: categoryCounts[name] ?? 0,
    ...meta,
  }));

  return (
    <section className="py-24 px-8 lg:px-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-fg tracking-tight mb-3">
            Browse by Category
          </h2>
          <p className="text-fg-muted">Find what you're looking for.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.a
              key={cat.name}
              href={`/blog?category=${cat.name}`}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group p-8 rounded-2xl border bg-surface-raised ${cat.border} ${cat.borderHover} transition-colors duration-300`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className={`font-mono text-xs uppercase tracking-widest ${cat.accent}`}>
                  {cat.count} articles
                </span>
                <ArrowRight
                  size={20}
                  className="text-fg-faint group-hover:text-fg group-hover:-rotate-45 transition-all duration-300"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-fg mb-3">{cat.name}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{cat.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
