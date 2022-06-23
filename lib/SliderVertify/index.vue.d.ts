import { VertifyType } from './types/props'
declare const _sfc_main: import('vue').DefineComponent<
  {
    width: {
      type: NumberConstructor
      required: false
    }
    height: {
      type: NumberConstructor
      required: false
    }
    l: {
      type: NumberConstructor
      required: false
    }
    r: {
      type: NumberConstructor
      required: false
    }
    visible: {
      type: BooleanConstructor
      required: false
    }
    text: {
      type: StringConstructor
      required: false
    }
    refreshIcon: {
      type: StringConstructor
      required: false
    }
    imgUrl: {
      type: StringConstructor
      required: false
    }
    onDraw: {
      type: FunctionConstructor
      required: false
    }
    onCustomVertify: {
      type: FunctionConstructor
      required: false
    }
    onSuccess: {
      type: FunctionConstructor
      required: false
    }
    onFail: {
      type: FunctionConstructor
      required: false
    }
    onRefresh: {
      type: FunctionConstructor
      required: false
    }
  },
  {
    name: string
    isLoading: import('vue').Ref<boolean>
    sliderLeft: import('vue').Ref<number>
    sliderClass: import('vue').Ref<string>
    textTip: import('vue').Ref<string>
    canvasRef: import('vue').Ref<HTMLCanvasElement | undefined>
    blockRef: import('vue').Ref<HTMLCanvasElement | undefined>
    imgRef: import('vue').Ref<HTMLImageElement | undefined>
    isMouseDownRef: import('vue').Ref<boolean>
    trailRef: import('vue').Ref<number[]>
    originXRef: import('vue').Ref<number>
    originYRef: import('vue').Ref<number>
    xRef: import('vue').Ref<number>
    yRef: import('vue').Ref<number>
    PI: number
    L: number
    setLoading: (loading: boolean) => void
    setSliderLeft: (sliderleft: number) => void
    setSliderClass: (sliderclass: string) => void
    drawPath: (ctx: any, x: number, y: number, operation: 'fill' | 'clip') => void
    getRandomImgSrc: () => string
    createImg: (onload: () => void) => HTMLImageElement
    draw: (img: HTMLImageElement) => void
    initImg: () => void
    reset: () => void
    handleRefresh: () => void
    verify: () => VertifyType
    handleDragStart: (e: any) => void
    handleDragMove: (e: any) => false | undefined
    handleDragEnd: (e: any) => false | undefined
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  Record<string, any>,
  string,
  import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
  Readonly<
    import('vue').ExtractPropTypes<{
      width: {
        type: NumberConstructor
        required: false
      }
      height: {
        type: NumberConstructor
        required: false
      }
      l: {
        type: NumberConstructor
        required: false
      }
      r: {
        type: NumberConstructor
        required: false
      }
      visible: {
        type: BooleanConstructor
        required: false
      }
      text: {
        type: StringConstructor
        required: false
      }
      refreshIcon: {
        type: StringConstructor
        required: false
      }
      imgUrl: {
        type: StringConstructor
        required: false
      }
      onDraw: {
        type: FunctionConstructor
        required: false
      }
      onCustomVertify: {
        type: FunctionConstructor
        required: false
      }
      onSuccess: {
        type: FunctionConstructor
        required: false
      }
      onFail: {
        type: FunctionConstructor
        required: false
      }
      onRefresh: {
        type: FunctionConstructor
        required: false
      }
    }>
  >,
  {
    visible: boolean
  }
>
export default _sfc_main
