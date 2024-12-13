<template>
  <div class="app-container">
    <!-- 筛选区域 -->
    <el-card class="filter-container">
      <div class="filter-header">
        <span class="filter-title">统计条件</span>
      </div>
      <div class="filter-content">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="handleDateChange"
            />
          </el-form-item>
          <el-form-item label="事件类型">
            <el-select v-model="filterForm.eventType" placeholder="全部类型" clearable>
              <el-option
                v-for="item in eventTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">
              查询
            </el-button>
            <el-button type="success" icon="el-icon-download" @click="handleExport">
              导出报表
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-header">
            <span class="stat-title">总事件数</span>
            <el-tooltip content="统计周期内的事件总数" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-trend" :class="{'up': stats.totalTrend > 0}">
              {{ Math.abs(stats.totalTrend) }}%
              <i :class="stats.totalTrend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-header">
            <span class="stat-title">平均处理时长</span>
            <el-tooltip content="事件从提交到解决的平均时长" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.avgProcessTime }}h</div>
            <div class="stat-trend" :class="{'down': stats.timeSpentTrend < 0}">
              {{ Math.abs(stats.timeSpentTrend) }}%
              <i :class="stats.timeSpentTrend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-header">
            <span class="stat-title">SLA达成率</span>
            <el-tooltip content="符合服务水平协议的事件比例" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.slaRate }}%</div>
            <div class="stat-trend" :class="{'up': stats.slaRateTrend > 0}">
              {{ Math.abs(stats.slaRateTrend) }}%
              <i :class="stats.slaRateTrend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-header">
            <span class="stat-title">升级事件比例</span>
            <el-tooltip content="需要升级处理的事件占比" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.escalateRate }}%</div>
            <div class="stat-trend" :class="{'down': stats.escalateRateTrend < 0}">
              {{ Math.abs(stats.escalateRateTrend) }}%
              <i :class="stats.escalateRateTrend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <div class="chart-header">
            <span class="chart-title">事件类型分布</span>
            <el-radio-group v-model="typeChartType" size="small">
              <el-radio-button label="pie">饼图</el-radio-button>
              <el-radio-button label="bar">柱状图</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-content">
            <div ref="typeChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div class="chart-header">
            <span class="chart-title">处理时效分析</span>
            <el-select v-model="timeChartMetric" size="small" style="width: 120px">
              <el-option label="平均处理时长" value="avgTime" />
              <el-option label="SLA达成率" value="slaRate" />
            </el-select>
          </div>
          <div class="chart-content">
            <div ref="timeChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <div class="chart-header">
            <span class="chart-title">事件趋势分析</span>
            <el-radio-group v-model="trendTimeUnit" size="small">
              <el-radio-button label="day">按日</el-radio-button>
              <el-radio-button label="week">按周</el-radio-button>
              <el-radio-button label="month">按月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-content">
            <div ref="trendChart" style="width: 100%; height: 100%"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

// 添加图表配置和数据
const mockTypeData = [
  { value: 35, name: '网络故障' },
  { value: 30, name: '系统故障' },
  { value: 24, name: '硬件故障' },
  { value: 18, name: '软件故障' },
  { value: 15, name: '账号问题' },
  { value: 12, name: '数据问题' },
  { value: 22, name: '其他问题' }
]

const mockTimeData = {
  avgTime: {
    xAxis: ['网络故障', '系统故障', '硬件故障', '软件故障', '账号问题', '数据问题', '其他问题'],
    data: [4.5, 6.2, 3.8, 2.5, 1.5, 2.8, 3.2]
  },
  slaRate: {
    xAxis: ['网络故障', '系统故障', '硬件故障', '软件故障', '账号问题', '数据问题', '其他问题'],
    data: [92, 88, 96, 98, 99, 97, 95]
  }
}

const mockTrendData = {
  day: {
    xAxis: ['3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7'],
    data: [23, 25, 18, 30, 22, 15, 20]
  },
  week: {
    xAxis: ['第1周', '第2周', '第3周', '第4周'],
    data: [88, 92, 85, 95]
  },
  month: {
    xAxis: ['1月', '2月', '3月'],
    data: [320, 350, 380]
  }
}

export default {
  name: 'EventReport',
  data() {
    return {
      filterForm: {
        dateRange: [],
        eventType: undefined
      },
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
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      eventTypeOptions: [
        { label: '网络故障', value: '网络故障' },
        { label: '系统故障', value: '系统故障' },
        { label: '硬件故障', value: '硬件故障' },
        { label: '软件故障', value: '软件故障' },
        { label: '账号问题', value: '账号问题' },
        { label: '数据问题', value: '数据问题' },
        { label: '其他问题', value: '其他问题' }
      ],
      stats: {
        total: 156,
        totalTrend: 12.5,
        avgProcessTime: 4.5,
        timeSpentTrend: -8.2,
        slaRate: 95.8,
        slaRateTrend: 2.3,
        escalateRate: 15.2,
        escalateRateTrend: -3.1
      },
      typeChartType: 'pie',
      timeChartMetric: 'avgTime',
      trendTimeUnit: 'week',
      typeChart: null,
      timeChart: null,
      trendChart: null
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.disposeCharts()
  },
  watch: {
    typeChartType() {
      this.updateTypeChart()
    },
    timeChartMetric() {
      this.updateTimeChart()
    },
    trendTimeUnit() {
      this.updateTrendChart()
    }
  },
  methods: {
    handleDateChange() {
      // TODO: 根据日期范围更新图表数据
    },
    handleSearch() {
      // TODO: 根据筛选条件更新统计数据和图表
    },
    handleExport() {
      // TODO: 导出统计报表
      this.$message.success('报表导出成功')
    },
    initCharts() {
      this.typeChart = echarts.init(this.$refs.typeChart)
      this.timeChart = echarts.init(this.$refs.timeChart)
      this.trendChart = echarts.init(this.$refs.trendChart)
      
      this.updateTypeChart()
      this.updateTimeChart()
      this.updateTrendChart()
    },
    handleResize() {
      this.typeChart && this.typeChart.resize()
      this.timeChart && this.timeChart.resize()
      this.trendChart && this.trendChart.resize()
    },
    disposeCharts() {
      this.typeChart && this.typeChart.dispose()
      this.timeChart && this.timeChart.dispose()
      this.trendChart && this.trendChart.dispose()
    },
    updateTypeChart() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        series: []
      }
      
      if (this.typeChartType === 'pie') {
        option.series.push({
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: mockTypeData
        })
      } else {
        option.tooltip.trigger = 'axis'
        option.legend = null
        option.xAxis = {
          type: 'category',
          data: mockTypeData.map(item => item.name),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        }
        option.yAxis = {
          type: 'value'
        }
        option.series.push({
          type: 'bar',
          data: mockTypeData.map(item => item.value),
          barWidth: '40%'
        })
      }
      
      this.typeChart.setOption(option)
    },
    updateTimeChart() {
      const data = this.timeChartMetric === 'avgTime' ? mockTimeData.avgTime : mockTimeData.slaRate
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: this.timeChartMetric === 'avgTime' ? '{value}h' : '{value}%'
          }
        },
        series: [{
          type: 'line',
          data: data.data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3
          },
          areaStyle: {
            opacity: 0.1
          }
        }]
      }
      
      this.timeChart.setOption(option)
    },
    updateTrendChart() {
      const data = mockTrendData[this.trendTimeUnit]
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: data.data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3
          },
          areaStyle: {
            opacity: 0.1
          }
        }]
      }
      
      this.trendChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 20px;
  
  .filter-header {
    margin-bottom: 16px;
    
    .filter-title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 2px;
        bottom: 2px;
        width: 4px;
        background: #409EFF;
        border-radius: 2px;
      }
    }
  }
  
  .filter-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}

.stat-row {
  margin-bottom: 20px;
  
  .stat-card {
    height: 100%;
    
    .stat-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .stat-title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-right: 8px;
      }
      
      .el-icon-question {
        color: #909399;
        cursor: help;
      }
    }
    
    .stat-body {
      .stat-value {
        font-size: 24px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
      }
      
      .stat-trend {
        font-size: 13px;
        color: #67C23A;
        
        &.up {
          color: #F56C6C;
        }
        
        i {
          margin-left: 4px;
        }
      }
    }
  }
}

.chart-row {
  margin-bottom: 20px;
  
  .chart-card {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .chart-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    
    .chart-content {
      height: 300px;
    }
  }
}

::v-deep {
  .el-card__body {
    padding: 20px;
  }
  
  .el-date-editor.el-input {
    width: 260px;
  }
}
</style> 