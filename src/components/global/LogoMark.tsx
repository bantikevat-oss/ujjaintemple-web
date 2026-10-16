/**
 * UjjainTemple emblem — nagara shikhar with kesariya dhwaja, trishul in the garbhagriha
 * doorway, and the Shipra as a wave under the plinth, inside an antique-gold arc.
 *
 * Drawn by hand (2026-10-16) from the concept in brand/2026-10-09_ujjaintemple-logo-gemini-raw.png,
 * whose raster had a painted "Text" artefact and a navy palette. Colours are the UT lane in
 * BRAND-THEMES.md (brick-maroon · burnt saffron · antique gold · cream) — navy + gold is
 * ByteFlow's corporate identity and does not belong on this site.
 *
 * public/favicon.svg mirrors this by hand: change one, change the other.
 */
interface Props {
  className?: string;
  /** Accessible name; omit when the mark sits next to the visible wordmark. */
  title?: string;
}

export function LogoMark({ className = 'h-10 w-10', title }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* gold arc, open at the bottom where the river runs */}
      <path d="M13.2 46.5 A22 22 0 1 1 50.8 46.5" stroke="#C9A84C" strokeWidth="2.4" strokeLinecap="round" />
      {/* dhwaja */}
      <path d="M32 13.5 V3.5" stroke="#8B1A1A" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32.6 3.8 L42.5 6.6 L32.6 9.6 Z" fill="#D4621A" />
      {/* side shikhars */}
      <path d="M12.5 46 V40.5 C12.5 37 14.4 33.5 16.75 30.5 C19.1 33.5 21 37 21 40.5 V46 Z" fill="#8B1A1A" />
      <path d="M43 46 V40.5 C43 37 44.9 33.5 47.25 30.5 C49.6 33.5 51.5 37 51.5 40.5 V46 Z" fill="#8B1A1A" />
      {/* main shikhar */}
      <path d="M22.5 46 V38.5 C22.5 30.5 26.5 21.5 32 14 C37.5 21.5 41.5 30.5 41.5 38.5 V46 Z" fill="#8B1A1A" />
      {/* amalaka + kalash */}
      <circle cx="32" cy="14" r="2.1" fill="#C9A84C" />
      {/* bhumi bands on the spire */}
      <path d="M27.6 25.5 H36.4 M25 32 H39" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round" />
      {/* garbhagriha doorway */}
      <path d="M27.6 46 V41 A4.4 4.4 0 0 1 36.4 41 V46 Z" fill="#FBF5EC" />
      {/* trishul */}
      <path
        d="M32 45.5 V39.2 M29.6 39.6 C29.6 41.4 30.6 42.2 32 42.2 C33.4 42.2 34.4 41.4 34.4 39.6"
        stroke="#8B1A1A" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* plinth */}
      <rect x="10.5" y="46" width="43" height="2.6" rx="0.8" fill="#C9A84C" />
      {/* Shipra */}
      <path d="M7 54 C14 50.5 20 57.5 27 54 S40 50.5 47 54 S55 56.5 58 54.5" stroke="#D4621A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 59 C20 56.5 25 61.5 32 59 S44 56.5 50 59" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
