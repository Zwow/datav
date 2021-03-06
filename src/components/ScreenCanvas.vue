<template>
  <div class="screen-canvas"
      ref="canvas"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      @dblclick="handleDoubleClick">
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
          <div class="selected-widget-box-background"
              v-show="showSelectedWidgetBox"
              :style="{
                width: `${selectedWidgetBox.width}px`,
                height: `${selectedWidgetBox.height}px`,
                transform: `translate3D(${selectedWidgetBox.x}px, ${selectedWidgetBox.y}px, 0)`
              }">
          </div>
          <!-- 组件 -->
          <div class="widget"
              v-for="(widget, index) in widgets"
              v-show="widget.visible"
              :key="index"
              :data-id="index"
              :style="{
                fontSize: '20px',
                height: `${widget.height}px`,
                width: `${widget.width}px`,
                transform: `translate3D(${widget.transform[0]}px, ${widget.transform[1]}px, 0)`,
                backgroundColor: widget.context.backgroundColor,
                backgroundImage: `url(${widget.context.backgroundImage})`,
                zIndex: widget.zLevel
              }">
            <component :is="widget.component" :widget-index="index"></component>
          </div>
          <!-- 组件的选中框 -->
          <div class="selected-widget-box"
              v-show="showSelectedWidgetBox"
              :style="{
                width: `${selectedWidgetBox.width}px`,
                height: `${selectedWidgetBox.height}px`,
                transform: `translate3D(${selectedWidgetBox.x}px, ${selectedWidgetBox.y}px, 0)`,
                zIndex: `${widgets.length + 10}`
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

// const
const DIM_MIN = 2,
      // mouse event
      DRAG = 1,
      RESIZE = 2,
      SELECT = 3,
      // keycode
      BACKSPACE = 8,
      DELETE = 46

export default {
  components: {
    ScrollView,
    CanvasZoomer,
    SimpleBar: () => import('./SimpleBar/Widget.vue')
  },
  data() {
    return {
      // drag, resize, selectbox
      mode: null,
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
                  ratio = -this.selectBoxDiff[1] / height,
                  overBoundary = this.bottomBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary)
            })
            const transformY = this.selectedWidgetBox.height - height
            transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = -this.selectBoxDiff[1] / height,
                  minWidth = width / height * DIM_MIN,
                  overBoundary = this.bottomBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary, minWidth)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary)
            })
            const transformX = (this.selectedWidgetBox.width - width) / 2,
                  transformY = this.selectedWidgetBox.height - height
            transformX && transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          }
        },
        {
          dr: 'e', 
          pos: [100, 50],
          resize: () => {
            const { width, left, x } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[0] / width,
                  overBoundary = this.leftBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[0] / width,
                  minHeight = height / width * DIM_MIN,
                  overBoundary = this.leftBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary, minHeight)
            })
            const transformY = (this.selectedWidgetBox.height - height) / 2
            transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          }
        },
        {
          dr: 's', 
          pos: [50, 100],
          resize: () => {
            const { height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[1] / height,
                  overBoundary = this.topBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary)
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[1] / height,
                  minWidth = width / height * DIM_MIN,
                  overBoundary = this.topBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary, minWidth)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary)
            })
            const transformX = (this.selectedWidgetBox.width - width) / 2
            transformX && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
            })
          }
        },
        {
          dr: 'w',
          pos: [0, 50],
          resize: () => {
            const { width, left, x } = this.selectedWidgetBox,
                  ratio = -this.selectBoxDiff[0] / width,
                  overBoundary = this.rightBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
            })
            const transformX = this.selectedWidgetBox.width - width
            transformX && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = -this.selectBoxDiff[0] / width,
                  minHeight = height / width * DIM_MIN,
                  overBoundary = this.rightBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary, minHeight)
            })
            const transformX = this.selectedWidgetBox.width - width,
                  transformY = (this.selectedWidgetBox.height - height) / 2
            transformX && transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          }
        },
        {
          dr: 'se', 
          pos: [100, 100],
          resize: () => {
            // 当进行边角缩放如se时，如果此时鼠标的偏移量同时越过left边界和top边界
            // 且此时的偏移量left != top，如果都将他们缩放至DIM_MIN，会变成一个正
            // 方形中，但因为用户此时不是等比例缩放，在最小时固定为正方形是没问题的
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio1 = this.selectBoxDiff[0] / width,
                  ratio2 = this.selectBoxDiff[1] / height,
                  { leftBoundary, topBoundary } = this
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio1, 'width', 'left', 0, leftBoundary)
              this.esResize(index, height, top, y, ratio2, 'height', 'top', 1, topBoundary)
            })
          },
          syncResize: () => {
            // 在等比例缩放时则有不同，虽然都用left边界判定，但在最小时
            // 不能将宽高都缩放至DIM_MIN，会变成正方形，所以要计算好宽高
            // 比例，在缩放至最小时仍保持原有比例
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[0] / width,
                  minHeight = height / width * DIM_MIN,
                  overBoundary = this.leftBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary, minHeight)
            })
          }
        },
        {
          dr: 'sw', 
          pos: [0, 100],
          resize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio1 = -this.selectBoxDiff[0] / width,
                  ratio2 = this.selectBoxDiff[1] / height,
                  { topBoundary, rightBoundary } = this
            this.selectedWidget.forEach((index) => {
              this.esResize(index, height, top, y, ratio2, 'height', 'top', 1, topBoundary)
              this.esResize(index, width, left, x, ratio1, 'width', 'left', 0, rightBoundary)
            })
            const transformX = this.selectedWidgetBox.width - width
            transformX && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = -this.selectBoxDiff[0] / width,
                  minHeight = height / width * DIM_MIN,
                  overBoundary = this.rightBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary, minHeight)
            })
            const transformX = this.selectedWidgetBox.width - width
            transformX && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
            })
          }
        },
        {
          dr: 'ne', 
          pos: [100, 0],
          resize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio1 = this.selectBoxDiff[0] / width,
                  ratio2 = -this.selectBoxDiff[1] / height,
                  { bottomBoundary, leftBoundary } = this
            this.selectedWidget.forEach((index) => {
              this.esResize(index, height, top, y, ratio2, 'height', 'top', 1, bottomBoundary)
              this.esResize(index, width, left, x, ratio1, 'width', 'left', 0, leftBoundary)
            })
            const transformY = this.selectedWidgetBox.height - height
            transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = this.selectBoxDiff[0] / width,
                  minHeight = height / width * DIM_MIN,
                  overBoundary = this.leftBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary, minHeight)
            })
            const transformY = this.selectedWidgetBox.height - height
            transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          }
        },
        {
          dr: 'nw', 
          pos: [0, 0],
          resize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio1 = -this.selectBoxDiff[0] / width,
                  ratio2 = -this.selectBoxDiff[1] / height,
                  { bottomBoundary, rightBoundary } = this
            this.selectedWidget.forEach((index) => {
              this.esResize(index, height, top, y, ratio2, 'height', 'top', 1, bottomBoundary)
              this.esResize(index, width, left, x, ratio1, 'width', 'left', 0, rightBoundary)
            })
            const transformX = this.selectedWidgetBox.width - width,
                  transformY = this.selectedWidgetBox.height - height
            this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          },
          syncResize: () => {
            const { width, left, x, height, top, y } = this.selectedWidgetBox,
                  ratio = -this.selectBoxDiff[0] / width,
                  minHeight = height / width * DIM_MIN,
                  overBoundary = this.rightBoundary
            this.selectedWidget.forEach((index) => {
              this.esResize(index, width, left, x, ratio, 'width', 'left', 0, overBoundary)
              this.esResize(index, height, top, y, ratio, 'height', 'top', 1, overBoundary, minHeight)
            })
            const transformX = this.selectedWidgetBox.width - width,
                  transformY = this.selectedWidgetBox.height - height
            transformX && transformY && this.selectedWidget.forEach((index) => {
              this.setWidgetTransform({ index, transformIndex: 0, value: this.widgets[index].transform[0] - transformX })
              this.setWidgetTransform({ index, transformIndex: 1, value: this.widgets[index].transform[1] - transformY })
            })
          }
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'widgets', 'selectedWidget', 'screenRect',
      'SCREEN_LEFT', 'SCREEN_TOP', 'canvasWidth', 'canvasHeight',
      'screenHeight', 'screenWidth', 'backgroundColor',
      'canvasZoomLevel', 'canvasProperZoomLevel', 'canvasScroll'
    ]),
    canvasRect() {
      return [this.screenRect[0] - this.SCREEN_LEFT, this.screenRect[1] - this.SCREEN_TOP]
    },
    ...mapGetters([
      'displayScreenWidth', 'displayScreenHeight', 'selectedWidgetBox',
      'screenWrapperWidth', 'screenWrapperHeight'
    ]),
    // selectbox的右下角点
    selectBoxEndPoint() {
      return [
        this.selectBoxOrigin[0] + this.selectBoxVector[0],
        this.selectBoxOrigin[1] + this.selectBoxVector[1]
      ]
    },
    // selectbox原点坐标(相对于screen)
    selectBoxScreenOffsetOrigin() {
      return [
        this.selectBoxOffsetOrigin[0] + this.canvasScroll[0] - this.SCREEN_LEFT,
        this.selectBoxOffsetOrigin[1] + this.canvasScroll[1] - this.SCREEN_TOP
      ]
    },
    // selectbox的右下角点的绝对坐标(相对于screen)
    selectBoxScreenOffsetEndPoint() {
      return [
        this.selectBoxScreenOffsetOrigin[0] + this.selectBoxSize[0],
        this.selectBoxScreenOffsetOrigin[1] + this.selectBoxSize[1]
      ]
    },
    // 减去canvas的坐标得到框选盒子的原点(相对整个canvas)
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
    leftBoundary() {
      return this.selectBoxOrigin[0] + this.canvasScroll[0] <= this.selectedWidgetBox.left
    },
    topBoundary() {
      return this.selectBoxOrigin[1] + this.canvasScroll[1] <= this.selectedWidgetBox.top
    },
    rightBoundary() {
      return this.selectBoxEndPoint[0] + this.canvasScroll[0] >= this.selectedWidgetBox.right
    },
    bottomBoundary() {
      return this.selectBoxEndPoint[1] + this.canvasScroll[1] >= this.selectedWidgetBox.bottom
    },
    showSelectedWidgetBox() {
      return this.selectedWidget.length > 0
    }
  },
  watch: {
    canvasZoomLevel(nv, old) {
      this.scaleWidgets((nv - old) / old)
    }
  },
  methods: {
    ...mapMutations([
      'addWidgets', 'removeWidget', 'editWidgetByKey',
      'setSelectedWidget', 'addSelectedWidget', 'setScreenRect',
      'setCanvasZoomLevel', 'setCanvasWidth', 'setCanvasHeight',
      'setProperZoomLevel', 'setCanvasScroll', 'setWidgetTransform'
    ]),
    // 东/南方向的缩放，其他所有的缩放可配合transform得到
    esResize(index, dim, offset, transform, ratio, dimKey, offsetKey, transformIndex, overBoundary, minValue = DIM_MIN) {
      // 可能会算出height/width(dimVal) <= 0的情况，导致错误的resize
      // widget[dimKey] * (1 + ratio) <= 0, 所以ratio <= -1
      // 所以this.selectBoxDiff / height(width) <= -1, 此时selectBoxDiff一定为负
      // 也就是selectbox此时的偏移量(负向，也就是缩小)>=selectedWidgetBox的宽高
      // 理论上来说如果selectbox此时是负向的，表明鼠标在做缩在小操作时
      // 如果偏移量已经大于selectedWidgetBox的宽高，那么此时的超过boundary判定应该
      // 是true，但现在会出现false的现象，这可能是小数点计算后数值不精确引起的
      const widget = this.widgets[index],
            offsetValBase = widget[offsetKey] - offset
      let dimVal = widget[dimKey] * (1 + ratio),
          offsetVal = widget.transform[transformIndex] + offsetValBase * ratio
      if (dimVal < 0 && !overBoundary) {
        console.log('######## resize got unexpected value but fixed ########')
        console.log(`dimVal(${dimKey}): ${dimVal}, over boundary: ${overBoundary},
                    ratio: ${ratio}, widget[dimKey]: ${widget[dimKey]}, dim: ${dim}`)
        console.log(`index: ${index}, offset: ${offset}, transform: ${transform}, dimKey: ${dimKey},
                    offsetKey: ${offsetKey}, transformIndex: ${transformIndex}`)
      }
      if (overBoundary || dimVal <= 0) {
        dimVal = widget[dimKey] / dim * minValue
        offsetVal = transform + (offsetValBase / dim) * minValue
      }
      this.editWidgetByKey({ index, key: dimKey, value: dimVal })
      this.setWidgetTransform({ index, transformIndex, value: offsetVal })
    },
    handleScroll({ scrollLeft, scrollTop }) {
      this.setCanvasScroll([scrollLeft, scrollTop])
    },
    getScreenRect() {
      const rect = this.$refs.screen.getBoundingClientRect()
      this.setScreenRect([rect.left, rect.top])
    },
    handleNewWidget() {
      this.addWidgets(new Widget({
        width: 100,
        height: 100,
        backgroundColor: 'red',
        name: `组件${this.widgets.length + 1}`,
        zLevel: this.widgets.length + 1
      }))
      // this.setSelectedWidget([this.widgets.length - 1])
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
    handleMouseDown(e) {
      e.preventDefault()
      const { pageX, pageY, target } = e
      this.downPoint = [pageX, pageY]
      // 在widget按下。widget能被按下时只有一种情况，就是widget未被选中
      // 因为一旦选中必然有selected-widget-box覆盖在上面，这时点击不到widget
      if (Array.prototype.indexOf.call(target.classList, 'widget') !== -1) {
        const widgetId = parseInt(target.dataset.id)
        // 按下ctrl，加选
        if (e.ctrlKey) {
          this.addSelectedWidget(widgetId)
          return
        }
        this.setSelectedWidget([widgetId])
        return
      }
      if (Array.prototype.indexOf.call(target.classList, 'selected-widget-box') !== -1) {
        this.mode = DRAG
        return
      }
      // 在cursor按下
      if (Array.prototype.indexOf.call(target.classList, 'cursor') !== -1) {
        this.cursorIndex = target.dataset.cursorIndex
        this.mode = RESIZE
        return
      }
      // 在screen或者screen-wrapper上按下，框选组件
      if (Array.prototype.some.call(target.classList, e => e === 'screen-wrapper' || e === 'screen')) {
        // 清空选择
        this.setSelectedWidget([])
        this.mode = SELECT
        return
      }
      this.mode = null
      return
    },
    handleMouseUp({ pageX, pageY, target, ctrlKey }) {
      // 框选
      if (this.mode === SELECT) {
        this.groupSelect()
      }
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
          if (e.shiftKey) {
            this.cursors[this.cursorIndex].syncResize()
          } else {
            this.cursors[this.cursorIndex].resize()
          }
          this.$nextTick(() => {
            this.selectedWidget.forEach((index) => {
              this.widgets[index].context.echart && this.widgets[index].context.echart.resize()
            })
          })
          return
        }
        // selectbox
        return
      }
    },
    handleDoubleClick(e) {
      const { target, pageX, pageY } = e
      // 在selected-widget-box上双击，选中双击的widget
      if (Array.prototype.indexOf.call(target.classList, 'selected-widget-box') !== -1) {
        let match = -1
        for (let i = 0; i < this.widgets.length; i++) {
          const widget = this.widgets[i]
          if (
            (widget.left - this.canvasScroll[0] < pageX) &&
            (widget.right - this.canvasScroll[0] > pageX) &&
            (widget.top - this.canvasScroll[0] < pageY) &&
            (widget.bottom - this.canvasScroll[0] > pageY)
          ) {
            if (match === -1 || this.widgets[match].zLevel < widget.zLevel) {
              match = i
            }
          }
        }
        if (match !== -1) {
          this.setSelectedWidget([match])
        }
      }
    },
    groupSelect() {
      const [left, top] = this.selectBoxScreenOffsetOrigin,
            [right, bottom] = this.selectBoxScreenOffsetEndPoint,
            selected = []
      this.widgets.forEach((widget, index) => {
        const widgetLeft = widget.transform[0],
              widgetTop = widget.transform[1]
        if ((widgetLeft > left && widgetLeft < right || widgetLeft < left && widgetLeft + widget.width > left) &&
            (widgetTop > top && widgetTop < bottom ||  widgetTop < top && widgetTop + widget.height > top)) {
          selected.push(index)
        }
      })
      this.setSelectedWidget(selected)
    },
    keydownHandler(e) {
    },
    keyupHandler(e) {
    },
    scaleWidgets(diff) {
      this.widgets.forEach((widget, index) => {
        this.editWidgetByKey({ index, key: 'height', value: widget.height * (1 + diff) })
        this.editWidgetByKey({ index, key: 'width', value: widget.width * (1 + diff) })
        this.editWidgetByKey({ index, key: 'transform', value: widget.transform.map((e) => e * (1 + diff)) })
        this.$nextTick(() => {
          widget.context.echart && widget.context.echart.resize()
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
  background: #2f3338;
  // 网络
  // background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.05) 5%, rgba(0, 0, 0, 0) 5%), linear-gradient(rgba(180, 180, 180, 0.05) 5%, rgba(0, 0, 0, 0) 5%);
  // background-size: 15px 15px;
  // 点阵
  background-image: linear-gradient(#2f3338 20px, transparent 0), linear-gradient(90deg, #666 2px, transparent 0);
  background-size: 22px 22px, 24px 24px;
  background-position: 10px;
  .canvas-scroll-view {
    height: 100%;
    width: 100%;
    z-index: 0;
  }
  .screen-wrapper {
    // fix right margin/padding issue
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    position: relative;
    z-index: 0;
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
    .selected-widget-box-background {
      background-color: rgba($secondary-theme-color, .1);
    }
    .selected-widget-box {
      @extend .abs-element;
      border: 1px solid lighten($secondary-theme-color, 10);
      box-sizing: border-box;
      .cursor {
        position: absolute;
        display: block;
        padding: 4px;
        box-sizing: border-box;
        transform: translate3d(-50%, -50%, 0);
        &::after {
          content: '';
          display: block;
          height: 6px;
          width: 6px;
          border: 1px solid $secondary-theme-color;
          box-sizing: border-box;
          background-color: #fff;
        }
      }
    }
  }
  .widget-group {
    @extend .abs-element;
    box-sizing: border-box;
    &:hover,
    &.hover {
      border: 1px solid $secondary-theme-color;
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