<template>
  <div class="widget-groups">
    <TreeNode v-for="(node, index) in groups.descendents"
              :key="index"
              :data="node">
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
  }
}
</script>

<style lang="scss" scoped>
.widget-groups {
  min-height: 100%;
  min-width: 100%;
}
</style>