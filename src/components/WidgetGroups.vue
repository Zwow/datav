<template>
  <div class="widget-groups">
    <GroupTree :data="groups.descendents" :depth="0" :id="groups.id"></GroupTree>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import GroupTree from './GroupTree.vue'
Vue.component('GroupTree', GroupTree)

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