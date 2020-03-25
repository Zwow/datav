<template>
<div class="setting-row">
  <label>{{ label }}</label>
  <div class="content">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    label: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.setting-row {
  display: flex;
  box-sizing: border-box;
  margin: 24px 10px;
  label {
    flex: 0 0 70px;
    font-size: $font-size-small;
  }
  .content {
    flex: 1;
    font-size: $font-size-small;
    color: $font-color-dark;
  }
}
</style>