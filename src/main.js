import './assets/main.css'
import { MotionPlugin } from '@vueuse/motion'
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).use(MotionPlugin).mount('#app')
