import React from 'react';

/**
 * A single animated skeleton row matching the two-column post/series list layout.
 * Used as a loading placeholder while PostsGrid or SeriesAccordion fetches more items.
 */
export const ListSkeleton: React.FC = () => (
  <div className="border-b border-line py-8 md:py-10 flex flex-col md:flex-row gap-4 animate-pulse">
    <div className="md:w-1/4 flex flex-col gap-3">
      <div className="h-5 w-24 rounded-full bg-line" />
      <div className="h-3 w-16 rounded bg-line" />
    </div>
    <div className="md:w-2/4 flex flex-col gap-2">
      <div className="h-6 w-3/4 rounded bg-line" />
      <div className="h-4 w-full rounded bg-line" />
    </div>
  </div>
);
