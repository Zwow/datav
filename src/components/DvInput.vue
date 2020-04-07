<template>
  <div class="dv-input-wrapper"
      :class="{ [`suffix${suffixIcon ? '-icon' : ''}`]: suffixIcon || suffix, [`prefix${prefixIcon ? '-icon' : ''}`]: prefixIcon || prefix }"
      :data-suffix="suffix"
      :data-prefix="prefix">
    <input type="text"
          :value="inputValue"
          :placeholder="placeholder"
          @input="handleInput"
          @focus="$emit('on-focus')"
          @blur="$emit('on-blur')">
    <i v-if="prefixIcon" :class="`dv-prefix-icon iconfont icon-${prefixIcon}`"></i>
    <i v-if="suffixIcon" :class="`dv-suffix-icon iconfont icon-${suffixIcon}`"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    suffix: {
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    prefixIcon: {
      type: String
    },
    suffixIcon: {
      type: String
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  watch: {
    value(nv) {
      this.inputValue = nv
    }
  },
  methods: {
    handleInput({ target: { value } }) {
      this.$emit('input', value)
      this.$emit('on-change', value)
    }
  },
  created() {
    this.inputValue = this.value
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.dv-input-wrapper {
  position: relative;
  width: 100%;
  input {
    width: 100%;
    box-sizing: border-box;
    outline: none;
    border: 1px solid $border-color-dark;
    padding: 4px 8px;
    background-color: #444;
    transition: .2s;
    color: #fff;
    z-index: 0;
    &:focus {
      background-color: #555;
      border-color: $theme-color;
      &~.iconfont {
        color: lighten($theme-color, 10);
      }
    }
    &:hover {
      background-color: #555;
    }
  }
  @mixin input-padding($placement) {
    input {
      padding-#{if($placement == prefix, left, right)}: 24px;
    }
  }
  @mixin input-mixin($placement) {
    @include input-padding($placement);
    &::#{if($placement == prefix, before, after)} {
      pointer-events: none;
      content: attr(data-#{$placement});
      width: 24px;
      text-align: center;
      display: block;
      position: absolute;
      top: 50%;
      #{if($placement == prefix, left, right)}: 0;
      transform: translate3d(0, -50%, 0);
    }
    
  }
  &.prefix {
    @include input-mixin(prefix);
  }
  &.suffix {
    @include input-mixin(suffix);
  }
  &.prefix-icon {
    @include input-padding(prefix);
    .dv-prefix-icon {
      left: 5px;
    }
  }
  &.suffix-icon {
    @include input-padding(suffix);
    .dv-suffix-icon {
      right: 5px;
    }
  }
  .iconfont {
    position: absolute;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    color: $font-color-dark;
    font-size: $font-size-medium;
  }
}
</style>