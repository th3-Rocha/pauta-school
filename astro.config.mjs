// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  // Endereços antigos (em português) continuam funcionando.
  redirects: {
    "/dia/[day]": "/guitar/day/[day]",
    "/equipamento": "/setup",
  },

  vite: {
    plugins: [tailwindcss()]
  }
});