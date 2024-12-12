<template>
  <div ref="chart" class="chart"/>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ChartComponent',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeHandler, { passive: true })
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      window.removeEventListener('resize', this.resizeHandler)
      this.chart = null
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) {
        return
      }
      this.chart = echarts.init(this.$refs.chart)
    },
    updateChart(data) {
      if (!this.chart) {
        this.initChart()
      }
      if (!this.chart) {
        return
      }

      const { type, title, xAxis, series } = data
      let option = {}

      switch (type) {
        case 'timeline':
          option = {
            title: {
              text: title,
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              formatter: '{b}: {c} 小时'
            },
            xAxis: {
              type: 'category',
              data: xAxis,
              axisLabel: {
                interval: 0,
                rotate: 30
              }
            },
            yAxis: {
              type: 'value',
              name: '平均处理时长(小时)'
            },
            series: [{
              data: series,
              type: 'bar',
              barWidth: '40%',
              label: {
                show: true,
                position: 'top'
              }
            }]
          }
          break
        case 'pie':
          option = {
            title: {
              text: title,
              left: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              top: 'middle'
            },
            series: [{
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c}'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: series
            }]
          }
          break
        case 'bar':
          option = {
            title: {
              text: title,
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: xAxis,
              axisLabel: {
                interval: 0,
                rotate: 45
              }
            },
            yAxis: {
              type: 'value',
              name: '处理事件数'
            },
            series: [{
              data: series,
              type: 'bar',
              barWidth: '40%',
              label: {
                show: true,
                position: 'top'
              }
            }]
          }
          break
      }

      this.chart.setOption(option, true)
    },
    resizeHandler() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style> 