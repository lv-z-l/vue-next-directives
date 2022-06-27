import { createApp } from 'vue'
import vLoading from './directives/loading/vLoading'
import App from './App.vue'
import Lazyplugin from './directives/lazy/Lazy'

createApp(App).use(Lazyplugin, { name: 'lazy' }).directive('loading', vLoading).mount('#app')
