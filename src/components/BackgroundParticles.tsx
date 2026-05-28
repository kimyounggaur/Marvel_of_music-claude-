import React, { useEffect, useRef } from 'react';

const SYMBOLS = ['♩','♪','♫','♬','✦','✧','⭐','★'];
const COLORS = ['#ffd700','#b388ff','#80deea','#f48fb1','#a5d6a7'];

interface Orb {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; symbol: string; color: string;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const orbs: Orb[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.2),
      size: Math.random() * 14 + 8,
      opacity: Math.random() * 0.35 + 0.08,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const o of orbs) {
        o.x += o.vx; o.y += o.vy;
        if (o.y < -30) { o.y = h + 10; o.x = Math.random() * w; }
        if (o.x < -30) o.x = w + 10;
        if (o.x > w + 30) o.x = -10;
        ctx.globalAlpha = o.opacity;
        ctx.fillStyle = o.color;
        ctx.font = `${o.size}px serif`;
        ctx.fillText(o.symbol, o.x, o.y);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:0.6 }} />;
};
