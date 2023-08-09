import toast from '@/utils/toast'
import { defineStore } from 'pinia'
import { swapArray } from '@/utils/index'

export const useCommonStore = defineStore('common', {
  state: () => ({
    // editor style
    canvasStyleData: {
      width: 1200,
      height: 740,
      scale: 100,
      color: '#000',
      opacity: 1,
      background: '#fff',
      fontSize: 14,
    },
    isInEditor: false, // 用于判断复制、粘贴组件时是否生效
    // editor data
    componentData: [],
    curComponent: null,
    curComponentIndex: null,
    // 点击画布时是否点中组件，主要用于取消选中组件用。
    // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
    isClickComponent: false,
  }),
  getters: {},
  actions: {
    setComponentData(componentData = []) {
      this.componentData = componentData
    },
    addComponent(component, index) {
      if (index !== undefined) {
        this.componentData.splice(index, 0, component)
      } else {
        this.componentData.push(component)
      }
    },
    setCurComponent(component, index) {
      this.curComponent = component
      this.curComponentIndex = index
    },
    setShapeStyle({ top, left, height, width }) {
      if (top) this.curComponent.style.top = Math.round(top)
      if (left) this.curComponent.style.left = Math.round(left)
      if (height) this.curComponent.style.height = Math.round(height)
      if (width) this.curComponent.style.width = Math.round(width)
    },
    setShapeSingleStyle({ key, value }) {
      this.curComponent.style[key] = value
    },
    deleteComponent(index) {
      if (!index) {
        index = this.curComponentIndex
      }

      if (index === this.curComponentIndex) {
        this.curComponent = null
        this.curComponentIndex = null
      }

      if (/\d/.test(index)) {
        this.componentData.splice(index, 1)
      }
    },
    setInEditorStatus(status) {
      this.isInEditor = status
    },
    setClickComponentStatus(status) {
      this.isClickComponent = status
    },
    // 上移
    upComponent() {
      if (this.curComponentIndex < this.componentData.length - 1) {
        swapArray(this.componentData, this.curComponentIndex, this.curComponentIndex + 1)
        this.curComponentIndex++
      } else {
        toast('已经到顶了')
      }
    },
    // 下移
    downComponent() {
      if (this.curComponentIndex > 0) {
        swapArray(this.componentData, this.curComponentIndex, this.curComponentIndex - 1)
        this.curComponentIndex--
      } else {
        toast('已经到底了')
      }
    },
    // 置顶
    topComponent() {
      if (this.curComponentIndex < this.componentData.length - 1) {
        this.componentData.splice(this.curComponentIndex, 1)
        this.componentData.push(this.curComponent)
        this.curComponentIndex = this.componentData.length - 1
      } else {
        toast('已经到顶了')
      }
    },
    // 置底
    bottomComponent() {
      if (this.curComponentIndex > 0) {
        this.componentData.splice(this.curComponentIndex, 1)
        this.componentData.unshift(this.curComponent)
        this.curComponentIndex = 0
      } else {
        toast('已经到底了')
      }
    },
  },
})
