// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],
  app:{
    head:{
      title: 'Pulse',
      meta:[
        { name: 'description', content: 'Pulse Fitness' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: true
  },
  css: ['~/assets/main.css'],
  postcss:{
    plugins:{
      tailwindcss: {},
      autoprefixer: {},
    }
  },
  runtimeConfig:{
    public:{
      apiBase: 'http://127.0.0.1:8000/',
    },
  },
  plugins:[ '~/plugins/loadingScreen.js' ]
})
