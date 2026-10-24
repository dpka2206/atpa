"use client";

import { motion } from "framer-motion";

/** Classic perforated pickleball — reusable motif */
export function PickleballIcon({
  className = "h-8 w-8",
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill={fill} />
      <g fill="#0B0E13" opacity="0.85">
        <circle cx="20" cy="18" r="3.2" />
        <circle cx="32" cy="14" r="3.2" />
        <circle cx="44" cy="18" r="3.2" />
        <circle cx="14" cy="28" r="3.2" />
        <circle cx="26" cy="26" r="3.2" />
        <circle cx="38" cy="26" r="3.2" />
        <circle cx="50" cy="28" r="3.2" />
        <circle cx="18" cy="40" r="3.2" />
        <circle cx="32" cy="38" r="3.2" />
        <circle cx="46" cy="40" r="3.2" />
        <circle cx="24" cy="50" r="3.2" />
        <circle cx="40" cy="50" r="3.2" />
      </g>
    </svg>
  );
}

export function FloatingPickleballs() {
  const balls = [
    { x: "8%", y: "18%", size: 28, delay: 0, duration: 5.5 },
    { x: "88%", y: "22%", size: 18, delay: 0.8, duration: 4.2 },
    { x: "72%", y: "68%", size: 36, delay: 0.3, duration: 6 },
    { x: "12%", y: "72%", size: 14, delay: 1.2, duration: 4.8 },
    { x: "48%", y: "12%", size: 12, delay: 0.5, duration: 5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {balls.map((b, i) => (
        <motion.div
          key={i}
          className="absolute text-lime"
          style={{ left: b.x, top: b.y, width: b.size, height: b.size }}
          animate={{ y: [0, -14, 0], rotate: [0, 25, 0] }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: b.delay,
          }}
        >
          <PickleballIcon className="h-full w-full opacity-40" fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

/** Soft court-line / hole pattern for backgrounds */
export function CourtPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    >
      <defs>
        <pattern id="pb-holes" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.6" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pb-holes)" />
    </svg>
  );
}
