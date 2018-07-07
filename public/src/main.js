import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'

import Login from './components/Login.vue'
import Home from './components/layout/Home.vue'
import Main from './components/layout/Main.vue'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)


import echarts from "echarts";
Vue.component("echarts", echarts)

import router from './router'
//store
router.beforeEach((to, from, next) => {
    if (to.meta.redirectAuth) {
        NProgress.start();
        var session = sessionStorage.getItem('session')
        if (store.state.User.UserID || session) {
            next()
        } else {
            next({ path: '/login' })
        }
    } else {
        NProgress.start();
        next()
    }
})

router.afterEach(transition => {
    NProgress.done();
});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: { App }
}).$mount('#app')

