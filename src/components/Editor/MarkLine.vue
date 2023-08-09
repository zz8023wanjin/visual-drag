<script setup>
import { useCommonStore } from '@/store/common'
import { inject, reactive } from 'vue'

const lines = ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'] // 分别对应三条横线和三条竖线
const diff = 3 // 相距 diff 像素将自动吸附
const lineStatus = reactive({
  xt: false,
  xc: false,
  xb: false,
  yl: false,
  yc: false,
  yr: false,
})
const lineRefs = reactive({
  xt: null,
  xc: null,
  xb: null,
  yl: null,
  yc: null,
  yr: null,
})

// store
const commonStore = useCommonStore()

// event bus
const EventBus = inject('EventBus')

EventBus.$on('move', (isDownward, isRightward) => {
  showLine(isDownward, isRightward)
})

EventBus.$on('unmove', () => {
  hideLine()
})

const isNearly = (dragValue, targetValue) => {
  return Math.abs(dragValue - targetValue) <= diff
}

const showLine = (isDownward, isRightward) => {
  const components = commonStore.componentData
  const curComponentStyle = commonStore.curComponent.style
  const curComponentHalfWidth = curComponentStyle.width / 2
  const curComponentHalfHeight = curComponentStyle.height / 2

  hideLine()
  components.forEach((component) => {
    if (component === commonStore.curComponent) return
    const componentStyle = component.style
    const { top, left } = componentStyle
    const componentWidth = componentStyle.width
    const componentHeight = componentStyle.height
    const componentHalfWidth = componentWidth / 2
    const componentHalfHeight = componentHeight / 2

    const conditions = {
      top: [
        {
          // 当前组件顶部与目标组件顶部对齐
          isNearly: isNearly(curComponentStyle.top, top),
          lineNode: lineRefs.xt,
          line: 'xt',
          dragShift: top,
          lineShift: top,
        },
        {
          // 当前组件的底部与目标组件的顶部对齐
          isNearly: isNearly(curComponentStyle.top + curComponentStyle.height, top),
          lineNode: lineRefs.xt,
          line: 'xt',
          dragShift: top - curComponentStyle.height,
          lineShift: top,
        },
        {
          // 当前组件与目标组件y轴居中对齐
          isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
          lineNode: lineRefs.xc,
          line: 'xc',
          dragShift: top + componentHalfHeight - curComponentHalfHeight,
          lineShift: top + componentHalfHeight,
        },
        {
          // 当前组件顶部与目标组件底部对齐
          isNearly: isNearly(curComponentStyle.top, top + componentHeight),
          lineNode: lineRefs.xb,
          line: 'xb',
          dragShift: top + componentHeight,
          lineShift: top + componentHeight,
        },
        {
          // 当前组件底部与目标组件底部对齐
          isNearly: isNearly(curComponentStyle.top + curComponentStyle.height, top + componentHeight),
          lineNode: lineRefs.xb,
          line: 'xb',
          dragShift: top + componentHeight - curComponentStyle.height,
          lineShift: top + componentHeight,
        },
      ],
      left: [
        {
          // 当前组件左侧和目标组件左侧对齐
          isNearly: isNearly(curComponentStyle.left, left),
          lineNode: lineRefs.yl,
          line: 'yl',
          dragShift: left,
          lineShift: left,
        },
        {
          // 当前组件的右侧与目标组件左侧对齐
          isNearly: isNearly(curComponentStyle.left + curComponentStyle.width, left),
          lineNode: lineRefs.yl,
          line: 'yl',
          dragShift: left - curComponentStyle.width,
          lineShift: left,
        },
        {
          // 组件与拖拽节点的中间是否对齐
          isNearly: isNearly(curComponentStyle.left + curComponentHalfWidth, left + componentHalfWidth),
          lineNode: lineRefs.yc,
          line: 'yc',
          dragShift: left + componentHalfWidth - curComponentHalfWidth,
          lineShift: left + componentHalfWidth,
        },
        {
          // 当前组件左侧与目标组件右侧对齐
          isNearly: isNearly(curComponentStyle.left, left + componentWidth),
          lineNode: lineRefs.yr,
          line: 'yr',
          dragShift: left + componentWidth,
          lineShift: left + componentWidth,
        },
        {
          // 当前组件右侧与目标组件右侧对齐
          isNearly: isNearly(curComponentStyle.right, left + componentWidth),
          lineNode: lineRefs.yr,
          line: 'yr',
          dragShift: left + componentWidth - curComponentStyle.width,
          lineShift: left + componentWidth,
        },
      ],
    }

    const needToShow = []
    Object.keys(conditions).forEach((key) => {
      conditions[key].forEach((condition) => {
        if (!condition.isNearly) return

        condition.lineNode.style[key] = `${condition.lineShift}px`
        needToShow.push(condition.line)
      })
    })

    if (needToShow.length) {
      chooseTheTureLine(needToShow, isDownward, isRightward)
    }
  })
}

const chooseTheTureLine = (needToShow, isDownward, isRightward) => {
  // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
  // 如果鼠标向下移动 则按从下到上的顺序显示横向 否则按相反顺序显示

  if (isRightward) {
    if (needToShow.includes('yr')) {
      lineStatus.yr = true
    } else if (needToShow.includes('yc')) {
      lineStatus.yc = true
    } else if (needToShow.includes('yl')) {
      lineStatus.yl = true
    }
  } else {
    if (needToShow.includes('yl')) {
      lineStatus.yl = true
    } else if (needToShow.includes('yc')) {
      lineStatus.yc = true
    } else if (needToShow.includes('yl')) {
      lineStatus.yl = true
    }
  }

  if (isDownward) {
    if (needToShow.includes('xb')) {
      lineStatus.xb = true
    } else if (needToShow.includes('xc')) {
      lineStatus.xc = true
    } else if (needToShow.includes('xt')) {
      lineStatus.xt = true
    }
  } else {
    if (needToShow.includes('xt')) {
      lineStatus.xt = true
    } else if (needToShow.includes('xc')) {
      lineStatus.xc = true
    } else if (needToShow.includes('xb')) {
      lineStatus.xb = true
    }
  }
}

const hideLine = () => {
  Object.keys(lineStatus).forEach((line) => {
    lineStatus[line] = false
  })
}
</script>

<template>
  <div class="mark-line">
    <div
      v-for="line in lines"
      v-show="lineStatus[line] || false"
      :key="line"
      class="line"
      :ref="(el) => (lineRefs[line] = el)"
      :class="line.includes('x') ? 'xline' : 'yline'"
    ></div>
  </div>
</template>

<style lang="less" scoped>
.mark-line {
  height: 100%;

  .line {
    background-color: #59c7f9;
    position: absolute;
    z-index: 1000;
  }

  .xline {
    width: 100%;
    height: 1px;
  }

  .yline {
    height: 100%;
    width: 1px;
  }
}
</style>
