export interface DemoConfig {
  title: string;
  template?: 'vanilla' | 'react' | 'react-ts' | 'node';
  files: Record<string, { code: string; active?: boolean; hidden?: boolean }>;
  showPreview: boolean;
  dependencies?: Record<string, string>;
  infiniteLoopProtection?: boolean;
}
