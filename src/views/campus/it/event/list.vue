<template>
  <div class="app-container">
    <div class="page-header">
      <div class="title">事件列表</div>
      <el-button type="primary" icon="el-icon-plus" @click="$router.push({ name: 'EventCreate' })">
        新增事件
      </el-button>
    </div>

    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="listQuery" size="medium">
        <el-form-item label="关键词">
          <el-input
            v-model="listQuery.search"
            placeholder="事件编号/标题"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="listQuery.type" placeholder="请选择" clearable class="filter-item">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="listQuery.priority" placeholder="请选择" clearable class="filter-item">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="���态">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable class="filter-item">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="待验证" value="validating" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="listQuery.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <div class="table-operations" v-if="selectedRows.length > 0">
        <span class="selected-count">已选择 {{ selectedRows.length }} 项</span>
        <el-button type="text" @click="handleBatchDelete">批量删除</el-button>
        <el-button type="text" @click="handleBatchProcess">批量处理</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="事件编号" width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件标题" min-width="200">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件类型" width="120" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.type | typeFilter">
              {{ row.type | typeNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.priority | priorityFilter">
              {{ row.priority | priorityNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="影响范围" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.impact | impactFilter">
              {{ row.impact | impactNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="报告人" width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.reporter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理人" width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.handler || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="text" @click="handleProcess(row)">
              处理
            </el-button>
            <el-button type="text" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 处理对话框 -->
    <el-dialog
      title="事件处理"
      :visible.sync="processDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="processForm" :model="processForm" :rules="processRules" label-width="80px">
        <el-form-item label="状态" prop="status">
          <el-select v-model="processForm.status" placeholder="���选择状态" style="width: 100%">
            <el-option label="处理中" value="processing" />
            <el-option label="待验证" value="validating" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明" prop="comment">
          <el-input
            v-model="processForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProcess">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'EventList',
  filters: {
    typeFilter(type) {
      const typeMap = {
        hardware: 'warning',
        software: 'success',
        network: 'danger',
        other: 'info'
      }
      return typeMap[type]
    },
    typeNameFilter(type) {
      const typeMap = {
        hardware: '硬件故障',
        software: '软件故障',
        network: '网络故障',
        other: '其他'
      }
      return typeMap[type]
    },
    priorityFilter(priority) {
      const priorityMap = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
      }
      return priorityMap[priority]
    },
    priorityNameFilter(priority) {
      const priorityMap = {
        high: '高',
        medium: '中',
        low: '低'
      }
      return priorityMap[priority]
    },
    statusFilter(status) {
      const statusMap = {
        pending: 'info',
        processing: 'warning',
        validating: 'success',
        completed: ''
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        validating: '待验证',
        completed: '已完成'
      }
      return statusMap[status]
    },
    impactFilter(impact) {
      const impactMap = {
        personal: 'info',
        department: 'warning',
        school: 'danger'
      }
      return impactMap[impact]
    },
    impactNameFilter(impact) {
      const impactMap = {
        personal: '个人',
        department: '部门',
        school: '全校'
      }
      return impactMap[impact]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      selectedRows: [],
      listQuery: {
        page: 1,
        limit: 10,
        search: '',
        type: '',
        priority: '',
        status: '',
        dateRange: []
      },
      typeOptions: [
        { label: '硬件故障', value: 'hardware' },
        { label: '软件故障', value: 'software' },
        { label: '网络故障', value: 'network' },
        { label: '其他', value: 'other' }
      ],
      priorityOptions: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ],
      processDialogVisible: false,
      processForm: {
        status: '',
        comment: '',
        handler: ''
      },
      processRules: {
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        comment: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await request({
          url: '/dev-api/it/events',
          method: 'get',
          params: this.listQuery
        })
        this.list = data.items
        this.total = data.total
      } catch (error) {
        console.error('获取事件列表失败:', error)
      } finally {
        this.listLoading = false
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery = {
        page: 1,
        limit: 10,
        search: '',
        type: '',
        priority: '',
        status: '',
        dateRange: []
      }
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleEdit(row) {
      this.$router.push({
        name: 'EventEdit',
        params: { id: row.id }
      })
    },
    handleProcess(row) {
      this.processForm = {
        status: '',
        comment: '',
        handler: ''
      }
      this.processDialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该事件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await request({
          url: `/dev-api/it/events/${row.id}`,
          method: 'delete'
        })
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      } catch (error) {
        console.error('删除事件失败:', error)
      }
    },
    async handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的事件')
        return
      }
      try {
        await this.$confirm(`确认删除选中的 ${this.selectedRows.length} 个事件?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await request({
          url: '/dev-api/it/events/batch',
          method: 'delete',
          data: {
            ids: this.selectedRows.map(row => row.id)
          }
        })
        this.$notify({
          title: '成功',
          message: '批量删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      } catch (error) {
        console.error('批量删除事件失败:', error)
      }
    },
    handleBatchProcess() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要处理的事件')
        return
      }
      this.processForm = {
        status: '',
        comment: '',
        handler: ''
      }
      this.processDialogVisible = true
    },
    async submitProcess() {
      this.$refs.processForm.validate(async valid => {
        if (valid) {
          try {
            // 调用处理API
            this.processDialogVisible = false
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } catch (error) {
            console.error('处理事件失败:', error)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .title {
    font-size: 20px;
    font-weight: 500;
    color: $heading-color;
  }
}

.search-card {
  margin-bottom: 24px;

  .filter-item {
    width: 200px;
  }
}

.table-card {
  .table-operations {
    margin-bottom: 16px;

    .selected-count {
      margin-right: 16px;
      color: $text-secondary;
    }

    .el-button {
      margin-right: 16px;
    }
  }
}

.pagination-container {
  padding: 16px;
  text-align: right;
}

.el-tag {
  border-radius: 2px;
  margin-right: 8px;

  &.el-tag--success {
    background: #f6ffed;
    border-color: #b7eb8f;
    color: #52c41a;
  }

  &.el-tag--warning {
    background: #fffbe6;
    border-color: #ffe58f;
    color: #faad14;
  }

  &.el-tag--danger {
    background: #fff1f0;
    border-color: #ffa39e;
    color: #f5222d;
  }
}
</style> 