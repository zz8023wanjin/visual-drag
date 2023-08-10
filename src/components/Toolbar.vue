<script setup>
import { useSnapshotStore } from '@/store/snapshot'
import Preview from './Editor/Preview.vue'
import { ref } from 'vue'
import { useCommonStore } from '@/store/common'
import toast from '@/utils/toast'

const isShowPreview = ref(false)
const isScreenshot = ref(false)

const snapshotStore = useSnapshotStore()
const commonStore = useCommonStore()

const undo = () => {
  snapshotStore.undo()
}

const redo = () => {
  snapshotStore.redo()
}

const preview = (_isScreenshot) => {
  isShowPreview.value = true
  isScreenshot.value = _isScreenshot
}

const handlePreviewChange = () => {
  isShowPreview.value = false
}

const save = () => {
  localStorage.setItem('canvasData', JSON.stringify(commonStore.componentData))
  localStorage.setItem('canvasStyle', JSON.stringify(commonStore.canvasStyleData))
  toast('保存成功', 'success')
}
</script>

<template>
  <div class="toolbar">
    <el-button @click="undo">撤销</el-button>
    <el-button @click="redo">重做</el-button>
    <el-button style="margin-left: 10px" @click="preview(false)">预览</el-button>
    <el-button @click="save">保存</el-button>

    <!-- 预览 -->
    <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
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
