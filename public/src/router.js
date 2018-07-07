import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Main from './components/layout/Main.vue'
import Home from './components/layout/Home.vue'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            component: Login,
            hidden: true
        },
        {
            path: '/',
            component: Home,
            name: '系统管理',
            iconCls: 'fa fa-id-card-o',//图标样式class
            children: [
                // {
                //     path: '/test',
                //     component: resolve =>
                //         require(['./components/controls/DataZoom.vue'], resolve),
                //     name: '测试',
                //     meta: { redirectAuth: true }
                // },
                {
                    path: '/',
                    component: resolve => require(['./components/gene/GeneTest.vue'], resolve),
                    name: '基因测试页',
                    meta: { redirectAuth: true }
                },
                {
                    path: '/Project',
                    component: resolve => require(['./components/gene/ProjectManager.vue'], resolve),
                    name: '基因项目管理',
                    meta: { redirectAuth: true }
                },
                {
                    path: '/GeneList',
                    component: resolve => require(['./components/gene/GeneList.vue'], resolve),
                    name: '基因数据上传',
                    meta: { redirectAuth: true }
                },
                {
                    path: '/User',
                    component: resolve => require(['./components/gene/UserManager.vue'], resolve),
                    name: '用户管理',
                    meta: { redirectAuth: true }
                },
            ],
            meta: { redirectAuth: true }
        },
        {
            path: '*',
            redirect: '/',
            hidden: true
        }
    ]
})