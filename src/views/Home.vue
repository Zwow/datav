<template>
  <div class="home">
    <div class="container"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove">
      <div v-for="(widget, id) in widgets"
          :key="id"
          :class="`widget-wrapper ${selectedWidget == id ? 'active' : ''}`"
          :style="{
            cursor: selectedWidget == id ? `${cursor}-resize` : '',
            transform: `translate3D(${widget.transform[0]}px, ${widget.transform[1]}px, 0)`,
          }">
        <div :class="`widget widget-${id}`"
            :id="id"
            ref="widget"
            :style="{
              height: `${widget.height}px`,
              width: `${widget.width}px`,
              backgroundColor: widget.backgroundColor
            }">
        </div>
      </div>
    </div>
    <div class="operations">
      <button @click="handleNewWidget">widget</button>
      <button @click="handleNewChart">chart</button>
      <button @click="handleDelete">delete</button>
    </div>
    <div class="settings" v-if="selectedWidget !== null">
      <h3>basic setting</h3>
      <div class="setting-row">
        <label for="">background: </label>
        <input type="color" v-model="widgets[selectedWidget].backgroundColor" />
      </div>
      <div class="setting-row">
        <label for="">height: </label><input v-model="widgets[selectedWidget].height" type="number" >px
        <label for="">width: </label><input v-model="widgets[selectedWidget].width" type="number" >px
        <label for="">left: </label><input v-model="widgets[selectedWidget].transform[0]" type="number" >px
        <label for="">top: </label><input v-model="widgets[selectedWidget].transform[1]" type="number" >px
      </div>
      <h3>chart setting</h3>
      <h4>x axis</h4>
      <div class="setting-row">
        <label for="">data: </label><input v-model="chartOptionXdata" type="text">
      </div>
      <div class="setting-row">
        <label for="">font: </label>
        <input type="number" v-model="chartOptionFontSize">px
        <input type="checkbox" v-model="chartOptionFontWeight">bold
      </div>
      <h4>y axis</h4>
      <label for="">data: </label><input v-model="chartOptionYdata" type="text">
      <h4>other</h4>
      <div class="setting-row">
        <label for="">bar: </label>
        <input v-model="chartOptionBarWidth" style="width: 60px;margin-right: 10px" type="text">
        absolute value is px or set to percentage with %
        <input type="color" v-model="chartOptionBarColor" />
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
const DRAG = 1,
      RESIZE = 2,
      // todo
      // 当外层wrapper的调整圈大小改变时，GAP一起调整
      // wrapper border width
      GAP = 4,
      mapping = {
        e: { axis: 'x', dim: 'width' },
        s: { axis: 'y', dim: 'height' },
        // e ~ s, w ~ n
        w: { axis: 'x', dim: 'width' },
        n: { axis: 'y', dim: 'height' }
      }
// keycode
const BACKSPACE = 8,
      CTRL = 17,
      DELETE = 46

class Widget {
  constructor(opt) {
    this.height = opt.height
    this.width = opt.width
    this.backgroundColor = opt.backgroundColor
    this.transform = [0, 0]
    this.group = opt.group
  }
}

export default {
  name: 'home',
  data() {
    return {
      selectedWidget: null,
      // element to be dragged, resized
      relativeElement: null,
      // drag, resize
      mode: null,
      offsets: [0, 0],
      cursor: 'n',
      widgets: [],
      ctrlDown: false
    }
  },
  computed: {
    chartOptionXdata: {
      get() {
        const { chart } = this.widgets[this.selectedWidget]
        if (chart) {
          return chart.getOption().xAxis[0].data.join(',')
        }
        return ''
      },
      set(str) {
        const { chart } = this.widgets[this.selectedWidget]
        const option = chart.getOption()
        option.xAxis[0].data = str.split(',')
        chart.setOption(option)
      }
    },
    chartOptionYdata: {
      get() {
        const { chart } = this.widgets[this.selectedWidget]
        if (chart) {
          return chart.getOption().series[0].data.join(',')
        }
        return ''
      },
      set(str) {
        const { chart } = this.widgets[this.selectedWidget]
        const option = chart.getOption()
        option.series[0].data = str.split(',')
        chart.setOption(option)
      }
    },
    chartOptionFontSize: {
      get() {
        const { chart } = this.widgets[this.selectedWidget]
        if (chart) {
          return chart.getOption().xAxis[0].axisLabel.fontSize
        }
        return 12
      },
      set(num) {
        const { chart } = this.widgets[this.selectedWidget]
        const option = chart.getOption()
        option.xAxis[0].axisLabel.fontSize = num
        chart.setOption(option)
      }
    },
    chartOptionFontWeight: {
      get() {
        const { chart } = this.widgets[this.selectedWidget]
        if (chart) {
          return chart.getOption().xAxis[0].axisLabel.fontWeight === 'bold'
        }
        return false
      },
      set(bold) {
        const { chart } = this.widgets[this.selectedWidget]
        const option = chart.getOption()
        option.xAxis[0].axisLabel.fontWeight = bold ? 'bold' : 'normal'
        chart.setOption(option)
      }
    },
    chartOptionBarWidth: {
      get() {
        const { chart } = this.widgets[this.selectedWidget]
        if (chart) {
          return chart.getOption().series[0].barWidth || null
        }
        return null
      },
      set(str) {
        const { chart } = this.widgets[this.selectedWidget]
        const option = chart.getOption()
        option.series[0].barWidth = /^\d+%$/.test(str) ? str : (parseFloat(str) || null)
        chart.setOption(option)
      }
    },
    chartOptionBarColor: {
      get() {
        const { chart } = this.widgets[this.selectedWidget]
        if (chart) {
          return chart.getOption().series[0].itemStyle.color || '#cccccc'
        }
        return null
      },
      set(str) {
        const { chart } = this.widgets[this.selectedWidget]
        const option = chart.getOption()
        option.series[0].itemStyle.color = str
        chart.setOption(option)
      }
    }
  },
  methods: {
    select(id) {
      this.selectedWidget = id
    },
    handleDelete() {
      this.widgets.splice(this.selectedWidget, 1)
      this.select(null)
    },
    handleNewWidget() {
      this.widgets.push(new Widget({
        width: 100,
        height: 100,
        backgroundColor: '#CCCCCC',
        group: null
      }))
      this.select(this.widgets.length - 1)
    },
    handleNewChart() {
      this.handleNewWidget()
      this.$nextTick(() => {
        const chart = echarts.init(this.$refs.widget[this.selectedWidget])
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
        this.$set(this.widgets[this.selectedWidget], 'chart', chart)
      })
    },
    handleMouseDown(e) {
      const { srcElement, offsetX, offsetY } = e
      // widget mousedown to drag 
      if (Array.prototype.indexOf.call(srcElement.classList, 'widget') !== -1) {
        // drag mode
        if (this.selectedWidget == srcElement.id) {
          // todo
          // 目前固定100数值，后期需要自动计算出来
          this.offsets = [offsetX + 100, offsetY + 100]
          this.relativeElement = srcElement.parentNode
          this.mode = DRAG
          return
        }
        // select
        this.select(srcElement.id)
        return
      }
      // widget wrapper mousedown to resize
      // there must be a selected widget at that time, so this.selectedWidget !== null
      if (Array.prototype.indexOf.call(srcElement.classList, 'widget-wrapper') !== -1) {
        this.relativeElement = srcElement.children[0]
        this.mode = RESIZE
        return
      }
      // not widget and widget-wrapper click
      this.select(null)
      this.relativeElement = null
      this.mode = null
      return
    },
    handleMouseUp() {
      this.relativeElement = null
      this.mode = null
    },
    handleMouseMove(e) {
      const { pageX, pageY, srcElement } = e
      // widget drag
      if (this.mode === DRAG) {
        this.widgets[this.selectedWidget].transform = [pageX - this.offsets[0], pageY - this.offsets[1]]
        return
      }
      // widget resize
      if (this.mode === RESIZE) {
        this.resize(e)
        this.$nextTick(() => {
          this.widgets[this.selectedWidget].chart && this.widgets[this.selectedWidget].chart.resize()
        })
        return
      }
      // widget-wrapper hover
      if (this.selectedWidget !== null) {
        const dom = this.$refs.widget[this.selectedWidget].parentNode
        const rect = dom.getBoundingClientRect()
        const { top, left, width, height } = rect
        // todo
        // 有滚动时必须加入scroll之类的值，否则top, left都是相对值，将导致判断失误
        // 但如果确定不存在滚动就要去掉，不需要考虑滚动的情况，这里加上window.scroll
        const boundX = pageX - left - window.scrollX,
              boundY = pageY - top - window.scrollY
        if (boundX < 0 || boundX > width || boundY < 0 || boundY > height) return
        if (boundX <= GAP) {
          if (boundY <= GAP) {
            this.cursor = 'nw'
            return
          }
          if (boundY >= (height - GAP)) {
            this.cursor = 'sw'
            return
          }
          this.cursor = 'w'
          return
        }
        if (boundX >= (width - GAP)) {
          if (boundY <= GAP) {
            this.cursor = 'ne'
            return
          }
          if (boundY >= (height - GAP)) {
            this.cursor = 'se'
            return
          }
          this.cursor = 'e'
          return
        }
        if (boundY > GAP) {
          this.cursor = 's'
          return
        }
        this.cursor = 'n'
        return
      }
    },
    resize(e) {
      const rect = this.relativeElement.getBoundingClientRect()
      Array.prototype.forEach.call(this.cursor, (direction) => {
        // todo
        // 同上，因为window有滚动，这里加上window.scroll
        const lambda = mapping[direction],
              capAxis = lambda.axis.toUpperCase(),
              pagePos = e[`page${capAxis}`],
              rectPos = rect[lambda.axis === 'x' ? 'left' : 'top'] + window[`scroll${capAxis}`]
        if (direction === 'e' || direction === 's') {
          this.widgets[this.selectedWidget][lambda.dim] = pagePos - rectPos
        } else {
          const offset = rectPos - pagePos,
                dimLength = offset + rect[lambda.dim]
          if (dimLength > 0) {
            const pos = this.widgets[this.selectedWidget].transform,
                  isWest = direction === 'w',
                  dimOffset = pos[isWest ? 0 : 1] - offset
            if (dimOffset > 0) {
              this.widgets[this.selectedWidget][lambda.dim] = dimLength
              this.widgets[this.selectedWidget].transform = isWest ? [dimOffset, pos[1]] : [pos[0], dimOffset]
            }
          }
        }
      })
    },
    keydownHandler({ keyCode }) {
      switch (keyCode) {
        case CTRL:
          this.ctrlDown = true
          break
      }
    },
    keyupHandler() {
      this.ctrlDown = false
    }
  },
  mounted() {
    this.handleNewChart()
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
  },
  created() {
    document.addEventListener('keydown', this.keydownHandler)
    document.addEventListener('keyup', this.keyupHandler)
  }
}
</script>

<style lang="scss">
.home {
  .container {
    margin: 100px 0 30px 100px;
    height: 600px;
    width: 900px;
    border: 1px solid #ccc;
    overflow: hidden;
    position: relative;
    .widget-wrapper {
      position: absolute;
      display: inline-block;
      border: 4px dashed transparent;
      &.active {
        border-color: purple;
        .widget {
          cursor: move;
        }
      }
      .widget>div {
        pointer-events: none;
      }
    }
  }
  .operations {
    margin-bottom: 20px;
    button {
      margin-right: 10px;
    }
  }
  .settings {
    border-top: 1px solid #ddd;
    .setting-row {
      margin-top: 10px;
      input[type="number"] {
        width: 60px;
      }
    }
    input[type="text"] {
      width: 250px;
    }
  }
}
</style>