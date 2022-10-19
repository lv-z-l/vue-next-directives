import { createApp } from 'vue'
import App from './App.vue'
import debounceInput from './directives/debounceInput/debounceInput'

createApp(App).directive('debounceInput', debounceInput).mount('#app')
