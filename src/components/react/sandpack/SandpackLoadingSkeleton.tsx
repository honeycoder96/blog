import React from 'react';

export const SandpackLoadingSkeleton: React.FC = () => (
  <div className="flex flex-col md:flex-row flex-1 h-full gap-px bg-line">
    {/* Editor skeleton */}
    <div className="flex-[3] bg-surface-inset p-4 flex flex-col gap-3">
      <div className="h-3 w-24 bg-line rounded animate-pulse" />
      <div className="h-3 w-48 bg-line rounded animate-pulse" />
      <div className="h-3 w-36 bg-line rounded animate-pulse" />
      <div className="h-3 w-56 bg-line rounded animate-pulse" />
      <div className="h-3 w-32 bg-line rounded animate-pulse" />
      <div className="h-3 w-44 bg-line rounded animate-pulse" />
      <div className="h-3 w-28 bg-line rounded animate-pulse" />
    </div>
    {/* Preview/console skeleton */}
    <div className="flex-[2] bg-surface-inset p-4 flex flex-col gap-3">
      <div className="h-3 w-20 bg-line rounded animate-pulse" />
      <div className="h-3 w-40 bg-line rounded animate-pulse" />
      <div className="h-3 w-32 bg-line rounded animate-pulse" />
    </div>
  </div>
);
