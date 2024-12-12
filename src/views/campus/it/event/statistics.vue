<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="filter-item"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.eventType"
        placeholder="事件类型"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in eventTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.priority"
        placeholder="优先级"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in priorityOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="handleFilter"
      >
        刷新
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>事件处理时效</span>
            <el-tooltip content="展示不同优先级事件的平均处理时长" placement="top">
              <i class="el-icon-question" style="margin-left: 8px"/>
            </el-tooltip>
          </div>
          <div class="chart-wrapper">
            <chart-component ref="timelineChart"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>事件类型分布</span>
            <el-tooltip content="展示不同类型事件的数量占比" placement="top">
              <i class="el-icon-question" style="margin-left: 8px"/>
            </el-tooltip>
          </div>
          <div class="chart-wrapper">
            <chart-component ref="typeChart"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>处理人统计</span>
            <el-tooltip content="展示各处理人的事件处理数量" placement="top">
              <i class="el-icon-question" style="margin-left: 8px"/>
            </el-tooltip>
          </div>
          <div class="chart-wrapper">
            <chart-component ref="handlerChart"/>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <span>事件明细</span>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="事件编号" align="center" min-width="100" width="120">
          <template slot-scope="{row}">
            <span>{{ row.eventId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件类型" align="center" min-width="120">
          <template slot-scope="{row}">
            <span>{{ row.eventType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" align="center" min-width="80" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.priority | priorityFilter">
              {{ row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人" align="center" min-width="100" width="120">
          <template slot-scope="{row}">
            <span>{{ row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理时长(小时)" align="center" min-width="120" width="140">
          <template slot-scope="{row}">
            <span>{{ row.handleTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" align="center" min-width="100" width="120">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" min-width="160">
          <template slot-scope="{row}">
            <span>{{ row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" align="center" min-width="160">
          <template slot-scope="{row}">
            <span>{{ row.finishedAt || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ChartComponent from './components/ChartComponent'

export default {
  name: 'EventStatistics',
  components: { Pagination, ChartComponent },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '处理中': 'warning',
        '已完成': 'success',
        '已关闭': 'info'
      }
      return statusMap[status]
    },
    priorityFilter(priority) {
      const priorityMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'info'
      }
      return priorityMap[priority]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        dateRange: [],
        eventType: undefined,
        priority: undefined
      },
      eventTypeOptions: [
        { label: '硬件故障', value: 'hardware' },
        { label: '软件故障', value: 'software' },
        { label: '网络故障', value: 'network' }
      ],
      priorityOptions: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ],
      mockData: {
        eventTypes: ['硬件故障', '软件故障', '网络故障'],
        priorities: ['高', '中', '低'], 
        handlers: ['张三', '李四', '王五', '赵六'],
        statuses: ['处理中', '已完成', '已关闭']
      },
      chartsInitialized: false
    }
  },
  created() {
    // 移除直接调用 getList
  },
  mounted() {
    // 在 mounted 中初始化
    this.$nextTick(() => {
      this.chartsInitialized = true
      this.getList()
    })
  },
  methods: {
    async getList() {
      try {
        this.listLoading = true
        
        // 生成模拟数据
        const mockList = []
        const count = 100
        
        for (let i = 0; i < count; i++) {
          mockList.push({
            eventId: i + 1,
            eventType: this.mockData.eventTypes[Math.floor(Math.random() * this.mockData.eventTypes.length)],
            priority: this.mockData.priorities[Math.floor(Math.random() * this.mockData.priorities.length)],
            handler: this.mockData.handlers[Math.floor(Math.random() * this.mockData.handlers.length)],
            handleTime: Number((Math.random() * 47 + 1).toFixed(1)),
            status: this.mockData.statuses[Math.floor(Math.random() * this.mockData.statuses.length)],
            createdAt: this.generateRandomDate(),
            finishedAt: Math.random() > 0.3 ? this.generateRandomDate() : null
          })
        }

        // 过滤数据
        let filteredList = [...mockList]
        if (this.listQuery.eventType) {
          filteredList = filteredList.filter(item => item.eventType === this.listQuery.eventType)
        }
        if (this.listQuery.priority) {
          filteredList = filteredList.filter(item => item.priority === this.listQuery.priority)
        }
        if (this.listQuery.dateRange && this.listQuery.dateRange.length === 2) {
          const startDate = new Date(this.listQuery.dateRange[0])
          const endDate = new Date(this.listQuery.dateRange[1])
          filteredList = filteredList.filter(item => {
            const itemDate = new Date(item.createdAt)
            return itemDate >= startDate && itemDate <= endDate
          })
        }

        // 分页
        const start = (this.listQuery.page - 1) * this.listQuery.limit
        const end = start + this.listQuery.limit
        this.list = filteredList.slice(start, end)
        this.total = filteredList.length

        // 只有在图表初始化完成后才更新图表
        if (this.chartsInitialized) {
          // 生成图表数据
          const timelineData = {
            type: 'timeline',
            title: '各优先级平均处理时长',
            xAxis: this.mockData.priorities,
            series: this.mockData.priorities.map(priority => {
              const items = filteredList.filter(item => item.priority === priority)
              return Number((items.reduce((sum, item) => sum + item.handleTime, 0) / (items.length || 1)).toFixed(1))
            })
          }

          const typeData = {
            type: 'pie',
            title: '事件类型分布',
            series: this.mockData.eventTypes.map(type => ({
              name: type,
              value: filteredList.filter(item => item.eventType === type).length
            }))
          }

          const handlerData = {
            type: 'bar',
            title: '处理人事件统计',
            xAxis: this.mockData.handlers,
            series: this.mockData.handlers.map(handler => 
              filteredList.filter(item => item.handler === handler).length
            )
          }

          // 使用 $nextTick 确保 DOM 更新后再更新图表
          this.$nextTick(() => {
            const charts = {
              timelineChart: timelineData,
              typeChart: typeData,
              handlerChart: handlerData
            }

            Object.keys(charts).forEach(key => {
              if (this.$refs[key] && this.$refs[key].updateChart) {
                this.$refs[key].updateChart(charts[key])
              }
            })
          })
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        this.listLoading = false
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['事件编号', '事件类型', '优先级', '处理人', '处理时长', '处理状态', '创建时间', '完成时间']
        const filterVal = ['eventId', 'eventType', 'priority', 'handler', 'handleTime', 'status', 'createdAt', 'finishedAt']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '事件统计'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => v[j]))
    },
    generateRandomDate() {
      const start = new Date(2024, 0, 1) // 2024年1月1日
      const end = new Date()
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      return randomDate.toISOString().slice(0, 19).replace('T', ' ')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
    display: inline-block;
  }
}
.chart-wrapper {
  height: 300px;
}
</style> 