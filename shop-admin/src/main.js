// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import '@/assets/css/style.css'
// import axios from 'axios'
import httpHelper from '@/plugins/http.js'
import moment from 'moment'
import MyBread from '@/components/myBread'
Vue.use(ElementUI)
Vue.use(httpHelper)
// 日期过滤器
Vue.filter('fmtDate', function (v) {
  return moment(v).format('YYY-MM-DD hh:mm:ss')
})
Vue.component(MyBread.name, MyBread)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
