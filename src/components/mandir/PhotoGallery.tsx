import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER = '/images/mandir-placeholder.svg';

interface Props { photos: string[]; alt: string; }

export function PhotoGallery({ photos, alt }: Props) {
  const [active, setActive] = useState<number | null>(null);

  // Filter out placeholder/missing photos so the gallery only renders real images
  const realPhotos = photos.filter((p) => p && !p.includes('placeholder'));
  if (!realPhotos.length) return null;

  const close = () => setActive(null);
  const next = () => setActive((i) => (i === null ? 0 : (i + 1) % realPhotos.length));
  const prev = () => setActive((i) => (i === null ? 0 : (i - 1 + realPhotos.length) % realPhotos.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {realPhotos.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className="group relative aspect-square overflow-hidden rounded-md bg-cream-dark"
            aria-label={`View photo ${i + 1}`}
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              decoding="async"
              width={300}
              height={300}
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.endsWith(PLACEHOLDER)) img.src = PLACEHOLDER;
              }}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4" role="dialog" aria-modal="true" onClick={close}>
          <button onClick={close} aria-label="Close" className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-2 sm:left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img src={realPhotos[active]} alt={`${alt} ${active + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain" />
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-2 sm:right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
