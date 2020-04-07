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
  // 如果在scroolview中有嵌套其他子级的组件，必须要在子级的组件有高度/宽度改变时，
  // 在updated方法中注入并调用updateScrollbar，保证scrollbar是正确显示的。
  // 如子组件是一个高度收缩的组件，在撑开的情况下滚动到底部，此时合上该组件，
  // 但滚动条依然存在，滚动高度仍停留在撑开的高度，这是不正确的，调用scrollbar.update
  // 后才是正常的显示效果。如果dom没有子组件嵌套则不需要调用，这时这里的updated
  // 事件已经能捕捉到
  provide() {
    return {
      updateScrollbar: () => {
        this.$nextTick(() => {
          this.scrollbar.update()
        })
      }
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