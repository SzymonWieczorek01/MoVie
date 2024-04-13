import { createApp } from 'vue'
import App from '../src/App.vue'
import router from '../src/router/router'
import Vue3TouchEvents from 'vue3-touch-events'
import store from '../src/store/store';

createApp(App).use(Vue3TouchEvents).use(store).use(router).mount('#app')
