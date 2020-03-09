<template>
  <div class="setting-panel">
    <div class="setting-title">
      屏幕设置
    </div>
    <ScrollView class="setting-panel-body">
      <template>
        <div class="setting-row">
          <label>屏幕尺寸</label>
          <div class="content">
            宽<CmInputNumber class="size-input" :precise="0" v-model="width"></CmInputNumber>
            高<CmInputNumber class="size-input" :precise="0" v-model="height"></CmInputNumber>
          </div>
        </div>
        <div class="setting-row">
          <label>背景颜色</label>
          <div class="content">
            <CmColorPicker v-model="backgroundColor" @on-change="handleChange"></CmColorPicker><br/>
          </div>
        </div>
        <div class="setting-row">
          <label>背景图</label>
          <div class="content">
            <CmInput v-model="backgroundUrl" placeholder="请输入图片链接" suffix-icon="link"></CmInput>
          </div>
        </div>
      </template>
    </ScrollView>
  </div>
</template>

<script>
import ScrollView from './ScrollView.vue'
import CmInputNumber from './CmInputNumber.vue'
import CmColorPicker from './CmColorPicker.vue'
import CmInput from './CmInput.vue'

export default {
  data() {
    return {
      width: 1920,
      height: 1080,
      backgroundColor: 'purple',
      backgroundUrl: ''
    }
  },
  components: {
    ScrollView,
    CmInputNumber,
    CmColorPicker,
    CmInput
  },
  methods: {
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
    height: 36px;
    background-color: $background-medium-dark;
    line-height: 36px;
    padding: 0 10px;
  }
  .setting-panel-body {
    height: calc(100% - 36px);
    .setting-row {
      display: flex;
      margin: 30px 10px;
      label {
        flex: 0 0 80px;
        margin-right: 15px;
        text-align: center;
      }
      .content {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: $font-size-small;
        color: $font-color-dark;
        .size-input {
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