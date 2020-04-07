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
      grid: {
        left: 40
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: '#ffffff'
        }
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#ffffff'
        }
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          barBorderRadius: [2, 2, 0, 0],
          color: '#6451f7'
        }
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