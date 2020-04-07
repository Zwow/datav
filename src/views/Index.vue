<template>
  <div id="index" class="h-w-100">
    <AppHeader class="app-header"></AppHeader>
    <div class="app-body">
      <WidgetList class="widget-list"></WidgetList>
      <div class="screen-canvas-wrapper">
        <ScreenCanvas class="screen-canvas"></ScreenCanvas>
        <ScreenCanvasFooter class="screen-canvas-footer"></ScreenCanvasFooter>
      </div>
      <div class="side-panel">
        <SettingPanel class="setting-panel"></SettingPanel>
        <LayerPanel class="layer-panel"></LayerPanel>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import WidgetList from '@/components/WidgetList.vue'
import ScreenCanvas from '@/components/ScreenCanvas.vue'
import ScreenCanvasFooter from '@/components/ScreenCanvasFooter.vue'
import SettingPanel from '@/components/SettingPanel.vue'
import LayerPanel from '@/components/LayerPanel.vue'

export default {
  name: 'index',
  components: {
    AppHeader,
    WidgetList,
    ScreenCanvas,
    ScreenCanvasFooter,
    SettingPanel,
    LayerPanel
  },
  data() {
    return {
      eventhub: new Vue()
    }
  },
  provide() {
    return {
      eventhub: this.eventhub
    }
  }
}
</script>

<style lang="scss" scoped>
$app-header-height: 50px;
$app-widget-list-width: 200px;
$app-widget-setting-width: 280px;

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
    .screen-canvas-wrapper {
      height: 100%;
      flex: 1;
      overflow: hidden;
      .screen-canvas {
        height: calc(100% - 36px);
        width: 100%;
      }
      .screen-canvas-footer {
        height: 36px;
      }
    }
    .side-panel {
      height: 100%;
      flex: 0 0 $app-widget-setting-width;
      width: $app-widget-setting-width;
      @include component-color(left);
      .setting-panel {
        height: 60%;
      }
      .layer-panel {
        height: 40%;
      }
    }
  }
}
</style>