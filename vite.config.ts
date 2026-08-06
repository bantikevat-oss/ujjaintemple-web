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
          // Temple/tour/puja JSON is pulled in by an eager import.meta.glob, so all 183
          // full records land in whatever chunk imports them. Left in the entry chunk
          // they roughly tripled it (166 KB → 438 KB gzipped) and pushed mobile FCP from
          // 3.5s to 4.4s. Splitting them out lets the app shell and the content download
          // in parallel and keeps the content cacheable across navigations.
          if (id.includes('/src/content/')) {
            return 'content';
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
