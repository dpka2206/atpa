"use client";

import { useMemo, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface BlurTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  direction?: "top" | "bottom";
  delay?: number;
  stepDuration?: number;
  threshold?: number;
  mutedLine?: string;
  /** Replay word reveal when scrolling back into view. */
  replay?: boolean;
}

export function BlurText({
  text,
  className = "",
  as: Tag = "h2",
  direction = "bottom",
  delay = 0,
  stepDuration = 0.32,
  threshold = 0.18,
  mutedLine,
  replay = true,
}: BlurTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const words = useMemo(() => text.trim().split(/\s+/), [text]);
  const mutedWords = useMemo(
    () => (mutedLine ? mutedLine.trim().split(/\s+/) : []),
    [mutedLine],
  );

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const spans = el.querySelectorAll<HTMLElement>("[data-blur-word]");

      if (reduced) {
        gsap.set(spans, {
          clearProps: "all",
          autoAlpha: 1,
          filter: "none",
          y: 0,
        });
        return;
      }

      const yFrom = direction === "top" ? -36 : 36;
      const startPct = (1 - threshold) * 100;

      gsap.set(spans, {
        autoAlpha: 0,
        filter: "blur(12px)",
        y: yFrom,
      });

      const tween = gsap.to(spans, {
        autoAlpha: 1,
        filter: "blur(0px)",
        y: 0,
        duration: stepDuration * 2,
        delay,
        ease: "power3.out",
        stagger: stepDuration * 0.42,
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
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
        text,
        mutedLine,
        direction,
        delay,
        stepDuration,
        threshold,
        replay,
      ],
    },
  );

  const renderWords = (list: string[], muted = false) =>
    list.map((word, i) => (
      <span
        key={`${muted ? "m" : "p"}-${word}-${i}`}
        data-blur-word
        className="inline-block will-change-[transform,filter,opacity]"
      >
        {word}
        {i < list.length - 1 ? "\u00A0" : ""}
      </span>
    ));

  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={className}
      aria-label={mutedLine ? `${text} ${mutedLine}` : text}
    >
      <span className="flex flex-wrap" aria-hidden="true">
        {renderWords(words)}
      </span>
      {mutedWords.length > 0 ? (
        <span className="mt-1 flex flex-wrap text-ink/40" aria-hidden="true">
          {renderWords(mutedWords, true)}
        </span>
      ) : null}
    </Component>
  );
}
