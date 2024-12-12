<template>
  <div class="app-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="dashboard-container">
      <el-col :span="6" v-for="item in statisticsData" :key="item.title">
        <el-card class="statistics-card" shadow="hover">
          <div class="card-header">
            <span class="card-title">{{ item.title }}</span>
            <el-tooltip :content="item.tooltip" placement="top">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="card-value" :class="getValueClass(item.value, item.threshold)">
            {{ item.value }}{{ item.unit }}
          </div>
          <div class="card-footer">
            <span>较上周:</span>
            <span :class="item.trend >= 0 ? 'up' : 'down'">
              {{ Math.abs(item.trend) }}%
              <i :class="item.trend >= 0 ? 'el-icon-top' : 'el-icon-bottom'" />
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时监控图表 -->
    <el-row :gutter="20" class="chart-container">
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">SLA达成率趋势</span>
            <el-radio-group v-model="timeRange" size="small" class="time-range">
              <el-radio-button label="day">今日</el-radio-button>
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart">
            <div ref="slaChart" class="echarts-chart" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">SLA告警</span>
            <el-button type="text" class="more-button">查看更多</el-button>
          </div>
          <el-table
            :data="alarmList"
            style="width: 100%"
            :show-header="false"
            size="small"
          >
            <el-table-column width="40">
              <template slot-scope="{row}">
                <el-tag
                  :type="row.level | alarmLevelType"
                  size="mini"
                  effect="dark"
                >{{ row.level | alarmLevelShort }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" show-overflow-tooltip>
              <template slot-scope="{row}">
                <div class="alarm-content">
                  <span>{{ row.content }}</span>
                  <span class="alarm-time">{{ row.time }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 服务级别详情 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">服务级别详情</span>
        <el-button-group class="filter-group">
          <el-button 
            v-for="btn in filterButtons" 
            :key="btn.value"
            size="small"
            :type="currentFilter === btn.value ? 'primary' : ''"
            @click="currentFilter = btn.value"
          >
            {{ btn.label }}
          </el-button>
        </el-button-group>
      </div>
      <el-table
        :data="slaDetailList"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="服务名称" min-width="150" />
        <el-table-column prop="level" label="服务级别" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.level | levelTagType" size="mini">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="responseRate" label="响应达成率" width="120" align="center">
          <template slot-scope="{row}">
            <span :class="getValueClass(row.responseRate, 95)">{{ row.responseRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="resolveRate" label="解决达成率" width="120" align="center">
          <template slot-scope="{row}">
            <span :class="getValueClass(row.resolveRate, 90)">{{ row.resolveRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="satisfaction" label="满意度" width="120" align="center">
          <template slot-scope="{row}">
            <el-rate
              v-model="row.satisfaction"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'" size="mini">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'SLAMonitor',
  filters: {
    levelTagType(level) {
      const levelMap = {
        '一级': 'danger',
        '二级': 'warning',
        '三级': 'info'
      }
      return levelMap[level]
    },
    alarmLevelType(level) {
      const levelMap = {
        '严重': 'danger',
        '警告': 'warning',
        '提示': 'info'
      }
      return levelMap[level]
    },
    alarmLevelShort(level) {
      const levelMap = {
        '严重': '严',
        '警告': '警',
        '提示': '提'
      }
      return levelMap[level]
    }
  },
  data() {
    return {
      timeRange: 'day',
      currentFilter: 'all',
      statisticsData: [
        {
          title: '总体达成率',
          value: 98.5,
          unit: '%',
          trend: 0.5,
          threshold: 95,
          tooltip: '所有SLA指标的平均达成率'
        },
        {
          title: '响应达成率',
          value: 99.2,
          unit: '%',
          trend: 1.2,
          threshold: 95,
          tooltip: '服务响应时间达标率'
        },
        {
          title: '解决达成率',
          value: 97.8,
          unit: '%',
          trend: -0.3,
          threshold: 90,
          tooltip: '服���解决时间达标率'
        },
        {
          title: '客户满意度',
          value: 4.8,
          unit: '',
          trend: 0.2,
          threshold: 4.5,
          tooltip: '服务满意度评分(1-5分)'
        }
      ],
      filterButtons: [
        { label: '全部', value: 'all' },
        { label: '一级服务', value: '一级' },
        { label: '二级服务', value: '二级' },
        { label: '三级服务', value: '三级' }
      ],
      alarmList: [
        {
          id: 1,
          level: '严重',
          content: '核心业务系统响应时间超出SLA标准',
          time: '10分钟前'
        },
        {
          id: 2,
          level: '警告',
          content: '教务系统解决率低于预警阈值',
          time: '30分钟前'
        },
        {
          id: 3,
          level: '提示',
          content: '一般业务SLA达成率出现下降趋势',
          time: '1小时前'
        }
      ],
      slaDetailList: [
        {
          name: '教务管理系统',
          level: '一级',
          responseRate: 99.5,
          resolveRate: 98.2,
          satisfaction: 4.8,
          status: '正常'
        },
        {
          name: '学生管理系统',
          level: '一级',
          responseRate: 98.9,
          resolveRate: 97.5,
          satisfaction: 4.7,
          status: '正常'
        },
        {
          name: '图书借阅系统',
          level: '二级',
          responseRate: 97.8,
          resolveRate: 96.4,
          satisfaction: 4.5,
          status: '正常'
        },
        {
          name: '教室预约系统',
          level: '二级',
          responseRate: 94.5,
          resolveRate: 89.8,
          satisfaction: 4.2,
          status: '异常'
        }
      ],
      chartInstance: null,
      chartData: {
        day: {
          times: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
          responseRates: [99.8, 99.5, 99.9, 98.5, 97.8, 98.9, 99.2, 99.5],
          resolveRates: [98.5, 98.2, 98.9, 97.5, 96.8, 97.9, 98.2, 98.5],
          availabilities: [100, 99.9, 100, 99.8, 99.7, 99.9, 100, 100]
        },
        week: {
          times: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          responseRates: [99.5, 99.2, 98.8, 99.1, 98.9, 99.3, 99.5],
          resolveRates: [98.2, 97.9, 97.5, 98.0, 97.8, 98.1, 98.3],
          availabilities: [99.9, 99.8, 99.7, 99.9, 99.8, 99.9, 100]
        },
        month: {
          times: Array.from({length: 30}, (_, i) => `${i + 1}日`),
          responseRates: Array.from({length: 30}, () => 95 + Math.random() * 5),
          resolveRates: Array.from({length: 30}, () => 94 + Math.random() * 5),
          availabilities: Array.from({length: 30}, () => 98 + Math.random() * 2)
        }
      }
    }
  },
  watch: {
    timeRange: {
      handler(newValue) {
        this.updateChart(newValue)
      }
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    getValueClass(value, threshold) {
      if (typeof value === 'number') {
        if (value >= threshold) return 'success'
        if (value >= threshold - 5) return 'warning'
        return 'danger'
      }
      return ''
    },
    
    initChart() {
      this.chartInstance = echarts.init(this.$refs.slaChart)
      this.updateChart(this.timeRange)
    },
    
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },
    
    updateChart(timeRange) {
      const data = this.chartData[timeRange]
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#ddd',
              width: 1,
              type: 'dashed'
            }
          }
        },
        legend: {
          data: ['响应达成率', '解决达成率', '服务可用性'],
          bottom: '0%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.times,
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          min: 90,
          max: 100,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '响应达成率',
            type: 'line',
            smooth: true,
            data: data.responseRates,
            itemStyle: {
              color: '#409EFF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64,158,255,0.3)' },
                { offset: 1, color: 'rgba(64,158,255,0.1)' }
              ])
            }
          },
          {
            name: '解决达成率',
            type: 'line',
            smooth: true,
            data: data.resolveRates,
            itemStyle: {
              color: '#67C23A'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(103,194,58,0.3)' },
                { offset: 1, color: 'rgba(103,194,58,0.1)' }
              ])
            }
          },
          {
            name: '服务可用性',
            type: 'line',
            smooth: true,
            data: data.availabilities,
            itemStyle: {
              color: '#E6A23C'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(230,162,60,0.3)' },
                { offset: 1, color: 'rgba(230,162,60,0.1)' }
              ])
            }
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin-bottom: 20px;
  
  .statistics-card {
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .card-title {
        font-size: 14px;
        color: #606266;
      }
      
      .el-icon-info {
        margin-left: 5px;
        color: #909399;
        cursor: help;
      }
    }
    
    .card-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      
      &.success { color: #67C23A; }
      &.warning { color: #E6A23C; }
      &.danger { color: #F56C6C; }
    }
    
    .card-footer {
      font-size: 12px;
      color: #909399;
      
      .up {
        color: #67C23A;
      }
      
      .down {
        color: #F56C6C;
      }
    }
  }
}

.chart-container {
  margin-bottom: 20px;
  
  .time-range {
    float: right;
  }
  
  .chart {
    height: 300px;
    
    .echarts-chart {
      width: 100%;
      height: 100%;
    }
  }
  
  .more-button {
    float: right;
    padding: 3px 0;
  }
  
  .alarm-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .alarm-time {
      font-size: 12px;
      color: #909399;
    }
  }
}

.filter-group {
  float: right;
}

::v-deep .el-table {
  .success {
    color: #67C23A;
  }
  .warning {
    color: #E6A23C;
  }
  .danger {
    color: #F56C6C;
  }
}
</style> 