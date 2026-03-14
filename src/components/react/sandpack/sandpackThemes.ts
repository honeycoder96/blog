import type { SandpackTheme } from '@codesandbox/sandpack-react';

export const darkTheme: SandpackTheme = {
  colors: {
    surface1: '#0a0a0a',
    surface2: '#171717',
    surface3: '#262626',
    clickable: '#a3a3a3',
    base: '#e5e5e5',
    disabled: '#525252',
    hover: '#fafafa',
    accent: '#fafafa',
    error: '#ef4444',
    errorSurface: '#450a0a',
  },
  syntax: {
    plain: '#e5e5e5',
    comment: { color: '#525252', fontStyle: 'italic' },
    keyword: '#c084fc',
    tag: '#7dd3fc',
    punctuation: '#a3a3a3',
    definition: '#67e8f9',
    property: '#fde68a',
    static: '#86efac',
    string: '#86efac',
  },
  font: {
    body: '"Inter", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    size: '14px',
    lineHeight: '1.6',
  },
};

export const lightTheme: SandpackTheme = {
  colors: {
    surface1: '#ffffff',
    surface2: '#f5f5f5',
    surface3: '#e5e5e5',
    clickable: '#737373',
    base: '#1a1a1a',
    disabled: '#d4d4d4',
    hover: '#0a0a0a',
    accent: '#0a0a0a',
    error: '#dc2626',
    errorSurface: '#fef2f2',
  },
  syntax: {
    plain: '#1a1a1a',
    comment: { color: '#a3a3a3', fontStyle: 'italic' },
    keyword: '#7c3aed',
    tag: '#0369a1',
    punctuation: '#737373',
    definition: '#0891b2',
    property: '#a16207',
    static: '#15803d',
    string: '#15803d',
  },
  font: {
    body: '"Inter", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    size: '14px',
    lineHeight: '1.6',
  },
};
