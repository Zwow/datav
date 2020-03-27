<template>
  <div class="tree-node">
    <div class="tree-node-header"
        :class="{ selected }"
        :data-path="path"
        :style="{ padding: `0 5px 0 ${depth * 16 + 5}px` }">
      <div class="toggle-btn">
        <i v-if="isGroup"
          :class="`toggle-collapsed-icon iconfont icon-arrow-${collapsed ? 'down' : 'up'}-fill`"
          @click="collapsed = !collapsed">
        </i>
      </div>
      <div class="node-name">
        <i :class="`iconfont icon-${isGroup ? 'folder' : 'component'}`"></i>
        {{ data.name }}
      </div>
    </div>
    <div class="tree-node-content"
        v-if="hasChild"
        :style="{ height: collapsed ? 0 : 'auto' }">
      <TreeNode v-for="(node, index) in data.descendents"
                :key="index"
                :data="node"
                :path="`${path},${index}`"
                :depth="depth + 1">
      </TreeNode>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    depth: {
      type: Number
    },
    path: {
      type: [Number, String]
    }
  },
  data() {
    return {
      collapsed: true
    }
  },
  computed: {
    ...mapState(['selectedGroupNode']),
    hasChild() {
      return this.data.descendents && this.data.descendents.length
    },
    isGroup() {
      return !this.data.data
    },
    selected() {
      return this.selectedGroupNode.findIndex(e => e.id === this.data.id) !== -1
    }
  },
  methods: {
    ...mapMutations(['setSelectedGroup', 'addToSelectedGroup', 'removeFromSelectedGroup', 'newGroup']),
    // handleToggleSelect({ ctrlKey }) {
    //   if (ctrlKey) {
    //     if (this.selected) {
    //       this.removeFromSelectedGroup(this.data.id)
    //       return
    //     }
    //     this.addToSelectedGroup(this.data)
    //     return
    //   }
    //   this.setSelectedGroup([this.data])
    // }
  }
}
</script>

<style lang="scss">
@import "../scss/vars.scss";

.tree-node {
  .tree-node-header {
    color: $font-color-white;
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .toggle-btn {
      flex: 0 0 18px;
      text-align: center;
      .toggle-collapsed-icon {
        cursor: pointer;
      }
    }
    .node-name {
      .iconfont {
        color: $font-color-base;
      }
    }
    &.selected {
      background-color: $theme-color;
    }
  }
  .tree-node-content {
    overflow: hidden;
  }
}
</style>