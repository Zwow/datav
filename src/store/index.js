import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 因为初始页面显示是自适应大小，所以zoom初始化必须是1
    // 以保证第一次缩放图表时能获得正确大小
    zoom: 1,
    screenHeight: 1080,
    screenWidth: 1920,
    backgroundColor: '#313b44'
  },
  getters: {
    canvasZoomLevel: ({ zoom }) => zoom,
    screenHeight: ({ screenHeight }) => screenHeight,
    screenWidth: ({ screenWidth }) => screenWidth,
    backgroundColor: ({ backgroundColor }) => backgroundColor
  },
  mutations: {
    setCanvasZoom(state, value) {
      console.log('zoom set to: ', Math.min(Math.max(value, .2), 1.5))
      state.zoom = Math.min(Math.max(value, .2), 1.5)
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
  }
})