<template>
  <draggable class="group-tree"
            :list="data"
            :group="{ name: 'groupTree' }"
            :data-id="id"
            tag="div"
            drag-class="drag-tree-node"
            ghost-class="drop-tree-node"
            :move="handleMove"
            @end="handleDragEnd">
    <div class="group-tree-node"
        v-for="(node, index) in data"
        :key="index">
      <div class="group-tree-header"
          :class="{ selected: selectedGroupNode.findIndex(e => e.id === node.id) !== -1 }"
          :style="{ padding: `0 8px 0 ${depth * 16 + 8}px` }"
          @click="(e) => handleToggleSelect(e, index)">
        <div class="node-name">
          <i :class="`iconfont icon-${!node.data ? 'folder' : 'component'}`"></i>
          {{ node.name }}
        </div>
        <i v-if="!node.data"
          :class="`toggle-collapsed-icon iconfont icon-arrow-${node.open ? 'up' : 'down'}-fill`"
          @click.prevent.stop="handleToggleOpen(index)">
        </i>
      </div>
      <div class="group-tree-content"
          :style="{ height: node.open ? 'auto' : 0 }">
        <GroupTree :data="node.descendents" :depth="depth + 1" :id="node.id"></GroupTree>
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { mapMutations, mapState, mapGetters } from 'vuex'

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    depth: {
      type: Number
    },
    id: {
      type: Number
    }
  },
  components: {
    draggable
  },
  computed: {
    ...mapState(['selectedGroupNode', 'groups'])
  },
  methods: {
    ...mapMutations(['setSelectedGroup', 'addToSelectedGroup', 'removeFromSelectedGroup', 'orderWidgetZlevel']),
    handleToggleSelect({ ctrlKey }, index) {
      const item = this.data[index]
      if (ctrlKey) {
        if (this.selected) {
          this.removeFromSelectedGroup(item.id)
          return
        }
        this.addToSelectedGroup(item)
        return
      }
      this.setSelectedGroup([item])
    },
    handleToggleOpen(index) {
      this.$set(this.data[index], 'open', !this.data[index].open)
    },
    handleMove({ draggedContext, relatedContext }) {
      if (!relatedContext.element || !draggedContext.element) return false
      console.log(draggedContext.element, relatedContext)
      this.setSelectedGroup([draggedContext.element])
      this.$set(draggedContext.element, 'parent', relatedContext.element.parent)
    },
    handleDragEnd(ev) {
      this.orderWidgetZlevel()
    }
  }
}
</script>

<style lang="scss">
@import "../scss/vars.scss";

.group-tree {
  .group-tree-header {
    color: $font-color-white;
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    .toggle-collapsed-icon {
      cursor: pointer;
      padding: 5px;
    }
    .node-name {
      .iconfont {
        color: $font-color-base;
      }
    }
    &.selected {
      background-color: $background-rare-dark;
    }
  }
  .group-tree-content {
    overflow: hidden;
  }
  .drag-tree-node {
    opacity: 0;
  }
  .drop-tree-node {
    position: relative;
    &::after {
      content: '';
      height: 2px;
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      background-color: $secondary-theme-color;
    }
  }
}
</style>