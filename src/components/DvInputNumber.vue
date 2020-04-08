<template>
  <div class="dv-input-number-wrapper">
    <div class="dv-input-number" :class="{ 'input-focus': false }">
      <DvInput v-bind="$attrs"
              v-model="input"
              @on-blur="handleBlur"
              @keypress.enter.native="handleBlur"
              :suffix="suffix"
              :class="{ 'btn-suffix': showBtn && !!suffix }">
      </DvInput>
      <div class="handle-btns" v-if="showBtn">
        <div class="handle-btn handle-plus" @click="handleChangeValue(step)"></div>
        <div class="handle-btn handle-minus" @click="handleChangeValue(-step)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DvInput from './DvInput.vue'

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
    DvInput
  },
  data() {
    return {
      input: 0
    }
  },
  watch: {
    value(nv) {
      this.input = this.getDisplayValue(nv)
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
    pow() {
      return Math.pow(10, this.propPrecise)
    },
    step() {
      return 1 / this.pow
    }
  },
  methods: {
    handleChangeValue(value) {
      this.checkValue(this.value + value)
    },
    checkValue(val) {
      const trimed = this.trimValue(val)
      if (trimed !== this.value) {
        this.$emit('input', trimed)
        this.$emit('on-change', trimed)
      } else if (val !== this.value) {
        // 相较真正的值有改动，撤回
        this.input = this.getDisplayValue(this.value)
      }
    },
    trimValue(val) {
      if (this.min !== undefined && val < this.min) {
        return this.min
      }
      if (this.max !== undefined && val > this.max) {
        return this.max
      }
      return parseFloat(val.toFixed(this.propPrecise))
    },
    getDisplayValue() {
      if (this.propPrecise === 0) {
        return this.value
      }
      return (Math.floor(this.value * this.pow) / this.pow).toFixed(this.propPrecise)
    },
    handleBlur() {
      // format number
      const value = +this.input
      // not number, restore
      if (Number.isNaN(value) || value === this.value) {
        this.input = this.getDisplayValue(this.value)
        return
      }
      this.checkValue(value)
    }
  },
  created() {
    this.input = this.getDisplayValue(this.value)
    this.checkValue(this.value)
  }
}
</script>

<style lang="scss">
@import "../scss/vars.scss";

.dv-input-number-wrapper {
  display: inline-block;
  vertical-align: top;
  width: 100px;
  color: $font-color-white;
}

.dv-input-number {
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
      flex: 0 0 50%;
      width: 100%;
      position: relative;
      background-color: #393939;
      @mixin operator($content) {
        cursor: pointer;
        &::after {
          content: $content;
          display: block;
          position: absolute;
          text-align: center;
          line-height: 1;
          width: 100%;
          color: #aaa;
        }
        &:hover {
          background-color: #444;
          &::after {
            color: #fff;
          }
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
      transform: translate3d(0, -100%, 0);
    }
  }
}
</style>