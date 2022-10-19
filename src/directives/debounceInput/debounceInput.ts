// @ts-nocheck
import { debounce, isFunction } from '../../utils/index'
function compositionStart(event: CompositionEvent) {
  event.target.composing = true
}
function compositionEnd(e: CompositionEvent) {
  e.target.composing = false
  const event = new Event('input', { bubbles: true })
  e.target?.dispatchEvent(event)
}

let inputFunction: (event: Event) => {}

function findInput(el: HTMLElement): HTMLElement | null {
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
    const { value, arg } = binding
    if (value && isFunction(value)) {
      let timeout = 600
      if (arg && !Number.isNaN(arg)) {
        timeout = Number(arg)
      }
      inputFunction = debounce(value, timeout)
      const input = findInput(el)
      el._INPUT = input
      if (input) {
        input.addEventListener('input', inputFunction)
        input.addEventListener('compositionstart', compositionStart)
        input.addEventListener('compositionend', compositionEnd)
      }
    }
  },
  beforeUnmount(el: HTMLElement) {
    if (el._INPUT) {
      el._INPUT.removeEventListener('input', inputFunction)
      el._INPUT.removeEventListener('compositionstart', compositionStart)
      el._INPUT.removeEventListener('compositionend', compositionEnd)
    }
  }
}
