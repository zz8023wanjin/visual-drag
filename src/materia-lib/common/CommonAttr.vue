<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useCommonStore } from '@/store/common'
import { optionMap, styleData, selectKey } from '@/utils/attr'

const data = reactive({
  activeName: '',
})

const commonStore = useCommonStore()

onMounted(() => {
  data.activeName = commonStore.curComponent.collapseName
})

const styleKeys = computed(() => {
  const curComponent = commonStore.curComponent

  if (curComponent) {
    const curComponentStyleKeys = Object.keys(curComponent.style)
    return styleData.filter((item) => curComponentStyleKeys.includes(item.key))
  }

  return []
})

const isIncludesColor = (str) => {
  return str.toLowerCase().includes('color')
}

const onChange = () => {}
</script>

<template>
  <div class="v-common-attr">
    <el-collapse v-model="data.activeName" accordion @change="onChange">
      <el-collapse-item title="通用样式" name="style">
        <el-form>
          <el-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="label">
            <el-color-picker
              v-if="isIncludesColor(key)"
              v-model="commonStore.curComponent.style[key]"
              show-alpha
            ></el-color-picker>
            <el-select v-else-if="selectKey.includes(key)" v-model="commonStore.curComponent.style[key]">
              <el-option
                v-for="item in optionMap[key]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input v-else v-model.number="commonStore.curComponent.style[key]" type="number" />
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <!-- <Request v-if="curComponent.request"></Request> -->
      <!-- <Linkage v-if="curComponent.linkage"></Linkage> -->
    </el-collapse>
  </div>
</template>

<style scoped lang="less">
.v-common-attr {
  .el-input-group__prepend {
    padding: 0 10px;
  }
}
</style>
