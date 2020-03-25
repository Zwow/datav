<template>
  <div class="cm-icon-button" :class="{ 'cm-disabled-button': disabled }" @click="(e) => !disabled && $emit('on-click', e)" :title="title">
    <i :class="`iconfont icon-${icon}`" v-if="icon"></i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    },
    disabled: {}
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.cm-icon-button {
  height: 25px;
  width: 25px;
  border: 1px solid #555;
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
  &:not(.cm-disabled-button):hover {
    background-color: $theme-color;
    color: $font-color-white;
    border-color: lighten($theme-color, 10);
  }
}
</style>