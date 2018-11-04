import axios from 'axios'
const httpHelper = {}
// 配置Vue插件
httpHelper.install = function fn (Vue) {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
  axios.interceptors.request.use(
    function (config) {
      // 一次性设置请求头
      const AUTH_TOKEN = sessionStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN
      console.log(config)

      // 在发送请求之前做些什么
      return config
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )
  // 添加响应拦截器
  axios.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么
      return response
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )
  Vue.prototype.$http = axios
}
export default httpHelper
