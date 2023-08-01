import { defineStore } from 'pinia'

export const useContextMenu = defineStore('contextMenu', {
  state: () => ({
    menuTop: 0,
    menuLeft: 0,
    menuShow: false,
  }),
  getters: {},
  actions: {
    showContextMenu({ top, left }) {
      this.menuShow = true
      this.menuTop = top
      this.menuLeft = left
    },
    hideContextMenu() {
      this.menuShow = false
    },
  },
})
