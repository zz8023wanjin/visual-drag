<script setup>
import { provide } from 'vue'
import Home from './pages/Home/index.vue'
import { EventBus } from './utils/eventBus'

provide('EventBus', EventBus)
</script>

<template>
  <div>
    <Home />
  </div>
</template>

<style scoped></style>
