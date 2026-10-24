import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AmbientScroll } from "@/components/motion/AmbientScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-full flex-col bg-paper">
      <SmoothScroll>
        <AmbientScroll />
        <ScrollProgress />
        <div className="relative z-10 flex min-h-full flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </SmoothScroll>
    </div>
  );
}
