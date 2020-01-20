<template>
  <div class="cm-input-number-wrapper">
    <div class="cm-input-number" :class="{ 'input-focus': false }">
      <CmInput v-bind="$attrs"
              v-model="nowValue"
              @on-blur="handleBlur"
              :suffix="suffix"
              :class="{ 'btn-suffix': showBtn && !!suffix }">
      </CmInput>
      <div class="handle-btns" v-if="showBtn">
        <div class="handle-btn handle-plus" @click="handleChangeValue(step)"></div>
        <div class="handle-btn handle-minus" @click="handleChangeValue(-step)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import CmInput from './CmInput.vue'

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    precise: {
      type: Number,
      default: 2
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  components: {
    CmInput
  },
  data() {
    return {
      nowValue: 0,
      preValue: 0
    }
  },
  watch: {
    value(nv) {
      this.checkValue(nv)
    }
  },
  computed: {
    propPrecise() {
      const val = parseInt(this.precise)
      if (Number.isNaN(val) || val < 0) {
        return 0
      }
      return val
    },
    step() {
      return 1 / Math.pow(10, this.propPrecise)
    }
  },
  methods: {
    handleChangeValue(value) {
      this.emitChangeEvents(parseFloat(this.nowValue) + value)
    },
    handleBlur() {
      const val = +this.nowValue
      // not number
      if (Number.isNaN(val)) {
        this.nowValue = this.preValue
        return
      }
      this.checkValue(val)
    },
    trim(val) {
      if (this.propPrecise === 0) {
        return parseInt(val)
      }
      return val.toFixed(this.propPrecise)
    },
    emitChangeEvents(val) {
      const v = parseFloat(val)
      this.$emit('input', v)
      this.$emit('on-change', v)
    },
    checkValue(val) {
      const trimVal = this.trim(this.getValue(val))
      if (trimVal != this.nowValue) {
        this.nowValue = trimVal
        this.preValue = trimVal
        this.emitChangeEvents(trimVal)
      }
    },
    getValue(val) {
      if (this.min !== undefined && val < this.min) {
        return this.min
      }
      if (this.max !== undefined && val > this.max) {
        return this.max
      }
      return val
    }
  },
  created() {
    const trimVal = this.trim(this.getValue(this.value))
    this.nowValue = trimVal
    this.preValue = trimVal
    if (trimVal != this.value) {
      this.emitChangeEvents(trimVal)
    }
  }
}
</script>

<style lang="scss">
@import "../scss/vars.scss";

.cm-input-number-wrapper {
  display: inline-block;
  color: $font-color-white;
}

.cm-input-number {
  position: relative;
  overflow: hidden;
  .btn-suffix {
    input {
      padding-right: 45px !important;
    }
    &::after {
      right: 25px !important;
    }
  }
  .handle-btns {
    position: absolute;
    width: 25px;
    height: 100%;
    right: 0;
    top: 0;
    border: 1px solid transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .handle-btn {
      flex: 1 1 50%;
      width: 100%;
      position: relative;
      background-color: #393939;
      @mixin operator($content) {
        cursor: pointer;
        &::after {
          content: $content;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -55%, 0);
        }
        &:hover {
          background-color: #444;
        }
      }
      &:first-child {
        @include operator('+');
      }
      &:last-child {
        @include operator('-');
      }
    }
    @mixin persudo-border {
      left: 0;
      background-color: #333;
      content: '';
      position: absolute;
    }
    &::before {
      @include persudo-border;
      width: 1px;
      height: 100%;
      top: 0;
      z-index: 2;
    }
    &::after {
      @include persudo-border;
      width: 100%;
      height: 1px;
      top: 50%;
      transform: translate3d(0, -50%, 0);
    }
  }
}
</style>