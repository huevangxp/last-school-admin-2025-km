// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  css: ["~/assets/css/global.css"],
  app: {
    head: {
      title: "Admin",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Lao:wght@100..900&family=Teko:wght@300..700&family=Volkhov:ital,wght@0,400;0,700;1,400;1,700&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2025-012-16",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // API server origin (serves both /api and /uploads). Nuxt auto-overrides
      // this from the NUXT_PUBLIC_API_BASE env var in production.
      apiBase: "http://localhost:4000",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  plugins: ["~/plugins/axios.ts"],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json", flag: "/eng.png" },
      { code: "la", name: "Lao", file: "la.json", flag: "/lao.png" },
    ],
    defaultLocale: "la",
    vueI18n: "./i18n.config.ts",
  },

  devServer: {
    port: 3000,
  },

  // Dev-only: forward same-origin API/upload calls to the Express server so the
  // admin works whether you open it directly (:3000) or via the proxy/ngrok.
  // (Through the :8080 proxy these prefixes never reach Nuxt; this covers :3000.)
  nitro: {
    devProxy: {
      // changeOrigin rewrites Host; headers.origin blanks the browser Origin so
      // the API server's strict CORS treats tunnelled (ngrok) calls as
      // same-origin instead of rejecting the unknown origin with a 500.
      "/api": {
        target: "http://localhost:4000/api",
        changeOrigin: true,
        headers: { origin: "" },
      },
      "/uploads": {
        target: "http://localhost:4000/uploads",
        changeOrigin: true,
        headers: { origin: "" },
      },
    },
  },

  // Allow tunnelled hosts (ngrok) to reach the Vite dev server in dev.
  vite: {
    server: {
      allowedHosts: true,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
