import React, { useState, useEffect } from 'react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface RelatedPost {
  slug: string;
  title: string;
  category: string;
}

interface Props {
  headings: Heading[];
  relatedPosts: RelatedPost[];
}

export const MobileSidebar: React.FC<Props> = ({ headings, relatedPosts }) => {
  const [open, setOpen] = useState(false);
  const filtered = headings.filter((h) => h.depth <= 2);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (filtered.length === 0 && relatedPosts.length === 0) return null;

  const handleLinkClick = (slug: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <>
      {/* Floating button — only visible below xl */}
      <button
        onClick={() => setOpen(true)}
        className="xl:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-fg text-surface flex items-center justify-center shadow-lg cursor-pointer"
        aria-label="Open table of contents"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="9" y2="18" />
        </svg>
      </button>

      {/* Backdrop — always in DOM, opacity controlled by state */}
      <div
        onClick={() => setOpen(false)}
        className={`xl:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sheet — always in DOM, translate controlled by state */}
      <div
        className={`xl:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="sticky top-0 bg-surface pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-line-strong" />
        </div>

        <div className="px-6 pb-8">
          {/* TOC section */}
          {filtered.length > 0 && (
            <nav>
              <p className="text-xs font-mono uppercase tracking-widest text-fg-faint mb-3">
                On this page
              </p>
              <ul className="flex flex-col gap-1.5">
                {filtered.map((heading) => (
                  <li key={heading.slug}>
                    <button
                      onClick={() => handleLinkClick(heading.slug)}
                      className={`text-left text-sm leading-relaxed transition-colors py-0.5 text-fg-muted hover:text-fg cursor-pointer ${
                        heading.depth === 2 ? 'pl-3' : ''
                      }`}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Related Reading section */}
          {relatedPosts.length > 0 && (
            <nav className={filtered.length > 0 ? 'mt-8 pt-6 border-t border-line-faint' : ''}>
              <p className="text-xs font-mono uppercase tracking-widest text-fg-faint mb-3">
                Related Reading
              </p>
              <ul className="flex flex-col gap-3">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <a
                      href={`/blog/${related.slug}`}
                      className="group block"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-[10px] font-mono text-fg-faint uppercase tracking-wider block mb-0.5">
                        {related.category}
                      </span>
                      <span className="text-sm text-fg-muted group-hover:text-fg transition-colors leading-snug block">
                        {related.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </>
  );
};
