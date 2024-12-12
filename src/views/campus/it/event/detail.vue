<template>
  <div class="app-container">
    <!-- 页面头部 -->
    <el-card class="header-card" shadow="never">
      <div class="header-wrapper">
        <div class="header-left">
          <div class="event-id">{{ mockData.eventId }}</div>
          <el-tag
            :type="getStatusType(mockData.status)"
            effect="light"
            size="medium"
          >{{ mockData.status }}</el-tag>
        </div>
        <div class="header-right">
          <el-button size="small" @click="$router.go(-1)">返回</el-button>
          <el-button 
            v-if="mockData.status !== '已完成'"
            type="primary" 
            size="small"
            @click="handleProcess"
          >处理事件</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16" style="margin-top: 16px;">
      <!-- 左侧内容区 -->
      <el-col :span="16">
        <!-- 基本信息 -->
        <el-card class="detail-card" shadow="never">
          <div slot="header">
            <span class="card-title">基本信息</span>
          </div>
          <el-descriptions :column="2" border size="medium">
            <el-descriptions-item label="事件标题">{{ mockData.title }}</el-descriptions-item>
            <el-descriptions-item label="事件类型">
              <el-tag size="small">{{ mockData.type }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="优先级">
              <el-tag 
                :type="getPriorityType(mockData.priority)"
                size="small"
              >{{ mockData.priority }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="影响范围">
              <el-tag size="small" type="warning">{{ mockData.impact }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="报告人">{{ mockData.reporter }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ mockData.createTime }}</el-descriptions-item>
          </el-descriptions>

          <div class="description-block">
            <div class="block-title">事件描述</div>
            <div class="block-content">{{ mockData.description }}</div>
          </div>

          <div class="attachment-block">
            <div class="block-title">相关附件</div>
            <div class="attachment-list">
              <div v-for="file in mockData.attachments" :key="file.id" class="attachment-item">
                <i class="el-icon-document" />
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
                <el-button 
                  type="text"
                  size="small"
                  @click="handleDownload(file)"
                >下载</el-button>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 处理记录 -->
        <el-card class="detail-card" shadow="never">
          <div slot="header">
            <span class="card-title">处理记录</span>
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="record in mockData.records"
              :key="record.id"
              :timestamp="record.time"
              :type="getTimelineType(record.status)"
            >
              <div class="timeline-header">
                <span class="handler">{{ record.handler }}</span>
                <el-tag 
                  size="small"
                  :type="getStatusType(record.status)"
                >{{ record.status }}</el-tag>
              </div>
              <div class="timeline-content">{{ record.content }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="8">
        <!-- 关联工单 -->
        <el-card class="detail-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">关联工单</span>
            <el-button 
              v-if="!mockData.workOrders.length"
              type="text"
              size="small"
              style="float: right;"
              @click="handleCreateWorkOrder"
            >创建工单</el-button>
          </div>
          <div v-if="mockData.workOrders.length" class="work-order-list">
            <div 
              v-for="order in mockData.workOrders" 
              :key="order.id"
              class="work-order-item"
            >
              <div class="order-header">
                <span class="order-id">{{ order.id }}</span>
                <el-tag 
                  size="small"
                  :type="getStatusType(order.status)"
                >{{ order.status }}</el-tag>
              </div>
              <div class="order-content">{{ order.title }}</div>
              <div class="order-footer">
                <span>处理人：{{ order.handler }}</span>
                <span>{{ order.createTime }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-block">
            <i class="el-icon-tickets"></i>
            <span>暂无关联工单</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 处理对话框 -->
    <el-dialog
      title="处理事件"
      :visible.sync="processDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      custom-class="k-dialog"
    >
      <el-form 
        ref="processForm" 
        :model="processForm" 
        :rules="processRules" 
        label-width="100px"
        size="medium"
      >
        <el-form-item label="处理状态" prop="status">
          <el-select 
            v-model="processForm.status" 
            placeholder="请选择状态" 
            style="width: 100%"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag 
                :type="getStatusType(item.label)"
                size="small"
                effect="plain"
              >{{ item.label }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="处理说明" prop="content">
          <el-input
            v-model="processForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
            resize="none"
          />
        </el-form-item>

        <el-form-item label="处理附件">
          <el-upload
            class="k-upload"
            action="#"
            :auto-upload="false"
            :file-list="processForm.fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            multiple
          >
            <el-button size="small" type="primary" plain>
              <i class="el-icon-upload2"></i>
              选择文件
            </el-button>
            <div slot="tip" class="upload-tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="通知相关人">
          <el-select
            v-model="processForm.notifyUsers"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入邮箱地址"
            style="width: 100%"
          >
            <el-option
              v-for="item in notifyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-tip">选择或输入需要通知的人员邮箱地址，可多选</div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="processDialogVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          :loading="submitLoading"
          @click="submitProcess"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EventDetail',
  data() {
    return {
      // 模拟数据
      mockData: {
        eventId: 'EV20240301001',
        title: '服务器CPU使用率过高',
        type: '硬件故障',
        priority: '高',
        status: '处理中',
        impact: '部门级',
        reporter: '张三',
        createTime: '2024-03-01 10:30:00',
        description: '生产环境主服务器CPU使用率持续超过90%，影响系统响应速度。初步排查为数据库查询导致CPU占用过高。',
        attachments: [
          { id: 1, name: 'CPU使用率监控截图.png', size: '1.2MB' },
          { id: 2, name: '问题分析报告.pdf', size: '526KB' }
        ],
        records: [
          {
            id: 1,
            handler: '李四',
            status: '处理中',
            time: '2024-03-01 11:00:00',
            content: '已收到报警，正在分析CPU使用率过高原因'
          },
          {
            id: 2,
            handler: '李四',
            status: '处理中',
            time: '2024-03-01 11:30:00',
            content: '定位到问题原因：数据库慢查询导致CPU使用率升高，正在优化SQL语句'
          }
        ],
        workOrders: [
          {
            id: 'WO20240301001',
            title: 'CPU使用率优化工单',
            status: '处理中',
            handler: '李四',
            createTime: '2024-03-01 11:05:00'
          }
        ]
      },
      // 处理对话框
      processDialogVisible: false,
      processForm: {
        status: '',
        content: '',
        fileList: [],
        notifyUsers: []
      },
      processRules: {
        status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
        content: [
          { required: true, message: '请输入处理说明', trigger: 'blur' },
          { min: 10, message: '处理说明不能少于10个字符', trigger: 'blur' }
        ]
      },
      statusOptions: [
        { value: 'processing', label: '处理中' },
        { value: 'validating', label: '待验证' },
        { value: 'completed', label: '已完成' }
      ],
      notifyOptions: [
        { value: 'zhangsan@example.com', label: '张三' },
        { value: 'lisi@example.com', label: '李四' },
        { value: 'wangwu@example.com', label: '王五' }
      ],
      submitLoading: false
    }
  },
  methods: {
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
    getTimelineType(status) {
      const types = {
        处理中: 'warning',
        已完成: 'success'
      }
      return types[status] || 'info'
    },
    handleProcess() {
      this.processDialogVisible = true
    },
    handleCreateWorkOrder() {
      this.$message.success('跳转到工单创建页面')
    },
    handleDownload(file) {
      this.$message.success(`下载文件：${file.name}`)
    },
    handleFileChange(file, fileList) {
      this.processForm.fileList = fileList
    },
    handleFileRemove(file, fileList) {
      this.processForm.fileList = fileList
    },
    submitProcess() {
      this.$refs.processForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // 模拟提交
          setTimeout(() => {
            this.submitLoading = false
            this.$notify({
              title: '成功',
              message: '事件处理成功',
              type: 'success',
              duration: 2000
            })
            this.processDialogVisible = false
          }, 1000)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-card {
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
      
      .event-id {
        font-size: 16px;
        font-weight: 500;
        margin-right: 16px;
      }
    }
  }
}

.detail-card {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2d3d;
  }

  .description-block,
  .attachment-block {
    margin-top: 24px;

    .block-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .block-content {
      line-height: 1.6;
      color: #606266;
    }
  }

  .attachment-list {
    .attachment-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      i {
        color: #909399;
        margin-right: 8px;
      }

      .file-name {
        flex: 1;
        margin-right: 16px;
      }

      .file-size {
        color: #909399;
        margin-right: 16px;
      }
    }
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .handler {
      font-weight: 500;
    }
  }

  .timeline-content {
    color: #606266;
    line-height: 1.6;
  }

  .work-order-list {
    .work-order-item {
      padding: 16px;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .order-id {
          color: #409EFF;
          font-weight: 500;
        }
      }

      .order-content {
        color: #606266;
        margin-bottom: 8px;
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        color: #909399;
        font-size: 12px;
      }
    }
  }

  .empty-block {
    padding: 32px 0;
    text-align: center;
    color: #909399;

    i {
      font-size: 32px;
      margin-bottom: 8px;
    }

    span {
      display: block;
    }
  }
}

::v-deep {
  .el-card__header {
    padding: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .el-card__body {
    padding: 16px;
  }

  .el-descriptions {
    margin-bottom: 0;
  }

  .el-timeline-item__node {
    width: 12px;
    height: 12px;
  }

  .el-timeline-item__tail {
    left: 5px;
  }
}

.k-dialog {
  ::v-deep {
    .el-dialog__header {
      padding: 20px 24px;
      border-bottom: 1px solid #ebeef5;
      margin: 0;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #1f2d3d;
      }
    }

    .el-dialog__body {
      padding: 24px;
    }

    .el-dialog__footer {
      padding: 16px 24px;
      border-top: 1px solid #ebeef5;
    }

    .el-form-item__label {
      font-weight: normal;
      color: #606266;
    }

    .el-textarea__inner {
      padding: 8px 12px;
      line-height: 1.6;
    }
  }

  .k-upload {
    ::v-deep {
      .el-upload-list {
        margin-top: 8px;
      }
    }
  }

  .upload-tip,
  .form-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    line-height: 1.4;
  }
}
</style> 