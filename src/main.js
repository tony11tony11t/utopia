import { createApp } from 'vue'
import App from './App.vue'
import UIComponents from './UIComponents.vue'
import 'ant-design-vue/dist/antd.css'

/**
 * main component
 */
// createApp(App).mount('#app');

/**
 * ui library's components
 */
createApp(UIComponents).mount('#app')
