<template>
  <div class="scroll-view" ref="scrollbar">
    <slot></slot>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

export default {
  data() {
    return {
      scrollbar: null
    }
  },
  mounted() {
    this.scrollbar = new PerfectScrollbar(this.$refs.scrollbar)
  },
  updated() {
    this.$nextTick(() => {
      this.scrollbar.update()
    })
  }
}
</script>

<style lang="scss">
.scroll-view {
  position: relative;
  .ps__rail-y {
    width: 6px;
    &, &.ps--clicking, &:hover {
      background-color: #222;
    }
    .ps__thumb-y {
      width: 4px;
      right: 1px;
      border-radius: 0;
      background-color: #666;
    }
  }
}
</style>