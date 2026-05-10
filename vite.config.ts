import { defineConfig } from 'vite';

/**
 * Using `base: './'` so the build works whether GitHub Pages serves it at the
 * root (user/organization site) or under `/repo-name/` (project site).
 * No special handling needed in CI.
 */
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Single CSS + single JS keeps the network request count tiny for a
        // small portfolio. Vite still hashes filenames for cache-busting.
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
