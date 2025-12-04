// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        // internalize all dependencies except zlib-sync
        external: ['zlib-sync'], 
      },
    },
    ssr: {
      external: ['zlib-sync'], 
    },
    optimizeDeps: {
      exclude: ['zlib-sync'] 
    }
  },

  adapter: cloudflare()
});