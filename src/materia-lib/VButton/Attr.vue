<script setup>
import { useCommonStore } from '@/store/common'
import CommontAttr from '../common/CommonAttr.vue'

const commonStore = useCommonStore()
</script>

<template>
  <div class="attr-list">
    <CommontAttr />
    <el-form>
      <el-form-item label="内容">
        <el-input v-model="commonStore.curComponent.propValue" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less"></style>
