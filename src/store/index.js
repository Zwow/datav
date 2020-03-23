import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // screen offset from canvas
    SCREEN_LEFT: 30,
    SCREEN_TOP: 30,
    // 因为初始页面显示是自适应大小，所以zoom初始化必须是1
    // 以保证第一次缩放图表时能获得正确大小
    canvasZoomLevel: 1,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasScroll: [0, 0],
    // 自适应大小时的缩放值
    canvasProperZoomLevel: 1,
    screenHeight: 1080,
    screenWidth: 1920,
    widgets: [],
    selectedWidget: [],
    groups: [],
    backgroundColor: '#313b44'
  },
  getters: {
    displayScreenWidth: ({ canvasZoomLevel, screenWidth }) => canvasZoomLevel * screenWidth,
    displayScreenHeight: ({ canvasZoomLevel, screenHeight }) => canvasZoomLevel * screenHeight,
    // 不应该包含边距，因为边距SCREEN_TOP/LEFT是固定的，而displayScreenWidth是变化的
    screenWrapperWidth: (
      { canvasWidth, SCREEN_LEFT, screenWidth, canvasProperZoomLevel },
      { displayScreenWidth }
    ) => (canvasWidth - 2 * SCREEN_LEFT) / (canvasProperZoomLevel * screenWidth) * displayScreenWidth,
    screenWrapperHeight: (
      { canvasHeight, SCREEN_TOP, screenHeight, canvasProperZoomLevel },
      { displayScreenHeight }
    ) => (canvasHeight - 2 * SCREEN_TOP) / (canvasProperZoomLevel * screenHeight) * displayScreenHeight
  },
  mutations: {
    setCanvasZoomLevel(state, value) {
      state.canvasZoomLevel = Math.min(Math.max(value, .2), 1.5)
    },
    setCanvasWidth(state, value) {
      state.canvasWidth = value
    },
    setCanvasHeight(state, value) {
      state.canvasHeight = value
    },
    setCanvasScroll(state, arr) {
      state.canvasScroll = arr
    },
    setProperZoomLevel(state, value) {
      state.canvasProperZoomLevel = value
    },
    setScreenWidth(state, value) {
      state.screenWidth = value
    },
    setScreenHeight(state, value) {
      state.screenHeight = value
    },
    setBackgroundColor(state, value) {
      state.backgroundColor = value
    },
    addWidgets(state, widget) {
      if (Array.isArray(widget)) {
        state.widgets.push(...widget)
      } else {
        state.widgets.push(widget)
      }
    },
    removeWidget(state, index) {
      if (Array.isArray(index)) {
        state.widgets = state.widgets.filter((e, id) => this.selectedWidget.indexOf(id) === -1)
      } else {
        state.widgets.splice(index, 1)
      }
    },
    editWidgetByKey(state, { index, key, value }) {
      Vue.set(state.widgets[index], key, value)
    },
    setWidgetTransform(state, { index, transformIndex, value }) {
      Vue.set(state.widgets[index].transform, transformIndex, value)
    },
    emptySelectedWidget(state) {
      state.selectedWidget = []
    },
    setSelectedWidget(state, indexArr) {
      state.selectedWidget = indexArr
    },
    addSelectedWidget(state, index) {
      state.selectedWidget.push(index)
    },
    removeSelectedWidget(state, index) {
      state.selectedWidget.splice(index, 1)
    },
    group(state, indexArr) {
      const indexes = JSON.parse(JSON.stringify(indexArr || state.selectedWidget))
      state.groups.push(indexes)
      console.log('groups: ', state.groups)
    }
  }
})