<script setup>
import { useCommonStore } from '@/store/common'
import { useContextMenu } from '@/store/contextMenu'
import { useCopyStore } from '@/store/copy'
import { useSnapshotStore } from '@/store/snapshot';

// store
const store = useContextMenu()
const commonStore = useCommonStore()
const copyStore = useCopyStore()
const snapshotStore = useSnapshotStore()

const handleMouseUp = () => {
  commonStore.setClickComponentStatus(true)
}

const copy = () => {
  copyStore.copy()
}

const paste = () => {
  copyStore.paste(true)
  snapshotStore.recordSnapshot()
}

const cut = () => {
  copyStore.cut()
}

const deleteComponent = () => {
  commonStore.deleteComponent()
  snapshotStore.recordSnapshot()
}

const lock = () => {}

const topComponent = () => {
  commonStore.topComponent()
  snapshotStore.recordSnapshot()
}

const bottomComponent = () => {
  commonStore.bottomComponent()
  snapshotStore.recordSnapshot()
}

const upComponent = () => {
  commonStore.upComponent()
  snapshotStore.recordSnapshot()
}

const downComponent = () => {
  commonStore.downComponent()
  snapshotStore.recordSnapshot()
}

const unlock = () => {}
</script>

<template>
  <div v-show="store.menuShow" class="contextmenu" :style="{ top: store.menuTop + 'px', left: store.menuLeft + 'px' }">
    <ul @mouseup="handleMouseUp">
      <template v-if="commonStore.curComponent">
        <li @click="copy">复制</li>
        <li @click="paste">粘贴</li>
        <li @click="cut">剪切</li>
        <li @click="deleteComponent">删除</li>
        <li @click="lock">锁定</li>
        <li @click="topComponent">置顶</li>
        <li @click="bottomComponent">置底</li>
        <li @click="upComponent">上移</li>
        <li @click="downComponent">下移</li>
      </template>
      <li v-else @click="paste">粘贴</li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.contextmenu {
  position: absolute;
  z-index: 1000;

  ul {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    padding: 6px 0;

    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
