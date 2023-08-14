import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [vue()],
  adapter: netlify()
});