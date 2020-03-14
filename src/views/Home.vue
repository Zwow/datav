<template>
  <div class="demo-page">
    <div class="upper">
      <div class="container">
        <div class="ele" :style="{ height: `${height}px`, margin: `${margin}px` }"></div>
      </div>
    </div>
    <div class="lower"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: 842,
      margin: 30
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-page {
  height: 100%;
  width: 100%;
  .upper {
    height: calc(100% - 36px);
    background-color: blue;
    .container {
      height: 100%;
      width: 100%;
      overflow: auto;
      display: inline-block;
    }
  }
  .lower {
    height: 36px;
    box-sizing: border-box;
    border-top: 1px solid red;
    background-color: green;
  }
}
</style>