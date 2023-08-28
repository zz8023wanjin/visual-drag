<script setup>
import { useCommonStore } from '@/store/common'
import { useComposeStore } from '@/store/compose'
import { useSnapshotStore } from '@/store/snapshot'
import { inject, nextTick, ref } from 'vue'
import calculateComponentPostionAndSize from '@/utils/calculateComponentPostionAndSize'

const props = defineProps({
  active: {
    required: true,
    type: Boolean,
    default: false,
  },
  element: {
    required: true,
    type: Object,
    default: () => {},
  },
  index: {
    required: true,
    type: [Number, String],
    default: 0,
  },
  defalutStyle: {
    required: true,
    type: Object,
    default: () => {},
  },
})

const pointList = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']

const commonStore = useCommonStore()
const snapshotStore = useSnapshotStore()
const composeStore = useComposeStore()

const EventBus = inject('EventBus')
const shapeRef = ref()

const onMouseDown = (e) => {
  e.stopPropagation()

  commonStore.setCurComponent(props.element, props.index)
  commonStore.setClickComponentStatus(true)

  const pos = { ...props.defalutStyle }
  const startX = e.clientX
  const startY = e.clientY
  const startTop = Number(pos.top)
  const startLeft = Number(pos.left)

  let needSave = false
  const move = async (moveEvent) => {
    needSave = true
    const curX = moveEvent.clientX
    const curY = moveEvent.clientY

    pos.left = curX - startX + startLeft
    pos.top = curY - startY + startTop
    commonStore.setShapeStyle(pos)

    // 等更新完当前组件的样式并绘制到屏幕后在判断是否需要吸附
    // 如果不使用 nextTick 吸附后将不能移动
    await nextTick()

    // 触发元素移动事件，用于显示标线、吸附功能
    // 后面两个参数代表鼠标移动方向
    // curY - startY > 0 true 表示向下移动 false 表示向上移动
    // curX - startX > 0 true 表示向右移动 false 表示向左移动
    EventBus.$emit('move', curY - startY > 0, curX - startX > 0)
  }

  const up = () => {
    needSave && snapshotStore.recordSnapshot()
    EventBus.$emit('unmove')
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

const getPointStyle = (point) => {
  const { height, width } = props.defalutStyle
  let hasT = /t/.test(point)
  let hasB = /b/.test(point)
  let hasL = /l/.test(point)
  let hasR = /r/.test(point)
  let newLeft = 0
  let newTop = 0

  // 四个角上的点
  if (point.length >= 2) {
    newLeft = hasL ? 0 : width
    newTop = hasT ? 0 : height
  } else {
    // 上下两个点
    if (hasT || hasB) {
      newLeft = width / 2
      newTop = hasT ? 0 : height
    }

    // 左右两个点
    if (hasL || hasR) {
      newTop = Math.floor(height / 2)
      newLeft = hasL ? 0 : width
    }
  }

  const style = {
    marginLeft: '-4px',
    marginTop: '-4px',
    left: `${newLeft}px`,
    top: `${newTop}px`,
    cursor: 'resize',
  }

  return style
}

const isActive = () => {
  return props.active
}

const getPointList = () => {
  return pointList
}

const onMouseDownByPoint = (point, e) => {
  commonStore.setClickComponentStatus(true)
  commonStore.setInEditorStatus(true)
  e.preventDefault()
  e.stopPropagation()

  const style = { ...props.defalutStyle }

  const proportion = style.width / style.height

  // 组件中心点
  const center = {
    x: style.left + style.width / 2,
    y: style.top + style.height / 2,
  }

  // 获取画布位置信息
  const editorRectInfo = composeStore.editor.getBoundingClientRect()

  // 获取当前拖动点的位置信息
  const pointRect = e.target.getBoundingClientRect()

  // 当前点击圆点当对于画布的中心坐标
  const curPoint = {
    x: Math.round(pointRect.left - editorRectInfo.left + e.target.offsetWidth / 2),
    y: Math.round(pointRect.top - editorRectInfo.top + e.target.offsetHeight / 2),
  }

  // 获取对称点的坐标
  const symmetricPoint = {
    x: center.x + (center.x - curPoint.x),
    y: center.y + (center.y - curPoint.y),
  }

  // 是否需要保存快照
  let needSave = false
  let first = true

  const move = async (event) => {
    // 第一次点击时也会触发 move，所以会有“刚点击组件但未移动，组件的大小却改变了”的情况发生
    // 因此第一次点击时不触发 move 事件
    if (first) {
      first = false
      return
    }

    needSave = true

    const curPosition = {
      x: event.clientX - Math.round(editorRectInfo.left),
      y: event.clientY - Math.round(editorRectInfo.top),
    }

    calculateComponentPostionAndSize(point, style, curPosition, proportion, false, {
      center,
      curPoint,
      symmetricPoint,
    })

    // 修改当前组件样式
    commonStore.setShapeStyle(style)
  }

  const up = () => {
    needSave && snapshotStore.recordSnapshot()
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

const selectCurComponent = (e) => {
  e.preventDefault()
  e.stopPropagation()
  commonStore.setCurComponent(props.element, props.index)
}

// 处理旋转
const handleRotate = (e) => {
  commonStore.setClickComponentStatus(true)
  e.preventDefault()
  e.stopPropagation()
  // 初始坐标和初始角度
  const pos = { ...props.defalutStyle }
  const startY = e.clientY
  const startX = e.clientX
  const startRotate = pos.rotate

  // 获取元素中心点位置
  const rect = shapeRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // 旋转前的角度
  const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

  // 如果元素没有移动，则不保存快照
  let hasMove = false
  const move = (moveEvent) => {
    hasMove = true
    const curX = moveEvent.clientX
    const curY = moveEvent.clientY
    // 旋转后的角度
    const rotateDegreeAfter = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)
    // 获取旋转的角度值
    pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore

    // 修改当前组件样式
    commonStore.setShapeStyle(pos)
  }

  const up = () => {
    hasMove && snapshotStore.recordSnapshot()
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
    // this.cursors = this.getCursor() // 根据旋转角度获取光标位置
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}
</script>

<template>
  <div class="shape" @mousedown="onMouseDown" @click="selectCurComponent" ref="shapeRef">
    <span v-show="isActive()" class="iconfont icon-xiangyouxuanzhuan" @mousedown="handleRotate"></span>
    <div
      v-for="item in isActive() ? getPointList() : []"
      :style="getPointStyle(item)"
      :key="item"
      class="shape-point"
      @mousedown="onMouseDownByPoint(item, $event)"
    ></div>
    <slot />
  </div>
</template>

<style scoped lang="less">
.shape {
  position: absolute;

  &:hover {
    cursor: move;
  }

  .shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 1;
  }

  .icon-xiangyouxuanzhuan {
    position: absolute;
    top: -34px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
    color: #59c7f9;
    font-size: 20px;
    font-weight: 600;

    &:active {
      cursor: grabbing;
    }
  }
}
</style>
