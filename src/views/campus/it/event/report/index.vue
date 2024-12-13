<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="handleDateChange"
      />
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-wrapper">
          <div class="chart-title">事件类型分布</div>
          <div class="chart-content">
            <!-- 这里放饼图组件 -->
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrapper">
          <div class="chart-title">处理时效分析</div>
          <div class="chart-content">
            <!-- 这里放柱状图组件 -->
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <div class="chart-wrapper">
          <div class="chart-title">事件趋势分析</div>
          <div class="chart-content">
            <!-- 这里放折线图组件 -->
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="export-container" style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-download" @click="handleExport">
        导出报表
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventReport',
  data() {
    return {
      dateRange: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    handleDateChange() {
      // TODO: 根据日期范围更新图表数据
    },
    handleExport() {
      // TODO: 导出报表
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px;
  .chart-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 16px;
  }
  .chart-content {
    height: 300px;
  }
}
</style> 