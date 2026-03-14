import React, { useState, useEffect, useRef } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from '@codesandbox/sandpack-react';
import { useTheme } from '../hooks/useTheme';
import { darkTheme, lightTheme } from './sandpackThemes';
import { loadDemo } from '../../../demos/registry';
import { SandpackLoadingSkeleton } from './SandpackLoadingSkeleton';
import type { DemoConfig } from '../../../demos/types';

interface SandpackEditorProps {
  demoId: string;
  onClose: () => void;
}

const SandpackEditor: React.FC<SandpackEditorProps> = ({ demoId, onClose }) => {
  const [config, setConfig] = useState<DemoConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const requestIdRef = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    loadDemo(demoId).then((result) => {
      if (currentRequest !== requestIdRef.current) return;
      if (!result) {
        setError(`Demo not found: ${demoId}`);
      } else {
        setConfig(result);
      }
      setLoading(false);
    });
  }, [demoId]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 border-b border-line">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-faint">Loading...</span>
          <CloseButton onClick={onClose} />
        </div>
        <SandpackLoadingSkeleton />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 border-b border-line">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-faint">Error</span>
          <CloseButton onClick={onClose} />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-fg-muted">
          <p className="text-sm">{error ?? 'Unknown error'}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-line-strong text-fg-muted hover:text-fg font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const sandpackTheme = theme === 'dark' ? darkTheme : lightTheme;
  const visibleFiles = Object.keys(config.files).filter((f) => !config.files[f].hidden);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-line shrink-0">
        <span className="font-display font-bold text-sm text-fg">{config.title}</span>
        <CloseButton onClick={onClose} />
      </div>

      {/* Sandpack */}
      <div className="flex-1 min-h-0">
        <SandpackProvider
          key={`${demoId}-${config.template ?? 'vanilla'}`}
          template={config.template}
          files={config.files}
          theme={sandpackTheme}
          options={{
            autorun: true,
            recompileMode: 'delayed',
            recompileDelay: 500,
            ...(config.infiniteLoopProtection === false && { infiniteLoopProtection: false }),
          }}
        >
          <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0 }}>
            <SandpackCodeEditor
              showTabs={visibleFiles.length > 1}
              showLineNumbers
              wrapContent
              style={{ flexGrow: 3, minWidth: 0 }}
            />
            {config.showPreview ? (
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton
                style={{ flexGrow: 2, minWidth: 0 }}
              />
            ) : (
              <SandpackConsole style={{ flexGrow: 2, minWidth: 0 }} />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-fg-faint hover:text-fg transition-colors p-1 cursor-pointer"
      aria-label="Close playground"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

export default SandpackEditor;
