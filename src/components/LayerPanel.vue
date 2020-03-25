<template>
  <div class="layer-panel">
    <div class="layer-panel-title">
      页面组件
    </div>
    <ScrollView class="layer-panel-body">
      <div class="layer-wrapper">
        
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
    DvIconButton,
  },
  data() {
    return {
      count: 0,
      groups: [],
      groups1: [
        {
          name: '分组1',
          id: 0,
          chilren: [{ widgetIndex: 0, id: 1, parentId: 0 }]
        },
        {
          name: '分组2',
          id: 2,
          chilren: [
            { widgetIndex: 1, id: 3, parentId: 2 },
            { widgetIndex: 2, id: 4, parentId: 2 },
            {
              name: '地图组包',
              id: 5,
              parentId: 2,
              chilren: [{ widgetIndex: 3, id: 6, parentId: 5 }]
            }
          ]
        },
        {
          name: '分组3',
          id: 7,
          chilren: []
        }
      ]
    }
  },
  computed: {
    ...mapState(['widgets', 'selectedWidget']),
  },
  watch: {
    'widgets.length': {
      handler(nv, old) {
        console.log(length, length)
      }
      // if (nv.length === 0) {
      //   this.groups = []
      //   return
      // }
      // // 只看变化的部分，如从2个变4个，则只看最后2个
      // // 但减少时不一定是最后的元素，这时就需要找出来
      // const length = old.length - nv.length
      // let diff = []
      // if (length < 0) {
      //   diff = nv.slice(length)
      // } else {
      //   console.log(length, '次')
      //   for (let i = 0; i < old.length && diff.length < length; i++) {
      //     if (nv.indexOf(old[i]) !== -1) {
      //       diff.push(old[i])
      //     }
      //   }
      // }
      // console.log('###', diff)
    }
  },
  methods: {
    // ...mapMutations([]),
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
  .layer-wrapper {

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