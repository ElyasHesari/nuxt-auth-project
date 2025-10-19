export default {
  // Global page headers
  head: {
    title: 'Authentication App',
    htmlAttrs: {
      lang: 'fa',
      dir: 'rtl'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt Firebase Authentication' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS
  css: [
  ],

  // Plugins to run before rendering page
  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/vuelidate.js'
  ],

  // Auto import components
  components: true,

  // Modules for dev and build
  buildModules: [
  ],

  // Modules
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  // Bootstrap Vue configuration
  bootstrapVue: {
    bootstrapCSS: true,
    bootstrapVueCSS: true
  },

  // Axios module configuration
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },

  // Router middleware
  router: {
    middleware: []
  },

  // Build Configuration
  build: {
  },

  // Environment variables
  publicRuntimeConfig: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID
  },

  privateRuntimeConfig: {
  }
}