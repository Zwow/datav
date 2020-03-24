<template>
  <div class="layer-panel">
    <div class="layer-panel-title">
      页面组件
    </div>
    <ScrollView class="layer-panel-body">
      <div class="layer-wrapper">
        <div class="layer-item"
            v-for="(item, index) in layer"
            :key="index">
          <div class="layer-item-header">
            <div class="layer-visible-btn">
              <i class="iconfont icon-eye"></i>
            </div>
            <i class="iconfont icon-arrow-down-fill layer-folder-btn"></i>
            <div class="layer-right">
              <i class="iconfont icon-folder"></i>
              <div class="layer-name">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollView>
    <div class="layer-toolbar">
      <DvIconButton icon="up" title="上移一层"></DvIconButton>
      <DvIconButton icon="down" title="下移一层"></DvIconButton>
      <DvIconButton icon="folder" title="创建分组" :disabled="!selectedWidget.length" @on-click="handleGroup"></DvIconButton>
      <DvIconButton icon="delete" title="删除" :disabled="!selectedWidget.length"></DvIconButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ScrollView from './ScrollView.vue'
import DvIconButton from './DvIconButton.vue'

export default {
  components: {
    ScrollView,
    DvIconButton
  },
  data() {
    return {
      hidden: []
    }
  },
  computed: {
    ...mapState(['widgets', 'selectedWidget', 'groups']),
    layer() {
      if (this.widgets.length) {
        const ungroupWidget = [...Array(this.widgets.length).keys()]
        this.groups.forEach(group => {
          group.data.forEach(e => {
            const exist = ungroupWidget.indexOf(e)
            exist !== -1 && ungroupWidget.splice(exist, 1)
          })
        })
        const lambda = (index) => {
          return {
            name: this.widgets[index].name,
            index
          }
        }
        return ungroupWidget.map(lambda).concat(this.groups.map((group, index) => {
          return {
            name: group.name,
            children: group.data.map(lambda),
            index
          }
        }))
      }
      return []
    }
  },
  methods: {
    ...mapMutations(['group']),
    handleGroup() {
      this.group()
    }
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
  height: calc(100% - 72px);
  .layer-item-header {
    height: 28px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid $border-color-dark;
    overflow: hidden;
    .layer-visible-btn {
      padding: 0 10px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid $border-color-dark;
      .iconfont {
        cursor: pointer;
      }
    }
    .layer-folder-btn {
      padding: 0 5px;
      cursor: pointer;
    }
    .layer-right {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      .iconfont {
        margin-right: 5px;
      }
      .layer-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.layer-toolbar {
  height: 36px;
  box-sizing: border-box;
  border-top: 1px solid $border-color-dark;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &>div {
    margin-left: 3px;
  }
}
</style>