import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from '@/views/Home'
export default new Router({
    routes: [

        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/home',
            component: Home,
        },
    ]
})