
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'drone-app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'droneShop - drone-app' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/bulma.css' },
      { rel: 'stylesheet', href: '/styles.css' },
      { rel: 'stylesheet', href: '/font-awesome.min.css' }

    ],
    script: [
      { src: '/util.js', type: 'text/javascript' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '@/plugins/firebase'
    '@/plugins/vee-validate',
    '@/plugins/vue-swal',
    '@/plugins/filters'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
