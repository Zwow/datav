<template>
  <div class="setting-panel">
    <div class="setting-title">
      {{ settingTitle }}
    </div>
    <ScrollView class="setting-panel-body">
      <div v-show="showScreenSetting">
        <!-- 最小300x300，最大暂定8K分辨率 -->
        <SettingRow label="屏幕尺寸">
          <div class="flex-row">
            宽<DvInputNumber class="size-input" :precise="0" :min="300" :max="7680" v-model="width"></DvInputNumber>
            高<DvInputNumber class="size-input" :precise="0" :min="300" :max="4320" v-model="height"></DvInputNumber>
          </div>
        </SettingRow>
        <SettingRow label="背景颜色">
          <DvColorPicker v-model="background" @on-change="handleChange"></DvColorPicker>
        </SettingRow>
        <SettingRow label="背景图">
          <DvInput v-model="backgroundUrl" placeholder="请输入图片链接" suffix-icon="link"></DvInput>
        </SettingRow>
      </div>
      <div v-show="showWidgetSetting">
        <component :is="currentWidget.component"></component>
      </div>
      <div v-show="showOtherSetting">
        <SettingRow label="组件尺寸">
          <div class="flex-row">
            宽<DvInputNumber class="size-input" :precise="0" v-model="selectedWidgetWidth"></DvInputNumber>
            高<DvInputNumber class="size-input" :precise="0" v-model="selectedWidgetHeight"></DvInputNumber>
          </div>
        </SettingRow>
        <SettingRow label="对齐工具">
          <div class="align-row">
            <DvIconButton class="align-button" icon="align-left" title="左对齐" @on-click="handleAlignTopLeft"></DvIconButton>
            <DvIconButton class="align-button" icon="align-top" title="顶部对齐" @on-click="handleAlignTopLeft(false)"></DvIconButton>
            <DvIconButton class="align-button" icon="align-right" title="右对齐" @on-click="handleAlignBottomRight"></DvIconButton>
            <DvIconButton class="align-button" icon="align-bottom" title="底部对齐" @on-click="handleAlignBottomRight(false)"></DvIconButton>
            <DvIconButton class="align-button" icon="align-center" title="垂直居中对齐" @on-click="handleAlignCenter"></DvIconButton>
            <DvIconButton class="align-button" icon="align-middle" title="水平居中对齐" @on-click="handleAlignBottomRight(false)"></DvIconButton>
          </div>
          <div class="align-row">
            <DvIconButton class="align-button" icon="align-vertical" title="垂直分布" @on-click="handleDistribution"></DvIconButton>
            <DvIconButton class="align-button" icon="align-horizontal" title="水平分布" @on-click="handleDistribution(false)"></DvIconButton>
          </div>
        </SettingRow>
      </div>
    </ScrollView>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ScrollView from './ScrollView.vue'
import SettingRow from './SettingRow.vue'
import DvInputNumber from './DvInputNumber.vue'
import DvColorPicker from './DvColorPicker.vue'
import DvInput from './DvInput.vue'
import DvButton from './DvButton.vue'
import DvIconButton from './DvIconButton.vue'

export default {
  data() {
    return {
      backgroundUrl: ''
    }
  },
  components: {
    ScrollView,
    SettingRow,
    DvInputNumber,
    DvColorPicker,
    DvInput,
    DvButton,
    DvIconButton,
    SimpleBar: () => import('./SimpleBar/Setting.vue')
  },
  computed: {
    ...mapGetters(['selectedWidgetBox']),
    ...mapState([
      'screenHeight', 'screenWidth', 'backgroundColor',
      'widgets', 'selectedWidget', 'canvasZoomLevel'
    ]),
    ...mapGetters(['currentWidget']),
    selectedWidgetWidth: {
      get() {
        return Math.round(this.selectedWidgetBox.width / this.canvasZoomLevel)
      },
      set(value) {
        
      }
    },
    selectedWidgetHeight: {
      get() {
        return Math.round(this.selectedWidgetBox.height / this.canvasZoomLevel)
      },
      set(value) {
        
      }
    },
    showScreenSetting() {
      return this.selectedWidget.length === 0
    },
    showWidgetSetting() {
      return this.selectedWidget.length === 1
    },
    showOtherSetting() {
      return this.selectedWidget.length > 1
    },
    settingTitle() {
      if (this.showScreenSetting) {
        return '屏幕设置'
      }
      if (this.showWidgetSetting) {
        return '组件设置'
      }
      return '其他'
    },
    width: {
      get() {
        return this.screenWidth
      },
      set(val) {
        this.setScreenWidth(val)
      }
    },
    height: {
      get() {
        return this.screenHeight
      },
      set(val) {
        this.setScreenHeight(val)
      }
    },
    background: {
      get() {
        return this.backgroundColor
      },
      set(val) {
        this.setBackgroundColor(val)
      }
    }
  },
  methods: {
    ...mapMutations([
      'setScreenWidth', 'setScreenHeight', 'setBackgroundColor',
      'setWidgetTransform', 'group'
    ]),
    handleAlignTopLeft(alignLeft) {
      const i = alignLeft ? 0 : 1
      let v = this.widgets[this.selectedWidget[0]].transform[i]
      this.selectedWidget.forEach((index) => {
        v = Math.min(v, this.widgets[index].transform[i])
      })
      this.selectedWidget.forEach((index) => {
        this.$set(this.widgets[index].transform, i, v)
      })
    },
    handleAlignCenter(vertical) {
      const i = vertical ? 0 : 1, dim = vertical ? 'width' : 'height'
      let v1 = this.widgets[this.selectedWidget[0]].transform[i],
          v2 = this.widgets[this.selectedWidget[0]].transform[i] + this.widgets[this.selectedWidget[0]][dim]
      this.selectedWidget.forEach((index) => {
        v1 = Math.min(v1, this.widgets[index].transform[i])
        v2 = Math.max(v2, this.widgets[index].transform[i] + this.widgets[index][dim])
      })
      const baseLine = (v1 + v2) / 2
      this.selectedWidget.forEach((index) => {
        this.$set(this.widgets[index].transform, i, baseLine - this.widgets[index][dim] / 2)
      })
    },
    handleAlignBottomRight(alignRight) {
      const i = alignRight ? 0 : 1, dim = alignRight ? 'width' : 'height'
      let v = this.widgets[this.selectedWidget[0]].transform[i] + this.widgets[this.selectedWidget[0]][dim]
      this.selectedWidget.forEach((index) => {
        v = Math.max(v, this.widgets[index].transform[i] + this.widgets[index][dim])
      })
      this.selectedWidget.forEach((index) => {
        this.$set(this.widgets[index].transform, i, v - this.widgets[index][dim])
      })
    },
    handleDistribution(vertical) {
      const i = vertical ? 1 : 0, dim = vertical ? 'height' : 'width'
      // 按left/top值先后排序
      const selected = this.selectedWidget.slice().sort((a, b) =>
        this.widgets[a].transform[i] - this.widgets[b].transform[i]
      )
      const interval = selected.slice(0, -1).reduce((res, id, index) => {
        const next = selected[index + 1]
        res += (this.widgets[next].transform[i] - this.widgets[id].transform[i] - this.widgets[id][dim])
        return res
      }, 0) / (selected.length - 1)
      selected.slice(1, -1).forEach((id, index) => {
        const pre = this.widgets[selected[index]]
        this.$set(this.widgets[id].transform, i, pre.transform[i] + pre[dim] + interval)
      })
    },
    handleChange(v) {
      console.log(v)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.setting-panel {
  overflow: hidden;
  .setting-title {
    height: 30px;
    background-color: $background-medium-dark;
    line-height: 30px;
    padding: 0 10px;
  }
  .setting-panel-body {
    height: calc(100% - 30px);
    .flex-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .size-input {
      width: 72px;
    }
    .align-row {
      margin-bottom: 10px;
    }
    .align-button {
      margin-right: 3px;
    }
  }
}
</style>