import { debounce } from '../../utils/index'
function compositionStart(event: CompositionEvent) {
  // @ts-ignore
  event.target.composing = true
}
function compositionEnd(e: CompositionEvent) {
  // @ts-ignore
  e.target.composing = false
  const event = new Event('input', { bubbles: true })
  e.target?.dispatchEvent(event)
}

let inputFunction: (event: Event) => {}

export default {
  mounted(el: HTMLElement, binding: any) {
    if (binding.value && typeof binding.value === 'function') {
      let timeout = 600
      if (binding.arg && !Number.isNaN(binding.arg)) {
        timeout = Number(binding.arg)
      }
      inputFunction = debounce(binding.value, timeout)
      el.addEventListener('input', inputFunction)
      el.addEventListener('compositionstart', compositionStart)
      el.addEventListener('compositionend', compositionEnd)
    }
  },
  updated(el: HTMLElement, binding: any) {},
  beforeUnmount(el: HTMLElement, binding: any) {
    el.removeEventListener('input', inputFunction)
    el.removeEventListener('compositionstart', compositionStart)
    el.removeEventListener('compositionend', compositionEnd)
  }
}
