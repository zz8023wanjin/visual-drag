<script setup>
import componentList from '../materia-lib/component-list'

const handleDragStart = (e) => {
  e.dataTransfer.setData('index', e.target.dataset.index)
}
</script>

<template>
  <div class="component-list" @dragstart="handleDragStart">
    <div v-for="(item, idx) in componentList" class="list" :key="idx" :data-index="idx" :draggable="true">
      <span v-if="item.icon.substring(0, 2) === 'el'" :class="item.icon"></span>
      <span v-else class="iconfont" :class="`icon-${item.icon}`"></span>
    </div>
  </div>
</template>

<style scoped lang="less">
.component-list {
  height: 65%;
  padding: 10px;
  display: grid;
  grid-gap: 10px 19px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 40px);

  .list {
    width: 80px;
    height: 40px;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    color: #333;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      cursor: grabbing;
    }

    .iconfont {
      margin-right: 4px;
      font-size: 20px;
    }

    .icon-wenben,
    .icon-biaoge {
      font-size: 18px;
    }

    .icon-tupian {
      font-size: 16px;
    }
  }
}
</style>
