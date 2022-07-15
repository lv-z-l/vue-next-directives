// @ts-nocheck
import { debounce } from '../../utils/index'
function compositionStart(event: CompositionEvent) {
  event.target.composing = true
}
function compositionEnd(e: CompositionEvent) {
  e.target.composing = false
  const event = new Event('input', { bubbles: true })
  e.target?.dispatchEvent(event)
}

let inputFunction: (event: Event) => {}

function findInputFromEl(el: HTMLElement): HTMLElement | null {
  const quene: HTMLElement[] = []
  quene.push(el)
  while (quene.length > 0) {
    const current = quene.shift()
    if (current?.tagName === 'INPUT') {
      return current
    }
    if (current?.childNodes) {
      quene.push(...current.childNodes)
    }
  }
  return null
}

export default {
  mounted(el: HTMLElement, binding: any) {
    if (binding.value && typeof binding.value === 'function') {
      let timeout = 600
      if (binding.arg && !Number.isNaN(binding.arg)) {
        timeout = Number(binding.arg)
      }
      inputFunction = debounce(binding.value, timeout)
      const inputDom = findInputFromEl(el)
      el.inputDom = inputDom
      if (inputDom) {
        inputDom.addEventListener('input', inputFunction)
        inputDom.addEventListener('compositionstart', compositionStart)
        inputDom.addEventListener('compositionend', compositionEnd)
      }
    }
  },
  beforeUnmount(el: HTMLElement) {
    if (el.inputDom) {
      el.inputDom.removeEventListener('input', inputFunction)
      el.inputDom.removeEventListener('compositionstart', compositionStart)
      el.inputDom.removeEventListener('compositionend', compositionEnd)
    }
  }
}
