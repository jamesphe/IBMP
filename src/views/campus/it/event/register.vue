<template>
  <div class="app-container">
    <div class="page-header">
      <div class="title">事件登记</div>
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">
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
          <el-select
            v-model="listQuery.type"
            placeholder="请选择"
            clearable
            class="filter-item"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select
            v-model="listQuery.priority"
            placeholder="请选择"
            clearable
            class="filter-item"
          >
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="listQuery.status"
            placeholder="请选择"
            clearable
            class="filter-item"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="listQuery.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="filter-item"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
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
        <el-table-column label="事件编号" prop="id" align="center" width="120" />
        <el-table-column label="事件标题" prop="title" align="center" min-width="150" />
        <el-table-column label="事件类型" align="center" width="120">
          <template slot-scope="{row}">
            <el-tag :type="row.type | typeFilter">{{ row.type | typeNameFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优先级" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.priority | priorityFilter">
              {{ row.priority | priorityNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="影响范围" prop="impact" align="center" width="120">
          <template slot-scope="{row}">
            <el-tag :type="row.impact | impactFilter">
              {{ row.impact | impactNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="报告人" prop="reporter" align="center" width="120" />
        <el-table-column label="处理人" prop="handler" align="center" width="120" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="{row}">
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-check"
                @click="handleProcess(row)"
              >
                处理
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-button-group>
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      width="680px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-width="100px"
        class="event-form"
      >
        <el-form-item label="事件标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入事件标题" />
        </el-form-item>
        <el-form-item label="事件类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择事件类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="temp.priority" placeholder="请选择优先级">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="影响范围" prop="impact">
          <el-select v-model="temp.impact" placeholder="请选择影响范围">
            <el-option label="个人" value="personal" />
            <el-option label="部门" value="department" />
            <el-option label="全校" value="school" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述事件内容"
          />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/pdf文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="事件处理"
      :visible.sync="processDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="processForm"
        :model="processForm"
        :rules="processRules"
        label-width="100px"
      >
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="processForm.status" placeholder="请选择处理状态">
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
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
        <el-form-item label="处理人" prop="handler">
          <el-input v-model="processForm.handler" placeholder="请输入处理人" />
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
  name: 'EventRegister',
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
      statusOptions: [
        { label: '待处理', value: 'pending' },
        { label: '处理中', value: 'processing' },
        { label: '待验证', value: 'validating' },
        { label: '已完成', value: 'completed' }
      ],
      temp: {
        id: undefined,
        title: '',
        type: '',
        priority: '',
        impact: '',
        status: 'pending',
        description: '',
        reporter: '',
        handler: '',
        createTime: new Date()
      },
      processForm: {
        status: '',
        comment: '',
        handler: ''
      },
      processRules: {
        status: [
          { required: true, message: '请选择处理状态', trigger: 'change' }
        ],
        comment: [
          { required: true, message: '请输入处理说明', trigger: 'blur' }
        ],
        handler: [
          { required: true, message: '请输入处理人', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      processDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑事件',
        create: '新增事件'
      },
      rules: {
        title: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
        impact: [{ required: true, message: '请选择影响范围', trigger: 'change' }],
        description: [{ required: true, message: '请输入事件描述', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
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
    handleCreate() {
      this.temp = {
        id: undefined,
        title: '',
        type: '',
        priority: '',
        impact: '',
        status: 'pending',
        description: '',
        reporter: '',
        handler: '',
        createTime: new Date()
      }
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          try {
            await request({
              url: '/it/events',
              method: 'post',
              data: this.temp
            })
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } catch (error) {
            console.error('创建事件失败:', error)
          }
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 这里应该调用后端API更新数据
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
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
    submitProcess() {
      this.$refs.processForm.validate((valid) => {
        if (valid) {
          // 这里应该调用后端API提交处理结果
          this.processDialogVisible = false
          this.$notify({
            title: '成功',
            message: '处理记录已提交',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该事件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里应该调用后端API删除数据
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的事件')
        return
      }
      this.$confirm(`确认删除选中的 ${this.selectedRows.length} 个事件?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里调用后端API批量删除数据
        this.$notify({
          title: '成功',
          message: '批量删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
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
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$heading-color: #1f1f1f;
$text-color: #595959;
$text-color-secondary: #8c8c8c;
$disabled-color: #bfbfbf;
$border-color-base: #d9d9d9;
$background-color-light: #fafafa;
$box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15);

.app-container {
  padding: 24px;
  background-color: #f0f2f5;
}

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
  
  :deep(.el-card__body) {
    padding: 24px 24px 0;
  }

  .el-form-item {
    margin-bottom: 24px;
  }
}

.table-card {
  :deep(.el-card__body) {
    padding: 0;
  }

  .table-operations {
    padding: 16px 24px;
    background: $background-color-light;
    border-bottom: 1px solid $border-color-base;

    .selected-count {
      color: $text-color-secondary;
      margin-right: 16px;
    }
  }

  .el-table {
    :deep(th) {
      background-color: #fafafa;
      color: $heading-color;
      font-weight: 500;
    }

    :deep(td) {
      color: $text-color;
    }
  }
}

.pagination-container {
  padding: 16px 24px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $border-color-base;
}

.event-form {
  padding: 8px 40px 24px;
  
  :deep(.el-form-item__label) {
    color: $heading-color;
    font-weight: 500;
  }

  :deep(.el-input__inner) {
    border-radius: 2px;
  }

  :deep(.el-textarea__inner) {
    border-radius: 2px;
  }
}

:deep(.el-dialog__header) {
  padding: 16px 24px;
  border-bottom: 1px solid $border-color-base;
  
  .el-dialog__title {
    font-size: 16px;
    font-weight: 500;
    color: $heading-color;
  }
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid $border-color-base;
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
