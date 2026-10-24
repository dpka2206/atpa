"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/tournaments", label: "Tournaments" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/email-logs", label: "Email logs" },
  { href: "/admin/users", label: "Users & roles" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-ink/10 bg-ink text-white">
      <div className="border-b border-white/10 px-4 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white ring-2 ring-white/20">
            <Image
              src="/logos/atpa.jpg"
              alt="ATPA"
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </span>
          <span>
            <span className="block font-display text-lg leading-tight tracking-tight">
              ATPA Admin
            </span>
            <span className="mt-0.5 block text-[11px] text-white/55">
              Tournament operations
            </span>
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-white/15 font-semibold text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-white/10 p-3">
        <Link
          href="/"
          className="block rounded-md px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white"
        >
          ← Public site
        </Link>
        <p className="px-3 pb-2 text-[11px] leading-relaxed text-white/40">
          Powered by{" "}
          <a
            href="https://editcomedia.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            editcomedia.com
          </a>
        </p>
      </div>
    </aside>
  );
}
