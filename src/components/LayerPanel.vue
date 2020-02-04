<template>
  <div class="layer-panel">
    <div class="layer-panel-title">
      页面组件
    </div>
    <ScrollView class="layer-panel-body">
      <div class="scroll-content"></div>
    </ScrollView>
  </div>
</template>

<script>
import ScrollView from './ScrollView.vue'

export default {
  components: {
    ScrollView
  }  
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.layer-panel-title {
  height: 36px;
  background-color: $background-medium-dark;
  line-height: 36px;
  padding: 0 10px;
}

.layer-panel-body {
  height: calc(100% - 36px);
  .scroll-content {
    height: 500px;
  }
}
</style>