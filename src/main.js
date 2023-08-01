import { createApp } from 'vue'
import '@/assets/styles/index.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import registerGlobalComponents from './materia-lib'
import ElementPlus from 'element-plus'

const pinia = createPinia()
const app = createApp(App)

// 注册物料库中的组件
registerGlobalComponents(app)

app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
