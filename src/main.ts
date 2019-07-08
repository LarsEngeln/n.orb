import Vue from 'vue';
Vue.config.productionTip = false;

import App from './components/app.vue';
//import router from './router';

const v = new Vue({
    el: '#app',
    //router: router,
    template: "<app/>",
    components: {
        App
    }
});