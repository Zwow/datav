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
  getNodeByData(dataArr, res = []) {
    if (this.data) {
      const index = dataArr.indexOf(this.data)
      if (index !== -1) {
        dataArr.splice(index, 1)
        res.push(this)
      }
      if (!dataArr.length) return res
    }
    for (let i = 0; i < this.descendents.length; i++) {
      const target = this.descendents[i]
      if (target.data) {
        const dIndex = dataArr.indexOf(target.data)
        if (dIndex !== -1){
          dataArr.splice(dIndex, 1)
          res.push(target)
          if (!dataArr.length) return res
        }
      }
      if (target.descendents.length) {
        target.getNodeByData(dataArr, res)
        if (!dataArr.length) return res
      }
    }
    return res
  }
  getNodeData(res = []) {
    if (this.data) {
      res.push(this.data)
      return res
    }
    for (let i = 0; i < this.descendents.length; i++) {
      this.descendents[i].getNodeData(res)
    }
    return res
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
    selectedWidgetBox: ({ selectedWidget, widgets }) => {
      if (!selectedWidget.length) return {}
      const first = widgets[selectedWidget[0]]
      const rect = {
        left: first.left,
        top: first.top,
        right: first.right,
        bottom: first.bottom,
        x: first.transform[0],
        y: first.transform[1]
      }
      for (let i = 1; i < selectedWidget.length; i++) {
        const widget = widgets[selectedWidget[i]]
        if (widget.left < rect.left) {
          rect.left = widget.left
          rect.x = widget.transform[0]
        }
        if (widget.top < rect.top) {
          rect.top = widget.top
          rect.y = widget.transform[1]
        }
        if (widget.right > rect.right) rect.right = widget.right
        if (widget.bottom > rect.bottom) rect.bottom = widget.bottom
      }
      rect.width = rect.right - rect.left
      rect.height = rect.bottom - rect.top
      return rect
    },
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
    // todo
    // 删除时记得把selectedWidget去掉，现在还没去，会报错
    removeWidget(state, indexes) {
      if (Array.isArray(indexes)) {
        state.widgets = state.widgets.filter((e, index) => indexes.indexOf(index) === -1)
        return
      }
      state.widgets.splice(indexes, 1)
    },
    editWidgetByKey(state, { index, key, value }) {
      Vue.set(state.widgets[index], key, value)
    },
    setWidgetTransform(state, { index, transformIndex, value }) {
      Vue.set(state.widgets[index].transform, transformIndex, value)
    },
    setSelectedWidget(state, indexArr) {
      state.selectedWidget = indexArr
      state.selectedGroupNode = state.groups.getNodeByData(indexArr.map(e => state.widgets[e]))
    },
    addSelectedWidget({ selectedWidget, selectedGroupNode, groups, widgets }, index) {
      if (selectedWidget.indexOf(index) === -1) {
        selectedWidget.push(index)
        selectedGroupNode.push(...groups.getNodeByData([widgets[index]]))
      }
    },
    addToSelectedGroup({ selectedGroupNode, selectedWidget, widgets }, groupNode) {
      selectedGroupNode.push(groupNode)
      groupNode.getNodeData().forEach(n => {
        const index = widgets.indexOf(n)
        if (index !== -1 && selectedWidget.indexOf(index) === -1) {
          selectedWidget.push(index)
        }
      })
    },
    removeFromSelectedGroup({ selectedGroupNode, selectedWidget, widgets }, groupId) {
      const index = selectedGroupNode.findIndex(e => e.id === groupId),
            node = selectedGroupNode[index]
      if (index !== -1) {
        selectedGroupNode.splice(index, 1)
        const item = node.getNode(groupId)
        if (item && item.data) {
          const dIndex = widgets.indexOf(item.data)
          if (dIndex !== -1) {
            const sIndex = selectedWidget.indexOf(dIndex)
            sIndex !== -1 && selectedWidget.splice(sIndex, 1)
          }
        }
      }
    },
    setSelectedGroup(state, data) {
      state.selectedGroupNode = data
      state.selectedWidget = []
      data.forEach(e => {
        e.getNodeData().forEach(n => {
          const index = state.widgets.indexOf(n)
          if (index !== -1 && state.selectedWidget.indexOf(index) === -1) {
            state.selectedWidget.push(index)
          }
        })
      })
    },
    orderWidgetZlevel({ groups, widgets }) {
      let total = widgets.length
      const func = (data) => {
        data.forEach(node => {
          if (node.data) {
            Vue.set(node.data, 'zLevel', --total)
          } else {
            func(node.descendents, total)
          }
        })
      }
      func(groups.descendents)
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
        this.commit('orderWidgetZlevel')
      }
    },
    swapGroupNode({ groups, selectedGroupNode }, i) {
      const target = groups.getNode(selectedGroupNode[0].parent).descendents,
            maxLimit = target.length - 1
      selectedGroupNode.forEach(e => {
        const fromIndex = target.indexOf(e),
              toIndex = fromIndex - i
        if (toIndex < 0 || toIndex > maxLimit) {
          return
        }
        const temp = target[toIndex]
        Vue.set(target, toIndex, target[fromIndex])
        Vue.set(target, fromIndex, temp)
      })
      this.commit('orderWidgetZlevel')
    }
  }
})