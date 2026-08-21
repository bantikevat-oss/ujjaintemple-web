import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          // Content JSON is pulled in by eager import.meta.globs, so it lands in whatever
          // chunk imports it. It MUST be split by consumer, not lumped together:
          //
          // The 183 full mandir records (1.4 MB) are read by exactly one module,
          // pages/mandirs/Detail.tsx, which is now behind a lazy route. Article JSON is
          // read by the landing pages, which are eager. While both shared ONE manual
          // chunk, the eager half kept the whole chunk in the entry graph and Vite
          // modulepreloaded all 395 KB gzipped on EVERY page — home page included —
          // for a site whose copy is already baked into the SSG HTML.
          //
          // Keeping them apart lets 'content-mandirs' become a genuinely async chunk
          // that only the temple detail pages fetch.
          if (id.includes('/src/content/mandirs/')) {
            return 'content-mandirs';
          }
          if (id.includes('/src/content/')) {
            return 'content-articles';
          }
        },
      },
    },
  },
  ssgOptions: {
    script: 'defer',
    formatting: 'minify',
    crittersOptions: {
      preload: 'media',
      pruneSource: true,
    },
  },
} as any);
