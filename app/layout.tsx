import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.amateurtelanganapickleballassociation.org"),
  title: {
    default: `${site.shortName} | ${site.name}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.mission,
  openGraph: {
    title: site.name,
    description: site.mission,
    type: "website",
    images: [{ url: "/logos/atpa.jpg" }],
  },
  icons: {
    icon: "/logos/atpa.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full antialiased text-ink">{children}</body>
    </html>
  );
}
