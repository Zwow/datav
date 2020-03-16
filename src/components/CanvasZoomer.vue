<template>
  <div class="canvas-zoomer"
      :style="{
        width: `${zoomerWidth}px`,
        height: `${zoomerHeight}px`
      }">
    <div class="screen-overview"
        :style="{
          width: `${overviewWidth}px`,
          height: `${overviewHeight}px`,
          margin: `${overviewTop}px 0 0 ${overviewLeft}px`,
          backgroundColor
        }">
    </div>
    <div class="drag-handle"
        :style="{
          width: `${zoomerHandleWidth}px`,
          height: `${zoomerHandleHeight}px`,
          transform: `translate3D(${transform[0]}px, ${transform[1]}px, 0)`
        }"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseout="handleMouseUp">
    </div>    
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      zoomerWidth: 156, 
      drag: false,
      transform: [0, 0],
      downpoint: [0, 0]
    }
  },
  computed: {
    ...mapState([
      'SCREEN_LEFT', 'SCREEN_TOP', 'canvasWidth', 'canvasHeight',
      'canvasZoomLevel', 'canvasProperZoomLevel', 'screenWidth', 'screenHeight',
      'backgroundColor'
    ]),
    ...mapGetters(['screenWrapperWidth', 'screenWrapperHeight']),
    zoomerHeight() {
      return this.zoomerWidth / this.canvasWidth * this.canvasHeight
    },
    overviewWidth() {
      return this.canvasProperZoomLevel * this.screenWidth / this.canvasWidth * this.zoomerWidth
    },
    overviewHeight() {
      return this.canvasProperZoomLevel * this.screenHeight / this.canvasHeight * this.zoomerHeight
    },
    overviewTop() {
      return this.SCREEN_TOP / this.canvasHeight * this.zoomerHeight
    },
    overviewLeft() {
      return this.SCREEN_LEFT / this.canvasWidth * this.zoomerWidth
    },
    zoomerHandleWidth() {
      return Math.min(this.canvasWidth / (this.screenWrapperWidth + 2 * this.SCREEN_LEFT), 1) * this.zoomerWidth
    },
    zoomerHandleHeight() {
      return Math.min(this.canvasHeight / (this.screenWrapperHeight + 2 * this.SCREEN_TOP), 1) * this.zoomerHeight
    },
    zoomerHandleMaxY() {
      return this.zoomerHeight - this.zoomerHandleHeight
    },
    zoomerHandleMaxX() {
      return this.zoomerWidth - this.zoomerHandleWidth
    }
  },
  methods: {
    ...mapMutations(['setCanvasZoomLevel', 'setCanvasScroll']),
    handleMouseDown(e) {
      e.preventDefault()
      this.downpoint = [e.offsetX, e.offsetY]
      this.drag = true
    },
    handleMouseMove(e) {
      if (this.drag) {
        this.transform = [
          Math.min(Math.max(0, this.transform[0] + e.offsetX - this.downpoint[0]), this.zoomerHandleMaxX),
          Math.min(Math.max(0, this.transform[1] + e.offsetY - this.downpoint[1]), this.zoomerHandleMaxY),
        ]
        this.setCanvasScroll([
          this.transform[0] / this.zoomerWidth * (this.screenWrapperWidth + 2 * this.SCREEN_LEFT),
          this.transform[1] / this.zoomerHeight * (this.screenWrapperHeight + 2 * this.SCREEN_TOP)
        ])
      }
    },
    handleMouseUp() {
      this.drag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.canvas-zoomer {
  background-color: #14181c;
  box-shadow: 0 0 15px rgba(0, 0, 0, .3);
  overflow: hidden;
  box-sizing: border-box;
  .screen-overview {}
  .drag-handle {
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid lighten($theme-color, 10%);
    box-sizing: border-box;
    cursor: move;
  }
}
</style>