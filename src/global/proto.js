import store from '@/store'

class Widget {
  constructor(opt) {
    this.height = opt.height * store.state.canvasZoomLevel
    this.width = opt.width * store.state.canvasZoomLevel
    this.transform = [100, 100]
    this.zLevel = opt.zLevel || 1
    this.rotate = opt.rotate || 0
    this.backgroundColor = opt.backgroundColor || null
    this.name = opt.name
    this.component = opt.component
    this.visible = opt.visible || true
    this.context = opt.context || {}
  }
  get left() {
    return this.transform[0] + store.state.screenRect[0]
  }
  get top() {
    return this.transform[1] + store.state.screenRect[1]
  }
  get right() {
    return this.left + this.width
  }
  get bottom() {
    return this.top + this.height
  }
}

// fuck the babel
export {
  Widget
}