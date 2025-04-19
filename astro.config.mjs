// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://david.gardiner.net.au/", // "https://aesthetic-gumdrop-a81100.netlify.app/"
  integrations: [sitemap()],
  experimental: {
  },
  build: {
    format: 'preserve'
  }
});