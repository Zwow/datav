<template>
  <div class="datav-collapse">
    <div class="datav-collapse-header" @click.prevent="handleToggleOpen">
      <slot name="header"></slot>
      <i :class="`iconfont icon-arrow-${open ? 'down' : 'right'}`"></i>
    </div>
    <div class="datav-collapse-body" v-show="open">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },
  inject: ['updateScrollbar'],
  methods: {
    handleToggleOpen() {
      this.open = !this.open
    }
  },
  updated() {
    this.updateScrollbar()
  }
}
</script>

<style lang="scss" scoped>

.datav-collapse {
  .datav-collapse-header {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
  }
  .datav-collapse-body {
    background-color: #121416;
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>