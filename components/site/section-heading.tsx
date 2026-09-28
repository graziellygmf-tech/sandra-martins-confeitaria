export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7c6d]">{eyebrow}</p>}
      <h2 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#292622] sm:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-[#655f58]">{description}</p>}
    </div>
  );
}
