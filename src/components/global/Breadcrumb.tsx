import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb { label: string; href?: string }
interface Props { items: Crumb[]; }

export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-3 pb-1">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-mute sm:text-sm">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-maroon" aria-label="Home">
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-cream-dark" aria-hidden />
            {it.href && i !== items.length - 1 ? (
              <Link to={it.href} className="hover:text-maroon">{it.label}</Link>
            ) : (
              <span className="font-medium text-ink" aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
