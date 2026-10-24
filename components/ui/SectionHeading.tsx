interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <p
          className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] ${
            light ? "text-white/50" : "text-muted"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-display text-[2.35rem] leading-[1.1] tracking-[-0.03em] md:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-base leading-relaxed md:text-lg ${
            light ? "text-white/55" : "text-muted"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
