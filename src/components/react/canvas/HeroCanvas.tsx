import React, { useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const THEME_COLORS: Record<string, { bg: string; particle: string; lineRgb: string }> = {
  dark: { bg: 'rgba(10,10,10,1)', particle: 'rgba(255,255,255,0.2)', lineRgb: '255,255,255' },
  light: { bg: 'rgba(255,255,255,1)', particle: 'rgba(0,0,0,0.15)', lineRgb: '0,0,0' },
};

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const theme = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      x: number; y: number;
      directionX: number; directionY: number;
      size: number;
      baseX: number; baseY: number;
      density: number;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
        this.x = x; this.y = y;
        this.directionX = directionX; this.directionY = directionY;
        this.size = size;
        this.baseX = x; this.baseY = y;
        this.density = Math.random() * 30 + 1;
      }

      draw() {
        const colors = THEME_COLORS[themeRef.current] || THEME_COLORS.dark;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx!.fillStyle = colors.particle;
        ctx!.fill();
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas!.height || this.y < 0) this.directionY = -this.directionY;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const forceX = dx / distance;
          const forceY = dy / distance;
          const maxDist = mouse.radius;
          const force = (maxDist - distance) / maxDist;

          if (distance < mouse.radius) {
            this.x -= forceX * force * this.density;
            this.y -= forceY * force * this.density;
          } else {
            if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 10;
            if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 10;
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      const count = (canvas!.width * canvas!.height) / 9000;
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas!.width - size * 4) + size * 2;
        const y = Math.random() * (canvas!.height - size * 4) + size * 2;
        const dX = Math.random() - 0.5;
        const dY = Math.random() - 0.5;
        particles.push(new Particle(x, y, dX, dY, size));
      }
    };

    const connect = () => {
      const colors = THEME_COLORS[themeRef.current] || THEME_COLORS.dark;
      const w = canvas!.width;
      const h = canvas!.height;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = dx * dx + dy * dy;
          if (dist < (w / 7) * (h / 7)) {
            const opacity = (1 - dist / 20000) * 0.15;
            ctx!.strokeStyle = `rgba(${colors.lineRgb},${opacity})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const colors = THEME_COLORS[themeRef.current] || THEME_COLORS.dark;
      ctx!.fillStyle = colors.bg;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach(p => p.update());
      connect();
    };

    const resize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};
