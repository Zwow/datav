<template>
  <div class="datav-angle-wrapper">
    <div class="datav-angle"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp">
      <div class="ref-point" :style="{ transform: `translate3D(${refpoint[0] - 1}px, ${refpoint[1] - 1}px, 0)` }"></div>
    </div>
  </div>
</template>

<script>
// r = 10, center = [10, 10]
const RADIUS = 10

export default {
  props: {
    value: {
      type: Number,
      validator(value) {
        return value >= 0 && value <= 360
      }
    }
  },
  data() {
    return {
      drag: false,
      angle: 0,
      downpoint: [0, 0],
      refpoint: [RADIUS, 0]
    }
  },
  watch: {
    value(nv, old) {
      if (nv !== old) {
        this.angleToPoint()
      }
    }
  },
  methods: {
    handleMouseDown({ offsetX, offsetY }) {
      this.drag = true
      this.downpoint = [offsetX, offsetY]
      this.refpoint = [offsetX, offsetY]
    },
    handleMouseMove({ offsetX, offsetY }) {
      if (this.drag) {
        this.refpoint = [offsetX, offsetY]
        this.pointToAngle()
      }
    },
    handleMouseUp() {
      this.drag = false
      this.downpoint = [0, 0]
    },
    angleToPoint() {
      this.refpoint = [
        RADIUS + RADIUS * Math.cos(Math.PI / 180 * this.angle - Math.PI / 2),
        RADIUS + RADIUS * Math.sin(Math.PI / 180 * this.angle - Math.PI / 2)
      ]
    },
    pointToAngle() {
      this.angle = -(Math.atan2(this.refpoint[0] - RADIUS, this.refpoint[1] - RADIUS) * 180 / Math.PI - 180)
      this.$emit('input', this.angle)
    }
  },
  created() {
    if (this.value) {
      this.angle = this.value
      this.angleToPoint()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../scss/vars.scss";

.datav-angle-wrapper{
  padding: 2px;
  display: inline-block;
  background-color: #eee;
  border: 1px solid $border-color-dark;
  box-sizing: border-box;
  border-radius: 50%;
}
.datav-angle {
  display: inline-block;
  vertical-align: top;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  .ref-point {
    position: absolute;
    left: 0;
    top: 0;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    pointer-events: none;
    background-color: #444;
  }
}
</style>