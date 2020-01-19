<template>
  <div class="canvas-zoomer">
    <div class="zoom-handle">
      <div class="drag-hanle"></div>
    </div>
    <div class="zoom-options">
      <CmSlider class="slider" input-suffix="%"></CmSlider>
    </div>
  </div>
</template>

<script>
import CmSlider from './CmSlider.vue'

export default {
  data() {
    return {
      zoom: 50,
      zoomOpts: [
        {
          zoom: '100%',
          value: 100
        },
        {
          zoom: '50%',
          value: 50
        },
        {
          zoom: '自适应',
          value: -1
        }
      ]
    }
  },
  components: {
    CmSlider
  }
}
</script>

<style lang="scss" scoped>
.canvas-zoomer {
  height: 200px;
  width: 310px;
  background-color: #1D2329;
  box-shadow: 0 0 15px rgba(0, 0, 0, .3);
  .zoom-handle {
    height: 155px;
    .drag-hanle {
      height: 40px;
      width: 70px;
      border: 2px solid #999;
      cursor: move;
    }
  }
  .zoom-options {
    height: 45px;
    background-color: #282D33;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 10px;
    .slider {
      flex: 1;
    }
  }
}
</style>