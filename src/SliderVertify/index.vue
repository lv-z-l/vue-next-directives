<template>
  <div
    class="slider-vertify-wrap"
    :style="{ width: width + 'px', margin: '0 auto', display: visible ? '' : 'none' }"
    @mousemove="handleDragMove"
    @mouseup="handleDragEnd"
    @touchmove="handleDragMove"
    @touchend="handleDragEnd"
  >
    <div class="canvas-area">
      <canvas ref="canvasRef" :width="width" :height="height"></canvas>
      <canvas ref="blockRef" class="block" :width="width" :height="height" @mousedown="handleDragStart" @touchstart="handleDragStart"></canvas>
    </div>
    <div
      :class="sliderClass"
      :style="{
        pointerEvents: isLoading ? 'none' : 'auto',
        width: width + 'px'
      }"
    >
      <div
        class="slider-mask"
        :style="{
          width: sliderLeft + 'px'
        }"
      >
        <div
          class="slider"
          :style="{
            left: sliderLeft + 'px'
          }"
          @mousedown="handleDragStart"
          @touchstart="handleDragStart"
        >
          <div class="slider-icon">&rarr;</div>
        </div>
      </div>
      <div class="slider-text">{{ textTip }}</div>
    </div>
    <div
      class="refresh-icon"
      :style="{
        backgroundImage: `url(${refreshIcon})`
      }"
      @click="handleRefresh"
    ></div>
    <div
      class="loading-container"
      :style="{
        width: width + 'px',
        height: height + 'px',
        display: isLoading ? '' : 'none'
      }"
    >
      <div class="loadingIcon"></div>
      <span>加载中...</span>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { VertifyType } from './types/props'
import { ref, watchEffect } from 'vue'
import { getRandomNumberByRange, sum, square } from './utils/index'
const {
  width = 320,
  height = 160,
  l = 42,
  r = 9,
  visible = true,
  text = '向右滑动滑块完成拼图',
  refreshIcon = 'http://cdn.dooring.cn/dr/icon12.png',
  imgUrl,
  onRefresh,
  onDraw,
  onSuccess,
  onFail,
  onCustomVertify
} = defineProps<{
  /**
   * @description   canvas宽度
   * @default       320
   */
  width?: number
  /**
   * @description   canvas高度
   * @default       160
   */
  height?: number
  /**
   * @description   滑块边长
   * @default       42
   */
  l?: number
  /**
   * @description   滑块半径
   * @default       9
   */
  r?: number
  /**
   * @description   是否可见
   * @default       true
   */
  visible?: boolean
  /**
   * @description   滑块文本
   * @default       向右滑动滑块完成拼图
   */
  text?: string
  /**
   * @description   刷新按钮icon, 为icon的url地址
   * @default       -
   */
  refreshIcon?: string
  /**
   * @description   用于获取随机图片的url地址
   * @default       https://picsum.photos/${id}/${width}/${height}, 具体参考https://picsum.photos/, 只需要实现类似接口即可
   */
  imgUrl?: string
  /**
   * @description   拖拽滑块时的回调, 参数为当前滑块拖拽的距离
   */
  onDraw?(l: number): void
  /**
   * @description   用户的自定义验证逻辑
   */
  onCustomVertify?(arg: VertifyType): VertifyType
  /**
   * @description   验证成功回调
   */
  onSuccess?(): void
  /**
   * @description   验证失败回调
   */
  onFail?(): void
  /**
   * @description   刷新时回调
   */
  onRefresh?(): void
}>()

const isLoading = ref(false)
const sliderLeft = ref(0)
const sliderClass = ref('slider-container')
const textTip = ref(text)
const canvasRef = ref<HTMLCanvasElement>()
const blockRef = ref<HTMLCanvasElement>()
const imgRef = ref<HTMLImageElement>()
const isMouseDownRef = ref(false)
const trailRef = ref<number[]>([])
const originXRef = ref(0)
const originYRef = ref(0)
const xRef = ref(0)
const yRef = ref(0)
const PI = Math.PI
const L = l + r * 2 + 3 // 滑块实际边长

function setLoading(loading: boolean): void {
  isLoading.value = loading
}
function setSliderLeft(sliderleft: number): void {
  sliderLeft.value = sliderleft
}
function setSliderClass(sliderclass: string): void {
  sliderClass.value = sliderclass
}

function drawPath(ctx: any, x: number, y: number, operation: 'fill' | 'clip') {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  ctx.lineWidth = 2
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.stroke()
  ctx.globalCompositeOperation = 'destination-over'
  operation === 'fill' ? ctx.fill() : ctx.clip()
}

function getRandomImgSrc() {
  return imgUrl || `https://picsum.photos/id/${getRandomNumberByRange(0, 1084)}/${width}/${height}`
}

function createImg(onload: () => void) {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = onload
  img.onerror = () => {
    ;(img as any).setSrc(getRandomImgSrc()) // 图片加载失败的时候重新加载其他图片
  }
  ;(img as any).setSrc = (src: string) => {
    const isIE = window.navigator.userAgent.indexOf('Trident') > -1
    if (isIE) {
      // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
      const xhr = new XMLHttpRequest()
      xhr.onloadend = function (e: any) {
        const file = new FileReader() // FileReader仅支持IE10+
        file.readAsDataURL(e.target.response)
        file.onloadend = function (e) {
          img.src = e?.target?.result as string
        }
      }
      xhr.open('GET', src)
      xhr.responseType = 'blob'
      xhr.send()
    } else {
      img.src = src
    }
  }
  ;(img as any).setSrc(getRandomImgSrc())
  return img
}

function draw(img: HTMLImageElement) {
  // @ts-ignore
  const canvasCtx = canvasRef.value.getContext('2d')
  // @ts-ignore
  const blockCtx = blockRef.value.getContext('2d')
  // 随机位置创建拼图形状
  xRef.value = getRandomNumberByRange(L + 10, width - (L + 10))
  yRef.value = getRandomNumberByRange(10 + r * 2, height - (L + 10))
  drawPath(canvasCtx, xRef.value, yRef.value, 'fill')
  drawPath(blockCtx, xRef.value, yRef.value, 'clip')

  // 画入图片
  // @ts-ignore
  canvasCtx.drawImage(img, 0, 0, width, height)
  // @ts-ignore
  blockCtx.drawImage(img, 0, 0, width, height)

  // 提取滑块并放到最左边
  const y1 = yRef.value - r * 2 - 1
  // @ts-ignore
  const ImageData = blockCtx.getImageData(xRef.value - 3, y1, L, L)
  // @ts-ignore
  blockRef.value.width = L
  // @ts-ignore
  blockCtx.putImageData(ImageData, 0, y1)
}

watchEffect(() => {
  if (visible) {
    imgRef.value ? reset() : initImg()
  }
})

function initImg() {
  const img = createImg(() => {
    setLoading(false)
    draw(img)
  })
  imgRef.value = img
}

function reset() {
  const canvasCtx = canvasRef.value && canvasRef.value.getContext('2d')
  const blockCtx = blockRef.value && blockRef.value.getContext('2d')
  // 重置样式
  setSliderLeft(0)
  setSliderClass('slider-container')
  // @ts-ignore
  blockRef.value.width = width
  // @ts-ignore
  blockRef.value.style.left = 0 + 'px'

  // 清空画布
  // @ts-ignore
  canvasCtx.clearRect(0, 0, width, height)
  // @ts-ignore
  blockCtx.clearRect(0, 0, width, height)

  // 重新加载图片
  setLoading(true)
  imgRef.value && (imgRef.value.src = getRandomImgSrc())
}

function handleRefresh() {
  reset()
  typeof onRefresh === 'function' && onRefresh()
}

function verify(): VertifyType {
  const arr = trailRef.value // 拖动时y轴的移动距离
  const average = arr.reduce(sum) / arr.length
  const deviations = arr.map(x => x - average)
  const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)
  // @ts-ignore
  const left = parseInt(blockRef.value.style.left)
  return {
    spliced: Math.abs(left - xRef.value) < 10,
    verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    left,
    destX: xRef.value
  }
}

function handleDragStart(e: any) {
  originXRef.value = e.clientX || e.touches[0].clientX
  originYRef.value = e.clientY || e.touches[0].clientY
  isMouseDownRef.value = true
}

function handleDragMove(e: any) {
  if (!isMouseDownRef.value) {
    return false
  }
  e.preventDefault()
  const eventX = e.clientX || e.touches[0].clientX
  const eventY = e.clientY || e.touches[0].clientY
  const moveX = eventX - originXRef.value
  const moveY = eventY - originYRef.value
  if (moveX < 0 || moveX + 38 >= width) {
    return false
  }
  setSliderLeft(moveX)
  const blockLeft = ((width - 40 - 20) / (width - 40)) * moveX
  // @ts-ignore
  blockRef.value.style.left = blockLeft + 'px'

  setSliderClass('slider-container slider-container_active')
  trailRef.value.push(moveY)
  onDraw && onDraw(blockLeft)
}

function handleDragEnd(e: any) {
  if (!isMouseDownRef.value) {
    return false
  }
  isMouseDownRef.value = false
  const eventX = e.clientX || e.changedTouches[0].clientX
  if (eventX === originXRef.value) {
    return false
  }
  setSliderClass('slider-container')
  const { spliced, verified } = onCustomVertify ? onCustomVertify(verify()) : verify()
  if (spliced) {
    if (verified) {
      setSliderClass('slider-container slider-container_success')
      typeof onSuccess === 'function' && onSuccess()
    } else {
      setSliderClass('slider-container slider-container_fail')
      textTip.value = '请再试一次'
      reset()
    }
  } else {
    setSliderClass('slider-container slider-container_fail')
    typeof onFail === 'function' && onFail()
    setTimeout(() => {
      reset()
    }, 1000)
  }
}
</script>

<style lang="scss">
@import './style/index.scss';
</style>
