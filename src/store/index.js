import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let groupIdCounter = 0

class GroupNode {
  constructor(opt) {
    this.name = opt.name || '分组'
    this.data = opt.data
    this.descendents = opt.descendents || []
    this.parent = opt.parent
    this.id = ++groupIdCounter
  }
  getNode(id) {
    if (this.id === id) return this
    for (let i = 0; i < this.descendents.length; i++) {
      const target = this.descendents[i]
      if (target.id === id){
        return target
      }
      if (target.descendents.length) {
        const exist = target.getNode(id)
        if (exist) {
          return exist
        }
      }
    }
    return null
  }
  appendChild(node) {
    node.parent = this.id
    this.descendents.splice(0, 0, node)
  }
  insert(start, ...nodes) {
    nodes.forEach(e => e.parent = this.id)
    this.descendents.splice(start, 0, ...nodes)
  }
}

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
    groups: new GroupNode({ name: 'root' }),
    // 要把整个group node实例放进来
    // 方便多选时知道这些实例是不是同一个组下的
    selectedGroupNode: [],
    backgroundColor: '#181818'
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
    ) => (canvasHeight - 2 * SCREEN_TOP) / (canvasProperZoomLevel * screenHeight) * displayScreenHeight,
    isSiblingNode: ({ selectedGroupNode }) => {
      if (!selectedGroupNode.length) return false
      const parentId = selectedGroupNode[0].parent
      return selectedGroupNode.every(e => e.parent === parentId)
    }
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
    addWidgets({ groups, widgets }, widget) {
      const elements = Array.isArray(widget) ? widget : [widget]
      widgets.push(...elements)
      elements.forEach(e => {
        groups.appendChild(new GroupNode({
          name: e.name,
          data: e
        }))
      })
    },
    removeWidget({ widgets }, indexes) {
      if (Array.isArray(indexes)) {
        widgets = widgets.filter((e, index) => indexes.indexOf(index) === -1)
        return
      }
      widgets.splice(indexes, 1)
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
    removeSelectedWidget(state, id) {
      const index = state.selectedWidget.indexOf(id)
      if (index !== -1) {
        state.selectedWidget.splice(index, 1)
      }
    },
    addToSelectedGroup(state, groupNode) {
      state.selectedGroupNode.push(groupNode)
    },
    removeFromSelectedGroup({ selectedGroupNode }, groupId) {
      const index = selectedGroupNode.findIndex(e => e.id === groupId)
      if (index !== -1) {
        selectedGroupNode.splice(index, 1)
      }
    },
    setSelectedGroup(state, data) {
      state.selectedGroupNode = data
    },
    newGroup({ groups, selectedGroupNode }) {
      if (this.getters.isSiblingNode) {
        const parentNode = groups.getNode(selectedGroupNode[0].parent),
              node = new GroupNode({ name: '分组', parent: parentNode.id }),
              indexes = selectedGroupNode.map(e => parentNode.descendents.indexOf(e)).sort((a, b) => b - a)
        indexes.forEach(i => {
          const [item] = parentNode.descendents.splice(i, 1)
          node.appendChild(item)
        })
        parentNode.insert(indexes[indexes.length - 1], node)
        this.commit('setSelectedGroup', [node])
        console.log(groups)
      }
    }
  }
})