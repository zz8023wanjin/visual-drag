<script setup>
import { useCommonStore } from '@/store/common'
import Modal from './Modal.vue'
import { ref } from 'vue'
import animationClassData from '@/utils/animationClassData'
import $runAnimation from '@/utils/runAnimation'

const commonStore = useCommonStore()

const isShowAnimation = ref(false)
const animationActiveName = ref('进入')
const refs = ref({})

const removeAnimation = (index) => {}

const handleAnimationSetting = (index) => {}

const runAnimation = async (animate) => {
  if (animate.pending) return

  animate.pending = true
  await $runAnimation(refs.value[animate.value], [animate])

  // 防止无限触发同一元素的动画
  setTimeout(() => {
    animate.pending = false
  }, 100)
}

const addAnimation = (animate) => {
  commonStore.addAnimation(animate)
}

const previewAnimate = () => {}
</script>

<template>
  <div class="animation-list">
    <div class="div-animation">
      <el-button @click="isShowAnimation = true">添加动画</el-button>
      <el-button @click="previewAnimate">预览动画</el-button>
      <div class="flex-col-center">
        <el-tag
          v-for="(tag, index) in commonStore.curComponent.animations"
          :key="index"
          closable
          @close="removeAnimation(index)"
        >
          {{ tag.label }}
          <i class="cursor el-icon-setting" @click="handleAnimationSetting(index)"></i>
        </el-tag>
      </div>
    </div>

    <!-- 选择动画 -->
    <Modal v-model="isShowAnimation">
      <el-tabs v-model="animationActiveName">
        <el-tab-pane v-for="item in animationClassData" :key="item.label" :label="item.label" :name="item.label">
          <el-scrollbar class="animate-container">
            <div
              v-for="animate in item.children"
              :ref="(el) => (refs[animate.value] = el)"
              :key="animate.value"
              class="animate"
              @mouseenter="runAnimation(animate)"
              @click="addAnimation(animate)"
            >
              <div>
                {{ animate.label }}
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </div>
</template>

<style scoped lang="less">
.animation-list {
  .cursor {
    cursor: pointer;
  }

  .div-animation {
    text-align: center;

    div {
      margin-top: 20px;
    }

    .el-tag {
      margin: auto;
      margin-bottom: 10px;
    }
  }

  ::v-deep .el-scrollbar__view {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 10px;

    .animate {
      cursor: pointer;
      div {
        width: 100px;
        height: 60px;
        background: #f5f8fb;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 12px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #333;
        border-radius: 3px;
        user-select: none;
        cursor: pointer;
      }
    }
  }
}
</style>
