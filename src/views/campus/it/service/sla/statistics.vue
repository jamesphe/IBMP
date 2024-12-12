<template>
  <div class="app-container">
    <!-- 时间范围选择 -->
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
        class="filter-item"
      />
      <el-select 
        v-model="serviceLevel" 
        placeholder="服务级别" 
        class="filter-item"
        @change="handleFilterChange"
      >
        <el-option label="全部级别" value="all" />
        <el-option label="一级服务" value="一级" />
        <el-option label="二级服务" value="二级" />
        <el-option label="三级服务" value="三级" />
      </el-select>
    </div>

    <!-- 统计概览卡片 -->
    <el-row :gutter="20" class="statistics-overview">
      <el-col :span="8" v-for="item in overviewData" :key="item.title">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-title">{{ item.title }}</div>
          <div class="overview-value" :class="getValueClass(item.value)">
            {{ item.value }}%
          </div>
          <div class="overview-footer">
            <span>目标值: {{ item.target }}%</span>
            <span :class="item.value >= item.target ? 'success-tag' : 'warning-tag'">
              {{ item.value >= item.target ? '已达标' : '未达标' }}
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 达成率趋势图 -->
    <el-card class="chart-card">
      <div slot="header" class="clearfix">
        <span>达成率趋势分析</span>
      </div>
      <div class="chart-container">
        <div ref="trendChart" class="trend-chart" />
      </div>
    </el-card>

    <!-- 未达标事项分析 -->
    <el-card class="analysis-card">
      <div slot="header" class="clearfix">
        <span>未达标事项分析</span>
        <el-button-group class="filter-group">
          <el-button 
            v-for="btn in periodButtons" 
            :key="btn.value"
            size="small"
            :type="currentPeriod === btn.value ? 'primary' : ''"
            @click="currentPeriod = btn.value"
          >
            {{ btn.label }}
          </el-button>
        </el-button-group>
      </div>
      <el-table
        :data="failureList"
        border
        style="width: 100%"
      >
        <el-table-column prop="serviceName" label="服务名称" min-width="150" />
        <el-table-column prop="level" label="服务级别" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.level | levelTagType" size="mini">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="未达标类型" width="120" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.type === '响应时间' ? 'warning' : 'danger'" size="mini">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="target" label="目标值" width="100" align="center">
          <template slot-scope="{row}">{{ row.target }}分钟</template>
        </el-table-column>
        <el-table-column prop="actual" label="实际值" width="100" align="center">
          <template slot-scope="{row}">{{ row.actual }}分钟</template>
        </el-table-column>
        <el-table-column prop="count" label="发生次数" width="100" align="center" />
        <el-table-column prop="reason" label="主要原因" min-width="200" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'SLAStatistics',
  filters: {
    levelTagType(level) {
      const levelMap = {
        '一级': 'danger',
        '二级': 'warning',
        '三级': 'info'
      }
      return levelMap[level]
    }
  },
  data() {
    return {
      dateRange: [],
      serviceLevel: 'all',
      currentPeriod: 'month',
      chartInstance: null,
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
          text: '最近一月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      periodButtons: [
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' }
      ],
      overviewData: [
        {
          title: '响应时间达成率',
          value: 98.5,
          target: 95,
          trend: 1.2
        },
        {
          title: '解决时间达成率',
          value: 96.8,
          target: 90,
          trend: -0.5
        },
        {
          title: '服务可用性',
          value: 99.9,
          target: 99.5,
          trend: 0.1
        }
      ],
      failureList: [
        {
          serviceName: '教务管理系统',
          level: '一级',
          type: '响应时间',
          target: 15,
          actual: 25,
          count: 3,
          reason: '系统负载过高，导致响应延迟'
        },
        {
          serviceName: '学生管理系统',
          level: '一级',
          type: '解决时间',
          target: 120,
          actual: 180,
          count: 2,
          reason: '问题复杂度超出预期，需要多部门协作'
        },
        {
          serviceName: '图书借阅系统',
          level: '二级',
          type: '响应时间',
          target: 30,
          actual: 45,
          count: 5,
          reason: '数据库查询性能下降'
        }
      ]
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
    getValueClass(value) {
      if (value >= 98) return 'success'
      if (value >= 90) return 'warning'
      return 'danger'
    },
    handleDateChange() {
      this.updateChart()
    },
    handleFilterChange() {
      this.updateChart()
    },
    initChart() {
      this.chartInstance = echarts.init(this.$refs.trendChart)
      this.updateChart()
    },
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },
    updateChart() {
      // 模拟数据
      const days = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['响应时间达成率', '解决时间达成率', '服务可用性'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: days,
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          min: 80,
          max: 100,
          axisLabel: {
            formatter: '{value}%',
            color: '#666'
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          }
        },
        series: [
          {
            name: '响应时间达成率',
            type: 'line',
            data: Array.from({ length: 30 }, () => (90 + Math.random() * 10).toFixed(1)),
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '解决时间达成率',
            type: 'line',
            data: Array.from({ length: 30 }, () => (85 + Math.random() * 15).toFixed(1)),
            itemStyle: {
              color: '#67C23A'
            }
          },
          {
            name: '服务可用性',
            type: 'line',
            data: Array.from({ length: 30 }, () => (95 + Math.random() * 5).toFixed(1)),
            itemStyle: {
              color: '#E6A23C'
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
.filter-container {
  padding-bottom: 20px;
  
  .filter-item {
    margin-right: 10px;
    width: 200px;
  }
}

.statistics-overview {
  margin-bottom: 20px;
  
  .overview-card {
    .overview-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 10px;
    }
    
    .overview-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      
      &.success { color: #67C23A; }
      &.warning { color: #E6A23C; }
      &.danger { color: #F56C6C; }
    }
    
    .overview-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #909399;
      
      .success-tag {
        color: #67C23A;
      }
      
      .warning-tag {
        color: #E6A23C;
      }
    }
  }
}

.chart-card {
  margin-bottom: 20px;
  
  .chart-container {
    height: 400px;
    
    .trend-chart {
      width: 100%;
      height: 100%;
    }
  }
}

.analysis-card {
  .filter-group {
    float: right;
  }
}

::v-deep .el-table {
  th {
    background-color: #f5f7fa;
  }
}
</style> 