import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    zoom: 50,
  },
  getters: {
    canvasZoomLevel: ({ zoom }) => zoom
  },
  mutations: {
    setCanvasZoom(state, value) {
      state.zoom = value
    }
  }
})