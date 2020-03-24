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
    groups: [
      {
        name: '分组1',
        index: 1,
        data: [0]
      },
      {
        name: '分组2',
        index: 2,
        data: [1]
      },
      {
        name: '分组3',
        index: 2,
        data: []
      }
    ],
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
      if (state.selectedWidget.indexOf(index) === -1) {
        state.selectedWidget.push(index)
      }
    },
    removeSelectedWidget(state, index) {
      state.selectedWidget.splice(index, 1)
    },
    group(state, indexArr) {
      const indexes = JSON.parse(JSON.stringify(indexArr || state.selectedWidget))
      let index = 0
      indexes.forEach(i => {
        // 找出最高层，成组后整个组就取最高层的index
        if (state.widgets[i].index > index) index = state.widgets[i].index
        // 如果组件之前已有组，则移出组
        for (let j = 0; j < state.groups.length; j++) {
          const { data } = state.groups[j]
          const exist = data.indexOf(i)
          if (exist !== -1) {
            data.splice(exist, 1)
            break
          }
        }
      })
      state.groups.push({
        name: `分组${state.groups.length + 1}`,
        index,
        data: indexes
      })
      console.log('groups: ', state.groups)
    }
  }
})