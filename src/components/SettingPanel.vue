<template>
  <div class="setting-panel">
    <div class="setting-title">
      屏幕设置
    </div>
    <section>
      <div class="setting-row">
        <label>屏幕尺寸</label>
        <div class="content">
          宽<CmInputNumber class="input" :precise="0" v-model="width"></CmInputNumber>
          高<CmInputNumber class="input" :precise="0" v-model="height"></CmInputNumber>
        </div>
      </div>
      <div class="setting-row">
        <label>背景颜色</label>
        <div class="content">
          <CmColorPicker></CmColorPicker>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CmInputNumber from './CmInputNumber.vue'
import CmColorPicker from './CmColorPicker.vue'

export default {
  data() {
    return {
      width: 1920,
      height: 1080,
      backgroundColor: '#ffffff'
    }
  },
  components: {
    CmInputNumber,
    CmColorPicker
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.setting-panel {
  overflow: hidden;
  .setting-title {
    height: 36px;
    background-color: $background-medium-dark;
    line-height: 36px;
    padding: 0 10px;
  }
  section {
    .setting-row {
      display: flex;
      margin: 20px 0;
      label {
        flex: 0 0 80px;
        margin-right: 20px;
        text-align: center;
      }
      .content {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: $font-size-small;
        color: $font-color-dark;
        .input {
          width: 75px;
          margin-left: 5px;
          margin-right: 15px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>