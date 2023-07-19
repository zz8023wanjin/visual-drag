<script setup>
import ComponentList from '@/components/ComponentList.vue'
import Editor from '@/components/Editor/index.vue'

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()

  const index = e.dataTransfer.getData('index')
  console.log(index)
}

const handleDragOver = (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}
</script>

<template>
  <div class="home">
    <main>
      <!-- 左侧物料库 -->
      <section class="left">
        <ComponentList />
      </section>

      <!-- 中间画布 -->
      <section class="center">
        <div class="content" @drop="handleDrop" @dragover="handleDragOver">
          <Editor />
        </div>
      </section>

      <!-- 右边属性列表 -->
      <section class="right"></section>
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
