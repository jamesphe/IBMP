<template>
  <div class="app-container">
    <div class="k-page-header">
      <div class="left">
        <div class="title">事件处理</div>
        <div class="description">处理和跟踪IT事件的解决过程</div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="k-search-card" shadow="never">
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
            >
              <i :class="item.icon" :style="{ color: item.color }" />
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="listQuery.priority" placeholder="请选择" clearable class="filter-item">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :type="item.type" size="small">{{ item.label }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="listQuery.status" placeholder="请选择" clearable class="filter-item">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :type="item.type" size="small">{{ item.label }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="k-table-card" shadow="never">
      <div class="table-toolbar">
        <div class="batch-actions" v-if="selectedRows.length > 0">
          <span class="selected-count">已选择 {{ selectedRows.length }} 项</span>
          <el-button type="text" @click="handleBatchProcess">批量处理</el-button>
        </div>
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
            <el-link type="primary" @click="handleView(row)">{{ row.title }}</el-link>
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
            <el-button type="text" @click="handleProcess(row)">处理</el-button>
            <el-button type="text" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="k-pagination">
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
      :title="processTitle"
      :visible.sync="processDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      class="k-dialog"
    >
      <el-form ref="processForm" :model="processForm" :rules="processRules" label-width="100px">
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="processForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option
              v-for="item in processStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :type="item.type" size="small">{{ item.label }}</el-tag>
            </el-option>
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
        <el-form-item label="处理附件">
          <el-upload
            class="k-uploader"
            action="/dev-api/it/events/upload"
            :file-list="processForm.fileList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            multiple
            :limit="3"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持格式：.jpg、.png、.pdf，单个文件不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitProcess">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'EventProcess',
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
      list: [],
      total: 0,
      listLoading: true,
      selectedRows: [], // 添加选中行数组
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
        { label: '硬件故障', value: 'hardware', icon: 'el-icon-cpu', color: '#E6A23C' },
        { label: '软件故障', value: 'software', icon: 'el-icon-monitor', color: '#409EFF' },
        { label: '网络故障', value: 'network', icon: 'el-icon-connection', color: '#F56C6C' },
        { label: '其他', value: 'other', icon: 'el-icon-more', color: '#909399' }
      ],
      priorityOptions: [
        { label: '高', value: 'high', type: 'danger' },
        { label: '中', value: 'medium', type: 'warning' },
        { label: '低', value: 'low', type: 'info' }
      ],
      statusOptions: [
        { label: '待处理', value: 'pending', type: 'info' },
        { label: '处理中', value: 'processing', type: 'warning' },
        { label: '待验证', value: 'validating', type: 'success' },
        { label: '已完成', value: 'completed', type: '' }
      ],
      processStatusOptions: [
        { label: '处理中', value: 'processing', type: 'warning' },
        { label: '待验证', value: 'validating', type: 'success' },
        { label: '已完成', value: 'completed', type: '' }
      ],
      processDialogVisible: false,
      processTitle: '事件处理',
      submitLoading: false,
      processForm: {
        status: '',
        comment: '',
        fileList: []
      },
      processRules: {
        status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
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
    handleProcess(row) {
      this.processForm = {
        status: '',
        comment: '',
        fileList: []
      }
      this.processTitle = `处理事件 - ${row.id}`
      this.processDialogVisible = true
    },
    handleBatchProcess() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要处理的事件')
        return
      }
      this.processForm = {
        status: '',
        comment: '',
        fileList: []
      }
      this.processTitle = `批量处理事件 - 共${this.selectedRows.length}项`
      this.processDialogVisible = true
    },
    handleView(row) {
      this.$router.push(`/campus/it/event/detail/${row.id}`)
    },
    async submitProcess() {
      this.$refs.processForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            // 调用处理API
            await request({
              url: '/dev-api/it/events/process',
              method: 'post',
              data: {
                ids: this.selectedRows.map(row => row.id),
                ...this.processForm
              }
            })

            this.processDialogVisible = false
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } catch (error) {
            this.$notify({
              title: '错误',
              message: '处理失败',
              type: 'error',
              duration: 2000
            })
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    beforeUpload(file) {
      const isValidType = [
        'image/jpeg',
        'image/png',
        'application/pdf'
      ].includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isValidType) {
        this.$message.error('文件格式不正确!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB!')
        return false
      }
      return true
    },
    handlePreview(file) {
      window.open(file.url)
    },
    handleRemove(file, fileList) {
      this.processForm.fileList = fileList
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.k-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .left {
    .title {
      font-size: 20px;
      font-weight: 500;
      color: $heading-color;
      margin-bottom: 8px;
    }

    .description {
      font-size: 14px;
      color: $text-secondary;
    }
  }
}

.k-search-card {
  margin-bottom: 24px;

  .filter-item {
    width: 200px;
  }
}

.k-table-card {
  .table-toolbar {
    margin-bottom: 16px;

    .batch-actions {
      .selected-count {
        margin-right: 16px;
        color: $text-secondary;
      }

      .el-button {
        margin-right: 12px;
      }
    }
  }
}

.k-pagination {
  margin-top: 16px;
  text-align: right;
}

.k-dialog {
  :deep(.el-dialog__body) {
    padding: 24px 32px;
  }

  .k-uploader {
    :deep(.el-upload-list) {
      margin-top: 8px;
    }

    :deep(.el-upload__tip) {
      margin-top: 8px;
      color: $text-secondary;
    }
  }
}

.el-select-dropdown__item {
  i {
    margin-right: 8px;
  }
}
</style> 