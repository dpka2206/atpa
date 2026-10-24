"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  /** Replay when scrolling back into view (default true). */
  replay?: boolean;
  /** Tie motion to scroll position while in view. */
  scrub?: boolean | number;
}

export function AnimatedContent({
  children,
  className = "",
  distance = 56,
  direction = "vertical",
  reverse = false,
  duration = 0.85,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 0.98,
  threshold = 0.14,
  delay = 0,
  replay = true,
  scrub = false,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el, { clearProps: "all", autoAlpha: 1 });
        return;
      }

      const axis = direction === "horizontal" ? "x" : "y";
      const offset = reverse ? -distance : distance;
      const startPct = (1 - threshold) * 100;

      gsap.set(el, {
        [axis]: offset,
        scale,
        opacity: animateOpacity ? initialOpacity : 1,
        autoAlpha: animateOpacity ? initialOpacity : 1,
      });

      const tween = gsap.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        autoAlpha: 1,
        duration: scrub ? undefined : duration,
        delay: scrub ? 0 : delay,
        ease: scrub ? "none" : ease,
        scrollTrigger: scrub
          ? {
              trigger: el,
              start: "top 92%",
              end: "top 42%",
              scrub: typeof scrub === "number" ? scrub : 0.65,
            }
          : {
              trigger: el,
              start: `top ${startPct}%`,
              end: "bottom top",
              toggleActions: replay
                ? "play reverse play reverse"
                : "play none none none",
            },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    {
      dependencies: [
        reduced,
        distance,
        direction,
        reverse,
        duration,
        ease,
        initialOpacity,
        animateOpacity,
        scale,
        threshold,
        delay,
        replay,
        scrub,
      ],
    },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
