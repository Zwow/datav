<template>
  <div class="tree-node">
    <div class="tree-node-header"
        :class="{ selected }"
        :style="{ paddingLeft: `${depth * 22 + 15}px` }"
        @click="handleToggleSelect">
      <i v-if="isGroup"
        :class="`toggle-collapsed-icon iconfont icon-arrow-${collapsed ? 'down' : 'up'}-fill`"
        @click="collapsed = !collapsed">
      </i>
      <div class="node-name">
        {{ data.name }}
      </div>
    </div>
    <div class="tree-node-content"
        v-if="hasChild"
        :style="{ height: collapsed ? 0 : 'auto' }">
      <TreeNode v-for="(node, index) in data.descendents"
                :key="index"
                :data="node"
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
    handleToggleSelect({ ctrlKey }) {
      if (ctrlKey) {
        if (this.selected) {
          this.removeFromSelectedGroup(this.data.id)
          return
        }
        this.addToSelectedGroup(this.data)
        return
      }
      this.setSelectedGroup([this.data])
    }
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
    .toggle-collapsed-icon {
      flex: 0 0 22px;
      cursor: pointer;
      text-align: center;
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