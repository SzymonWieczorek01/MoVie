import { createApp } from 'vue'
import App from '../src/App.vue'
import router from '../src/router/router'
import Vue3TouchEvents from 'vue3-touch-events'
import store from '../src/store/store';
import YouTube from 'vue3-youtube'
import db from './firebase/firebase'


createApp(App).use(Vue3TouchEvents).use(db).use(store).use(router).component('YouTube', YouTube).mount('#app')

