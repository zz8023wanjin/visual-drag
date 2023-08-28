<script setup>
import { onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  propValue: {
    type: Object,
    default: () => {},
  },
  element: {
    type: Object,
    default: () => {},
  },
})

const canvas = ref()

const state = reactive({
  width: 0,
  height: 0,
  img: null,
  ctx: null,
  isFirst: true,
})

watch(
  () => props.element.style.width,
  () => {
    drawImage()
  }
)
watch(
  () => props.element.style.height,
  () => {
    drawImage()
  }
)
watch(
  () => props.propValue?.flip.vertical,
  () => {
    mirrorFlip()
  }
)
watch(
  () => props.propValue?.flip.horizontal,
  () => {
    mirrorFlip()
  }
)

onMounted(() => {
  state.ctx = canvas.value.getContext('2d')
  drawImage()
})

const drawImage = () => {
  const { height, width } = props.element.style

  canvas.value.width = width
  canvas.value.height = height
  if (state.isFirst) {
    state.isFirst = false
    state.img = document.createElement('img')
    state.img.src = props.propValue.url
    state.img.onload = () => {
      state.ctx.drawImage(state.img, 0, 0, width, height)
      mirrorFlip()
    }
  } else {
    mirrorFlip()
  }
}

const mirrorFlip = () => {
  const { vertical, horizontal } = props.propValue.flip
  const { width, height } = props.element.style
  const hValue = horizontal ? -1 : 1
  const vValue = vertical ? -1 : 1

  // 清除图片
  state.ctx.clearRect(0, 0, width, height)
  // 平移图片
  state.ctx.translate(width / 2 - (width * hValue) / 2, height / 2 - (height * vValue) / 2)
  // 对称镜像 
  state.ctx.scale(hValue, vValue)
  state.ctx.drawImage(state.img, 0, 0, width, height)
  // 还原坐标点
  state.ctx.setTransform(1, 0, 0, 1, 0, 0)
}
</script>

<template>
  <div class="Picture">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style lang="less" scoped>
.Picture {
  overflow: hidden;
}
</style>
