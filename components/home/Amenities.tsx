"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedContent } from "@/components/motion/AnimatedContent";

const items = [
  {
    id: "events",
    title: "Sanctioned tournaments",
    body: "From grassroots one-dayers to state opens — clear draws, fair officiating, published results.",
    image: "/gallery/IMG-20250226-WA0023.jpg",
  },
  {
    id: "pathways",
    title: "Player pathways",
    body: "Membership, rankings and age-group categories so beginners and veterans share the same ecosystem.",
    image: "/gallery/IMG-20250226-WA0013.jpg",
  },
  {
    id: "courts",
    title: "Clubs & courts map",
    body: "Find affiliated venues and academies across Hyderabad and the wider Telangana network.",
    image: "/gallery/IMG-20250226-WA0006.jpg",
  },
  {
    id: "coaching",
    title: "Coaching workshops",
    body: "Clinics and skill sessions that grow the game at the grassroots — not just at the podium.",
    image: "/gallery/IMG-20250226-WA0016.jpg",
  },
];

export function Amenities() {
  const [active, setActive] = useState(items[0].id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <section className="section-pad bg-cream">
      <div className="container-wide">
        <AnimatedContent>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
            EVERYTHING
            <br />
            YOU NEED.
          </h2>
        </AnimatedContent>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedContent>
            <ul className="space-y-2">
              {items.map((item) => {
                const on = item.id === active;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={`w-full rounded-[1.25rem] px-5 py-4 text-left transition ${
                        on
                          ? "bg-ink text-white"
                          : "bg-transparent text-ink hover:bg-mist/70"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            on ? "bg-lime text-ink" : "bg-mist text-slate"
                          }`}
                        >
                          {on ? "●" : "○"}
                        </span>
                        <span className="font-display text-lg font-bold md:text-xl">
                          {item.title}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {on ? (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-11 text-sm leading-relaxed text-white/70"
                          >
                            <span className="mt-2 block pb-1">{item.body}</span>
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </AnimatedContent>

          <AnimatedContent delay={0.1}>
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-mist">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
