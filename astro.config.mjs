// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL || "https://david.gardiner.net.au/",
  integrations: [sitemap(), mdx()],
  experimental: {
  },
  build: {
    format: 'preserve'
  }
});