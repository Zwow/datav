<template>
  <div class="canvas-zoomer">
    <div class="canvas-overview">
      <div class="drag-handle"></div>
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
      <CmIconButton class="icon-button" icon="fullscreen"></CmIconButton>
    </div>
  </div>
</template>

<script>
import CmIconButton from './CmIconButton.vue'
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
    CmIconButton,
    CmSlider
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.canvas-zoomer {
  height: 200px;
  width: 310px;
  background-color: #1D2329;
  box-shadow: 0 0 15px rgba(0, 0, 0, .3);
  .canvas-overview {
    height: 155px;
    .drag-handle {
      height: 100%;
      width: 100%;
      border: 1px solid lighten($theme-color, 10%);
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
    justify-content: flex-end;
    padding: 0 5px;
    .slider {
      flex: 0 0 180px;
      margin-right: 10px;
    }
  }
}
</style>