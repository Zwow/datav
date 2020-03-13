<template>
  <div class="canvas-zoomer" :style="{ width: `${zoomerWidth}px` }">
    <div class="canvas-overview"
        :style="{ height: `${zoomerHeight}px` }">
      <div class="screen-overview"
          :style="{ backgroundColor }">
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
    <div class="zoom-options">
      <span>画布缩放</span>
      <CmSlider class="slider"
                v-model="zoom"
                :min="20"
                :max="150"
                suffix="%"
                show-input>
      </CmSlider>
      <CmIconButton class="icon-button" icon="fullscreen" @click.native="handleSetProperZoomLevel"></CmIconButton>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CmIconButton from './CmIconButton.vue'
import CmSlider from './CmSlider.vue'

const ZOOMER_WIDTH = 286

export default {
  components: {
    CmIconButton,
    CmSlider
  },
  data() {
    return {
      zoomerWidth: ZOOMER_WIDTH,
      drag: false,
      transform: [0, 0],
      downpoint: [0, 0]
    }
  },
  computed: {
    ...mapGetters([
      'canvasZoomLevel', 'canvasProperZoomLevel', 'screenWidth',
      'screenHeight', 'backgroundColor'
    ]),
    zoom: {
      get() {
        // 显示一个整数而不是小数，但真实的zoomLevel可能不绝对等于显示的值
        return Math.round(this.canvasZoomLevel * 100)
      },
      set(value) {
        this.setCanvasZoom(value / 100)
      }
    },
    zoomerHeight() {
      return this.zoomerWidth / this.screenWidth * this.screenHeight
    },
    zoomerHandleWidth() {
      return this.zoomerWidth * this.displayRatio
    },
    zoomerHandleHeight() {
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
    handleSetProperZoomLevel() {
      this.setCanvasZoom(this.canvasProperZoomLevel)
    },
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
  .canvas-overview {
    position: relative;
    padding: 3%;
    overflow: hidden;
    box-sizing: border-box;
    .screen-overview {
      height: 100%;
      width: 100%;
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
  .zoom-options {
    height: 45px;
    background-color: #282D33;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 0 5px;
    .slider {
      flex: 0 0 180px;
      margin-right: 5px;
    }
  }
}
</style>