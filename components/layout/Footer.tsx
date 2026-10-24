import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

const columns = [
  {
    title: "Association",
    links: [
      { href: "/about", label: "About ATPA" },
      { href: "/news", label: "News" },
      { href: "/contact", label: "Contact" },
      { href: "/players", label: "Membership" },
    ],
  },
  {
    title: "Compete",
    links: [
      { href: "/tournaments", label: "Tournaments" },
      { href: "/register", label: "Register" },
      { href: "/rankings", label: "Rankings" },
      { href: "/clubs", label: "Clubs & courts" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="container-max section-pad !pb-10 !pt-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/atpa.jpg"
                alt={`${site.shortName} logo`}
                width={44}
                height={46}
                className="h-10 w-auto rounded-md bg-white"
              />
              <div>
                <p className="text-sm font-semibold tracking-wide text-sun">
                  {site.shortName}
                </p>
                <p className="text-xs text-white/40">{site.name}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/45">
              Promoting pickleball through tournaments, player development and
              community participation across Telangana.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/55 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="mt-16 select-none text-[clamp(4rem,18vw,12rem)] font-semibold leading-none tracking-[-0.06em] text-white/[0.06]"
          aria-hidden
        >
          ATPA
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <address className="text-xs not-italic text-white/35">
            {site.contact.address} ·{" "}
            <a href={`mailto:${site.contact.email}`} className="hover:text-white/60">
              {site.contact.email}
            </a>{" "}
            · {site.contact.phone}
          </address>
          <div className="flex flex-wrap items-center gap-5 text-xs text-white/35">
            <Link href="/privacy" className="hover:text-white/60">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/60">
              Terms
            </Link>
            <span>© 2026 ATPA</span>
            <a
              href="https://editcomedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60"
            >
              Powered by EditCo Media
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
