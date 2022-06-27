export function addClass(el: HTMLElement, className: string) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el: HTMLElement, className: string) {
  el.classList.remove(className)
}
