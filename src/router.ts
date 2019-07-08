import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './components/app.vue';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [{
        path: '/',
        name: 'main',
        component: App
    }]
});