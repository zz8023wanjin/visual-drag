<script setup>
import { useCommonStore } from '@/store/common'
import CommontAttr from '../common/CommonAttr.vue'

const commonStore = useCommonStore()
</script>

<template>
  <div class="attr-list">
    <CommontAttr></CommontAttr>
    <el-form>
      <el-form-item label="镜像翻转">
        <div style="clear: both">
          <el-checkbox v-model="commonStore.curComponent.propValue.flip.horizontal" label="horizontal"
            >水平翻转</el-checkbox
          >
          <el-checkbox v-model="commonStore.curComponent.propValue.flip.vertical" label="vertical"
            >垂直翻转</el-checkbox
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less"></style>
