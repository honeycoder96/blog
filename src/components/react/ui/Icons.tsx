/**
 * Inline SVG icons — exact paths from lucide-react, rendered as plain SVG.
 * No forwardRef, no noExternal needed, zero SSR overhead.
 */

interface IconProps {
  size?: number;
  className?: string;
}

const Svg = ({ size = 24, className, children }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ArrowRight = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const X = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
);

export const Search = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.34-4.34" />
  </Svg>
);

export const Check = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const AlertCircle = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </Svg>
);

export const Loader2 = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Svg>
);

export const ChevronDown = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const BookOpen = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </Svg>
);

export const Clock = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Svg>
);

export const Terminal = ({ size, className }: IconProps) => (
  <Svg size={size} className={className}>
    <path d="M12 19h8" />
    <path d="m4 17 6-6-6-6" />
  </Svg>
);
