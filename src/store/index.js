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
    }
  }
})