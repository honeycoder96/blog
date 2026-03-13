import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state !== 'idle') return;
    setState('loading');
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setState('success');
  };

  return (
    <section className="py-24 px-8 lg:px-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="font-mono text-xs text-fg-faint uppercase tracking-widest mb-4 block">
            Newsletter
          </span>
          <h2 className="text-4xl font-display font-bold text-fg tracking-tight mb-4">
            Stay in the loop
          </h2>
          <p className="text-fg-muted leading-relaxed mb-8">
            New articles about architecture, deep dives, and engineering culture — delivered when
            they're ready, not on a fixed schedule.
          </p>

          <AnimatePresence mode="wait">
            {state === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-green-400 font-mono text-sm"
              >
                <Check size={16} />
                You're subscribed. Welcome aboard.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex gap-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-surface-raised border border-line rounded-full px-6 py-3 text-fg placeholder-fg-faint font-mono text-sm outline-none focus:border-line-strong transition-colors"
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="px-6 py-3 bg-fg text-surface rounded-full font-mono text-sm uppercase tracking-widest hover:opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {state === 'loading' ? '...' : 'Subscribe'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
