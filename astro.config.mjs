// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL || "https://david.gardiner.net.au/",
  integrations: [sitemap({
    serialize(item) {

      // ensure we have no trailing slash for files
      item.url = item.url.replace(/\/$/, '');
      
      return item;
    }
  }), mdx()],
  experimental: {
  },
  build: {
    format: 'file',
  }
});