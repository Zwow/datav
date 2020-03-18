<template>
  <div class="screen-canvas"
      ref="canvas"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove">
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
            >
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
                    :data-cursor-index="index"
                    :data-cursor="cursor.dr"
                    :style="{ cursor: `${cursor.dr}-resize`, left: `${cursor.pos[0]}%`, top: `${cursor.pos[1]}%` }">
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScrollView>
    <div class="select-box"
        v-if="showSelectBox"
        :style="{
          width: `${selectBoxSize[0]}px`,
          height: `${selectBoxSize[1]}px`,
          transform: `translate3D(${selectBoxOffsetOrigin[0]}px, ${selectBoxOffsetOrigin[1]}px, 0)`
        }">
    </div>
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

// ========= RESIZE FUNCTIONS START =========
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

// ========= RESIZE FUNCTIONS END =========

const DRAG = 1,
      RESIZE = 2,
      SELECT = 3,
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

let screenRect = []

class Widget {
  constructor(opt) {
    this.height = opt.height
    this.width = opt.width
    this.backgroundColor = opt.backgroundColor
    this.transform = [0, 0]
    this.index = 0
  }
  get pageX() {
    return this.transform[0] + screenRect[0]
  }
  get pageY() {
    return this.transform[1] + screenRect[1]
  }
  get endPageX() {
    return this.pageX + this.width
  }
  get endPageY() {
    return this.pageY + this.height
  }
}

export default {
  components: {
    ScrollView,
    CanvasZoomer
  },
  data() {
    return {
      // drag, resize, selectbox
      mode: null,
      cursor: 'n',
      cursorIndex: 0,
      // 鼠标downpoint
      downPoint: [],
      // dragpoint - downpoint, 带方向
      selectBoxVector: [0, 0],
      // 按下鼠标后每次移动的变化量
      selectBoxDiff: [0, 0],
      // 左上点(pageX, pageY)
      selectBoxOrigin: [0, 0],
      cursors: [
        {
          dr: 'n', 
          pos: [50, 0],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.nResize(index)
            })
          }
        },
        {
          dr: 'e', 
          pos: [100, 50],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.eResize(index)
            })
          }
        },
        {
          dr: 's', 
          pos: [50, 100],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.sResize(index)
            })
          }
        },
        {
          dr: 'w',
          pos: [0, 50],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.wResize(index)
            })
          }
        },
        {
          dr: 'se', 
          pos: [100, 100],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.sResize(index)
              this.eResize(index)
            })
          }
        },
        {
          dr: 'sw', 
          pos: [0, 100],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.sResize(index)
              this.wResize(index)
            })
          }
        },
        {
          dr: 'ne', 
          pos: [100, 0],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.nResize(index)
              this.eResize(index)
            })
          }
        },
        {
          dr: 'nw', 
          pos: [0, 0],
          resize: () => {
            this.selectedWidget.forEach((index) => {
              this.nResize(index)
              this.wResize(index)
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'widgets', 'selectedWidget',
      'SCREEN_LEFT', 'SCREEN_TOP', 'canvasWidth', 'canvasHeight',
      'screenHeight', 'screenWidth', 'backgroundColor',
      'canvasZoomLevel', 'canvasProperZoomLevel', 'canvasScroll'
    ]),
    canvasRect() {
      return [screenRect[0] - this.SCREEN_LEFT, screenRect[1] - this.SCREEN_TOP]
    },
    ...mapGetters([
      'displayScreenWidth', 'displayScreenHeight',
      'screenWrapperWidth', 'screenWrapperHeight'
    ]),
    // selectbox的右下角点
    selectBoxEndPoint() {
      return [
        this.selectBoxOrigin[0] + this.selectBoxVector[0],
        this.selectBoxOrigin[1] + this.selectBoxVector[1]
      ]
    },
    // 减去canvas的坐标得到框选盒子的原点
    selectBoxOffsetOrigin() {
      return [
        this.selectBoxOrigin[0] - this.canvasRect[0],
        this.selectBoxOrigin[1] - this.canvasRect[1]
      ]
    },
    selectBoxSize() {
      return this.selectBoxVector.map(e => Math.abs(e))
    },
    showSelectBox() {
      return this.mode === SELECT && this.selectBoxSize.every(e => e)
    }
  },
  watch: {
    canvasZoomLevel(nv, old) {
      this.scaleWidgets((nv - old) / old)
    }
  },
  methods: {
    ...mapMutations([
      'addWidgets', 'removeWidgets', 'editWidgetByKey', 'emptySelectedWidget',
      'setSelectedWidget', 'addSelectedWidget', 'removeSelectedWidget',
      'setCanvasZoomLevel', 'setCanvasWidth', 'setCanvasHeight',
      'setProperZoomLevel', 'setCanvasScroll', 'setWidgetTransform'
    ]),
    eResize(index) {
      // selectbox的原点要在widget的正方向
      // 否则每一次越过边界后鼠标和真正的锚点的距离会渐增
      // 其他所有正向边同理
      const target = this.widgets[index],
            width = this.selectBoxOrigin[0] + this.canvasScroll[0] > target.pageX ? target.width + this.selectBoxDiff[0] : 0
      this.editWidgetByKey({ index, key: 'width', value: width })
    },
    sResize(index) {
      const target = this.widgets[index],
            height = this.selectBoxOrigin[1] + this.canvasScroll[1] > target.pageY ? target.height + this.selectBoxDiff[1] : 0
      this.editWidgetByKey({ index, key: 'height', value: height })
    },
    wResize(index) {
      // bug
      // 在做负方向的缩放时，一旦设置为0，但由于外层有widget-mask的边框
      // 而widget本身会缩放至0，因此会产生一个小抖动
      // 这是一个视觉的问题，对程序不影响，可以为widget设置一个和widget-mask
      // 一样大小的border且不能设置box-sizing为borderbox，这样视觉正常
      // 但可能会影响到widget内其他元素的显示

      // selectbox的终点要在widget的负方向
      // 其他反向边同理
      const target = this.widgets[index]
      let width = target.width - this.selectBoxDiff[0],
          transformX = target.transform[0] + this.selectBoxDiff[0]
      if (this.selectBoxEndPoint[0] > target.endPageX) {
        transformX = target.endPageX - screenRect[0]
        width = 0
      }
      this.editWidgetByKey({ index, key: 'width', value: width })
      this.setWidgetTransform({ index, transformIndex: 0, value: transformX })
    },
    nResize(index) {
      const target = this.widgets[index]
      let height = target.height - this.selectBoxDiff[1],
          transformY = target.transform[1] + this.selectBoxDiff[1]
      if (this.selectBoxEndPoint[1] > target.endPageY) {
        transformY = target.endPageY - screenRect[1]
        height = 0
      }
      this.editWidgetByKey({ index, key: 'height', value: height })
      this.setWidgetTransform({ index, transformIndex: 1, value: transformY })
    },
    handleScroll({ scrollLeft, scrollTop }) {
      this.setCanvasScroll([scrollLeft, scrollTop])
    },
    getScreenRect() {
      const rect = this.$refs.screen.getBoundingClientRect()
      screenRect = [rect.left, rect.top]
    },
    handleDelete() {
      this.removeWidgets(this.selectedWidget)
      this.emptySelectedWidget()
    },
    handleNewWidget() {
      this.addWidgets(new Widget({
        width: 100,
        height: 100,
        backgroundColor: '#CCCCCC'
      }))
      this.setSelectedWidget([this.widgets.length - 1])
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
        this.editWidgetByKey({ index: this.selectedWidget[0], key: 'chart', value: chart })
      })
    },
    // drag = down + move + up
    // click = down + up
    handleMouseDown(e) {
      e.preventDefault()
      const { pageX, pageY, target } = e, id = parseInt(target.dataset.id)
      this.downPoint = [pageX, pageY]
      // 在widget-mask按下且widget已被选择
      if (Array.prototype.indexOf.call(target.classList, 'widget-mask') !== -1 &&
        this.selectedWidget.indexOf(id) !== -1) {
        this.mode = DRAG
        return
      }
      // 在cursor按下
      // 这时一定会有选中的widget, this.selectedWidget !== []
      if (Array.prototype.indexOf.call(target.classList, 'cursor') !== -1) {
        this.cursor = target.dataset.cursor
        this.cursorIndex = target.dataset.cursorIndex
        this.mode = RESIZE
        return
      }
      // 不是widget或cursor时，清空选择
      this.emptySelectedWidget()

      // 在screen或者screen-wrapper上按下，框选组件
      if (Array.prototype.some.call(target.classList, e => e === 'screen-wrapper' || e === 'screen')) {
        this.mode = SELECT
        return
      }
      this.mode = null
      return
    },
    handleMouseUp({ pageX, pageY, target, ctrlKey }) {
      this.mode = null
      this.selectBoxVector = [0, 0]
      this.selectBoxDiff = [0, 0]
      this.selectBoxOrigin = [0, 0]
      // widget click
      if (target.dataset.id && pageX === this.downPoint[0] && pageY === this.downPoint[1]) {
        const eleId = parseInt(target.dataset.id),
            index = this.selectedWidget.indexOf(eleId),
            selected = index !== -1
        // 按下ctrl
        if (ctrlKey) {
          if (selected) {
            this.removeSelectedWidget(index)
            return
          }
          this.addSelectedWidget(eleId)
          return
        }
        // 没有选中或多于一个选中
        if (this.selectedWidget.length !== 1 || !selected) {
          this.setSelectedWidget([eleId])
          return
        }
        this.emptySelectedWidget()
      }
    },
    handleMouseMove(e) {
      // drag, resize, selectbox时记录一下框选盒子
      if (this.mode) {
        const { pageX, pageY } = e
        const [dx, dy] = this.downPoint,
              vector = [pageX - dx, pageY - dy]
        this.selectBoxOrigin = [dx < pageX ? dx : pageX, dy < pageY ? dy : pageY]
        this.selectBoxDiff = [vector[0] - this.selectBoxVector[0], vector[1] - this.selectBoxVector[1]]
        this.selectBoxVector = vector
        // widget drag
        if (this.mode === DRAG) {
          this.selectedWidget.forEach((index) => {
            const { transform } = this.widgets[index]
            this.editWidgetByKey({
              index,
              key: 'transform',
              value: [transform[0] + this.selectBoxDiff[0], transform[1] + this.selectBoxDiff[1]]
            })
          })
          return
        }
        // widget resize
        if (this.mode === RESIZE) {
          // this.resize(e)
          this.cursors[this.cursorIndex].resize()
          this.$nextTick(() => {
            this.selectedWidget.forEach((index) => {
              this.widgets[index].chart && this.widgets[index].chart.resize()
            })
          })
          return
        }
        // selectbox
      }
    },
    resize2() {
      
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
        this.editWidgetByKey({ index, key: 'height', value: widget.height * (1 + diff) })
        this.editWidgetByKey({ index, key: 'width', value: widget.width * (1 + diff) })
        this.editWidgetByKey({ index, key: 'transform', value: widget.transform.map((e) => e * (1 + diff)) })
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
      // this.handleNewChart()
      // this.handleNewChart()
      // this.setSelectedWidget([0, 1, 2])
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
    position: relative;
    .widget-wrapper {
      display: inline-block;
      vertical-align: top;
      position: absolute;
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
          border: 1px solid lighten($secondary-theme-color, 10);
          .cursor {
            display: inline-block;
          }
        }
        .cursor {
          height: 6px;
          width: 6px;
          border: 1px solid $secondary-theme-color;
          box-sizing: border-box;
          display: none;
          position: absolute;
          background-color: #fff;
          // border-radius: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }
  }
  .select-box {
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid $secondary-theme-color;
    background-color: rgba($secondary-theme-color, .2);
    box-sizing: border-box;
  }
  .canvas-zoomer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>