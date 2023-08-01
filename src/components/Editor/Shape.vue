<script setup>
import { useCommonStore } from '@/store/common'
import { to } from 'mathjs'

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

const onMouseDown = (e) => {
  e.stopPropagation()

  commonStore.setCurComponent(props.element, props.index)
  commonStore.setClickComponentStatus(true)

  const pos = { ...props.defalutStyle }
  const startX = e.clientX
  const startY = e.clientY
  const startTop = Number(pos.top)
  const startLeft = Number(pos.left)

  const move = (moveEvent) => {
    const curX = moveEvent.clientX
    const curY = moveEvent.clientY

    pos.left = curX - startX + startLeft
    pos.top = curY - startY + startTop
    commonStore.setShapeStyle(pos)
  }

  const up = () => {
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
      newTop = height / 2
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
  const startX = e.clientX
  const startY = e.clientY
  const width = Number(style.width)
  const height = Number(style.height)
  const left = Number(style.left)
  const top = Number(style.top)

  let needSave = false
  const move = (event) => {
    const curX = event.clientX
    const curY = event.clientY
    const hasT = /t/.test(point)
    const hasB = /b/.test(point)
    const hasL = /l/.test(point)
    const hasR = /r/.test(point)
    const disX = curX - startX
    const disY = curY - startY

    const newLeft = left + (hasL ? disX : 0)
    const newTop = top + (hasT ? disY : 0)
    const newHeight = height + (hasT ? -disY : hasB ? disY : 0)
    const newWdith = width + (hasL ? -disX : hasR ? disX : 0)
    style.height = newHeight > 0 ? newHeight : 0
    style.width = newWdith > 0 ? newWdith : 0
    style.left = newWdith > 0 ? newLeft : left + (hasL ? width : 0)
    style.top = newHeight > 0 ? newTop : top + (hasT ? height : 0)

    commonStore.setShapeStyle(style)
  }

  const down = (event) => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', down)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', down)
}

const selectCurComponent = (e) => {
  e.preventDefault()
  e.stopPropagation()
  commonStore.setCurComponent(props.element, props.index)
}
</script>

<template>
  <div class="shape" @mousedown="onMouseDown" @click="selectCurComponent">
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
}
</style>