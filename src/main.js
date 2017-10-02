// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// Original file layout for Vues/store was taken from CoPilot:
// https://github.com/misterGF/CoPilot
// Very similar example linked to from the Vuex documentation:
// https://vuex.vuejs.org/en/structure.html
// Which points to the store example:
// https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart/store
import store from './store'

Vue.config.productionTip = false

// Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // Inject state store into this and all child components.
  template: '<App/>',
  components: { App }
})
