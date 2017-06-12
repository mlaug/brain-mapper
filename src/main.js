import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/bulbs'
import axios from 'axios'
import {auth0RequestSuccessInterceptor, auth0RequestErrorInterceptor} from './common/axios/auth0-interceptor'

axios.interceptors.request.use(
  auth0RequestSuccessInterceptor,
  auth0RequestErrorInterceptor
)

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
