<script setup>
import { useCommonStore } from '@/store/common'
import { getCanvasStyle } from '@/utils/style'
import { changeStyleWithScale } from '@/utils/translate'
import { cloneDeep } from 'lodash-es'
import { ref, onBeforeMount } from 'vue'
import ComponentWrapper from './ComponentWrapper.vue'
import { toPng } from 'html-to-image'

const emit = defineEmits(['close'])

const props = defineProps({
  isScreenshot: {
    type: Boolean,
    default: false,
  },
})

const commonStore = useCommonStore()

const container = ref()
const copyData = ref([])

onBeforeMount(() => {
  copyData.value = cloneDeep(commonStore.componentData)
})

const onClose = () => {
  emit('close')
}

const htmlToImage = () => {
  toPng(container.value.querySelector('.canvas'))
    .then((dataUrl) => {
      const a = document.createElement('a')
      a.setAttribute('download', 'screenshot')
      a.href = dataUrl
      a.click()
    })
    .catch((error) => {
      console.error('oops, something went wrong!', error)
    })
    .finally(onClose)
}
</script>

<template>
  <div class="bg" ref="container">
    <el-button v-if="!isScreenshot" class="close" @click="onClose">关闭</el-button>
    <el-button v-else class="close" @click="htmlToImage">确定</el-button>

    <div class="canvas-container">
      <div
        class="canvas"
        :style="{
          ...getCanvasStyle(commonStore.canvasStyleData),
          width: changeStyleWithScale(commonStore.canvasStyleData.width, commonStore.canvasStyleData.scale) + 'px',
          height: changeStyleWithScale(commonStore.canvasStyleData.height, commonStore.canvasStyleData.scale) + 'px',
        }"
      >
        <ComponentWrapper v-for="(item, index) in copyData" :key="index" :config="item" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    overflow: auto;

    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
