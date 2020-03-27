<template>
  <div class="widget-groups" @click="handleClick">
    <TreeNode v-for="(node, index) in groups.descendents"
              :key="index"
              :data="node"
              :path="index"
              :depth="0">
    </TreeNode>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import TreeNode from './TreeNode.vue'
Vue.component('TreeNode', TreeNode)

export default {
  computed: {
    ...mapState(['groups'])
  },
  methods: {
    handleClick(e) {
      console.log(e.target.classList)
      if (Array.prototype.indexOf.call(e.target.classList, 'tree-node-header') !== -1) {
        console.log('12313')
        // if (e.ctrlKey) {
        //   if (this.selected) {
        //     this.removeFromSelectedGroup(this.data.id)
        //     return
        //   }
        //   this.addToSelectedGroup(this.data)
        //   return
        // }
        // this.setSelectedGroup([this.data])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.widget-groups {
  min-height: 100%;
  min-width: 100%;
}
</style>