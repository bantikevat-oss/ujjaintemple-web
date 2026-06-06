interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeader({ eyebrow, title, subtitle, center = false }: Props) {
  return (
    <div className={`mb-6 ${center ? 'text-center mx-auto max-w-2xl' : ''}`}>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 mb-1">{eyebrow}</p>}
      <h2 className="font-serif text-2xl font-bold text-maroon sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-base text-ink-soft">{subtitle}</p>}
    </div>
  );
}
