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
            }">
          <!-- 组件 -->
          <div class="widget"
              ref="widget"
              v-for="(widget, index) in widgets"
              :key="index"
              :data-id="index"
              :style="{
                height: `${widget.height}px`,
                width: `${widget.width}px`,
                transform: `translate3D(${widget.transform[0]}px, ${widget.transform[1]}px, 0)`,
                backgroundColor: widget.backgroundColor,
                zIndex: widget.index
              }">
          </div>
          <!-- 组件的选中框 -->
          <div class="selected-widget-box"
              v-show="showSelectedWidgetBox"
              :style="{
                width: `${selectedWidgetBox.width}px`,
                height: `${selectedWidgetBox.height}px`,
                transform: `translate3D(${selectedWidgetBox.x}px, ${selectedWidgetBox.y}px, 0)`
              }">
            <span class="cursor"
                  v-for="(cursor, index) in cursors"
                  :key="index"
                  :data-cursor-index="index"
                  :style="{ cursor: `${cursor.dr}-resize`, left: `${cursor.pos[0]}%`, top: `${cursor.pos[1]}%` }">
            </span>
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

// const
const DIM_MIN = 2,
      // mouse event
      DRAG = 1,
      RESIZE = 2,
      SELECT = 3,
      // keycode
      BACKSPACE = 8,
      DELETE = 46

let screenRect = []

class Widget {
  constructor(opt) {
    this.height = opt.height
    this.width = opt.width
    this.backgroundColor = opt.backgroundColor
    this.transform = [20, 20]
    this.index = 0
  }
  get left() {
    return this.transform[0] + screenRect[0]
  }
  get top() {
    return this.transform[1] + screenRect[1]
  }
  get right() {
    return this.left + this.width
  }
  get bottom() {
    return this.top + this.height
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
            const { height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[1] / height
            this.selectedWidget.forEach((index) => {
              this.nResize(index, height, top, y, ratio)
            })
          }
        },
        {
          dr: 'e', 
          pos: [100, 50],
          resize: () => {
            const { width, left, x } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[0] / width
            this.selectedWidget.forEach((index, i) => {
              let widget = this.widgets[index],
                  widgetWidth = widget.width * (1 + ratio),
                  leftVal = widget.left - left,
                  widgetLeft = widget.transform[0] + leftVal * ratio
              if (this.selectBoxLeftBoundary) {
                widgetWidth = widget.width / width * DIM_MIN
                widgetLeft = x + (leftVal / width) * DIM_MIN
              }
              this.editWidgetByKey({ index, key: 'width', value: widgetWidth })
              this.setWidgetTransform({ index, transformIndex: 0, value: widgetLeft })
            })
          }
        },
        {
          dr: 's', 
          pos: [50, 100],
          resize: () => {
            const { height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[1] / height
            this.selectedWidget.forEach((index, i) => {
              let widget = this.widgets[index],
                  widgetHeight = widget.height * (1 + ratio),
                  topVal = widget.top - top,
                  widgetTop = widget.transform[1] + topVal * ratio
              if (this.selectBoxTopBoundary) {
                widgetHeight = widget.height / height * DIM_MIN
                widgetTop = y + (topVal / height) * DIM_MIN
              }
              this.editWidgetByKey({ index, key: 'height', value: widgetHeight })
              this.setWidgetTransform({ index, transformIndex: 1, value: widgetTop })
            })
          }
        },
        {
          dr: 'w',
          pos: [0, 50],
          resize: () => {
            const { width, left, x } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[0] / width
            this.selectedWidget.forEach((index, i) => {
              let widget = this.widgets[index],
                  widgetWidth = widget.width * (1 - ratio),
                  leftVal = widget.left - left,
                  widgetLeft = widget.transform[0] + this.selectBoxDiff[0] - leftVal * ratio
              if (this.selectBoxRightBoundary) {
                widgetWidth = widget.width / width * DIM_MIN
                widgetLeft = x + width - DIM_MIN + (leftVal / width) * DIM_MIN
              }
              this.editWidgetByKey({ index, key: 'width', value: widgetWidth })
              this.setWidgetTransform({ index, transformIndex: 0, value: widgetLeft })
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
    },
    selectBoxLeftBoundary() {
      return this.selectBoxOrigin[0] + this.canvasScroll[0] <= this.selectedWidgetBox.left
    },
    selectBoxTopBoundary() {
      return this.selectBoxOrigin[1] + this.canvasScroll[1] <= this.selectedWidgetBox.top
    },
    selectBoxRightBoundary() {
      return this.selectBoxEndPoint[0] + this.canvasScroll[0] >= this.selectedWidgetBox.right
    },
    selectBoxBottomBoundary() {
      return this.selectBoxEndPoint[1] + this.canvasScroll[1] >= this.selectedWidgetBox.bottom
    },
    showSelectedWidgetBox() {
      return this.selectedWidget.length > 0
    },
    selectedWidgetBox() {
      if (!this.selectedWidget.length) return {}
      const first = this.widgets[this.selectedWidget[0]]
      const rect = {
        left: first.left,
        top: first.top,
        right: first.right,
        bottom: first.bottom,
        x: first.transform[0],
        y: first.transform[1]
      }
      for (let i = 1; i < this.selectedWidget.length; i++) {
        const widget = this.widgets[this.selectedWidget[i]]
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
            width = this.selectBoxLeft > target.left ? target.width + this.selectBoxDiff[0] : 0
      this.editWidgetByKey({ index, key: 'width', value: width })
    },
    sResize(index) {
      const target = this.widgets[index],
            height = this.selectBoxTop > target.top ? target.height + this.selectBoxDiff[1] : 0
      this.editWidgetByKey({ index, key: 'height', value: height })
    },
    wResize(index) {
      // bug
      // 在做负方向的缩放时，一旦设置为0，但由于外层有widget-wrapper的边框
      // 整体最小会是2，但widget本身会缩放至0，因此会产生一个小抖动
      // 这是一个视觉的问题，对程序不影响，可以为widget设置一个和widget-wrapper
      // 一样大小的border且不能设置box-sizing为borderbox，这样视觉正常
      // 但可能会影响到widget内其他元素的显示

      // selectbox的终点要在widget的负方向
      // 其他反向边同理
      const target = this.widgets[index]
      let width = target.width - this.selectBoxDiff[0],
          transformX = target.transform[0] + this.selectBoxDiff[0]
      if (this.selectBoxRight > target.right) {
        transformX = target.right - screenRect[0]
        width = 0
      }
      this.editWidgetByKey({ index, key: 'width', value: width })
      this.setWidgetTransform({ index, transformIndex: 0, value: transformX })
    },
    nResize(index, height, top, y, ratio) {
      let widget = this.widgets[index],
          widgetHeight = widget.height * (1 - ratio),
          topVal = widget.top - top,
          widgetLeft = widget.transform[1] + this.selectBoxDiff[1] - topVal * ratio
      if (this.selectBoxBottomBoundary) {
        widgetHeight = widget.height / height * DIM_MIN
        widgetLeft = y + height - DIM_MIN + (topVal / height) * DIM_MIN
      }
      this.editWidgetByKey({ index, key: 'height', value: widgetHeight })
      this.setWidgetTransform({ index, transformIndex: 1, value: widgetLeft })
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
      const { pageX, pageY, target } = e
      this.downPoint = [pageX, pageY]
      // 在widget按下
      if (Array.prototype.indexOf.call(target.classList, 'widget') !== -1) {
        const widgetId = parseInt(target.dataset.id),
              index = this.selectedWidget.indexOf(widgetId),
              selected = index !== -1
        // 按下ctrl
        if (e.ctrlKey) {
          if (selected) {
            this.removeSelectedWidget(index)
            return
          }
          this.addSelectedWidget(widgetId)
          return
        }
        // 没有选中或多于一个选中
        if (this.selectedWidget.length !== 1 || !selected) {
          this.setSelectedWidget([widgetId])
          return
        }
        // 有且只有自己被选中时，再点击时不反应
        return
      }
      if (Array.prototype.indexOf.call(target.classList, 'selected-widget-box') !== -1) {
        this.mode = DRAG
        return
      }
      // 在cursor按下
      // 这时一定会有选中的widget, this.selectedWidget !== []
      if (Array.prototype.indexOf.call(target.classList, 'cursor') !== -1) {
        this.cursorIndex = target.dataset.cursorIndex
        this.mode = RESIZE
        return
      }
      // 不是widget, cursor, selected-widget-box，清空选择
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
      this.handleNewChart()
      this.handleNewChart()
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

// mixin class
.abs-element {
  position: absolute;
  left: 0;
  top: 0;
}

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
    // fix right margin/padding issue
    display: inline-block;
    vertical-align: top;
  }
  .screen {
    box-shadow: 0 0 30px rgba(0, 0, 0, .3);
    position: relative;
    .widget {
      @extend .abs-element;
      &::after {
        content: '';
        width: 100%;
        height: 100%;
        @extend .abs-element;
      }
    }
    .selected-widget-box {
      @extend .abs-element;
      border: 1px solid lighten($secondary-theme-color, 10);
      box-sizing: border-box;
      .cursor {
        position: absolute;
        display: block;
        height: 6px;
        width: 6px;
        border: 1px solid $secondary-theme-color;
        box-sizing: border-box;
        background-color: #fff;
        transform: translate3d(-50%, -50%, 0);
      }
    }
  }
  .select-box {
    @extend .abs-element;
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