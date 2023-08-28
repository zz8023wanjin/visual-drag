<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const stopPropagation = (e) => {
  e.stopPropagation()
}

const hide = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="props.modelValue" class="modal-bg" @click="hide">
    <div class="fadeInLeft animated modal" @click="stopPropagation">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="less">
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;

  .modal {
    width: 400px;
    background: #fff;
    height: 100%;
  }
}
</style>
