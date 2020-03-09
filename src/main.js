import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './scss/global.scss'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
