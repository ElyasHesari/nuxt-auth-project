export default {
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

  css: [
    '~/assets/css/main.css'
  ],

  plugins: [
    '~/plugins/firebase.js',
    '~/plugins/vuelidate.js',
    { src: '~/plugins/auth-persistence.js', mode: 'client' },
    { src: '~/plugins/localStorage.js', mode: 'client' }
  ],

  components: true,

  buildModules: [
  ],

  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  bootstrapVue: {
    bootstrapCSS: true,
    bootstrapVueCSS: true
  },

  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },

  router: {
    middleware: []
  },

  build: {
  },

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