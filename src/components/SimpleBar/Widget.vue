<template>
  <div class="widget-simple-bar"
      ref="container"
      :style="{
        background: context.background
      }">
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  props: {
    widgetIndex: {
      type: Number
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    ...mapState(['widgets']),
    context() {
      return this.widgets[this.widgetIndex].context
    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.container)
    chart.setOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false }
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }]
    })
    this.chart = chart
    this.widgets[this.widgetIndex].context.echart = chart
  }
}
</script>

<style lang="scss" scoped>
.widget-simple-bar {
  height: 100%;
  width: 100%;
}
</style>