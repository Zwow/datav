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
    zoom: 1,
    canvasHeight: 1080,
    zoomerTransform: [0, 0],
    // 自适应大小时的缩放值
    properZoomLevel: 1,
    screenHeight: 1080,
    screenWidth: 1920,
    backgroundColor: '#313b44'
  },
  getters: {
    SCREEN_LEFT: ({ SCREEN_LEFT }) => SCREEN_LEFT,
    SCREEN_TOP: ({ SCREEN_TOP }) => SCREEN_TOP,
    canvasZoomLevel: ({ zoom }) => zoom,
    canvasHeight: ({ canvasHeight }) => canvasHeight,
    canvasProperZoomLevel: ({ properZoomLevel }) => properZoomLevel,
    screenHeight: ({ screenHeight }) => screenHeight,
    screenWidth: ({ screenWidth }) => screenWidth,
    backgroundColor: ({ backgroundColor }) => backgroundColor,
    zoomerTransform: ({ zoomerTransform }) => zoomerTransform
  },
  mutations: {
    setCanvasZoom(state, value) {
      state.zoom = Math.min(Math.max(value, .2), 1.5)
    },
    setCanvasHeight(state, value) {
      state.canvasHeight = value
    },
    setZoomerTransform(state, arr) {
      state.zoomerTransform = arr
    },
    setProperZoomLevel(state, value) {
      state.properZoomLevel = value
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