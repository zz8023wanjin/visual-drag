<script setup>
import { useCommonStore } from '@/store/common'
import { getCanvasStyle, getStyle, getShapeStyle } from '@/utils/style.js'
import { changeStyleWithScale } from '@/utils/translate'
import Grid from './Grid.vue'
import Shape from './Shape.vue'
import ContextMenu from './ContextMenu.vue'
import MarkLine from './MarkLine.vue'
import { useContextMenu } from '@/store/contextMenu'

// store
const commonStore = useCommonStore()
const contextMenuStore = useContextMenu()

const svgFilterAttrs = ['width', 'height', 'top', 'left', 'rotate']

// 处理鼠标右击事件
const handleContextMenu = (e) => {
  e.preventDefault()
  e.stopPropagation()

  // 计算菜单相对于编辑器的偏移量
  let target = e.target
  let top = e.offsetY
  let left = e.offsetX
  while (target instanceof SVGElement) {
    target = target.parentNode
  }

  while (!target.className.includes('editor')) {
    left += target.offsetLeft
    top += target.offsetTop
    target = target.parentNode
  }
  contextMenuStore.showContextMenu({ top, left })
}

const getComponentStyle = (style) => {
  return getStyle(style, svgFilterAttrs)
}
</script>

<template>
  <div
    class="editor"
    id="editor"
    :style="{
      ...getCanvasStyle(commonStore.canvasStyleData),
      width: changeStyleWithScale(commonStore.canvasStyleData.width, commonStore.canvasStyleData.scale) + 'px',
      height: changeStyleWithScale(commonStore.canvasStyleData.height, commonStore.canvasStyleData.scale) + 'px',
    }"
    @contextmenu="handleContextMenu"
  >
    <!-- 网格线 -->
    <Grid />

    <!-- 吸附和对齐 -->
    <MarkLine />

    <!-- 画板组件列表显示 -->
    <Shape
      v-for="(item, index) in commonStore.componentData"
      :key="item.id"
      :active="item.id === (commonStore.curComponent || {}).id"
      :element="item"
      :index="index"
      :style="getShapeStyle(item.style)"
      :defalutStyle="item.style"
    >
      <component
        :is="item.component"
        :style="getComponentStyle(item.style)"
        class="component"
        :element="item"
        :propValue="item.propValue"
      />
    </Shape>

    <!-- 右键菜单栏 -->
    <ContextMenu />
  </div>
</template>

<style scoped lang="less">
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
}

.component {
  outline: none;
  width: 100%;
  height: 100%;
}
</style>
