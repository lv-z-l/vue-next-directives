import { VNode } from 'vue'

export interface VertifyType {
  spliced: boolean
  verified: boolean // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
  left: number // 滑块的移动位置
  destX: number // 滑块的目标位置
}

export interface SliderVertifyProps {
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
   * @default       向右滑动填充拼图
   */
  text?: string | VNode
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
   * @default       (l: number):void => {}
   */
  onDraw?(l: number): void
  /**
   * @description   用户的自定义验证逻辑
   * @default       (arg: VertifyType) => VertifyType
   */
  onCustomVertify?(arg: VertifyType): void
  /**
   * @description   验证成功回调
   * @default       ():void => {}
   */
  onSuccess?(): void
  /**
   * @description   验证失败回调
   * @default       ():void => {}
   */
  onFail?(): void
  /**
   * @description   刷新时回调
   * @default       ():void => {}
   */
  onRefresh?(): void
}
