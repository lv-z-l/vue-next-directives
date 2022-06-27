export interface imageManagerOption {
  el: HTMLElement
  src: string
  loading: string
  error: string
  cache: Set<string>
}

export interface LazyOption {
  name: string
  loading: string
  error: string
}
