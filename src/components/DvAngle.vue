<template>
  <div class="datav-angle-wrapper">
    <div class="datav-angle" ref="dom">
      <div class="ref-point" :style="{ left: `${refPoint[0]}px`, top: `${refPoint[1]}px` }"></div>
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
  inject: ['eventhub'],
  data() {
    return {
      drag: false,
      angle: 0,
      downPoint: [0, 0],
      refPoint: [RADIUS, 0],
      centerPoint: [0, 0]
    }
  },
  watch: {
    value(nv) {
      if (nv !== this.angle) {
        this.refPoint = this.angleToPoint(nv)
      }
    }
  },
  methods: {
    handleMouseDown({ target, offsetX, offsetY, pageX, pageY }) {
      if (target === this.$refs.dom) {
        this.drag = true
        this.downPoint = [offsetX, offsetY]
        this.refPoint = [offsetX, offsetY]
        this.centerPoint = [
          pageX - offsetX + RADIUS,
          pageY - offsetY + RADIUS
        ]
      }
    },
    handleMouseMove(e) {
      if (this.drag) {
        e.preventDefault()
        const { target, offsetX, offsetY, pageX, pageY } = e
        if (target === this.$refs.dom) {
          this.refPoint = [offsetX, offsetY]
          this.angle = this.pointToAngle(...this.refPoint)
        } else {
          this.angle = this.pointToAngle(pageX, pageY, this.centerPoint[0], this.centerPoint[1])
          this.refPoint = this.angleToPoint(this.angle)
        }
        this.$emit('input', this.angle)
      }
    },
    handleMouseUp() {
      this.drag = false
      this.downPoint = [0, 0]
    },
    angleToPoint(angle) {
      return [
        RADIUS + RADIUS * Math.cos(Math.PI / 180 * angle - Math.PI / 2),
        RADIUS + RADIUS * Math.sin(Math.PI / 180 * angle - Math.PI / 2)
      ]
    },
    pointToAngle(x, y, cx = RADIUS, cy = RADIUS) {
      const angle = Math.atan2(x - cx, y - cy) * 180 / Math.PI
      // 转到0 - 360度
      return 180 - angle
    }
  },
  created() {
    this.eventhub.$on('on-mousedown', this.handleMouseDown)
    this.eventhub.$on('on-mousemove', this.handleMouseMove)
    this.eventhub.$on('on-mouseup', this.handleMouseUp)
    if (this.value) {
      this.angle = this.value
      this.refPoint = this.angleToPoint(this.angle)
    }
  },
  beforeDestroy() {
    this.eventhub.$off('on-mousedown', this.handleMouseDown)
    this.eventhub.$off('on-mousemove', this.handleMouseMove)
    this.eventhub.$off('on-mouseup', this.handleMouseUp)
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
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>