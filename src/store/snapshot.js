import { defineStore } from 'pinia'
import { useCommonStore } from './common'
import { cloneDeep } from 'lodash-es'

export const useSnapshotStore = defineStore('snapshot', {
  state: () => ({
    snapshotData: [],
    snapshotIndex: -1,
  }),
  getters: {},
  actions: {
    undo() {
      const commonStore = useCommonStore()

      if (this.snapshotIndex >= 0) {
        this.snapshotIndex--
        const componentData = cloneDeep(this.snapshotData[this.snapshotIndex])
        if (commonStore.curComponent?.component) {
          // 如果当前组件不在 componentData 中，则清空
          const needClean = componentData.find((component) => component.id === commonStore.curComponent.id)
          
          if (needClean) {
            commonStore.setCurComponent({
              component: null,
              index: null,
            })
          }
        }

        commonStore.setComponentData(componentData)
      }
    },
    redo() {
      const commonStore = useCommonStore()

      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.snapshotIndex++
        const componentData = this.snapshotData[this.snapshotIndex]

        commonStore.setComponentData(componentData)
      }
    },
    recordSnapshot() {
      const commonStore = useCommonStore()

      this.snapshotData[++this.snapshotIndex] = cloneDeep(commonStore.componentData)
      // 如果在撤销的过程中，添加新的快照时，需要清理掉后面的快照
      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.snapshotData = this.snapshotData.slice(0, this.snapshotIndex + 1)
      }
    },
  },
})
