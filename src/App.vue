<script setup>
import { provide } from 'vue'
import Home from './pages/Home/index.vue'
import { EventBus } from './utils/eventBus'
import Test from './pages/Test.vue'

provide('EventBus', EventBus)
</script>

<template>
  <div>
    <Home />
    <!-- <Test /> -->
  </div>
</template>

<style scoped></style>
