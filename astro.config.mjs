import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import netlify from "@astrojs/netlify/functions";

export default defineConfig({
  output: 'server',
  integrations: [vue()],
  adapter: netlify(),
  // redirects: {
  //   "/": "/mantenimiento",
  //   "/admin": "/mantenimiento",
  //   "/admin/carteles": "/mantenimiento",
  //   "/admin/facturas": "/mantenimiento",
  //   "/admin/inicio": "/mantenimiento",
  //   "/admin/registros": "/mantenimiento",
  //   "/registro": "/mantenimiento",
  // }
  redirects: {
    "/registro/cartel" : "/"
  }
});