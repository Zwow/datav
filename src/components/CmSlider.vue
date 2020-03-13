<template>
  <div class="cm-slider-wrapper">
    <div class="cm-slider"
        @mousedown.stop="handleMouseDown"
        ref="slider">
      <div class="cm-slider-handle"
          ref="handle"
          :class="{ dragging: drag }"
          :style="{ transform: `translate3D(${length}px, 0, 0)` }">
      </div>
    </div>
    <label v-if="showValue && !showInput">{{ `${prefix}${value}${suffix}` }}</label>
    <CmInputNumber class="cm-input-number"
                  :style="{ width: `${inputWidth}px` }"
                  v-if="showInput"
                  :max="max"
                  :min="min"
                  :value="value"
                  :precise="0"
                  :show-btn="false"
                  :prefix="prefix"
                  :suffix="suffix"
                  v-on="$listeners">
    </CmInputNumber>
  </div>
</template>

<script>
import CmInputNumber from './CmInputNumber.vue'

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    showInput: {
      type: Boolean,
      default: false
    },
    inputWidth: {
      type: Number,
      default: 56
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  components: {
    CmInputNumber
  },
  data() {
    return {
      drag: false,
      length: 0
    }
  },
  watch: {
    value() {
      this.setLength()
    }
  },
  methods: {
    handleMouseDown(e) {
      const { srcElement, offsetX } = e
      e.preventDefault()
      // click
      if (srcElement === this.$refs.slider) {
        this.$emit('input', this.getValue(offsetX))
      } else {
        // drag
        this.drag = true
      }
    },
    handleMouseMove({ pageX }) {
      if (this.drag) {
        const rect = this.$refs.slider.getBoundingClientRect()
        this.$emit('input', Math.min(Math.max(this.min, this.getValue(pageX - this.$refs.slider.getBoundingClientRect().left)), this.max))
      }
    },
    getValue(val) {
      return Math.round(val / this.getSliderWidth() * (this.max - this.min) + this.min, 2)
    },
    endDrag() {
      this.drag = false
    },
    getSliderWidth() {
      return parseFloat(getComputedStyle(this.$refs.slider, null).width)
    },
    setLength() {
      this.length = Math.round((this.value - this.min) / (this.max - this.min) * this.getSliderWidth())
    }
  },
  mounted() {
    this.setLength()
  },
  created() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.endDrag)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.endDrag)
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.cm-slider-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  .cm-slider {
    height: 20px;
    position: relative;
    flex: 1;
    margin: 0 18px 0 10px;
    cursor: pointer;
    &::before {
      content: '';
      height: 2px;
      width: 100%;
      padding-right: 8px;
      background: linear-gradient(to right, #555, #333);
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate3d(0, -50%, 0);
    }
    .cm-slider-handle {
      position: absolute;
      top: 10%;
      width: 8px;
      left: 0;
      height: 80%;
      background-color: #444;
      border: 1px solid #222;
      box-sizing: border-box;
      transition: border-color .3s;
      &.dragging {
        border-color: $theme-color;
      }
    }
  }
  label {
    margin-right: 10px;
  }
}
</style>