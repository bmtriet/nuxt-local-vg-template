import Vue from 'vue'
import VueSession from 'vue-session'
import excel from 'vue-excel-export'
import dayjs from 'dayjs'
let options = { persist: true }
Vue.use(VueSession, options)
Vue.use(excel)
Vue.use(dayjs)