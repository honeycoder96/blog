import { AnimatedTitle } from '../ui/AnimatedTitle';
import { siteConfig } from '../../../config/site';

export const HeroSection: React.FC = () => {
  return (
    <header className="pt-8 pb-20">
      {/* Eyebrow */}
      <p
        className="hero-fade-in font-mono text-xs text-fg-muted uppercase tracking-widest mb-10"
        style={{ animationDelay: '0s' }}
      >
        {siteConfig.siteName}
      </p>

      {/* Title */}
      <AnimatedTitle
        text="Writing about code, systems, and craft."
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-fg leading-[0.9] mb-10 max-w-4xl"
        staggerDelay={0.025}
        as="h1"
      />

      {/* Subtitle */}
      <p
        className="hero-fade-in text-base text-fg-muted max-w-md inline leading-relaxed"
        style={{ animationDelay: '0.9s' }}
      >
        Deep dives into patterns, performance, and engineering culture.
        <br />
        Essays from the trenches of building real products.
      </p>
    </header>
  );
};
