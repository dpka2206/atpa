"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Thin top progress bar that tracks page scroll continuously. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px] bg-transparent"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-leaf via-accent-bright to-sun"
      />
    </div>
  );
}
