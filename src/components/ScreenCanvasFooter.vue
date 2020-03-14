<template>
  <div class="screen-canvas-footer">
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

export default {
  components: {
    CmIconButton,
    CmSlider
  },
  computed: {
    ...mapGetters(['canvasZoomLevel', 'canvasProperZoomLevel']),
    zoom: {
      get() {
        // 显示一个整数而不是小数，但真实的zoomLevel可能不绝对等于显示的值
        return Math.round(this.canvasZoomLevel * 100)
      },
      set(value) {
        this.setCanvasZoom(value / 100)
      }
    },
  },
  methods: {
    ...mapMutations(['setCanvasZoom']),
    handleSetProperZoomLevel() {
      this.setCanvasZoom(this.canvasProperZoomLevel)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.screen-canvas-footer {
  background-color: #22262b;
  box-sizing: border-box;
  border-top: 1px solid $border-color-dark;
  display: flex;
  align-items: center;
  padding: 0 1%;
  .zoom-options {
    flex: 1;
    height: 45px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // padding: 0 5px;
    .slider {
      flex: 0 0 180px;
      margin-right: 5px;
    }
  }
}
</style>