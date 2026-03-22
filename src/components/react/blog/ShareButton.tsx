import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title }) => {
  const [state, setState] = useState<'idle' | 'copied'>('idle');

  const handle = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handle}
      aria-label="Share this post"
      className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-fg-faint hover:text-fg transition-colors cursor-pointer"
    >
      {state === 'copied' ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
          Share
        </>
      )}
    </button>
  );
};
