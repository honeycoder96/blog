import React, { useCallback, useState } from 'react';

interface RunDemoProps {
  id: string;
  label?: string;
}

export const RunDemo: React.FC<RunDemoProps> = ({ id, label = 'Run this demo' }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (clicked) return;
    setClicked(true);
    window.dispatchEvent(
      new CustomEvent('sandpack:open', { detail: { id } })
    );
    setTimeout(() => setClicked(false), 500);
  }, [id, clicked]);

  return (
    <div className="my-6 not-prose">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line-strong bg-surface-raised text-fg-muted hover:text-fg hover:border-fg-faint font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
        aria-label={`Open interactive demo: ${label}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        {clicked ? 'Opening...' : label}
      </button>
    </div>
  );
};
