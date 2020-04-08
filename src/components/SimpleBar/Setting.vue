<template>
  <div class="widget-simple-bar-setting">
    <SettingRow label="组件尺寸">
      <div class="flex-row">
        宽<DvInputNumber class="input-number" :precise="0" :min="2" v-model="width"></DvInputNumber>
        高<DvInputNumber class="input-number" :precise="0" :min="2" v-model="height"></DvInputNumber>
      </div>
    </SettingRow>
    <SettingRow label="位置">
      <div class="flex-row">
        左<DvInputNumber class="input-number" :precise="0" :min="2" v-model="left"></DvInputNumber>
        上<DvInputNumber class="input-number" :precise="0" :min="2" v-model="top"></DvInputNumber>
      </div>
    </SettingRow>
    <SettingRow label="背景颜色">
      <DvColorPicker v-model="background"></DvColorPicker>
    </SettingRow>
    <SettingRow label="背景图">
      <DvInput v-model="backgroundUrl" placeholder="请输入图片链接" suffix-icon="link"></DvInput>
      <div class="mt-20">
        <DvIconButton class="icon-checkbox" icon="cover" type="checkbox" title="拉伸至铺满"></DvIconButton>
        <DvIconButton class="icon-checkbox" icon="infinite" type="checkbox" title="背景重复"></DvIconButton>
      </div>
    </SettingRow>
    <SettingRow label="旋转角度" >
      <div class="flex-row justify-start">
        <DvAngle v-model="angle"></DvAngle>
        <DvInputNumber v-model="inputAngle"
                      class="input-number widget-rotate"
                      :precise="0"
                      :min="0"
                      :max="360"
                      :show-btn="false"
                      suffix="°">
        </DvInputNumber>
      </div>
    </SettingRow>
    <DvSelect></DvSelect>
    <DvCollapse class="border-top">
      <template slot="header">
        样式设置
      </template>
      <div>
        <SettingRow label="图表位置">
          <div class="flex-row">
            左<DvInputNumber class="input-number" :precise="0" :min="2" v-model="left"></DvInputNumber>
            上<DvInputNumber class="input-number" :precise="0" :min="2" v-model="top"></DvInputNumber>
          </div>
          <div class="flex-row mt-20">
            右<DvInputNumber class="input-number" :precise="0" :min="2" v-model="left"></DvInputNumber>
            下<DvInputNumber class="input-number" :precise="0" :min="2" v-model="top"></DvInputNumber>
          </div>
        </SettingRow>
        <SettingRow label="柱宽">
          <DvInputNumber class="input-number" :precise="0" :min="1" :max="100" suffix="%" :show-btn="false" v-model="left"></DvInputNumber>
        </SettingRow>
        <SettingRow label="颜色">
          <DvColorPicker v-model="background"></DvColorPicker>
        </SettingRow>
        <SettingRow label="X轴">
          <div class="flex-row">
            <DvIconButton class="icon-checkbox" icon="horizontal-line" type="checkbox" title="显示轴线"></DvIconButton>
            <div class="flex-row">
              <DvInputNumber class="mr-10 mini-input-number" suffix="px" :show-btn="false" :precise="0" :min="1" :max="100" v-model="left"></DvInputNumber>
              <DvColorPicker v-model="background"></DvColorPicker>
            </div>
          </div>
          <div class="flex-row mt-20">
            <DvIconButton class="icon-checkbox" icon="horizontal-grid" type="checkbox" title="显示网格线"></DvIconButton>
          </div>
          <DvSelect></DvSelect>
        </SettingRow>
      </div>
    </DvCollapse>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SettingRow from '../SettingRow.vue'
import DvInputNumber from '../DvInputNumber.vue'
import DvInput from '../DvInput.vue'
import DvColorPicker from '../DvColorPicker.vue'
import DvAngle from '../DvAngle.vue'
import DvIconButton from '../DvIconButton.vue'
import DvCollapse from '../DvCollapse.vue'
import DvSelect from '../DvSelect.vue'

export default {
  components: {
    SettingRow,
    DvInputNumber,
    DvInput,
    DvColorPicker,
    DvAngle,
    DvIconButton,
    DvCollapse,
    DvSelect
  },
  computed: {
    ...mapState(['widgets', 'selectedWidget', 'canvasZoomLevel']),
    ...mapGetters(['currentWidget']),
    width: {
      get() {
        return Math.round(this.currentWidget.width / this.canvasZoomLevel)
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]], 'width', value * this.canvasZoomLevel)
        this.$nextTick(() => {
          this.currentWidget.context.echart.resize()
        })
      }
    },
    height: {
      get() {
        return Math.round(this.currentWidget.height / this.canvasZoomLevel)
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]], 'height', value * this.canvasZoomLevel)
        this.$nextTick(() => {
          this.currentWidget.context.echart.resize()
        })
      }
    },
    left: {
      get() {
        return Math.round(this.currentWidget.transform[0] / this.canvasZoomLevel)
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]].transform, 0, value * this.canvasZoomLevel)
      }
    },
    top: {
      get() {
        return Math.round(this.currentWidget.transform[1] / this.canvasZoomLevel)
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]].transform, 1, value * this.canvasZoomLevel)
      }
    },
    background: {
      get() {
        return this.currentWidget.context.backgroundColor
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]].context, 'backgroundColor', value)
      }
    },
    backgroundUrl: {
      get() {
        return this.currentWidget.context.backgroundImage
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]].context, 'backgroundImage', value)
      }
    },
    angle: {
      get() {
        return this.currentWidget.rotate
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]], 'rotate', value)
      }
    },
    inputAngle: {
      get() {
        return Math.round(this.currentWidget.rotate)
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]], 'rotate', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.widget-simple-bar-setting {
  .flex-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .input-number {
    width: 72px;
  }
  .mini-input-number {
    width: 56px;
  }
  .widget-rotate {
    margin-left: 10px;
    width: 66px;
  }
  .icon-checkbox {
    margin-right: 3px;
  }
}
</style>