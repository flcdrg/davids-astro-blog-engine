// @ts-check
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://aesthetic-gumdrop-a81100.netlify.app/",
  integrations: [preact()]
});