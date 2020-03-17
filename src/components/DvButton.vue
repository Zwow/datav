<template>
  <button :class="`cm-button ${size}`" @click="handleClick">
    <i :class="`iconfont icon-${icon}`" v-if="icon"></i><slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String
    },
    size: {
      type: String,
      default: 'normal',
      validator: v => ['large', 'normal', 'small'].indexOf(v) !== -1
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('on-click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.cm-button {
  border: none;
  color: $font-color-white;
  outline: none;
  margin: 0;
  line-height: normal;
  background-color: $theme-color;
  transition: .3s;
  cursor: pointer;
  .iconfont {
    margin-right: 10px;
  }
  &:hover {
    background-color: lighten($theme-color, 2);
  }
  &.normal {
    padding: $button-padding-base;
  }
  &.small {
    padding: $mini-button-padding;
    font-size: $font-size-small;
    .iconfont {
      margin-right: 4px;
      font-size: $font-size-small;
    }
  }
  &:active {
    background-color: darken($theme-color, 1);
  }
}
</style>