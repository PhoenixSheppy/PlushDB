"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const MAX_TILT = 10;

export function TiltCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      rotateX: ((centerY - y) / centerY) * MAX_TILT,
      rotateY: ((x - centerX) / centerX) * MAX_TILT,
      scale: 1.02,
    });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  }

  function handleLeave() {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }

  const isResting = tilt.scale === 1 && tilt.rotateX === 0 && tilt.rotateY === 0;

  return (
    <div className="h-full [perspective:900px]">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`relative h-full will-change-transform ${className}`}
        style={{
          transform: enabled
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`
            : undefined,
          transition: isResting ? "transform 0.45s ease-out" : "transform 0.08s ease-out",
        }}
      >
        {children}
        {enabled && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              opacity: glare.opacity * 0.12,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(143, 163, 214, 0.45), transparent 55%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
