<template>
  <div id="index" class="h-w-100">
    <AppHeader class="app-header"></AppHeader>
    <div class="app-body">
      <WidgetList class="widget-list"></WidgetList>
      <ScreenCanvas class="screen-canvas"></ScreenCanvas>
      <SettingPanel class="setting-panel"></SettingPanel>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import WidgetList from '@/components/WidgetList.vue'
import ScreenCanvas from '@/components/ScreenCanvas.vue'
import SettingPanel from '@/components/SettingPanel.vue'

export default {
  name: 'index',
  data() {
    return {}
  },
  components: {
    AppHeader,
    WidgetList,
    ScreenCanvas,
    SettingPanel
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
$app-header-height: 50px;
$app-widget-list-width: 200px;
$app-widget-setting-width: 320px;

#index {
  @mixin component-color($direction) {
    background-color: #181b1e;
    box-sizing: border-box;
    border-#{$direction}: 1px solid #101214;
  }
  background-color: #1D2329;
  .app-header {
    height: $app-header-height;
    @include component-color(bottom);
  }
  .app-body {
    height: calc(100% - #{$app-header-height});
    display: flex;
    .widget-list {
      flex: 0 0 $app-widget-list-width;
      height: 100%;
      width: $app-widget-list-width;
      @include component-color(right);
    }
    .screen-canvas {
      height: 100%;
      flex: 1;
    }
    .setting-panel {
      height: 100%;
      flex: 0 0 $app-widget-setting-width;
      width: $app-widget-setting-width;
      @include component-color(left);
    }
  }
}
</style>