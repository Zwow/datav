<template>
  <div class="screen-canvas" ref="canvas">
    <ScrollView class="canvas-scroll-view"
              :scroll="canvasScroll"
              @on-scroll="handleScroll">
      <div class="screen-wrapper"
          :style="{
            width: `${screenWrapperWidth}px`,
            height: `${screenWrapperHeight}px`,
            padding: `${SCREEN_TOP}px ${SCREEN_LEFT}px`,
          }">
        <div class="screen"
            ref="screen"
            :style="{
              width: `${displayScreenWidth}px`,
              height: `${displayScreenHeight}px`,
              backgroundColor
            }"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mousemove="handleMouseMove">
          <div v-for="(widget, id) in widgets"
              :key="id"
              class="widget-wrapper"
              :style="{
                transform: `translate3D(${widget.transform[0]}px, ${widget.transform[1]}px, 0)`,
                zIndex: widget.index
              }">
            <div class="widget"
                ref="widget"
                :style="{
                  height: `${widget.height}px`,
                  width: `${widget.width}px`,
                  backgroundColor: widget.backgroundColor
                }">
            </div>
            <div :data-id="id" :class="`widget-mask ${selectedWidget.indexOf(id) !== -1 ? 'active' : ''}`">
              <span class="cursor"
                    v-for="(cursor, index) in cursors"
                    :key="index"
                    :data-id="id"
                    :data-cursor="cursor.dr"
                    :style="{ cursor: `${cursor.dr}-resize`, left: `${cursor.pos[0]}%`, top: `${cursor.pos[1]}%` }">
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollView>
    <CanvasZoomer class="canvas-zoomer"></CanvasZoomer>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import echarts from 'echarts'
import Vue from 'vue'
import { debounce } from '@/util/helpers'
import ScrollView from './ScrollView.vue'
import CanvasZoomer from './CanvasZoomer.vue'

// todo
// 1、给各种事件加debounce
// 2、不应该允许将width, height设置为0，最小也要>0，如0.00001, 否则无法恢复?

function posTransform(item, value, refs) {
  // s, e
  // widget width/height
  const l = item[this.dim] * value / refs
  if (l > 0) item[this.dim] = l
}

function ngtTransform(item, value) {
  // n, w
  // widget width/height, left/top
  const l = item[this.dim] - value
  if (l > 0) {
    item[this.dim] = l
    Vue.set(item.transform, this.index, item.transform[this.index] + value)
  }
}

function posSyncTransform(item, value, refs) {
  const l = value / refs * item[this.odim]
  if (l > 0) {
    Vue.set(item.transform, this.oIndex, item.transform[this.oIndex] - (l - item[this.odim]) / 2)
    item[this.odim] = l
  }
}

function ngtSyncTransform(item, value) {
  const l = item[this.dim] - value
  if (l > 0) {
    const v = item[this.odim] * l / item[this.dim],
          diff = (v - item[this.odim]) / 2
    item[this.odim] = v
    Vue.set(item.transform, this.oIndex, item.transform[this.oIndex] - diff)
  }
}

function seSyncTransform(item, value, refs) {
  const l = value / refs * item[this.odim]
  if (l > 0) item[this.odim] = l
}

function neSyncTransform(item, value, refs) {
  const l = value / refs * item[this.odim]
  if (l > 0) {
    Vue.set(item.transform, this.oIndex, item.transform[this.oIndex] - l + item[this.odim])
    item[this.odim] = l
  }
}

function swSyncTransform(item, value) {
  const l = (item[this.dim] - value) / item[this.dim] * item[this.odim]
  if (l > 0 ) item[this.odim] = l
}

function nwSyncTransform(item, value) {
  const l = item[this.dim] - value
  if (l > 0) {
    const v = item[this.odim] * l / item[this.dim],
          diff = (v - item[this.odim])
    item[this.odim] = v
    Vue.set(item.transform, this.oIndex, item.transform[this.oIndex] - diff)
  }
}

const DRAG = 1,
      RESIZE = 2,
      mapping = {
        e: {
          axis: 'X', dim: 'width', odim: 'height', index: 0, oIndex: 1,
          transform: posTransform, sync: posSyncTransform, ssync: seSyncTransform, nsync: neSyncTransform
        },
        s: {
          axis: 'Y', dim: 'height', odim: 'width', index: 1, oIndex: 0,
          transform: posTransform, sync: posSyncTransform
        },
        w: {
          axis: 'X', dim: 'width', odim: 'height', index: 0, oIndex: 1,
          transform: ngtTransform, sync: ngtSyncTransform, ssync: swSyncTransform, nsync: nwSyncTransform
        },
        n: {
          axis: 'Y', dim: 'height', odim: 'width', index: 1, oIndex: 0,
          transform: ngtTransform, sync: ngtSyncTransform
        }
      }

// keycode
const BACKSPACE = 8,
      DELETE = 46

class Widget {
  constructor(opt) {
    this.height = opt.height
    this.width = opt.width
    this.backgroundColor = opt.backgroundColor
    this.transform = [0, 0]
    this.index = 0
  }
}

export default {
  components: {
    ScrollView,
    CanvasZoomer
  },
  data() {
    return {
      selectedWidget: [],
      // element to be dragged, resized
      relativeElement: null,
      // drag, resize
      mode: null,
      offsets: [0, 0],
      cursor: 'n',
      // widgets: [],
      // containter left corner to page left corner, [left, top]
      // update when this component mounted
      // get it by screenRect[mapping.index]
      screenRect: [],
      downPoint: [],
      cursors: [
        {
          dr: 'n', 
          pos: [50, 0]
        },
        {
          dr: 'e', 
          pos: [100, 50]
        },
        {
          dr: 's', 
          pos: [50, 100]
        },
        {
          dr: 'w',
          pos: [0, 50]
        },
        {
          dr: 'se', 
          pos: [100, 100]
        },
        {
          dr: 'sw', 
          pos: [0, 100]
        },
        {
          dr: 'ne', 
          pos: [100, 0]
        },
        {
          dr: 'nw', 
          pos: [0, 0]
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'widgets',
      'SCREEN_LEFT', 'SCREEN_TOP', 'canvasWidth', 'canvasHeight',
      'screenHeight', 'screenWidth', 'backgroundColor',
      'canvasZoomLevel', 'canvasProperZoomLevel', 'canvasScroll'
    ]),
    ...mapGetters([
      'displayScreenWidth', 'displayScreenHeight',
      'screenWrapperWidth', 'screenWrapperHeight'
    ])
  },
  watch: {
    canvasZoomLevel(nv, old) {
      this.scaleWidgets((nv - old) / old)
    }
  },
  methods: {
    ...mapMutations([
      'addWidgets', 'removeWidgets', 'editWidget',
      'setCanvasZoomLevel', 'setCanvasWidth', 'setCanvasHeight',
      'setProperZoomLevel', 'setCanvasScroll'
    ]),
    handleScroll({ scrollLeft, scrollTop }) {
      this.setCanvasScroll([scrollLeft, scrollTop])
    },
    getScreenRect() {
      // 这里不包括滚动，如果页面有滚动还要加上window.scrollX Y
      const rect = this.$refs.screen.getBoundingClientRect()
      this.screenRect = [rect.left, rect.top]
    },
    handleAlignTopLeft(alignLeft) {
      const i = alignLeft ? 0 : 1
      let v = this.widgets[this.selectedWidget[0]].transform[i]
      this.selectedWidget.forEach((index) => {
        v = Math.min(v, this.widgets[index].transform[i])
      })
      this.selectedWidget.forEach((index) => {
        this.$set(this.widgets[index].transform, i, v)
      })
    },
    handleAlignCenter(vertical) {
      const i = vertical ? 0 : 1, dim = vertical ? 'width' : 'height'
      let v1 = this.widgets[this.selectedWidget[0]].transform[i],
          v2 = this.widgets[this.selectedWidget[0]].transform[i] + this.widgets[this.selectedWidget[0]][dim]
      this.selectedWidget.forEach((index) => {
        v1 = Math.min(v1, this.widgets[index].transform[i])
        v2 = Math.max(v2, this.widgets[index].transform[i] + this.widgets[index][dim])
      })
      const baseLine = (v1 + v2) / 2
      this.selectedWidget.forEach((index) => {
        this.$set(this.widgets[index].transform, i, baseLine - this.widgets[index][dim] / 2)
      })
    },
    handleAlignBottomRight(alignRight) {
      const i = alignRight ? 0 : 1, dim = alignRight ? 'width' : 'height'
      let v = this.widgets[this.selectedWidget[0]].transform[i] + this.widgets[this.selectedWidget[0]][dim]
      this.selectedWidget.forEach((index) => {
        v = Math.max(v, this.widgets[index].transform[i] + this.widgets[index][dim])
      })
      this.selectedWidget.forEach((index) => {
        this.$set(this.widgets[index].transform, i, v - this.widgets[index][dim])
      })
    },
    handleDistribution(vertical) {
      const i = vertical ? 1 : 0, dim = vertical ? 'height' : 'width'
      // 按left/top值先后排序
      const selected = this.selectedWidget.slice().sort((a, b) =>
        this.widgets[a].transform[i] - this.widgets[b].transform[i]
      )
      const interval = selected.slice(0, -1).reduce((res, id, index) => {
        const next = selected[index + 1]
        res += (this.widgets[next].transform[i] - this.widgets[id].transform[i] - this.widgets[id][dim])
        return res
      }, 0) / (selected.length - 1)
      selected.slice(1, -1).forEach((id, index) => {
        const pre = this.widgets[selected[index]]
        this.$set(this.widgets[id].transform, i, pre.transform[i] + pre[dim] + interval)
      })
    },
    handleDelete() {
      // this.widgets = this.widgets.filter((e, id) => this.selectedWidget.indexOf(id) === -1)
      this.removeWidgets(this.selectedWidget)
      this.selectedWidget = []
    },
    handleNewWidget() {
      // this.widgets.push(new Widget({
      //   width: 100,
      //   height: 100,
      //   backgroundColor: '#CCCCCC'
      // }))
      this.addWidgets(new Widget({
        width: 100,
        height: 100,
        backgroundColor: '#CCCCCC'
      }))
      this.selectedWidget = [this.widgets.length - 1]
    },
    handleNewChart() {
      this.handleNewWidget()
      this.$nextTick(() => {
        const chart = echarts.init(this.$refs.widget[this.selectedWidget[0]])
        chart.setOption({
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: { show: false }
          },
          yAxis: {
            type: 'value',
            axisTick: { show: false }
          },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }]
        })
        // this.$set(this.widgets[this.selectedWidget[0]], 'chart', chart)
        this.editWidget({ index: this.selectedWidget[0], payload: { chart } })
      })
    },
    // drag = down + move + up
    // click = down + up
    handleMouseDown(e) {
      e.preventDefault()
      this.downPoint = [e.pageX, e.pageY]
      const { offsetX, offsetY, target } = e,
            id = parseInt(target.dataset.id)
      this.relativeElement = id
      // 在widget-mask按下
      if (Array.prototype.indexOf.call(target.classList, 'widget-mask') !== -1) {
        // pageX - this.offsets[0] === widget左上端点到screen左上端点的X距离， Y同理
        const rect = this.$refs.screen.getBoundingClientRect()
        if (this.selectedWidget.indexOf(id) !== -1) {
          this.offsets = [offsetX + rect.left + window.scrollX, offsetY + rect.top + window.scrollY]
          this.mode = DRAG
        }
        return
      }
      // 在cursor按下
      // 这时一定会有选中的widget, this.selectedWidget !== []
      if (Array.prototype.indexOf.call(target.classList, 'cursor') !== -1) {
        this.cursor = target.dataset.cursor
        this.mode = RESIZE
        return
      }
      // 不是widget或cursor
      this.selectedWidget = []
      this.relativeElement = null
      this.mode = null
      return
    },
    handleMouseUp({ pageX, pageY, target, ctrlKey }) {
      this.relativeElement = null
      this.mode = null
      // widget click
      if (target.dataset.id && pageX === this.downPoint[0] && pageY === this.downPoint[1]) {
        const eleId = parseInt(target.dataset.id),
            index = this.selectedWidget.indexOf(eleId),
            selected = index !== -1
        // 按下ctrl
        if (ctrlKey) {
          if (selected) {
            this.selectedWidget.splice(index, 1)
            return
          }
          this.selectedWidget.push(eleId)
          return
        }
        // 没有选中或多于一个选中
        if (this.selectedWidget.length !== 1 || !selected) {
          this.selectedWidget = [eleId]
          return
        }
        this.selectedWidget = []
      }
    },
    handleMouseMove(e) {
      // widget drag
      if (this.mode === DRAG) {
        const { pageX, pageY } = e,
              refPoint = this.widgets[this.relativeElement].transform
        this.selectedWidget.forEach((index) => {
          const { transform } = this.widgets[index]
          const offsets = [refPoint[0] - transform[0], refPoint[1] - transform[1]]
          // this.widgets[index].transform = [pageX - this.offsets[0] - offsets[0], pageY - this.offsets[1] - offsets[1]]
          this.editWidget({ index, payload: { transform: [pageX - this.offsets[0] - offsets[0], pageY - this.offsets[1] - offsets[1]] } })
        })
        return
      }
      // widget resize
      if (this.mode === RESIZE) {
        this.resize(e)
        this.$nextTick(() => {
          this.selectedWidget.forEach((index) => {
            this.widgets[index].chart && this.widgets[index].chart.resize()
          })
        })
        return
      }
    },
    resize(e) {
      let cursor = this.cursor, vertical = ''
      if (this.cursor.length === 2 && e.shiftKey) {
        [vertical, cursor] = cursor
      }
      Array.prototype.forEach.call(cursor, (direction) => {
        const map = mapping[direction],
              transform = this.widgets[this.relativeElement].transform[map.index],
              // 这里要减去screen距离页面左上角的xy值
              value = e[`page${map.axis}`] - this.screenRect[map.index] - transform,
              refs = this.widgets[this.relativeElement][map.dim]
        this.selectedWidget.forEach((index) => {
          const target = this.widgets[index]
          e.shiftKey && map[`${vertical}sync`](target, value, refs)
          map.transform(target, value, refs)
        })
      })
    },
    keydownHandler({ keyCode }) {
      
    },
    keyupHandler() {
    },
    scaleWidgets(diff) {
      this.widgets.forEach((widget, index) => {
        // this.$set(widget, 'height', widget.height * (1 + diff))
        // this.$set(widget, 'width', widget.width * (1 + diff))
        // this.$set(widget, 'transform', widget.transform.map((e) => e * (1 + diff)))
        this.editWidget({
          index,
          payload: {
            height: widget.height * (1 + diff),
            width: widget.width * (1 + diff),
            transform: widget.transform.map((e) => e * (1 + diff))
          }
        })
        this.$nextTick(() => {
          widget.chart && widget.chart.resize()
        })
      })
    },
    getProperZoomLevel() {
      const canvasStyle = getComputedStyle(this.$refs.canvas, null),
            height = parseFloat(canvasStyle.height),
            width = parseFloat(canvasStyle.width)
      let zoomLevel = 1
      if (this.screenWidth > this.screenHeight) {
        const displayScreenWidth = width - this.SCREEN_LEFT * 2
        zoomLevel = displayScreenWidth / this.screenWidth
      } else {
        const displayScreenHeight = height - this.SCREEN_TOP * 2
        zoomLevel = displayScreenHeight / this.screenHeight
      }
      this.setCanvasZoomLevel(zoomLevel)
      // 保存一份自适应大小时的zoomlevel
      this.setProperZoomLevel(zoomLevel)
      // 保存容器的长宽
      this.setCanvasWidth(width)
      this.setCanvasHeight(height)
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取screen相当对页面左上角的xy
      this.getScreenRect()
      // 调整画面缩放使其全部可见
      this.getProperZoomLevel()
      this.handleNewChart()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.pageResizeHandler)
    document.removeEventListener('keydown', this.keydownHandler)
    document.removeEventListener('keyup', this.keydownHandler)
  },
  created() {
    this.pageResizeHandler = debounce(this.getProperZoomLevel, 500)
    window.addEventListener('resize', this.pageResizeHandler)
    document.addEventListener('keydown', this.keydownHandler)
    document.addEventListener('keyup', this.keyupHandler)
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.screen-canvas {
  position: relative;
  background: #2A2E33;
  // 网络
  // background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.05) 5%, rgba(0, 0, 0, 0) 5%), linear-gradient(rgba(180, 180, 180, 0.05) 5%, rgba(0, 0, 0, 0) 5%);
  // background-size: 15px 15px;
  // 点阵
  background-image: linear-gradient(#2A2E33 20px, transparent 0), linear-gradient(90deg, #515151 2px, transparent 0);
  background-size: 22px 22px, 24px 24px;
  background-position: 14px;
  .canvas-scroll-view {
    height: 100%;
    width: 100%;
  }
  .screen-wrapper {
    display: inline-block;
    vertical-align: top;
  }
  .screen {
    box-shadow: 0 0 30px rgba(0, 0, 0, .3);
    overflow: hidden;
    .widget-wrapper {
      display: inline-block;
      vertical-align: top;
      .widget {
        overflow: hidden;
      }
      .widget-mask {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        &.active {
          border: 1px solid $theme-color;
          .cursor {
            display: inline-block;
          }
        }
        .cursor {
          height: 6px;
          width: 6px;
          border: 1px solid #ccc;
          display: none;
          position: absolute;
          background-color: #fff;
          border-radius: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }
  }
  .canvas-zoomer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>