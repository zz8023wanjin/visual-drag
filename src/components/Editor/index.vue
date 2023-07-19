<script setup></script>

<template>
  <div class="editor"></div>
</template>

<style scoped lang="less">
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
}
</style>
