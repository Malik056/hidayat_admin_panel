import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import { auth } from './firebase'

Vue.config.productionTip = false

// new Vue({
//   vuetify,
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')



let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app =
      new Vue({
        vuetify,
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
  }
})
