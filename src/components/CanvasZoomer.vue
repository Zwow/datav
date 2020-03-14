<template>
  <div class="canvas-zoomer"
      :style="{
        width: `${zoomerWidth}px`,
        height: `${zoomerHeight}px`
      }">
    <div class="screen-overview"></div>
    <!-- <div class="drag-handle"
        :style="{
          width: `${zoomerHandleWidth}px`,
          height: `${zoomerHandleHeight}px`,
          transform: `translate3D(${transform[0]}px, ${transform[1]}px, 0)`
        }"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseout="handleMouseUp">
    </div>     -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

const ZOOMER_WIDTH_BASE = 186, ZOOMER_HEIGHT_BASE = 150

export default {
  data() {
    return {
      drag: false,
      transform: [0, 0],
      downpoint: [0, 0]
    }
  },
  computed: {
    ...mapGetters([
      'canvasZoomLevel', 'canvasProperZoomLevel', 'canvasHeight',
      'screenWidth', 'screenHeight', 'backgroundColor', 'SCREEN_TOP'
    ]),
    zoomerWidth() {
      if (this.screenWidth > this.screenHeight) {
        return ZOOMER_WIDTH_BASE
      }
      return this.zoomerHeight / this.screenHeight * this.screenWidth
    },
    zoomerHeight() {
      if (this.screenHeight > this.screenWidth) {
        return ZOOMER_HEIGHT_BASE
      }
      return this.zoomerWidth / this.screenWidth * this.screenHeight
    },
    zoomerHandleWidth() {
      return this.zoomerWidth * this.displayRatio
    },
    zoomerHandleHeight() {
      if (this.canvasZoomLevel * this.screenHeight + this.SCREEN_TOP * 2 <= this.canvasHeight) {
        return this.zoomerHeight
      }
      return this.zoomerHeight * this.displayRatio
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
  padding: 5px;
  .screen-overview {
    height: 100%;
    width: 100%;
    border: 1px solid #324c5b;
    box-sizing: border-box;
  }
  .drag-handle {
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid lighten($theme-color, 10%);
    box-shadow: 10px 8px 15px rgba(0, 0, 0, .2);
    box-sizing: border-box;
    cursor: move;
  }
}
</style>