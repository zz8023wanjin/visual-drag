import { defineStore } from "pinia";

export const useComposeStore = defineStore('compose', {
  state: () => ({
    editor: null
  }),
  actions: {
    getEditor() {
      this.editor = document.getElementById('editor')
    }
  }
})