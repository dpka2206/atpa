interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="border-b border-ink/[0.06] bg-paper pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="container-max px-5 md:px-8 lg:px-14">
        {eyebrow ? (
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl font-display text-4xl leading-[1.1] tracking-[-0.03em] text-ink md:text-5xl lg:text-6xl text-balance">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
