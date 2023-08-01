import toast from '@/utils/toast'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { useCommonStore } from './common'
import { useContextMenu } from './contextMenu'
import generateID from '@/utils/generateID'

export const useCopyStore = defineStore('copy', {
  state: () => ({
    // 复制粘贴剪贴
    copyData: null,
    isCut: false,
  }),
  getters: {},
  actions: {
    copy() {
      const commonStore = useCommonStore()

      if (!commonStore.curComponent) {
        toast('请选择组件')
        return
      }

      this._copyData()
      this.isCut = false
    },
    _copyData() {
      const commonStore = useCommonStore()

      this.copyData = {
        data: cloneDeep(commonStore.curComponent),
        index: commonStore.curComponentIndex,
      }
    },
    paste(isMouse) {
      const commonStore = useCommonStore()
      const contextMenuStore = useContextMenu()

      if (!this.copyData.data) {
        toast('请选择组件')
        return
      }

      const data = deepCopyHelper(this.copyData.data)

      if (isMouse) {
        data.style.top = contextMenuStore.menuTop
        data.style.left = contextMenuStore.menuLeft
      } else {
        data.style.top += 10
        data.style.left += 10
      }

      commonStore.addComponent(data, this.copyData.index)

      if (this.isCut) {
        this.copyData = null
      }
    },
    cut() {
      const commonStore = useCommonStore()

      if (!commonStore.curComponent) {
        toast('请选择组件')
        return
      }

      // 如果重复剪切，则需要回复上一次剪切的内容
      this._restorePreCutData()
      this._copyData()

      commonStore.deleteComponent()
      this.isCut = true
    },
    _restorePreCutData() {
      const commonStore = useCommonStore()

      if (this.isCut && this.copyData) {
        const data = cloneDeep(this.copyData.data)
        const index = this.copyData.index
        commonStore.addComponent(data, index)
        // 如果当前组件的索引大于等于插入索引，需要加一，因为当前组件往后移了一位
        if (commonStore.curComponentIndex >= index) {
          commonStore.curComponentIndex++
        }
      }
    },
  },
})

function deepCopyHelper(data) {
  const result = cloneDeep(data)
  result.id = generateID()
  if (result.component === 'Group') {
    result.propValue.forEach((component, i) => {
      result.propValue[i] = deepCopyHelper(component)
    })
  }

  return result
}
