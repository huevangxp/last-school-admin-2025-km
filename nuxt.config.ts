// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Admin',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@100..900&family=Teko:wght@300..700&family=Volkhov:ital,wght@0,400;0,700;1,400;1,700&display=swap',
        },
      ],
    },
  },
  compatibilityDate: '2025-012-16',
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  plugins: ['~/plugins/axios.ts'
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

   i18n: {
    locales: [
      { code: 'en', name: 'English' , file: 'en.json', flag: '/eng.png'  },
      { code: 'la', name: 'Lao' , file: 'la.json', flag: '/lao.png'},
    ],
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts'
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    define: {
      'chrome': 'undefined',
      'browser': 'undefined'
    }
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  },
})
