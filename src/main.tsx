import { ViteReactSSG } from 'vite-react-ssg';
import './styles/globals.css';
import { routes } from './routes';

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    // Optional client-side init (analytics queue replay, etc.)
  }
);
