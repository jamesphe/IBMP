<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery" size="small">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="listQuery.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            class="filter-date-picker"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select
            v-model="listQuery.type"
            placeholder="请选择事件类型"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="item in eventTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事件状态">
          <el-select
            v-model="listQuery.status"
            placeholder="请选择事件状态"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="item in eventStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select
            v-model="listQuery.priority"
            placeholder="请选择优先级"
            clearable
            class="filter-select"
          >
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查询</el-button>
          <el-button
            icon="el-icon-refresh"
            @click="handleReset"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-container" shadow="never">
      <div slot="header" class="clearfix">
        <span class="card-title">事件历史记录</span>
        <div class="table-operations">
          <el-button
            type="text"
            icon="el-icon-download"
            @click="handleExport"
          >导出Excel</el-button>
          <el-button
            type="text"
            icon="el-icon-printer"
            @click="handlePrint"
          >打印</el-button>
        </div>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :max-height="tableHeight"
        @sort-change="handleSortChange"
      >
        <el-table-column
          prop="eventId"
          label="事件编号"
          width="140"
          align="center"
          sortable="custom"
          class-name="event-id-column"
          show-overflow-tooltip
        />
        <el-table-column
          prop="eventName"
          label="事件名称"
          min-width="150"
          show-overflow-tooltip
          class-name="event-name-column"
        />
        <el-table-column
          prop="eventType"
          label="事件类型"
          width="100"
          align="center"
        />
        <el-table-column
          prop="priority"
          label="优先级"
          width="80"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag
              :type="getPriorityType(row.priority)"
              size="small"
              effect="plain"
              class="priority-tag"
            >{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
              effect="light"
              class="status-tag"
            >{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
          sortable="custom"
          class-name="time-column"
        />
        <el-table-column
          prop="handleTime"
          label="处理时长"
          width="100"
          align="center"
          sortable="custom"
          class-name="time-column"
        >
          <template slot-scope="{row}">
            {{ formatHandleTime(row.handleTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              @click="handleDetail(row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.limit"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getEventHistory } from '@/api/it/event'
import { parseTime } from '@/utils'

export default {
  name: 'EventHistory',
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      tableHeight: 500,
      // 模拟数据
      mockData: [
        {
          eventId: 'EV20240301001',
          eventName: '服务器CPU使用率过高',
          eventType: '硬件故障',
          priority: '高',
          status: '已完成',
          createTime: '2024-03-01 10:30:00',
          handleTime: 120 // 单位:分钟
        },
        {
          eventId: 'EV20240301002',
          eventName: 'Oracle数据库连接异常',
          eventType: '软件问题',
          priority: '高',
          status: '处理中',
          createTime: '2024-03-01 11:15:00',
          handleTime: 45
        },
        {
          eventId: 'EV20240301003',
          eventName: '网络访问缓慢',
          eventType: '网络故障',
          priority: '中',
          status: '待处理',
          createTime: '2024-03-01 14:20:00',
          handleTime: 0
        },
        {
          eventId: 'EV20240301004',
          eventName: '可疑IP访问告警',
          eventType: '安全事件',
          priority: '高',
          status: '已完成',
          createTime: '2024-03-01 16:45:00',
          handleTime: 30
        },
        {
          eventId: 'EV20240301005',
          eventName: '打印机无法连接',
          eventType: '硬件故障',
          priority: '低',
          status: '完成',
          createTime: '2024-03-01 09:10:00',
          handleTime: 15
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        dateRange: [],
        type: '',
        status: '',
        priority: '',
        sort: '+id'
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
      eventTypes: [
        { value: 'hardware', label: '硬件故障' },
        { value: 'software', label: '软件问题' },
        { value: 'network', label: '网络故障' },
        { value: 'security', label: '安全事件' }
      ],
      eventStatus: [
        { value: 'pending', label: '待处理' },
        { value: 'processing', label: '处理中' },
        { value: 'completed', label: '已完成' },
        { value: 'closed', label: '已关闭' }
      ],
      priorityOptions: [
        { value: 'high', label: '高' },
        { value: 'medium', label: '中' },
        { value: 'low', label: '低' }
      ]
    }
  },
  created() {
    this.getList()
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    calculateTableHeight() {
      this.tableHeight = window.innerHeight - 300
    },
    async getList() {
      this.listLoading = true
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 过滤数据
        let filteredData = [...this.mockData]
        
        // 根据查询条件过滤
        if (this.listQuery.type) {
          filteredData = filteredData.filter(item => 
            item.eventType === this.eventTypes.find(t => t.value === this.listQuery.type)?.label
          )
        }
        if (this.listQuery.status) {
          filteredData = filteredData.filter(item => 
            item.status === this.eventStatus.find(s => s.value === this.listQuery.status)?.label
          )
        }
        if (this.listQuery.priority) {
          filteredData = filteredData.filter(item => 
            item.priority === this.priorityOptions.find(p => p.value === this.listQuery.priority)?.label
          )
        }
        if (this.listQuery.dateRange && this.listQuery.dateRange.length === 2) {
          const startDate = new Date(this.listQuery.dateRange[0])
          const endDate = new Date(this.listQuery.dateRange[1])
          filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.createTime.split(' ')[0])
            return itemDate >= startDate && itemDate <= endDate
          })
        }
        
        // 处理排序
        if (this.listQuery.sort) {
          const order = this.listQuery.sort.charAt(0)
          const prop = this.listQuery.sort.substring(1)
          filteredData.sort((a, b) => {
            if (order === '+') {
              return a[prop] > b[prop] ? 1 : -1
            } else {
              return a[prop] < b[prop] ? 1 : -1
            }
          })
        }
        
        // 处理分页
        const start = (this.listQuery.page - 1) * this.listQuery.limit
        const end = start + this.listQuery.limit
        
        this.list = filteredData.slice(start, end)
        this.total = filteredData.length
      } catch (error) {
        this.$message.error('获取事件历史记录失败')
        console.error('获取事件历史记录失败:', error)
      } finally {
        this.listLoading = false
      }
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
        dateRange: [],
        type: '',
        status: '',
        priority: '',
        sort: '+id'
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSortChange({ prop, order }) {
      this.listQuery.sort = (order === 'ascending' ? '+' : '-') + prop
      this.getList()
    },
    handleExport() {
      this.$message.success('导出成功')
    },
    handlePrint() {
      window.print()
    },
    handleDetail(row) {
      this.$router.push(`/campus/it/event/detail/${row.eventId}`)
    },
    getPriorityType(priority) {
      const types = {
        高: 'danger',
        中: 'warning',
        低: 'info'
      }
      return types[priority] || 'info'
    },
    getStatusType(status) {
      const types = {
        待处理: 'info',
        处理中: 'warning',
        已完成: 'success',
        已关闭: ''
      }
      return types[status] || 'info'
    },
    formatHandleTime(time) {
      if (!time) return '-'
      const hours = Math.floor(time / 60)
      const minutes = time % 60
      return hours ? `${hours}小时${minutes}分钟` : `${minutes}分钟`
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 16px;
  background-color: #f5f7fa;

  .filter-container {
    margin-bottom: 16px;

    .filter-date-picker {
      width: 360px;
    }

    .filter-select {
      width: 180px;
    }

    ::v-deep .el-form-item {
      margin-bottom: 0;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .table-container {
    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #1f2d3d;
    }

    .table-operations {
      float: right;

      .el-button {
        padding: 3px 0;
        margin-left: 16px;
        font-size: 14px;

        &:hover {
          color: #66b1ff;
        }
      }
    }

    ::v-deep {
      .el-table {
        // 表头样式
        th {
          background-color: #f5f7fa;
          color: #1f2d3d;
          font-weight: 500;
          height: 44px;
          padding: 8px 0;
        }

        // 单元格样式
        td {
          padding: 8px 0;
          height: 44px;
        }

        // 事件编号列样式
        .event-id-column {
          .cell {
            font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
            color: #409EFF;
            font-size: 13px;
            white-space: nowrap;
          }
        }

        // 事件名称列样式
        .event-name-column {
          .cell {
            font-weight: 500;
            color: #1f2d3d;
          }
        }

        // 时间列样式
        .time-column {
          .cell {
            color: #606266;
            font-size: 13px;
          }
        }

        // 标签样式
        .priority-tag,
        .status-tag {
          min-width: 60px;
          border-radius: 2px;
          font-size: 12px;
        }

        // 鼠标悬停效果
        tbody tr:hover {
          td {
            background-color: #f5f7fa;
          }
        }

        // 表格边框
        &.el-table--border {
          border-radius: 4px;
          overflow: hidden;
        }
      }
    }
  }

  .pagination-container {
    padding: 16px 0;
    text-align: right;

    ::v-deep {
      .el-pagination {
        padding: 0;
        font-weight: normal;

        .btn-prev,
        .btn-next {
          padding: 0 10px;
          min-width: 32px;
        }

        .el-pager li {
          min-width: 32px;
          margin: 0 4px;
          border-radius: 2px;
          
          &.active {
            background-color: #409EFF;
            color: #fff;
          }
        }
      }
    }
  }
}

@media print {
  .filter-container,
  .table-operations,
  .pagination-container {
    display: none;
  }
}
</style> 