"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-ink/[0.06] bg-white/90 px-3 py-2.5 shadow-[0_12px_40px_-20px_rgba(14,26,18,0.35)] backdrop-blur-xl md:px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 pl-1"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logos/atpa.jpg"
            alt={`${site.shortName} logo`}
            width={36}
            height={38}
            className="h-8 w-auto rounded-md"
            priority
          />
          <span className="hidden sm:block">
            <span className="block text-[12px] font-semibold tracking-wide text-leaf">
              {site.shortName}
            </span>
            <span className="block text-[9px] tracking-[0.12em] text-muted uppercase">
              Telangana
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-[13px] font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-sun px-4 py-2 text-[12px] font-semibold text-ink transition hover:bg-sun-deep md:px-5 md:text-[13px]"
          >
            Register
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink lg:hidden"
          >
            <div className="flex w-3.5 flex-col gap-1.5">
              <span
                className={`h-px w-full bg-current transition ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div className="pointer-events-auto mx-auto mt-2 max-w-6xl overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-lg lg:hidden">
          <nav className="flex flex-col px-5 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/[0.05] py-3.5 text-[15px] font-medium text-ink last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
