<template>
  <div class="layer-panel">
    <div class="layer-panel-title">
      页面组件
    </div>
    <ScrollView class="layer-panel-body">
      <WidgetGroups></WidgetGroups>
    </ScrollView>
    <div class="layer-toolbar">
      <DvIconButton icon="up" :disabled="!isSiblingNode" title="上移一层"></DvIconButton>
      <DvIconButton icon="down" :disabled="!isSiblingNode" title="下移一层"></DvIconButton>
      <DvIconButton icon="folder" title="创建分组" :disabled="!isSiblingNode" @on-click="newGroup"></DvIconButton>
      <DvIconButton icon="delete" title="删除"></DvIconButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import ScrollView from './ScrollView.vue'
import DvIconButton from './DvIconButton.vue'
import WidgetGroups from './WidgetGroups.vue'

export default {
  components: {
    ScrollView,
    DvIconButton,
    WidgetGroups
  },
  computed: {
    ...mapState(['widgets', 'selectedWidget', 'selectedGroupNode']),
    ...mapGetters(['isSiblingNode'])
  },
  methods: {
    ...mapMutations(['newGroup']),
    handleGroup() {

    },
    setUpGroups() {
      
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
}
.layer-toolbar {
  height: 36px;
  box-sizing: border-box;
  border-top: 1px solid $border-color-dark;
  background-color: #22262b;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &>div {
    margin-left: 3px;
  }
}
</style>