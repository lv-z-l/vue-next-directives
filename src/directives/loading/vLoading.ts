import Loading from './Loading.vue'

import { createApp } from 'vue'
import { addClass, removeClass } from '@/utils/index'

const relativeCls = 'position-relative'

function append(el: HTMLElement) {
  const name = Loading.name
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  // @ts-ignore
  el.appendChild(el[name].instance.$el)
}

function remove(el: HTMLElement) {
  const name = Loading.name
  removeClass(el, relativeCls)
  // @ts-ignore
  el.removeChild(el[name].instance.$el)
}

export default {
  mounted(el: HTMLElement, binding: any) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    const name: string = Loading.name
    // @ts-ignore
    if (!el[name]) {
      // @ts-ignore
      el[name] = {}
    }
    // @ts-ignore
    el[name].instance = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // @ts-ignore
      instance.setTitle(title)
    }
    if (binding.modifiers && 'doublesize' in binding.modifiers) {
      // @ts-ignore
      instance.changeSize()
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el: HTMLElement, binding: any) {
    const title = binding.arg
    const name = Loading.name
    if (typeof title !== 'undefined') {
      // @ts-ignore
      el[name].instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}
