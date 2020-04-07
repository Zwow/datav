<template>
  <div class="dv-icon-button"
      :class="{
        'dv-disabled-button': disabled,
        'dv-button-checked': !disabled && checked
      }"
      @click="handleClick"
      :title="title">
    <i :class="`iconfont icon-${icon}`" v-if="icon"></i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    icon: {
      type: String
    },
    title: {
      type: String
    },
    type: {
      type: String,
      default: 'button',
      validator(value) {
        return ['button', 'checkbox'].indexOf(value) !== -1
      }
    },
    disabled: {}
  },
  data() {
    return {
      checked: false
    }
  },
  watch: {
    value(nv) {
      this.checked = nv
    }
  },
  methods: {
    handleClick(e) {
      if (!this.disabled) {
        if (this.type === 'button') {
          this.$emit('on-click', e)
        } else {
          this.checked = !this.checked
          this.$emit('input', this.checked)
          this.$emit('on-change', this.checked)
        }
      }
    }
  },
  created() {
    this.checked = this.value
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.dv-icon-button {
  height: 25px;
  width: 25px;
  border: 1px solid $border-color-dark;
  background-color: $background-rare-dark;
  box-sizing: border-box;
  display: inline-block;
  line-height: 22px;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
  transition: .2s;
  color: $font-color-dark;
  font-size: $font-size-small;
  &:not(.dv-disabled-button):not(.dv-button-checked):hover {
    background-color: $background-rare-dark-hover;
    color: $font-color-white;
  }
  &.dv-button-checked {
    border-color: $theme-color;
    color: #ddd;
    background-color: rgba($theme-color, .5);
  }
}
</style>