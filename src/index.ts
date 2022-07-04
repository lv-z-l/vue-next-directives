import Loading from './directives/loading/vLoading'
import Lazy from './directives/lazy/Lazy'
import debounceInput from './directives/debounceInput/debounceInput'
import { LazyOption } from './directives/lazy/types/Lazy'
import { App } from 'vue'

export default {
  install(app: App, option: LazyOption) {
    if (!option) {
      option = { name: 'lazy' }
    }
    if (!option.name) {
      option.name = 'lazy'
    }
    app.directive('loading', Loading).directive('debounceInput', debounceInput).use(Lazy, option)
  }
}
