<template>
  <div class="screen-canvas">
    <div class="canvas-view" :style="{ padding: `${canvasHeight / canvasWidth * zoom}% ${zoom}%` }">
      <div class="canvas-wrapper">
        <div class="canvas"></div>
      </div>
    </div>
    <CanvasZoomer class="canvas-zoomer"></CanvasZoomer>
  </div>
</template>

<script>
import CanvasZoomer from './CanvasZoomer.vue'

export default {
  data() {
    return {
      zoom: 50,
      ratio: 1,
      canvasWidth: 1920,
      canvasHeight: 1080
    }
  },
  components: {
    CanvasZoomer
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.screen-canvas {
  overflow: hidden;
  position: relative;
  background: #20252b;
  background-image: linear-gradient(#20252b 20px, transparent 0), linear-gradient(90deg, #444 2px, transparent 0);
  background-size: 22px 22px, 24px 24px;
  background-position: 14px 12px;
  .canvas-view {
    position: relative;
    .canvas-wrapper {
      position: absolute;
      left: 3%;
      top: 5%;
      right: 3%;
      bottom: 5%;
      overflow: visible;
      .canvas {
        height: 100%;
        width: 100%;
        background-color: #313b44;
        box-shadow: 0 0 30px rgba(0, 0, 0, .3);
      }
    }
  }
  .canvas-zoomer {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>