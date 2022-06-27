import { App } from 'vue'
import { ImageManager, STATE } from './ImageManager'
import { LazyOption } from './types/Lazy'
import defaultImg from '../../assets/images/undraw_snap_the_moment_re_88cu.svg'
import defaultError from '../../assets/images/undraw_fixing_bugs_w7gi.svg'

const DEFAULT_LOADING = defaultImg
const DEFAULT_ERROR = defaultError

class Lazy {
  imageManagerQuene: ImageManager[]
  loading: string
  error: string
  observer?: IntersectionObserver
  cache: Set<string>
  constructor(option: LazyOption) {
    this.imageManagerQuene = []
    this.loading = option.loading || DEFAULT_LOADING
    this.error = option.error || DEFAULT_ERROR
    this.cache = new Set()
    this.initImageObserver()
  }

  initImageObserver() {
    this.observer = new IntersectionObserver(
      (entrys: any[]) => {
        entrys.forEach((entry: any) => {
          if (entry.isIntersecting) {
            const manager = this.imageManagerQuene.find(manager => {
              return manager.el === entry.target
            })
            if (manager) {
              if (manager.state === STATE.loaded) {
                this.removeManager(manager)
                return
              }
              manager.renderSrc()
            }
          }
        })
      },
      {
        rootMargin: '0px',
        threshold: 0
      }
    )
  }
  add(el: HTMLElement, binding: any) {
    const m = new ImageManager({
      el,
      src: binding.value,
      loading: this.loading,
      error: this.error,
      cache: this.cache
    })
    this.imageManagerQuene.push(m)
    this.observer?.observe(el)
  }
  removeManager(m: ImageManager) {
    const index = this.imageManagerQuene.indexOf(m)
    if (index >= 0) {
      this.imageManagerQuene.splice(index, 1)
      this.observer && this.observer?.unobserve(m.el)
    }
  }
  findManagerByEl(el: HTMLElement) {
    return this.imageManagerQuene.find(m => m.el === el)
  }
  remove(el: HTMLElement) {
    const manager = this.findManagerByEl(el)
    if (manager) {
      this.removeManager(manager)
    }
  }
  update(el: HTMLElement, binding: any) {
    const src = binding.value
    const manager = this.findManagerByEl(el)
    if (manager) {
      manager.updateSrc(src)
    }
  }
}

export default {
  install(app: App, option: LazyOption) {
    const lazy = new Lazy(option)
    app.directive(option.name, {
      mounted: lazy.add.bind(lazy),
      unmounted: lazy.remove.bind(lazy),
      updated: lazy.update.bind(lazy)
    })
  }
}
