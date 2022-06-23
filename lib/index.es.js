import { defineComponent, ref, watchEffect, openBlock, createElementBlock, normalizeStyle, createElementVNode, normalizeClass, toDisplayString } from 'vue'
function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start)
}
function sum(x, y) {
  return x + y
}
function square(x) {
  return x * x
}
const _hoisted_1 = {
  class: 'canvas-area'
}
const _hoisted_2 = ['width', 'height']
const _hoisted_3 = ['width', 'height']
const _hoisted_4 = /* @__PURE__ */ createElementVNode(
  'div',
  {
    class: 'slider-icon'
  },
  '\u2192',
  -1
)
const _hoisted_5 = [_hoisted_4]
const _hoisted_6 = {
  class: 'slider-text'
}
const _hoisted_7 = /* @__PURE__ */ createElementVNode(
  'div',
  {
    class: 'loadingIcon'
  },
  null,
  -1
)
const _hoisted_8 = /* @__PURE__ */ createElementVNode('span', null, '\u52A0\u8F7D\u4E2D...', -1)
const _hoisted_9 = [_hoisted_7, _hoisted_8]
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  props: {
    width: {
      default: 320
    },
    height: {
      default: 160
    },
    l: {
      default: 42
    },
    r: {
      default: 9
    },
    visible: {
      type: Boolean,
      default: true
    },
    text: {
      default: '\u5411\u53F3\u6ED1\u52A8\u6ED1\u5757\u5B8C\u6210\u62FC\u56FE'
    },
    refreshIcon: {
      default: 'http://cdn.dooring.cn/dr/icon12.png'
    },
    imgUrl: null,
    onDraw: null,
    onCustomVertify: null,
    onSuccess: null,
    onFail: null,
    onRefresh: null
  },
  setup(__props) {
    const isLoading = ref(false)
    const sliderLeft = ref(0)
    const sliderClass = ref('slider-container')
    const textTip = ref(__props.text)
    const canvasRef = ref()
    const blockRef = ref()
    const imgRef = ref()
    const isMouseDownRef = ref(false)
    const trailRef = ref([])
    const originXRef = ref(0)
    const originYRef = ref(0)
    const xRef = ref(0)
    const yRef = ref(0)
    const PI = Math.PI
    const L = __props.l + __props.r * 2 + 3
    function setLoading(loading) {
      isLoading.value = loading
    }
    function setSliderLeft(sliderleft) {
      sliderLeft.value = sliderleft
    }
    function setSliderClass(sliderclass) {
      sliderClass.value = sliderclass
    }
    function drawPath(ctx, x, y, operation) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x + __props.l / 2, y - __props.r + 2, __props.r, 0.72 * PI, 2.26 * PI)
      ctx.lineTo(x + __props.l, y)
      ctx.arc(x + __props.l + __props.r - 2, y + __props.l / 2, __props.r, 1.21 * PI, 2.78 * PI)
      ctx.lineTo(x + __props.l, y + __props.l)
      ctx.lineTo(x, y + __props.l)
      ctx.arc(x + __props.r - 2, y + __props.l / 2, __props.r + 0.4, 2.76 * PI, 1.24 * PI, true)
      ctx.lineTo(x, y)
      ctx.lineWidth = 2
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.stroke()
      ctx.globalCompositeOperation = 'destination-over'
      operation === 'fill' ? ctx.fill() : ctx.clip()
    }
    function getRandomImgSrc() {
      return __props.imgUrl || `https://picsum.photos/id/${getRandomNumberByRange(0, 1084)}/${__props.width}/${__props.height}`
    }
    function createImg(onload) {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = onload
      img.onerror = () => {
        img.setSrc(getRandomImgSrc())
      }
      img.setSrc = src => {
        const isIE = window.navigator.userAgent.indexOf('Trident') > -1
        if (isIE) {
          const xhr = new XMLHttpRequest()
          xhr.onloadend = function (e) {
            const file = new FileReader()
            file.readAsDataURL(e.target.response)
            file.onloadend = function (e2) {
              let _a
              img.src = (_a = e2 == null ? void 0 : e2.target) == null ? void 0 : _a.result
            }
          }
          xhr.open('GET', src)
          xhr.responseType = 'blob'
          xhr.send()
        } else {
          img.src = src
        }
      }
      img.setSrc(getRandomImgSrc())
      return img
    }
    function draw(img) {
      const canvasCtx = canvasRef.value.getContext('2d')
      const blockCtx = blockRef.value.getContext('2d')
      xRef.value = getRandomNumberByRange(L + 10, __props.width - (L + 10))
      yRef.value = getRandomNumberByRange(10 + __props.r * 2, __props.height - (L + 10))
      drawPath(canvasCtx, xRef.value, yRef.value, 'fill')
      drawPath(blockCtx, xRef.value, yRef.value, 'clip')
      canvasCtx.drawImage(img, 0, 0, __props.width, __props.height)
      blockCtx.drawImage(img, 0, 0, __props.width, __props.height)
      const y1 = yRef.value - __props.r * 2 - 1
      const ImageData = blockCtx.getImageData(xRef.value - 3, y1, L, L)
      blockRef.value.width = L
      blockCtx.putImageData(ImageData, 0, y1)
    }
    watchEffect(() => {
      if (__props.visible) {
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
      setSliderLeft(0)
      setSliderClass('slider-container')
      blockRef.value.width = __props.width
      blockRef.value.style.left = 0 + 'px'
      canvasCtx.clearRect(0, 0, __props.width, __props.height)
      blockCtx.clearRect(0, 0, __props.width, __props.height)
      setLoading(true)
      imgRef.value && (imgRef.value.src = getRandomImgSrc())
    }
    function handleRefresh() {
      reset()
      typeof __props.onRefresh === 'function' && __props.onRefresh()
    }
    function verify() {
      const arr = trailRef.value
      const average = arr.reduce(sum) / arr.length
      const deviations = arr.map(x => x - average)
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length)
      const left = parseInt(blockRef.value.style.left)
      return {
        spliced: Math.abs(left - xRef.value) < 10,
        verified: stddev !== 0,
        left,
        destX: xRef.value
      }
    }
    function handleDragStart(e) {
      originXRef.value = e.clientX || e.touches[0].clientX
      originYRef.value = e.clientY || e.touches[0].clientY
      isMouseDownRef.value = true
    }
    function handleDragMove(e) {
      if (!isMouseDownRef.value) {
        return false
      }
      e.preventDefault()
      const eventX = e.clientX || e.touches[0].clientX
      const eventY = e.clientY || e.touches[0].clientY
      const moveX = eventX - originXRef.value
      const moveY = eventY - originYRef.value
      if (moveX < 0 || moveX + 38 >= __props.width) {
        return false
      }
      setSliderLeft(moveX)
      const blockLeft = ((__props.width - 40 - 20) / (__props.width - 40)) * moveX
      blockRef.value.style.left = blockLeft + 'px'
      setSliderClass('slider-container slider-container_active')
      trailRef.value.push(moveY)
      __props.onDraw && __props.onDraw(blockLeft)
    }
    function handleDragEnd(e) {
      if (!isMouseDownRef.value) {
        return false
      }
      isMouseDownRef.value = false
      const eventX = e.clientX || e.changedTouches[0].clientX
      if (eventX === originXRef.value) {
        return false
      }
      setSliderClass('slider-container')
      const { spliced, verified } = __props.onCustomVertify ? __props.onCustomVertify(verify()) : verify()
      if (spliced) {
        if (verified) {
          setSliderClass('slider-container slider-container_success')
          typeof __props.onSuccess === 'function' && __props.onSuccess()
        } else {
          setSliderClass('slider-container slider-container_fail')
          textTip.value = '\u8BF7\u518D\u8BD5\u4E00\u6B21'
          reset()
        }
      } else {
        setSliderClass('slider-container slider-container_fail')
        typeof __props.onFail === 'function' && __props.onFail()
        setTimeout(() => {
          reset()
        }, 1e3)
      }
    }
    return (_ctx, _cache) => {
      return (
        openBlock(),
        createElementBlock(
          'div',
          {
            class: 'slider-vertify-wrap',
            style: normalizeStyle({
              width: __props.width + 'px',
              margin: '0 auto',
              display: __props.visible ? '' : 'none'
            }),
            onMousemove: handleDragMove,
            onMouseup: handleDragEnd,
            onTouchmove: handleDragMove,
            onTouchend: handleDragEnd
          },
          [
            createElementVNode('div', _hoisted_1, [
              createElementVNode(
                'canvas',
                {
                  ref_key: 'canvasRef',
                  ref: canvasRef,
                  width: __props.width,
                  height: __props.height
                },
                null,
                8,
                _hoisted_2
              ),
              createElementVNode(
                'canvas',
                {
                  ref_key: 'blockRef',
                  ref: blockRef,
                  class: 'block',
                  width: __props.width,
                  height: __props.height,
                  onMousedown: handleDragStart,
                  onTouchstart: handleDragStart
                },
                null,
                40,
                _hoisted_3
              )
            ]),
            createElementVNode(
              'div',
              {
                class: normalizeClass(sliderClass.value),
                style: normalizeStyle({
                  pointerEvents: isLoading.value ? 'none' : 'auto',
                  width: __props.width + 'px'
                })
              },
              [
                createElementVNode(
                  'div',
                  {
                    class: 'slider-mask',
                    style: normalizeStyle({
                      width: sliderLeft.value + 'px'
                    })
                  },
                  [
                    createElementVNode(
                      'div',
                      {
                        class: 'slider',
                        style: normalizeStyle({
                          left: sliderLeft.value + 'px'
                        }),
                        onMousedown: handleDragStart,
                        onTouchstart: handleDragStart
                      },
                      _hoisted_5,
                      36
                    )
                  ],
                  4
                ),
                createElementVNode('div', _hoisted_6, toDisplayString(textTip.value), 1)
              ],
              6
            ),
            createElementVNode(
              'div',
              {
                class: 'refresh-icon',
                style: normalizeStyle({
                  backgroundImage: `url(${__props.refreshIcon})`
                }),
                onClick: handleRefresh
              },
              null,
              4
            ),
            createElementVNode(
              'div',
              {
                class: 'loading-container',
                style: normalizeStyle({
                  width: __props.width + 'px',
                  height: __props.height + 'px',
                  display: isLoading.value ? '' : 'none'
                })
              },
              _hoisted_9,
              4
            )
          ],
          36
        )
      )
    }
  }
})
const index_vue_vue_type_style_index_0_lang = /* @__PURE__ */ (() =>
  '.slider-vertify-wrap{position:relative}.slider-vertify-wrap .block{position:absolute;left:0;top:0;cursor:pointer;cursor:grab}.slider-vertify-wrap .block:active{cursor:grabbing}.slider-vertify-wrap .slider-container{position:relative;text-align:center;width:310px;height:40px;line-height:40px;margin-top:15px;background:#f7f9fa;color:#45494c;border:1px solid #e4e7eb}.slider-vertify-wrap .slider-container_active .slider{height:38px;top:-1px;border:1px solid #486cd6}.slider-vertify-wrap .slider-container_active .slider-mask{height:38px;border-width:1px}.slider-vertify-wrap .slider-container_success .slider{height:38px;top:-1px;border:1px solid #0db87f;background-color:#0ca14a!important}.slider-vertify-wrap .slider-container_success .slider-mask{height:38px;border:1px solid #0db87f;background-color:#d2f4ef}.slider-vertify-wrap .slider-container_success .slider-icon{background-position:0 -26px!important}.slider-vertify-wrap .slider-container_fail .slider{height:38px;top:-1px;border:1px solid #f57a7a;background-color:#f57a7a!important}.slider-vertify-wrap .slider-container_fail .slider-mask{height:38px;border:1px solid #f57a7a;background-color:#fce1e1}.slider-vertify-wrap .slider-container_fail .slider-icon{top:14px;background-position:0 -82px!important}.slider-vertify-wrap .slider-container_active .slider-text,.slider-vertify-wrap .slider-container_success .slider-text,.slider-vertify-wrap .slider-container_fail .slider-text{display:none}.slider-vertify-wrap .slider-mask{position:absolute;left:0;top:0;height:40px;border:0 solid #486cd6;background:#d1e9fe}.slider-vertify-wrap .slider{position:absolute;top:0;left:0;width:40px;height:40px;background:#fff;box-shadow:0 0 3px #0000004d;transition:background .2s linear;cursor:pointer;cursor:grab}.slider-vertify-wrap .slider:active{cursor:grabbing}.slider-vertify-wrap .slider:hover{background:#486cd6}.slider-vertify-wrap .slider-icon{font-size:18px;color:#000}.slider-vertify-wrap .slider:hover .slider-icon{color:#fff}.slider-vertify-wrap .refresh-icon{position:absolute;right:5px;top:5px;width:30px;height:30px;cursor:pointer;background-size:32px}.slider-vertify-wrap .loading-container{position:absolute;left:0;top:0;width:310px;height:155px;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:14px;color:#45494c;z-index:2;background:#edf0f2}.slider-vertify-wrap .loadingIcon{width:32px;height:32px;margin-bottom:10px;background:url(http://cdn.dooring.cn/dr/icon12.png);background-size:32px;animation:loading-icon-rotate .8s linear infinite}@keyframes loading-icon-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n')()
export { _sfc_main as default }
