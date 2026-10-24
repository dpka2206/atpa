"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface MediaRevealProps {
  children: ReactNode;
  className?: string;
  parallax?: boolean;
  scrubScale?: boolean;
}

export function MediaReveal({
  children,
  className = "",
  parallax = true,
  scrubScale = true,
}: MediaRevealProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const media = mediaRef.current;
      if (!trigger || !media) return;

      if (reduced) {
        gsap.set(media, { clearProps: "all", autoAlpha: 1 });
        return;
      }

      const reveal = gsap.fromTo(
        media,
        {
          clipPath: "inset(16% 16% 16% 16%)",
          scale: 1.06,
          autoAlpha: 0.65,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top 88%",
            end: "top 45%",
            scrub: 0.7,
          },
        },
      );

      const tweens: gsap.core.Tween[] = [reveal];

      if (parallax) {
        tweens.push(
          gsap.to(media, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }),
        );
      }

      if (scrubScale) {
        const img = media.querySelector("img");
        if (img) {
          tweens.push(
            gsap.fromTo(
              img,
              { scale: 1.14 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.85,
                },
              },
            ),
          );
        }
      }

      return () => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    },
    { dependencies: [reduced, parallax, scrubScale] },
  );

  return (
    <div ref={triggerRef} className={className}>
      <div ref={mediaRef} className="overflow-hidden will-change-transform">
        {children}
      </div>
    </div>
  );
}
