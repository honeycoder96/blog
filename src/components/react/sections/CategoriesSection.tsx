import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Architecture',
    description: 'System design, distributed systems, and the decisions that define your platform.',
    count: 3,
    gradient: 'from-neutral-700/60 via-neutral-900 to-neutral-950',
    border: 'border-neutral-600',
    borderHover: 'hover:border-neutral-400',
    accent: 'text-white',
  },
  {
    name: 'Deep Dive',
    description: 'Implementation details, internals, and the "how it actually works" explanations.',
    count: 3,
    gradient: 'from-white/[0.06] via-neutral-900 to-black',
    border: 'border-neutral-700',
    borderHover: 'hover:border-neutral-500',
    accent: 'text-neutral-300',
  },
  {
    name: 'Engineering',
    description: 'Process, tooling, team dynamics, and building software at scale.',
    count: 2,
    gradient: 'from-neutral-800/80 to-neutral-950',
    border: 'border-neutral-700/60',
    borderHover: 'hover:border-neutral-500',
    accent: 'text-neutral-400',
  },
];

export const CategoriesSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 px-8 lg:px-24 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-3">
            Browse by Category
          </h2>
          <p className="text-neutral-500">Find what you're looking for.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href={`/blog?category=${cat.name}`}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group p-8 rounded-2xl border bg-gradient-to-br ${cat.gradient} ${cat.border} ${cat.borderHover} transition-colors duration-300`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className={`font-mono text-xs uppercase tracking-widest ${cat.accent}`}>
                  {cat.count} articles
                </span>
                <ArrowRight
                  size={20}
                  className="text-neutral-600 group-hover:text-white group-hover:-rotate-45 transition-all duration-300"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">{cat.name}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{cat.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
