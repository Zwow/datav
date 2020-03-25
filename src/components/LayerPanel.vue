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
          <LayerRow :data="item"
                    :selected="selectedGroup.indexOf(index) !== -1"
                    @on-click="handleGroupClick">
          </LayerRow>
          <div class="layer-item-body"
              v-if="item.children"
              :style="{ height: item.collapsed ? 0 : `${28 * item.children.length}px` }">
            <LayerRow v-for="(subMenu, menuIndex) in item.children"
                      :key="menuIndex"
                      :data="subMenu"
                      :selected="selectedWidget.indexOf(menuIndex) !== -1"
                      padding>
            </LayerRow>
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
import LayerRow from './LayerRow.vue'

export default {
  components: {
    ScrollView,
    DvIconButton,
    LayerRow
  },
  data() {
    return {
      selectedGroup: []
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
            visible: this.widgets[index].visible,
            index
          }
        }
        return ungroupWidget.map(lambda).concat(this.groups.map((group, index) => {
          return {
            name: group.name,
            children: group.data.map(lambda),
            visible: group.data.some(e => this.widgets[e].visible) || group.data.length === 0,
            index,
            collapsed: group.collapsed
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
    },
    handleGroupClick({ ctrlKey }) {
      if (ctrlKey) {
        return
      }
      console.log(ctrlKey)
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
  border-bottom: 1px solid #1c1c1c;
  box-sizing: border-box;
}
.layer-panel-body {
  height: calc(100% - 72px);
  .layer-wrapper {
    background-color: #22272b;
    .layer-item-body {
      transition: .2s;
      overflow: hidden;
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