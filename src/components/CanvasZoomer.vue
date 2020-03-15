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
        }"></div>
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
import { mapGetters, mapMutations } from 'vuex'

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
    ...mapGetters([
      'canvasZoomLevel', 'canvasProperZoomLevel', 'canvasWidth', 'canvasHeight',
      'screenWidth', 'screenHeight', 'backgroundColor', 'SCREEN_LEFT', 'SCREEN_TOP'
    ]),
    zoomerHeight() {
      if (this.displayWidthRatio > 1) {
        return this.zoomerWidth / this.canvasWidth * this.canvasHeight
      }
      return this.zoomerWidth / this.screenWidth * this.screenHeight
    },
    displayWidthRatio() {
      return this.canvasWidth / (this.screenWidth * this.canvasZoomLevel + this.SCREEN_LEFT * 2)
    },
    displayHeightRatio() {
      return this.canvasHeight / (this.screenHeight * this.canvasZoomLevel + this.SCREEN_TOP * 2)
    },
    overviewWidth() {
      return this.zoomerWidth / Math.max(this.displayWidthRatio, 1) - this.overviewLeft * 2
    },
    overviewHeight() {
      return this.zoomerHeight / Math.max(this.displayHeightRatio, 1) - this.overviewTop * 2
    },
    overviewTop() {
      // return this.SCREEN_TOP / this.canvasHeight * this.zoomerHeight
      if (this.displayHeightRatio > 1) {
        return this.SCREEN_TOP / this.canvasHeight * this.zoomerHeight
      }
      return this.SCREEN_TOP / (this.screenHeight * this.canvasProperZoomLevel + 2 * this.SCREEN_TOP) * this.zoomerHeight
    },
    overviewLeft() {
      if (this.displayWidthRatio > 1) {
        return this.SCREEN_LEFT / this.canvasWidth * this.zoomerWidth
      }
      return this.SCREEN_LEFT / (this.screenWidth * this.canvasProperZoomLevel + 2 * this.SCREEN_LEFT) * this.zoomerWidth
    },
    zoomerHandleWidth() {
      return this.zoomerWidth * Math.min(this.displayWidthRatio, 1)
    },
    zoomerHandleHeight() {
      return this.zoomerHeight * Math.min(this.displayHeightRatio, 1)
    },
    zoomerHandleMaxY() {
      return this.zoomerHeight - this.zoomerHandleHeight
    },
    zoomerHandleMaxX() {
      return this.zoomerWidth - this.zoomerHandleWidth
    },
    ratio() {
      return this.canvasProperZoomLevel / this.canvasZoomLevel
    },
    displayRatio() {
      return Math.min(1, this.ratio)
    }
  },
  watch: {
    // zoomerHandleWidth(nv, old) {
    //   this.$set(this.transform, 0, this.transform[0] - nv + old)
    // },
    // zoomerHandleHeight(nv, old) {
    //   this.$set(this.transform, 1, this.transform[1] - nv + old)
    // }
  },
  methods: {
    ...mapMutations(['setCanvasZoom', 'setZoomerTransform']),
    handleMouseDown(e) {
      e.preventDefault()
      if (this.displayRatio === 1) {
        return
      }
      this.downpoint = [e.offsetX, e.offsetY]
      this.drag = true
    },
    handleMouseMove(e) {
      if (this.drag) {
        this.transform = [
          Math.min(Math.max(0, this.transform[0] + e.offsetX - this.downpoint[0]), this.zoomerHandleMaxX),
          Math.min(Math.max(0, this.transform[1] + e.offsetY - this.downpoint[1]), this.zoomerHandleMaxY),
        ]
        this.setZoomerTransform([
          this.transform[0] / this.zoomerWidth,
          this.transform[1] / this.zoomerHeight
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