import { imageManagerOption } from './types/Lazy'

export const STATE = {
  loading: 0,
  loaded: 1,
  error: 2
}

function clear(img: HTMLImageElement): void {
  img.onload = null
  img.onerror = null
}

function loadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve()
      clear(img)
    }
    img.onerror = error => {
      reject(error)
      clear(img)
    }
    img.src = src
  })
}

export class ImageManager {
  el: HTMLElement
  src: string
  state: number
  loading: string
  error: string
  cache: Set<string>
  constructor(option: imageManagerOption) {
    this.el = option.el
    this.src = option.src
    this.state = STATE.loading
    this.loading = option.loading
    this.error = option.error
    this.cache = option.cache
    this.setImageSrc()
  }
  setImageSrc(src: string = this.loading) {
    this.el.setAttribute('src', src)
  }

  renderSrc() {
    if (this.state > STATE.loading) {
      return
    }
    if (this.cache.has(this.src)) {
      this.state = STATE.loaded
      this.setImageSrc(this.src)
      return
    }
    loadImage(this.src)
      .then(() => {
        this.state = STATE.loaded
        this.cache.add(this.src)
        this.setImageSrc(this.src)
      })
      .catch(error => {
        this.state = STATE.error
        this.setImageSrc(this.error)
        console.error(`Image resources (${this.src}) Load failed`)
      })
  }

  updateSrc(src: string) {
    if (this.src === src) {
      return
    }
    this.src = src
    this.state = STATE.loading
  }
}
