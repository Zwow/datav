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
            <!-- 最小300x300，最大暂定8K分辨率 -->
            宽<DvInputNumber class="size-input" :precise="0" :min="300" :max="7680" v-model="width"></DvInputNumber>
            高<DvInputNumber class="size-input" :precise="0" :min="300" :max="4320" v-model="height"></DvInputNumber>
          </div>
        </div>
        <div class="setting-row">
          <label>背景颜色</label>
          <div class="content">
            <DvColorPicker v-model="background" @on-change="handleChange"></DvColorPicker><br/>
          </div>
        </div>
        <div class="setting-row">
          <label>背景图</label>
          <div class="content">
            <DvInput v-model="backgroundUrl" placeholder="请输入图片链接" suffix-icon="link"></DvInput>
          </div>
        </div>
        <DvButton @on-click="handleClick">保存</DvButton>
      </template>
    </ScrollView>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ScrollView from './ScrollView.vue'
import DvInputNumber from './DvInputNumber.vue'
import DvColorPicker from './DvColorPicker.vue'
import DvInput from './DvInput.vue'
import DvButton from './DvButton.vue'

export default {
  data() {
    return {
      backgroundUrl: ''
    }
  },
  components: {
    ScrollView,
    DvInputNumber,
    DvColorPicker,
    DvInput,
    DvButton
  },
  computed: {
    ...mapState(['screenHeight', 'screenWidth', 'backgroundColor']),
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
    ...mapMutations(['setScreenWidth', 'setScreenHeight', 'setBackgroundColor']),
    handleChange(v) {
      console.log(v)
    },
    handleClick() {
      console.log('###', this.backgroundColor)
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