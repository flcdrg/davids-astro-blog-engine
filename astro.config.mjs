// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://david.gardiner.net.au/", // "https://aesthetic-gumdrop-a81100.netlify.app/"
  integrations: [],
  experimental: {
  },
  build: {
    format: 'preserve'
  }
});