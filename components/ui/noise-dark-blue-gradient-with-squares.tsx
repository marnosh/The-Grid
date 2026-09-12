"use client";

import React, { useEffect, useRef } from "react";
type Offset = { x: number; y: number };

const setHiDPICanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const parent = canvas.parentElement;
  const cw = (parent?.clientWidth ?? window.innerWidth) | 0;
  const ch = (parent?.clientHeight ?? window.innerHeight) | 0;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  canvas.width = Math.floor(cw * dpr);
  canvas.height = Math.floor(ch * dpr);
  canvas.style.width = cw + "px";
  canvas.style.height = ch + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const originFromOffset = (offset: Offset, cell: number) => ({
  x: -((offset.x % cell) + cell) % cell,
  y: -((offset.y % cell) + cell) % cell,
});

const Noise: React.FC<{ refresh?: number; alpha?: number }> = ({ refresh = 2, alpha = 18 }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    let f = 0;
    let id = 0;
    const S = 1024;

    const resize = () => {
      c.width = S;
      c.height = S;
      c.style.width = "100vw";
      c.style.height = "100vh";
    };

    const draw = () => {
      const img = ctx.createImageData(S, S);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = alpha;
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = () => {
      if (f % refresh === 0) draw();
      f++;
      id = requestAnimationFrame(loop);
    };

    addEventListener("resize", resize);
    resize();
    loop();
    return () => {
      removeEventListener("resize", resize);
      cancelAnimationFrame(id);
    };
  }, [refresh, alpha]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

interface GridProps {
  squareSize: number;
  borderColor: string;
  vignette?: boolean;
  vignetteColor?: string;
  gridOffsetRef: React.MutableRefObject<Offset>;
  className?: string;
}

const MovingGrid: React.FC<GridProps> = ({
  squareSize,
  borderColor = "rgba(216, 223, 233, 0.75)",
  vignette = false,
  vignetteColor = "transparent",
  gridOffsetRef,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);

      const origin = originFromOffset(gridOffsetRef.current, squareSize);

      ctx.lineWidth = 1;
      ctx.strokeStyle = borderColor;
      // vertical lines
      for (let x = origin.x; x < cw + squareSize; x += squareSize) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, ch);
        ctx.stroke();
      }
      // horizontal lines
      for (let y = origin.y; y < ch + squareSize; y += squareSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(cw, y + 0.5);
        ctx.stroke();
      }

      if (vignette) {
        const grad = ctx.createRadialGradient(
          cw / 2,
          ch / 2,
          0,
          cw / 2,
          ch / 2,
          Math.sqrt(cw * cw + ch * ch) / 2
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, vignetteColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      raf.current = requestAnimationFrame(draw);
    };

    const resize = () => setHiDPICanvas(canvas, ctx);
    resize();
    raf.current = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    return () => {
      removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [squareSize, borderColor, vignette, vignetteColor, gridOffsetRef]);

  return <canvas ref={canvasRef} className={`block h-full w-full border-none ${className}`} />;
};

interface HoverProps {
  squareSize: number;
  hoverFillColor?: string;
  hoverStrokeColor?: string;
  hoverGlowColor?: string;
  gridOffsetRef: React.MutableRefObject<Offset>;
  className?: string;
}

interface TrailItem {
  gx: number;
  gy: number;
  alpha: number;
}

const SquaresInteractive: React.FC<HoverProps> = ({
  squareSize,
  hoverFillColor = "rgba(255, 255, 255, 0.45)",
  hoverStrokeColor = "rgba(255, 255, 255, 0.85)",
  hoverGlowColor = "rgba(255, 255, 255, 0.35)",
  gridOffsetRef,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef<{ x: number; y: number } | null>(null);
  const trailRef = useRef<Map<string, TrailItem>>(new Map());
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.pointerEvents = "none";
    canvas.style.background = "transparent";

    const draw = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);

      const origin = originFromOffset(gridOffsetRef.current, squareSize);

      // If active hovered cell, set/refresh in trail with full alpha 1.0
      if (hoveredRef.current) {
        const { x: gx, y: gy } = hoveredRef.current;
        trailRef.current.set(`${gx},${gy}`, { gx, gy, alpha: 1.0 });
      }

      // Draw each cell in trail
      trailRef.current.forEach((item, key) => {
        const { gx, gy, alpha } = item;
        const cellX = origin.x + gx * squareSize;
        const cellY = origin.y + gy * squareSize;

        if (cellX + squareSize < 0 || cellX > cw || cellY + squareSize < 0 || cellY > ch) {
          trailRef.current.delete(key);
          return;
        }

        // Soft ambient glow behind cell
        ctx.save();
        ctx.shadowBlur = 10 * alpha;
        ctx.shadowColor = `rgba(216, 223, 233, ${0.5 * alpha})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * alpha})`;
        ctx.fillRect(cellX, cellY, squareSize, squareSize);
        ctx.restore();

        // Inner translucent white gradient for subtle contrast
        const grad = ctx.createLinearGradient(cellX, cellY, cellX, cellY + squareSize);
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.55 * alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${0.88 * alpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(cellX, cellY, squareSize, squareSize);

        // Crisp subtle border matching brand card border
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = `rgba(190, 205, 225, ${0.85 * alpha})`;
        ctx.strokeRect(cellX + 0.5, cellY + 0.5, squareSize - 1, squareSize - 1);

        // Decay alpha if not currently directly under cursor
        const isCurrentlyHovered =
          hoveredRef.current &&
          hoveredRef.current.x === gx &&
          hoveredRef.current.y === gy;

        if (!isCurrentlyHovered) {
          item.alpha -= 0.045; // ~22 frames smooth fade out
          if (item.alpha <= 0.01) {
            trailRef.current.delete(key);
          }
        }
      });

      raf.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const origin = originFromOffset(gridOffsetRef.current, squareSize);
        const gx = Math.floor((mouseX - origin.x) / squareSize);
        const gy = Math.floor((mouseY - origin.y) / squareSize);
        hoveredRef.current = { x: gx, y: gy };
      } else {
        hoveredRef.current = null;
      }
    };

    const onMouseLeave = () => {
      hoveredRef.current = null;
    };

    const resize = () => {
      setHiDPICanvas(canvas, ctx);
    };

    resize();
    raf.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [squareSize, hoverFillColor, hoverStrokeColor, hoverGlowColor, gridOffsetRef]);

  return <canvas ref={canvasRef} className={`block h-full w-full border-none pointer-events-none ${className}`} />;
};

/* =========================
   Final combined component
   ========================= */
type Direction = "right" | "left" | "up" | "down" | "diagonal";

interface CombinedProps {
  showGrid?: boolean;
  direction?: Direction;
  speed?: number;
  squareSize?: number;

  // Grid styling
  borderColor?: string;
  vignette?: boolean;
  vignetteColor?: string;
  backgroundColor?: string;
  spotlightGradient?: string;
  bottomGradient?: string;

  // Hover styling
  hoverFillColor?: string;
  hoverStrokeColor?: string;
  hoverGlowColor?: string;

  className?: string;
  children?: React.ReactNode;
}

export default function Component({
  showGrid = true,
  direction = "diagonal",
  speed = 0.08,
  squareSize = 44,
  borderColor = "rgba(216, 223, 233, 0.75)",
  vignette = false,
  vignetteColor = "transparent",
  backgroundColor = "bg-[#F6F5FA]",
  spotlightGradient = "",
  bottomGradient = "",
  hoverFillColor = "rgba(255, 255, 255, 0.70)", 
  hoverStrokeColor = "rgba(190, 205, 225, 0.85)",
  hoverGlowColor = "rgba(216, 223, 233, 0.50)", 
  className = "",
  children,
}: CombinedProps) {
  const gridOffsetRef = useRef<Offset>({ x: 0, y: 0 });
  const raf = useRef<number | undefined>(undefined);

  // Single animation loop for the offset shared by both canvases
  useEffect(() => {
    const tick = () => {
      const v = Math.max(speed, 0.01);
      const s = squareSize;
      switch (direction) {
        case "right":
          gridOffsetRef.current.x = (gridOffsetRef.current.x - v + s) % s;
          break;
        case "left":
          gridOffsetRef.current.x = (gridOffsetRef.current.x + v + s) % s;
          break;
        case "up":
          gridOffsetRef.current.y = (gridOffsetRef.current.y + v + s) % s;
          break;
        case "down":
          gridOffsetRef.current.y = (gridOffsetRef.current.y - v + s) % s;
          break;
        case "diagonal":
        default:
          gridOffsetRef.current.x = (gridOffsetRef.current.x - v + s) % s;
          gridOffsetRef.current.y = (gridOffsetRef.current.y - v + s) % s;
          break;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [direction, speed, squareSize]);

  const hasExplicitPosition =
    className.includes("absolute") ||
    className.includes("fixed") ||
    className.includes("relative");
  const positionClasses = hasExplicitPosition ? "" : "absolute inset-0";

  return (
    <div className={`overflow-hidden ${backgroundColor} ${positionClasses} ${className}`}>
      {/* soft spotlight tone matching site theme if present */}
      {spotlightGradient && (
        <div className={`absolute inset-0 z-0 ${spotlightGradient}`} />
      )}

      {/* grid layer (optional) */}
      {showGrid && (
        <div className="absolute inset-0 z-10">
          <MovingGrid
            squareSize={squareSize}
            borderColor={borderColor}
            vignette={vignette}
            vignetteColor={vignetteColor}
            gridOffsetRef={gridOffsetRef}
          />
        </div>
      )}

      {/* interactive hover cell (always on) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <SquaresInteractive
          squareSize={squareSize}
          hoverFillColor={hoverFillColor}
          hoverStrokeColor={hoverStrokeColor}
          hoverGlowColor={hoverGlowColor}
          gridOffsetRef={gridOffsetRef}
        />
      </div>

      {/* bottom vignette if present */}
      {bottomGradient && (
        <div className={`pointer-events-none absolute inset-0 z-40 ${bottomGradient}`} />
      )}

      {/* Optional nested children */}
      {children && (
        <div className="relative z-50 w-full">
          {children}
        </div>
      )}
    </div>
  );
}

export { Component as NoiseDarkBlueGradientWithSquares };
