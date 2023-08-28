// 自定义事件
const events = {
  redirect(url) {
    if (url) {
      window.location.href = url
    }
  },
  alert(msg) {
    if (msg) {
      window.alert(msg)
    }
  },
}

const eventList = [
  {
    key: 'redirect',
    label: '跳转事件',
    param: '',
  },
  {
    key: 'alert',
    label: 'alert 事件',
    param: '',
  },
]

export { eventList, events }
