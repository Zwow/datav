<template>
  <div class="cm-icon-button">
    <i :class="`iconfont icon-${icon}`" v-if="icon"></i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.cm-icon-button {
  height: 25px;
  padding: 0 4px;
  border: 1px solid $border-color-dark;
  background-color: $background-rare-dark;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: .2s;
  color: $font-color-dark;
  font-size: $font-size-small;
  &:hover {
    background-color: $background-rare-dark-hover;
    color: $font-color-white;
  }
}
</style>