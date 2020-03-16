<template>
  <div class="screen-canvas-footer">
    <div class="zoom-options">
      <span>画布缩放</span>
      <DvSlider class="slider"
                v-model="zoom"
                :min="20"
                :max="150"
                suffix="%"
                show-input>
      </DvSlider>
      <DvIconButton class="icon-button" icon="fullscreen" @click.native="handleSetProperZoomLevel"></DvIconButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import DvIconButton from './DvIconButton.vue'
import DvSlider from './DvSlider.vue'

export default {
  components: {
    DvIconButton,
    DvSlider
  },
  computed: {
    ...mapState(['canvasZoomLevel', 'canvasProperZoomLevel']),
    zoom: {
      get() {
        // 显示一个整数而不是小数，但真实的zoomLevel可能不绝对等于显示的值
        return Math.round(this.canvasZoomLevel * 100)
      },
      set(value) {
        this.setCanvasZoomLevel(value / 100)
      }
    },
  },
  methods: {
    ...mapMutations(['setCanvasZoomLevel']),
    handleSetProperZoomLevel() {
      this.setCanvasZoomLevel(this.canvasProperZoomLevel)
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