// @ts-nocheck
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

  el.appendChild(el[name].instance.$el)
}

function remove(el: HTMLElement) {
  const name = Loading.name
  removeClass(el, relativeCls)
  el.removeChild(el[name].instance.$el)
}

export default {
  mounted(el: HTMLElement, binding: any) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    const name: string = Loading.name
    if (!el[name]) {
      el[name] = {}
    }
    el[name].instance = instance
    const title = binding.arg
    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }
    if (binding.modifiers && 'doublesize' in binding.modifiers) {
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
      el[name].instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}
