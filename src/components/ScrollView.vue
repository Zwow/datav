<template>
  <div class="scroll-view" ref="scrollbar">
    <slot></slot>
  </div>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      scrollbar: null
    }
  },
  mounted() {
    this.scrollbar = new PerfectScrollbar(this.$refs.scrollbar, this.options)
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
  .ps__rail-x {
    height: 6px;
    &, &.ps--clicking, &:hover {
      background-color: #222;
    }
    .ps__thumb-x {
      height: 4px;
      bottom: 1px;
      border-radius: 0;
      background-color: #666;
    }
  }
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