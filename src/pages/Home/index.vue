<script setup>
import ComponentList from '@/components/ComponentList.vue'
import Editor from '@/components/Editor/index.vue'
import { cloneDeep } from 'lodash-es'
import componentList from '@/materia-lib/component-list'
import { useComposeStore } from '@/store/compose'
import { useCommonStore } from '@/store/common'
import { onMounted, ref } from 'vue'
import generateID from '@/utils/generateID'
import { useContextMenu } from '@/store/contextMenu'
import Toolbar from '@/components/Toolbar.vue'
import { useSnapshotStore } from '@/store/snapshot'

const activeName = ref('attr')

// store
const composeStore = useComposeStore()
const commonStore = useCommonStore()
const contextMenuStore = useContextMenu()
const snapshotStore = useSnapshotStore()

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()

  const index = e.dataTransfer.getData('index')
  const rectInfo = composeStore.editor.getBoundingClientRect()
  if (index) {
    const component = cloneDeep(componentList[index])
    component.style.top = e.clientY - rectInfo.y
    component.style.left = e.clientX - rectInfo.x
    component.id = generateID()

    commonStore.addComponent(component)
    snapshotStore.recordSnapshot()
  }
}

const restore = () => {
  if (localStorage.getItem('canvasData')) {
    commonStore.setComponentData(JSON.parse(localStorage.getItem('canvasData')))
  }

  if (localStorage.getItem('canvasStyle')) {
    commonStore.setCanvasStyle(JSON.parse(localStorage.getItem('canvasStyle')))
  }
}

// 初始化，恢复保存的画布数据
restore()

onMounted(() => {
  composeStore.getEditor()
})

const handleDragOver = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

const deselectCurComponent = (e) => {
  if (!commonStore.isClickComponent) {
    commonStore.setCurComponent(null, null)
  }

  // 0-左击 1-滚轮 2-右击
  if (e.button !== 2) {
    contextMenuStore.hideContextMenu()
  }
}

const handleMouseDown = (e) => {
  e.stopPropagation()

  commonStore.setInEditorStatus(true)
  commonStore.setClickComponentStatus(false)
}
</script>

<template>
  <div class="home">
    <Toolbar />

    <main>
      <!-- 左侧物料库 -->
      <section class="left">
        <ComponentList />
      </section>

      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mouseup="deselectCurComponent"
          @mousedown="handleMouseDown"
        >
          <Editor />
        </div>
      </section>

      <!-- 右边属性列表 -->
      <section class="right">
        <el-tabs v-if="commonStore.curComponent" v-model="activeName" stretch>
          <el-tab-pane label="属性" name="attr">
            <component :is="commonStore.curComponent.component + 'Attr'" />
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation" style="padding-top: 20px">
            <AnimationList />
          </el-tab-pane>
          <el-tab-pane label="事件" name="events" style="padding-top: 20px">
            <EventList />
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<style scoped lang="less">
.home {
  height: 100vh;
  background: #fff;
  main {
    position: relative;
    height: calc(100% - 64px);

    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;

      & > div {
        overflow: auto;

        &:first-child {
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 0;
      .el-select {
        width: 100%;
      }
    }

    .center {
      margin-left: 200px;
      margin-right: 288px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
