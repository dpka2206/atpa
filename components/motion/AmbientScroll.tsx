"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Soft floating orbs that drift with scroll — keeps the page feeling alive
 * between section reveals.
 */
export function AmbientScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const orbs = root.querySelectorAll<HTMLElement>("[data-orb]");
    const tweens: gsap.core.Tween[] = [];

    orbs.forEach((orb, i) => {
      tweens.push(
        gsap.to(orb, {
          y: i % 2 === 0 ? -120 : 140,
          x: i % 2 === 0 ? 40 : -50,
          rotate: i % 2 === 0 ? 18 : -12,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2 + i * 0.2,
          },
        }),
      );

      tweens.push(
        gsap.to(orb, {
          opacity: 0.55,
          duration: 3.5 + i,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.4,
        }),
      );
    });

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        data-orb
        className="absolute -left-20 top-[18%] h-64 w-64 rounded-full bg-leaf/10 blur-3xl"
      />
      <div
        data-orb
        className="absolute -right-16 top-[48%] h-72 w-72 rounded-full bg-sun/15 blur-3xl"
      />
      <div
        data-orb
        className="absolute left-[35%] top-[72%] h-56 w-56 rounded-full bg-accent-bright/10 blur-3xl"
      />
    </div>
  );
}
