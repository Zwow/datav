<template>
  <div class="cm-color-picker-wrapper">
    <div class="cm-color-picker">
      <CmInput class="cm-input"></CmInput>
      <input class="color-picker" type="color">
    </div>
  </div>
</template>

<script>
import CmInput from './CmInput.vue'

export default {
  components: {
    CmInput
  }
}
</script>

<style lang="scss">
.cm-color-picker {
  width: 120px;
  position: relative;
  .cm-input {
    input {
      padding-left: 40px;
    }
  }
  .color-picker {
    position: absolute;
    left: 4px;
    top: 50%;
    width: 20px;
    height: 60%;
    border: 0;
    transform: translate3d(0, -50%, 0);
  }
}
</style>