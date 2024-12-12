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
          </div>
          <div class="chart-wrapper">
            <chart-component ref="timelineChart" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>事件类型分布</span>
          </div>
          <div class="chart-wrapper">
            <chart-component ref="typeChart" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>处理人统计</span>
          </div>
          <div class="chart-wrapper">
            <chart-component ref="handlerChart" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px;"
    >
      <el-table-column label="事件编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.eventId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.eventType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.handler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时长(小时)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.handleTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
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
  </div>
</template>

<script>
import { getEventStatistics } from '@/api/it/event'
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
        eventType: undefined
      },
      eventTypeOptions: [
        { label: '硬件故障', value: 'hardware' },
        { label: '软件故障', value: 'software' },
        { label: '网络故障', value: 'network' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getEventStatistics(this.listQuery)
      this.list = data.items
      this.total = data.total
      
      // 更新图表数据
      this.$refs.timelineChart.updateChart(data.timelineData)
      this.$refs.typeChart.updateChart(data.typeData)
      this.$refs.handlerChart.updateChart(data.handlerData)
      
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      // 实现导出功能
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['事件编号', '事件类型', '处理人', '处理时长', '处理状态']
        const filterVal = ['eventId', 'eventType', 'handler', 'handleTime', 'status']
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