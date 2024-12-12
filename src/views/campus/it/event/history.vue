<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="filter-container" shadow="hover">
      <el-form :inline="true" :model="listQuery" size="medium">
        <el-form-item label="时间范围" class="filter-item">
          <el-date-picker
            v-model="listQuery.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            class="filter-date-picker"
          />
        </el-form-item>
        <el-form-item label="事件类型" class="filter-item">
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
        <el-form-item label="事件状态" class="filter-item">
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
        <el-form-item class="filter-item">
          <el-button 
            type="primary" 
            icon="el-icon-search"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button 
            icon="el-icon-refresh"
            @click="handleReset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-container" shadow="hover">
      <div slot="header" class="clearfix">
        <span class="card-title">事件历史记录</span>
        <el-button
          class="export-button"
          type="text"
          icon="el-icon-download"
          @click="handleExport"
        >
          导出
        </el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        class="custom-table"
      >
        <el-table-column
          prop="eventId"
          label="事件编号"
          width="120"
          align="center"
        />
        <el-table-column
          prop="eventName"
          label="事件名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="eventType"
          label="事件类型"
          width="120"
          align="center"
        />
        <el-table-column
          prop="priority"
          label="优先级"
          width="100"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag 
              :type="getPriorityType(row.priority)"
              size="medium"
              effect="plain"
            >
              {{ row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag 
              :type="getStatusType(row.status)"
              size="medium"
              effect="light"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
        />
        <el-table-column
          prop="handleTime"
          label="处理时长"
          width="120"
          align="center"
        />
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template slot-scope="{row}">
            <el-button 
              type="text" 
              size="medium"
              class="operation-button"
              @click="handleDetail(row)"
            >
              查看详情
            </el-button>
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

export default {
  name: 'EventHistory',
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        dateRange: [],
        type: '',
        status: ''
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
        { value: 'closed', label: '���关闭' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getEventHistory(this.listQuery)
        this.list = data.items
        this.total = data.total
      } catch (error) {
        this.$message.error('获取事件历史记录失败，请稍后重试')
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
        status: ''
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
    handleExport() {
      this.$message.success('导出成功')
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
    background-color: #fff;
    border-radius: 4px;

    .filter-item {
      margin-bottom: 0;
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
    }

    .filter-date-picker {
      width: 360px;
    }

    .filter-select {
      width: 180px;
    }
  }

  .table-container {
    background-color: #fff;
    border-radius: 4px;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #1f2d3d;
    }

    .export-button {
      float: right;
      padding: 3px 0;
      font-size: 14px;
      color: #409EFF;

      &:hover {
        color: #66b1ff;
      }
    }

    .custom-table {
      margin: 16px 0;
      
      ::v-deep .el-table__header th {
        background-color: #f5f7fa;
        color: #1f2d3d;
        font-weight: 500;
      }

      ::v-deep .el-table__row {
        td {
          padding: 12px 0;
        }
      }
    }

    .operation-button {
      color: #409EFF;
      font-weight: normal;

      &:hover {
        color: #66b1ff;
      }
    }
  }

  .pagination-container {
    padding: 16px 0;
    text-align: right;
  }
}

// 自定义 Tag 样式
::v-deep .el-tag {
  border-radius: 2px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}
</style> 