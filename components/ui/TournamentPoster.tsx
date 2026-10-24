"use client";

import Image from "next/image";
import { hasTournamentImage, tournamentInitials } from "@/lib/tournaments/initials";

type Props = {
  name: string;
  src?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function TournamentPoster({
  name,
  src,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
}: Props) {
  if (hasTournamentImage(src)) {
    return (
      <Image
        src={src!}
        alt={name}
        fill
        priority={priority}
        className={`object-cover ${className}`}
        sizes={sizes}
      />
    );
  }

  const initials = tournamentInitials(name);

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-ink via-ink-soft to-leaf ${className}`}
      aria-label={`${name} poster`}
    >
      <span className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-semibold tracking-tight text-white/95">
        {initials}
      </span>
    </div>
  );
}
