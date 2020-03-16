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
    },
    scroll: {
      type: Array
    }
  },
  data() {
    return {
      scrollbar: null
    }
  },
  watch: {
    scroll: {
      handler(nv) {
        this.$refs.scrollbar.scrollLeft = nv[0]
        this.$refs.scrollbar.scrollTop = nv[1]
      },
      deep: true
    }
  },
  methods: {
    scrollHandler() {
      this.$emit('on-scroll', { scrollLeft: this.$refs.scrollbar.scrollLeft, scrollTop: this.$refs.scrollbar.scrollTop })
    }
  },
  mounted() {
    this.scrollbar = new PerfectScrollbar(this.$refs.scrollbar, this.options)
    this.$refs.scrollbar.addEventListener('ps-scroll-x', this.scrollHandler)
    this.$refs.scrollbar.addEventListener('ps-scroll-y', this.scrollHandler)
  },
  beforeDestroy() {
    this.$refs.scrollbar.removeEventListener('ps-scroll-x', this.scrollHandler)
    this.$refs.scrollbar.removeEventListener('ps-scroll-y', this.scrollHandler)
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