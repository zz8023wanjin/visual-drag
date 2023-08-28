<script setup>
import { onMounted, ref } from 'vue'

const list = ref(['1', '2', '3'])
const refs = ref([])

onMounted(() => {
  console.log('refs', refs.value)
})
</script>

<template>
  <div class="test">
    <ul>
      <li v-for="(item, idx) in list" :key="idx" :ref="(el) => (refs[idx] = el)">{{ item }}</li>
    </ul>
  </div>
</template>

<style scoped lang="less"></style>
