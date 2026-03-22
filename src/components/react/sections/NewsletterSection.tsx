import React, { useState } from 'react';
import { Check } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state !== 'idle') return;
    setState('loading');
    await new Promise((r) => setTimeout(r, 1200));
    setState('success');
  };

  return (
    <section className="py-24 px-8 lg:px-24 border-t border-line-faint">
      <div className="max-w-7xl mx-auto">
        {/* animate-fade-slide-up plays once on mount via CSS @keyframes */}
        <div className="max-w-2xl animate-fade-slide-up">
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

          {/* Form / success swap */}
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className={`flex gap-3 transition-opacity duration-300 ${
                state === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
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
            </form>

            <div
              className={`absolute inset-0 flex items-center gap-3 text-green-400 font-mono text-sm transition-[opacity,transform] duration-300 ${
                state === 'success'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <Check size={16} />
              You're subscribed. Welcome aboard.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
