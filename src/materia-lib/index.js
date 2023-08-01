import { defineAsyncComponent } from 'vue'

const components = ['VButton']

export default function registerGlobalComponents(app) {
  components.forEach(async (key) => {
    const component = defineAsyncComponent(() => import(`./${key}/Component.vue`))
    app.component(key, component)
  })
}
