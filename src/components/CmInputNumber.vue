<template>
  <div class="cm-input-number" :class="{ 'input-focus': false }">
    <CmInput v-bind="$attrs"
            v-model="nowValue"
            @on-blur="handleBlur"
            :suffix="suffix"
            :class="{ 'btn-suffix': showBtn && !!suffix }">
    </CmInput>
    <div class="handle-btns" v-if="showBtn">
      <div class="handle-btn handle-plus"></div>
      <div class="handle-btn handle-minus"></div>
    </div>
  </div>
</template>

<script>
import CmInput from './CmInput.vue'

export default {
  props: {
    value: {
      type: Number
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    precise: {
      type: Number,
      default: 0
    },
    showBtn: {
      type: Boolean,
      default: false
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
    }
  },
  methods: {
    handleBlur() {
      if (this.nowValue === '') {
        return this.checkValue(0)
      }
      // 整数或小数
      if (/^\d*\.?\d+$/.test(this.nowValue)) {
        return this.checkValue(this.nowValue)
      }
      this.nowValue = this.preValue
    },
    trim(val) {
      if (this.propPrecise === 0) {
        return parseInt(val)
      }
      return parseFloat(val.toString().replace(/(\.)(\d+)/, (a, b, c) => `${b}${c.slice(0, this.propPrecise)}`))
    },
    emitChangeEvents(val) {
      this.$emit('input', val)
      this.$emit('on-change', val)
    },
    checkValue(val) {
      const trimVal = this.trim(val)
      if (trimVal !== this.nowValue) {
        this.nowValue = trimVal
        this.preValue = trimVal
        this.emitChangeEvents(trimVal)
      }
    }
  },
  created() {
    const trimVal = this.trim(this.value)
    this.nowValue = trimVal
    this.preValue = trimVal
    if (trimVal !== this.value) {
      this.emitChangeEvents(trimVal)
    }
  }
}
</script>

<style lang="scss">
@import "../scss/vars.scss";

.cm-input-number {
  position: relative;
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
    border-left-color: #333;
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
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      top: 50%;
      left: 0;
      background-color: #333;
      transform: translate3d(0, -50%, 0);
    }
  }
}
</style>