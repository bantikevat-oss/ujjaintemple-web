/**
 * MandalaDivider — subtle cultural ornament between sections.
 * Gold lotus motif flanked by hairlines. Used to break editorial flow with restraint.
 */
export function MandalaDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`mx-auto flex items-center justify-center gap-4 py-8 sm:py-10 ${className}`}>
      <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-gold/40" />
      <svg
        viewBox="0 0 48 48"
        width="32"
        height="32"
        className="text-gold-600"
        fill="currentColor"
      >
        {/* 8-petal mandala (simple but elegant) */}
        <g transform="translate(24 24)">
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-10"
              rx="3"
              ry="9"
              opacity="0.7"
              transform={`rotate(${i * 45})`}
            />
          ))}
          <circle r="3.5" fill="currentColor" opacity="0.9" />
          <circle r="1.5" fill="#FBF5EC" />
        </g>
      </svg>
      <div className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}
