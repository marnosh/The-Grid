"use client";

import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  oldX: number;
  oldY: number;
  oldZ: number;
  pinned: boolean;
  baseX: number;
  baseY: number;
  baseZ: number;
  projX: number;
  projY: number;
  projScale: number;
}

interface Constraint3D {
  p1: Point3D;
  p2: Point3D;
  length: number;
}

export interface NeonMeshProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  neonColor?: string;
  baseMeshColor?: string;
  bgColor?: string;
  shadowEffect?: boolean;
  children?: React.ReactNode;
}

export type NeonMagneticMeshProps = NeonMeshProps;

export function NeonMesh({
  title = "THE GRID",
  subtitle = "HILITE BUSINESS PARK · CALICUT",
  description = "A co-working space that can help you grow your business quickly within your budget.",
  className = "",
  bgColor = "#F6F5FA", // Ghost White
  shadowEffect = true,
  children,
}: NeonMeshProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Interactive mouse camera angles & forces
    const mouse = {
      x: -1000,
      y: -1000,
      targetAngleX: 0.22,
      targetAngleY: -0.28,
      angleX: 0.22,
      angleY: -0.28,
      radius: 180,
    };

    let points: Point3D[] = [];
    let constraints: Constraint3D[] = [];

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initMesh();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      mouse.x = rawX;
      mouse.y = rawY;

      // Subtle responsive 3D tilt tracking mouse
      const normX = (rawX / Math.max(1, width) - 0.5) * 2;
      const normY = (rawY / Math.max(1, height) - 0.5) * 2;
      mouse.targetAngleY = normX * 0.35 - 0.15;
      mouse.targetAngleX = -normY * 0.25 + 0.22;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.targetAngleX = 0.22;
      mouse.targetAngleY = -0.28;
    };

    const initMesh = () => {
      points = [];
      constraints = [];

      // Clean, refined cell spacing (compact architectural grid)
      const spacing = 34;
      const cols = Math.ceil((width * 1.25) / spacing) + 2;
      const rows = Math.ceil((height * 1.25) / spacing) + 2;

      const grid: Point3D[][] = [];
      const startX = -(cols * spacing) / 2;
      const startY = -(rows * spacing) / 2;

      for (let j = 0; j < rows; j++) {
        grid[j] = [];
        for (let i = 0; i < cols; i++) {
          const bx = startX + i * spacing;
          const by = startY + j * spacing;
          const bz = 0;

          const isEdge =
            i === 0 || i === cols - 1 || j === 0 || j === rows - 1;

          const p: Point3D = {
            x: bx,
            y: by,
            z: bz,
            oldX: bx,
            oldY: by,
            oldZ: bz,
            pinned: isEdge,
            baseX: bx,
            baseY: by,
            baseZ: bz,
            projX: 0,
            projY: 0,
            projScale: 1,
          };

          points.push(p);
          grid[j][i] = p;
        }
      }

      // 3D Grid Springs
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          if (i < cols - 1) {
            constraints.push({
              p1: grid[j][i],
              p2: grid[j][i + 1],
              length: spacing,
            });
          }
          if (j < rows - 1) {
            constraints.push({
              p1: grid[j][i],
              p2: grid[j + 1][i],
              length: spacing,
            });
          }
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.022;

      // Smooth camera orientation transition
      mouse.angleX += (mouse.targetAngleX - mouse.angleX) * 0.05;
      mouse.angleY += (mouse.targetAngleY - mouse.angleY) * 0.05;

      const cosX = Math.cos(mouse.angleX);
      const sinX = Math.sin(mouse.angleX);
      const cosY = Math.cos(mouse.angleY);
      const sinY = Math.sin(mouse.angleY);

      const effectiveBgColor = bgColor || "#F6F5FA";

      // Clear canvas with Ghost White background
      ctx.fillStyle = effectiveBgColor;
      ctx.fillRect(0, 0, width, height);

      // Verlet Integration Step with visible, smooth kinetic undulating wave
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;

        const vx = (p.x - p.oldX) * 0.93;
        const vy = (p.y - p.oldY) * 0.93;
        const vz = (p.z - p.oldZ) * 0.93;

        p.oldX = p.x;
        p.oldY = p.y;
        p.oldZ = p.z;

        p.x += vx;
        p.y += vy;
        p.z += vz;

        // Continuous visible organic 3D wave
        const ambientZ =
          Math.sin(p.baseX * 0.011 + p.baseY * 0.011 + time) * 16 +
          Math.cos(p.baseX * 0.007 - time * 0.9) * 9;

        // Restoration anchor force
        p.x += (p.baseX - p.x) * 0.04;
        p.y += (p.baseY - p.y) * 0.04;
        p.z += (p.baseZ + ambientZ - p.z) * 0.04;
      }

      // 3D Projection Calculation
      const perspective = 560;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // 3D Y Rotation
        const rx1 = p.x * cosY + p.z * sinY;
        const ry1 = p.y;
        const rz1 = -p.x * sinY + p.z * cosY;

        // 3D X Pitch Rotation
        const rx2 = rx1;
        const ry2 = ry1 * cosX - rz1 * sinX;
        const rz2 = ry1 * sinX + rz1 * cosX + 480;

        // Perspective Scale Factor
        const scale = perspective / Math.max(20, rz2);
        p.projScale = scale;
        p.projX = centerX + rx2 * scale;
        p.projY = centerY + ry2 * scale;

        // Screen-space 3D Interactive Force (mouse ripple response)
        if (!p.pinned && mouse.x > -500) {
          const dx = p.projX - mouse.x;
          const dy = p.projY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 14;
            const angle = Math.atan2(dy, dx);
            p.x += (Math.cos(angle) * force) / p.projScale;
            p.y += (Math.sin(angle) * force) / p.projScale;
            p.z -= (force * 1.4) / p.projScale;
          }
        }
      }

      // Constraint Relaxation Solver
      for (let iter = 0; iter < 3; iter++) {
        for (let i = 0; i < constraints.length; i++) {
          const c = constraints[i];
          const dx = c.p2.x - c.p1.x;
          const dy = c.p2.y - c.p1.y;
          const dz = c.p2.z - c.p1.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const delta = (dist - c.length) / (dist || 1);

          if (!c.p1.pinned) {
            c.p1.x += dx * 0.5 * delta;
            c.p1.y += dy * 0.5 * delta;
            c.p1.z += dz * 0.5 * delta;
          }
          if (!c.p2.pinned) {
            c.p2.x -= dx * 0.5 * delta;
            c.p2.y -= dy * 0.5 * delta;
            c.p2.z -= dz * 0.5 * delta;
          }
        }
      }

      // Render Mesh Lines
      ctx.save();
      for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];

        // Bounds clipping check
        if (
          (c.p1.projX < -40 && c.p2.projX < -40) ||
          (c.p1.projX > width + 40 && c.p2.projX > width + 40) ||
          (c.p1.projY < -40 && c.p2.projY < -40) ||
          (c.p1.projY > height + 40 && c.p2.projY > height + 40)
        ) {
          continue;
        }

        const midX = (c.p1.projX + c.p2.projX) / 2;
        const midY = (c.p1.projY + c.p2.projY) / 2;

        const dx = mouse.x - midX;
        const dy = mouse.y - midY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHot = dist < mouse.radius;
        const avgScale = (c.p1.projScale + c.p2.projScale) / 2;

        // Subtle shadow line for tactile 3D depth (decreased opacity)
        if (shadowEffect) {
          ctx.strokeStyle = isHot
            ? "rgba(33, 33, 33, 0.04)"
            : `rgba(33, 33, 33, ${Math.min(0.025, 0.015 * avgScale)})`;
          ctx.lineWidth = Math.max(0.6, (isHot ? 1.1 : 0.75) * avgScale);
          ctx.beginPath();
          ctx.moveTo(c.p1.projX + 1.0, c.p1.projY + 1.0);
          ctx.lineTo(c.p2.projX + 1.0, c.p2.projY + 1.0);
          ctx.stroke();
        }

        // Primary grid wireframe line (decreased opacity: delicate, light charcoal tint)
        ctx.strokeStyle = isHot
          ? "rgba(33, 33, 33, 0.22)"
          : `rgba(33, 33, 33, ${Math.min(0.11, Math.max(0.05, 0.08 * avgScale))})`;
        ctx.lineWidth = Math.max(0.6, (isHot ? 1.1 : 0.75) * avgScale);
        ctx.beginPath();
        ctx.moveTo(c.p1.projX, c.p1.projY);
        ctx.lineTo(c.p2.projX, c.p2.projY);
        ctx.stroke();
      }
      ctx.restore();

      // Render Micro-Nodes for architectural texture (decreased opacity)
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.projX < -20 || p.projX > width + 20 || p.projY < -20 || p.projY > height + 20) {
          continue;
        }

        const dx = mouse.x - p.projX;
        const dy = mouse.y - p.projY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const proximity = 1 - dist / mouse.radius;
          ctx.fillStyle = `rgba(33, 33, 33, ${proximity * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, (1.0 + proximity * 1.2) * p.projScale, 0, Math.PI * 2);
          ctx.fill();

          // Delicate Honeydew accent aura around cursor nodes
          ctx.strokeStyle = `rgba(207, 222, 202, ${proximity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, (2.0 + proximity * 1.5) * p.projScale, 0, Math.PI * 2);
          ctx.stroke();
        } else if (i % 5 === 0) {
          // Subtle blueprint node dots (decreased opacity)
          ctx.fillStyle = `rgba(33, 33, 33, ${Math.min(0.06, 0.035 * p.projScale)})`;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, 0.8 * p.projScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [bgColor, shadowEffect]);

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: bgColor || "#F6F5FA" }}
      className={`relative w-full h-full min-h-[500px] overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block cursor-crosshair w-full h-full"
      />

      {children ? (
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 pointer-events-none text-[#212121] py-16">
          {subtitle && (
            <span className="font-mono text-xs tracking-widest uppercase mb-3 px-3 py-1 rounded-full bg-[#EFF0A3] text-[#212121] font-semibold">
              {subtitle}
            </span>
          )}
          {title && (
            <h1 className="font-mono text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none text-[#212121]">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-4 font-mono text-xs md:text-sm max-w-lg text-[#212121]/80">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default NeonMesh;
