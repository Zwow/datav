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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SettingRow from '../SettingRow.vue'
import DvInputNumber from '../DvInputNumber.vue'
import DvColorPicker from '../DvColorPicker.vue'
import DvAngle from '../DvAngle.vue'

export default {
  components: {
    SettingRow,
    DvInputNumber,
    DvColorPicker,
    DvAngle
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
        return this.currentWidget.context.background
      },
      set(value) {
        this.$set(this.widgets[this.selectedWidget[0]].context, 'background', value)
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
  }
  .justify-start {
    justify-content: flex-start;
  }
  .input-number {
    width: 72px;
  }
  .widget-rotate {
    margin-left: 10px;
    width: 66px;
  }
}
</style>