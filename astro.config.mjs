// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL || "https://david.gardiner.net.au/",
  integrations: [sitemap({
    serialize(item) {

      // ensure we have a trailing slash for directories
      if (/\d{4}\/{0}/.test(item.url)) {
        item.url += "/";
      } else if (/tags\/{0}/.test(item.url)) {
        item.url += "/";
      }
      return item;
    }
  }), mdx()],
  experimental: {
  },
  build: {
    format: 'file',
  }
});