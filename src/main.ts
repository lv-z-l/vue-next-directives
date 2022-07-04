import { createApp } from 'vue'
import App from './App.vue'
import inputs from './directives/debounceInput/debounceInput'

createApp(App).directive('inputs', inputs).mount('#app')
