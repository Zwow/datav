<template>
  <div class="cm-input-wrapper"
      :class="{ suffix: !!suffix, prefix: !!prefix }"
      :data-suffix="suffix"
      :data-prefix="prefix">
    <input type="text"
          :value="inputValue"
          @input="handleInput"
          @focus="$emit('on-focus')"
          @blur="$emit('on-blur')">
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

.cm-input-wrapper {
  position: relative;
  width: 100%;
  input {
    width: 100%;
    box-sizing: border-box;
    outline: none;
    border: 1px solid #222;
    padding: 4px 8px;
    background-color: #444;
    transition: .2s;
    color: #fff;
    &:focus {
      background-color: #555;
      border-color: $theme-color;
    }
  }
  @mixin input-mixin($placement) {
    input {
      padding-#{if($placement == prefix, left, right)}: 24px;
    }
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
}
</style>