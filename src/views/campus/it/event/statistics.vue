<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card shadow="never">
          <div slot="header">处理时效趋势</div>
          <div ref="timeChart" style="height: 300px" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <div slot="header">分类统计</div>
          <div ref="typeChart" style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EventStatistics',
  data() {
    return {
      timeChart: null,
      typeChart: null
    }
  },
  mounted() {
    this.initCharts()
  },
  beforeDestroy() {
    if (this.timeChart) {
      this.timeChart.dispose()
    }
    if (this.typeChart) {
      this.typeChart.dispose()
    }
  }
}
</script> 