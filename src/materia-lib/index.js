import { defineAsyncComponent } from 'vue'

const components = ['VButton']

export default function registerGlobalComponents(app) {
  components.forEach(async (key) => {
    const component = defineAsyncComponent(() => import(`./${key}/Component.vue`))
    const attr = defineAsyncComponent(() => import(`./${key}/Attr.vue`))
    app.component(key, component).component(`${key}Attr`, attr)
  })
}
