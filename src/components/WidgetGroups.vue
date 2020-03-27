<template>
  <div class="widget-groups">
    <TreeNode v-for="(node, index) in groups.descendents"
              :key="index"
              :data="node"
              :depth="0">
    </TreeNode>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import TreeNode from './TreeNode.vue'
Vue.component('TreeNode', TreeNode)

export default {
  computed: {
    ...mapState(['groups'])
  }
}
</script>

<style lang="scss" scoped>
.widget-groups {
  
}
</style>