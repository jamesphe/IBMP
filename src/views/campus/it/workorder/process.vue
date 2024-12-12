<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">工单处理</span>
      </div>

      <!-- 搜索栏 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.search"
          placeholder="工单号/标题"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.type"
          placeholder="工单类型"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in typeOptions"
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
          style="width: 130px"
        >
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <el-tag :type="item.tagType" size="small">{{ item.label }}</el-tag>
          </el-option>
        </el-select>
        <el-select
          v-model="listQuery.status"
          placeholder="工单状态"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="filter-item date-range"
          value-format="yyyy-MM-dd"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-button
          class="filter-item"
          icon="el-icon-refresh"
          @click="resetFilter"
        >
          重置
        </el-button>
      </div>

      <!-- 工单列表 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="工单号" prop="id" align="center" width="120" />
        <el-table-column label="工单标题" prop="title" align="center" min-width="150">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleDetail(row)">{{ row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="工单类型" align="center" width="120">
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
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人" prop="handler" align="center" width="120" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
        <el-table-column label="期望完成时间" prop="expectedTime" align="center" width="180" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="{row}">
            <el-button 
              type="primary" 
              size="mini" 
              icon="el-icon-edit"
              :disabled="row.status === 'closed'"
              @click="handleProcess(row)"
            >
              处理
            </el-button>
            <el-button 
              type="success" 
              size="mini" 
              icon="el-icon-check"
              :disabled="!['resolved', 'processing'].includes(row.status)"
              @click="handleClose(row)"
            >
              关闭
            </el-button>
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

      <!-- 工单处理对话框 -->
      <el-dialog 
        :title="'处理工单：' + currentWorkOrder.id" 
        :visible.sync="dialogVisible"
        width="55%"
        class="process-dialog"
      >
        <div class="process-form-container">
          <!-- 工单基本信息 -->
          <div class="form-section">
            <div class="section-header">
              <i class="el-icon-info" />
              <span>工单信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="info-item">
                  <span class="label">工单标题：</span>
                  <span class="value">{{ currentWorkOrder.title }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="info-item">
                  <span class="label">当前状态：</span>
                  <el-tag :type="currentWorkOrder.status | statusFilter">
                    {{ currentWorkOrder.status | statusNameFilter }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 处理表单 -->
          <div class="form-section">
            <div class="section-header">
              <i class="el-icon-edit" />
              <span>处理信息</span>
            </div>
            <el-form
              ref="processForm"
              :model="processForm"
              :rules="processRules"
              label-width="100px"
              class="process-form"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="处理状态" prop="status" required>
                    <el-select 
                      v-model="processForm.status" 
                      placeholder="请选择处理状态"
                      class="full-width"
                    >
                      <el-option
                        v-for="item in processStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                        <el-tag :type="item.value | statusFilter" size="small">
                          {{ item.label }}
                        </el-tag>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="处理结果" prop="result" required>
                    <el-select 
                      v-model="processForm.result" 
                      placeholder="请选择处理结果"
                      class="full-width"
                    >
                      <el-option label="已解决" value="resolved">
                        <i class="el-icon-success success-icon" />
                        已解决
                      </el-option>
                      <el-option label="未解决" value="unresolved">
                        <i class="el-icon-error error-icon" />
                        未解决
                      </el-option>
                      <el-option label="需要协助" value="needHelp">
                        <i class="el-icon-help info-icon" />
                        需要协助
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="处理说明" prop="comment" required>
                <el-input
                  v-model="processForm.comment"
                  type="textarea"
                  :rows="4"
                  placeholder="请详细描述处理过程和结果"
                  class="process-textarea"
                />
              </el-form-item>

              <el-form-item label="附件">
                <el-upload
                  action="#"
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :file-list="fileList"
                  multiple
                  class="upload-container"
                >
                  <el-button size="small" type="primary">
                    <i class="el-icon-upload2" /> 选择文件
                  </el-button>
                  <div slot="tip" class="el-upload__tip">
                    支持jpg、png、doc、pdf等格式文件，单个文件不超过10MB
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitProcess">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 工单详情对话框 -->
      <el-dialog 
        title="工单详情" 
        :visible.sync="detailDialogVisible"
        width="65%"
        class="detail-dialog"
      >
        <!-- 顶部操作区 -->
        <div class="detail-header">
          <div class="left">
            <el-tag size="medium" :type="currentWorkOrder.status | statusFilter">
              {{ currentWorkOrder.status | statusNameFilter }}
            </el-tag>
            <span class="workorder-id">{{ currentWorkOrder.id }}</span>
          </div>
          <div class="right">
            <el-button 
              type="primary" 
              size="small" 
              icon="el-icon-edit"
              :disabled="currentWorkOrder.status === 'closed'"
              @click="handleProcess(currentWorkOrder)"
            >
              处理工单
            </el-button>
            <el-button 
              type="success" 
              size="small" 
              icon="el-icon-check"
              :disabled="!['resolved', 'processing'].includes(currentWorkOrder.status)"
              @click="handleClose(currentWorkOrder)"
            >
              关闭工单
            </el-button>
          </div>
        </div>

        <!-- 基本信息区 -->
        <div class="detail-section">
          <div class="section-header">
            <i class="el-icon-document" />
            <span>基本信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <span class="label">工单标题：</span>
                <span class="value">{{ currentWorkOrder.title }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">工单类型：</span>
                <el-tag size="small" :type="currentWorkOrder.type | typeFilter">
                  {{ currentWorkOrder.type | typeNameFilter }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">优先级：</span>
                <el-tag size="small" :type="currentWorkOrder.priority | priorityFilter">
                  {{ currentWorkOrder.priority | priorityNameFilter }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <span class="label">处理人：</span>
                <span class="value">{{ currentWorkOrder.handler }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ currentWorkOrder.createTime }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <span class="label">期望完成时间：</span>
                <span class="value">{{ currentWorkOrder.expectedTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 工单描述区 -->
        <div class="detail-section">
          <div class="section-header">
            <i class="el-icon-document-copy" />
            <span>工单描述</span>
          </div>
          <div class="description-content">
            {{ currentWorkOrder.description }}
          </div>
        </div>

        <!-- 处理记录区 -->
        <div class="detail-section" v-if="currentWorkOrder.processHistory">
          <div class="section-header">
            <i class="el-icon-time" />
            <span>处理记录</span>
          </div>
          <el-timeline class="process-timeline">
            <el-timeline-item
              v-for="(history, index) in currentWorkOrder.processHistory"
              :key="index"
              :type="history.type"
              :timestamp="history.time"
              :color="getTimelineItemColor(history.type)"
            >
              <div class="timeline-content">
                <div class="timeline-title">
                  <span class="operator">{{ history.operator }}</span>
                  <span class="action">{{ history.action }}</span>
                </div>
                <div class="timeline-comment">{{ history.comment }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'WorkOrderProcess',
  components: { Pagination },
  filters: {
    typeFilter(type) {
      const typeMap = {
        hardware: 'warning',
        software: 'success',
        network: 'danger',
        service: 'info',
        other: ''
      }
      return typeMap[type]
    },
    typeNameFilter(type) {
      const typeMap = {
        hardware: '硬件故障',
        software: '软件故障',
        network: '网络故障',
        service: '服务请求',
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
        resolved: 'success',
        closed: ''
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已解决',
        closed: '已关闭'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
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
        { value: 'hardware', label: '硬件故障' },
        { value: 'software', label: '软件故障' },
        { value: 'network', label: '网���故障' },
        { value: 'service', label: '服务请求' },
        { value: 'maintenance', label: '日常维护' },
        { value: 'other', label: '其他' }
      ],
      priorityOptions: [
        { value: 'high', label: '高', tagType: 'danger' },
        { value: 'medium', label: '中', tagType: 'warning' },
        { value: 'low', label: '低', tagType: 'info' }
      ],
      statusOptions: [
        { value: 'pending', label: '待处理' },
        { value: 'processing', label: '处理中' },
        { value: 'resolved', label: '已解决' },
        { value: 'closed', label: '已关闭' }
      ],
      processStatusOptions: [
        { value: 'processing', label: '处理中' },
        { value: 'resolved', label: '已解决' },
        { value: 'pending', label: '待处理' }
      ],
      dialogVisible: false,
      detailDialogVisible: false,
      currentWorkOrder: {},
      processForm: {
        status: '',
        comment: '',
        result: ''
      },
      processRules: {
        status: [
          { required: true, message: '请选择处理状态', trigger: 'change' }
        ],
        comment: [
          { required: true, message: '请输入处理说明', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '请选择处理结果', trigger: 'change' }
        ]
      },
      fileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 模拟数据
      setTimeout(() => {
        this.list = [
          {
            id: 'WO2024001',
            title: '系统无法访问',
            type: 'network',
            priority: 'high',
            status: 'pending',
            handler: '张三',
            createTime: '2024-01-10 10:30:00',
            expectedTime: '2024-01-11 10:30:00',
            description: '财务系统无法正常访问，影响部门正常工作',
            processHistory: [
              {
                time: '2024-01-10 10:30:00',
                operator: '李四',
                action: '创建工单',
                comment: '创建工单',
                type: 'primary'
              }
            ]
          },
          {
            id: 'WO2024002',
            title: '打印机故障',
            type: 'hardware',
            priority: 'medium',
            status: 'processing',
            handler: '李四',
            createTime: '2024-01-10 11:30:00',
            expectedTime: '2024-01-11 11:30:00',
            description: '打印机无法正常打印',
            processHistory: [
              {
                time: '2024-01-10 11:30:00',
                operator: '王五',
                action: '创建工单',
                comment: '创建工单',
                type: 'primary'
              },
              {
                time: '2024-01-10 13:30:00',
                operator: '李四',
                action: '开始处理',
                comment: '正在检查打印机硬件问题',
                type: 'warning'
              }
            ]
          }
        ]
        this.total = 2
        this.listLoading = false
      }, 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter() {
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
    handleProcess(row) {
      this.currentWorkOrder = row
      this.processForm = {
        status: '',
        comment: '',
        result: ''
      }
      this.fileList = []
      this.dialogVisible = true
    },
    handleDetail(row) {
      this.currentWorkOrder = row
      this.detailDialogVisible = true
    },
    handleClose(row) {
      this.$confirm('确认关闭该工单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '工单已关闭',
          type: 'success',
          duration: 2000
        })
        row.status = 'closed'
      })
    },
    submitProcess() {
      this.$refs.processForm.validate(valid => {
        if (valid) {
          const now = new Date().toLocaleString()
          this.currentWorkOrder.processHistory.push({
            time: now,
            operator: '当前用户',
            action: '处理工单',
            comment: this.processForm.comment,
            type: 'success'
          })
          this.currentWorkOrder.status = this.processForm.status
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '处理结果已提交',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList
    },
    getTimelineItemColor(type) {
      const colorMap = {
        primary: '#409EFF',
        success: '#67C23A',
        warning: '#E6A23C',
        danger: '#F56C6C',
        info: '#909399'
      }
      return colorMap[type] || '#409EFF'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .box-card {
    .card-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.filter-container {
  padding-bottom: 20px;
  
  .filter-item {
    margin-right: 10px;
    vertical-align: top;
  }

  .date-range {
    width: 340px;
  }
}

.process-history {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;

  .history-title {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 15px;
  }
}

.upload-container {
  .el-upload__tip {
    margin-top: 8px;
    color: #909399;
  }
}

::v-deep {
  .el-descriptions {
    padding: 20px;
    background-color: #fff;
  }

  .el-timeline {
    padding: 20px;
  }
}

.detail-dialog {
  ::v-deep .el-dialog__body {
    padding: 0 20px 20px;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 20px;

    .left {
      display: flex;
      align-items: center;
      
      .workorder-id {
        margin-left: 12px;
        font-size: 14px;
        color: #606266;
      }
    }

    .right {
      .el-button {
        margin-left: 12px;
      }
    }
  }

  .detail-section {
    margin-bottom: 24px;
    background: #fff;
    border-radius: 4px;

    .section-header {
      display: flex;
      align-items: center;
      padding: 16px 0;
      margin-bottom: 16px;
      border-bottom: 1px solid #EBEEF5;

      i {
        font-size: 16px;
        color: #409EFF;
        margin-right: 8px;
      }

      span {
        font-size: 15px;
        font-weight: 500;
        color: #303133;
      }
    }

    .info-item {
      margin-bottom: 16px;
      line-height: 20px;

      .label {
        color: #606266;
        margin-right: 8px;
      }

      .value {
        color: #303133;
      }
    }

    .description-content {
      padding: 16px;
      background: #F5F7FA;
      border-radius: 4px;
      color: #303133;
      line-height: 1.6;
    }
  }

  .process-timeline {
    padding: 16px;

    .timeline-content {
      .timeline-title {
        margin-bottom: 8px;

        .operator {
          font-weight: 500;
          color: #303133;
          margin-right: 8px;
        }

        .action {
          color: #606266;
        }
      }

      .timeline-comment {
        color: #606266;
        line-height: 1.6;
      }
    }
  }
}

.process-dialog {
  ::v-deep .el-dialog__body {
    padding: 0 20px;
  }

  .process-form-container {
    padding: 20px 0;
  }

  .form-section {
    margin-bottom: 24px;

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #EBEEF5;

      i {
        font-size: 16px;
        color: #409EFF;
        margin-right: 8px;
      }

      span {
        font-size: 15px;
        font-weight: 500;
        color: #303133;
      }
    }

    .info-item {
      margin-bottom: 16px;
      line-height: 32px;

      .label {
        color: #606266;
        margin-right: 8px;
      }

      .value {
        color: #303133;
        font-weight: 500;
      }
    }
  }

  .process-form {
    .full-width {
      width: 100%;
    }

    .process-textarea {
      font-family: inherit;
    }

    ::v-deep .el-form-item__label {
      font-weight: normal;
      color: #606266;
    }

    ::v-deep .el-form-item.is-required .el-form-item__label:before {
      color: #F56C6C;
    }
  }

  .upload-container {
    .el-upload__tip {
      margin-top: 8px;
      color: #909399;
      line-height: 1.4;
    }
  }

  .success-icon {
    color: #67C23A;
    margin-right: 4px;
  }

  .error-icon {
    color: #F56C6C;
    margin-right: 4px;
  }

  .info-icon {
    color: #909399;
    margin-right: 4px;
  }
}

.dialog-footer {
  padding: 16px 20px;
  text-align: right;
  background: #F5F7FA;
  border-top: 1px solid #E4E7ED;

  .el-button {
    padding: 9px 20px;
    font-size: 13px;
    
    & + .el-button {
      margin-left: 12px;
    }
  }
}
</style>
