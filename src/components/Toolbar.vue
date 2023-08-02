<script setup>
import { useSnapshotStore } from '@/store/snapshot'
import { ElButton } from 'element-plus'

const snapshotStore = useSnapshotStore()

const undo = () => {
  snapshotStore.undo()
}

const redo = () => {
  snapshotStore.redo()
}
</script>

<template>
  <div class="toolbar">
    <ElButton @click="undo">撤销</ElButton>
    <ElButton @click="redo">重做</ElButton>
  </div>
</template>

<style scoped lang="less">
.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #ddd;
}
</style>
