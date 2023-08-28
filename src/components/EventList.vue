<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'
import { useCommonStore } from '@/store/common'
import { eventList as _eventList } from '@/utils/events'

const commonStore = useCommonStore()

const isShowEvent = ref(false)
const evnetActiveName = ref('redirect')
const eventList = ref(_eventList)

const showEventModal = () => {
  isShowEvent.value = true
}

const addEvent = (event, param) => {
  isShowEvent.value = false
  commonStore.addEvent({ event, param })
}

const removeEvent = (event) => {
  commonStore.removeEvent(event)
}
</script>

<template>
  <div class="event-list">
    <div class="div-events">
      <el-button @click="showEventModal">添加事件</el-button>
      <div class="flex-col-center">
        <el-tag
          v-for="event in Object.keys(commonStore.curComponent.events)"
          :key="event"
          closable
          @close="removeEvent(event)"
        >
          {{ event }}
        </el-tag>
      </div>
    </div>

    <!-- 选择事件弹窗 -->
    <Modal v-model="isShowEvent">
      <el-tabs v-model="evnetActiveName">
        <el-tab-pane
          v-for="item in eventList"
          :key="item.key"
          :label="item.label"
          :name="item.key"
          style="padding: 0 20px"
        >
          <el-input
            v-if="item.key === 'redirect'"
            v-model="item.param"
            type="textarea"
            placeholder="请输入完整的 URL"
          />
          <el-input
            v-if="item.key === 'alert'"
            v-model="item.param"
            type="textarea"
            placeholder="请输入要 alert 的内容"
          />
          <el-button style="margin-top: 20px" @click="addEvent(item.key, item.param)">确定</el-button>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </div>
</template>

<style scoped lang="less">
.event-list {
  .div-events {
    text-align: center;
    padding: 0 20px;

    .el-button {
      display: inline-block;
      margin-bottom: 10px;
    }

    .el-tag {
      margin: auto;
      margin-bottom: 10px;
    }
  }
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
