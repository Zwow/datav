<template>
  <div class="cm-slider-wrapper">
    <div class="cm-slider"><div class="cm-slider-handle"></div></div>
    <CmInputNumber class="cm-input-number"
                  v-if="showInput"
                  v-model="test"
                  :prefix="inputPrefix"
                  :suffix="inputSuffix">
    </CmInputNumber>
  </div>
</template>

<script>
import CmInputNumber from './CmInputNumber.vue'

export default {
  props: {
    showInput: {
      type: Boolean,
      default: true
    },
    inputPrefix: {
      type: String,
      default: ''
    },
    inputSuffix: {
      type: String,
      default: ''
    }
  },
  components: {
    CmInputNumber
  },
  data() {
    return {
      test: 50
    }
  },
  methods: {
    handleChange(v) {
      console.log('###', v)
    }
  }
}
</script>

<style lang="scss" scoped>

.cm-slider-wrapper {
  display: flex;
  align-items: center;
  .cm-slider {
    height: 20px;
    position: relative;
    width: 100px;
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    &::before {
      content: '';
      height: 2px;
      width: 100%;
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
      height: 80%;
      background-color: #444;
      border: 1px solid #222;
      box-sizing: border-box;
    }
  }
  .cm-input-number {
    width: 56px;
  }
}
</style>