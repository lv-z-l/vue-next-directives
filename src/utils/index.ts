export function addClass(el: HTMLElement, className: string) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el: HTMLElement, className: string) {
  el.classList.remove(className)
}

export function debounce(input: (event: Event) => any, timeout: number): (this: HTMLElement, ev: Event) => any {
  let timer: string | number | NodeJS.Timeout | undefined
  return (event: Event) => {
    // @ts-ignore
    if (event.target.composing === true) {
      return
    }
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
    timer = setTimeout(() => {
      input(event)
      clearTimeout(timer)
      timer = undefined
    }, timeout)
  }
}
