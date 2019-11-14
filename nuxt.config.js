module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Food Oasis Los Angeles',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { hid: 'description', name: 'description', content: 'Nuxt.js project' }

      // for Windows 8
      { name: 'msapplication-TileImage', content: '/assets/images/favicon.png' },
      { name: 'msapplication-TileColor', content: 'rgb(240, 240, 240)' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Reem+Kufi|Open+Sans:400,400i,600' },
      { rel: 'stylesheet', href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.css' },
      { rel: 'stylesheet', href: '/assets/css/elements.css' },
      { rel: 'stylesheet', href: '/assets/css/buttons.css' },
      { rel: 'stylesheet', href: '/assets/css/form.css' },
      { rel: 'stylesheet', href: '/assets/css/header.css' },
      { rel: 'stylesheet', href: '/assets/css/footer.css' },
      { rel: 'stylesheet', href: '/assets/css/nav.css' },
      { rel: 'stylesheet', href: '/assets/css/map.css' },
      { rel: 'stylesheet', href: '/assets/css/location-list.css' },
      { rel: 'stylesheet', href: '/assets/css/location-details.css' },
      { rel: 'stylesheet', href: '/assets/css/audience.css' },
      { rel: 'stylesheet', href: '/assets/css/organizations.css' },
      { rel: 'stylesheet', href: '/assets/css/home.css' },

      // for general use
      { rel: 'icon', type: 'image/png', href: '/assets/images/favicon.png' },

      // for iOS
      { rel: 'apple-touch-icon', href: '/assets/images/favicon-rgb-240-240-240.png' }
    ],
    script: [
      { src: 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.js' }

      // Jim’s Google Maps API key
      // { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBP5KxqO9v1sLhXlkrG3vDiDdOJvYLJ0H4' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    // base: '/app/',
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'locations',
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      })
      /*
      routes.push({
        name: 'locations',
        path: '/locations/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      routes.push({
        name: 'community-garden',
        path: '/community-garden/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      routes.push({
        name: 'farmers-market',
        path: '/farmers-market/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      routes.push({
        name: 'food-pantry',
        path: '/food-pantry/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      routes.push({
        name: 'summer-lunch',
        path: '/summer-lunch/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      routes.push({
        name: 'supermarket',
        path: '/supermarket/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      routes.push({
        name: 'cultivate-la',
        path: '/cultivate-la/:name?',
        component: resolve(__dirname, 'pages/index.vue')
      })
      */
    }
  },
  modules: [
    '@nuxtjs/axios'
    // 'mapbox'
  ],
  axios: {
    // proxyHeaders: false
  }
}
