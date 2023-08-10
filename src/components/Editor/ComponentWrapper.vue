<script setup>
import { getStyle } from '@/utils/style'

const props = defineProps({
  config: {
    type: Object,
    default: () => {},
  },
})

const onClick = () => {}
</script>

<template>
  <div @click="onClick">
    <component
      :is="props.config.component"
      ref="component"
      class="component"
      :style="getStyle(props.config.style)"
      :prop-value="props.config.propValue"
      :element="props.config"
      :request="props.config.request"
      :linkage="props.config.linkage"
    />
  </div>
</template>

<style scoped lang="less">
.component {
  position: absolute;
}
</style>
