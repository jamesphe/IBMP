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
        v-model="serviceType" 
        placeholder="服务类型" 
        class="filter-item"
        @change="handleFilterChange"
      >
        <el-option label="全部类型" value="all" />
        <el-option label="IT支持" value="it" />
        <el-option label="系统维护" value="system" />
        <el-option label="设备管理" value="device" />
      </el-select>
    </div>

    <!-- 统计概览卡片 -->
    <el-row :gutter="20" class="statistics-overview">
      <el-col :span="6" v-for="item in overviewData" :key="item.title">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-title">{{ item.title }}</div>
          <div class="overview-value">{{ item.value }}</div>
          <div class="overview-footer">
            <span>较上期:</span>
            <span :class="item.trend >= 0 ? 'up' : 'down'">
              {{ Math.abs(item.trend) }}%
              <i :class="item.trend >= 0 ? 'el-icon-top' : 'el-icon-bottom'" />
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 使用趋势图 -->
    <el-card class="chart-card">
      <div slot="header" class="clearfix">
        <span>服务使用趋势</span>
      </div>
      <div class="chart-container">
        <div ref="trendChart" class="trend-chart" />
      </div>
    </el-card>

    <!-- 服务排行榜 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="rank-card">
          <div slot="header" class="clearfix">
            <span>高频服务TOP5</span>
          </div>
          <div class="rank-list">
            <div v-for="(item, index) in topServices" :key="index" class="rank-item">
              <span class="rank-index" :class="index < 3 ? 'top' + (index + 1) : ''">{{ index + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <span class="rank-value">{{ item.count }}次</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="rank-card">
          <div slot="header" class="clearfix">
            <span>低频服务TOP5</span>
          </div>
          <div class="rank-list">
            <div v-for="(item, index) in bottomServices" :key="index" class="rank-item">
              <span class="rank-index">{{ index + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <span class="rank-value">{{ item.count }}次</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'CatalogStatistics',
  data() {
    return {
      dateRange: [],
      serviceType: 'all',
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
      overviewData: [
        {
          title: '服务总数',
          value: 125,
          trend: 5.2
        },
        {
          title: '本月调用次数',
          value: 3562,
          trend: 12.5
        },
        {
          title: '平均响应时间',
          value: '2.5s',
          trend: -8.3
        },
        {
          title: '服务覆盖率',
          value: '95%',
          trend: 2.1
        }
      ],
      topServices: [
        { name: '故障报修', count: 856 },
        { name: '账号申请', count: 645 },
        { name: '设备借用', count: 523 },
        { name: '权限变更', count: 421 },
        { name: '系统咨询', count: 389 }
      ],
      bottomServices: [
        { name: '数据恢复', count: 12 },
        { name: '系统培训', count: 15 },
        { name: '设备采购', count: 18 },
        { name: '网络架构', count: 23 },
        { name: '安全审计', count: 25 }
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
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['调用次数', '响应时间'],
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '调用次数',
            axisLabel: {
              formatter: '{value}次',
              color: '#666'
            },
            splitLine: {
              lineStyle: {
                color: '#eee'
              }
            }
          },
          {
            type: 'value',
            name: '响应时间',
            axisLabel: {
              formatter: '{value}s',
              color: '#666'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '调用次数',
            type: 'bar',
            data: [320, 332, 301, 334, 390, 330, 320],
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '响应时间',
            type: 'line',
            yAxisIndex: 1,
            data: [2.6, 2.4, 2.8, 2.3, 2.5, 2.2, 2.4],
            itemStyle: {
              color: '#67C23A'
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
      color: #303133;
    }
    
    .overview-footer {
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

.rank-card {
  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #ebeef5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .rank-index {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        background: #f5f7fa;
        margin-right: 10px;
        
        &.top1 { background: #f56c6c; color: #fff; }
        &.top2 { background: #e6a23c; color: #fff; }
        &.top3 { background: #409eff; color: #fff; }
      }
      
      .rank-name {
        flex: 1;
        color: #606266;
      }
      
      .rank-value {
        color: #909399;
      }
    }
  }
}
</style> 