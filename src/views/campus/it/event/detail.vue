<template>
  <div class="app-container">
    <div class="k-page-header">
      <div class="left">
        <div class="title">事件详情</div>
        <div class="event-id">{{ detail.id }}</div>
      </div>
      <div class="right">
        <el-button @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" @click="handleProcess" v-if="canProcess">处理事件</el-button>
      </div>
    </div>

    <el-row :gutter="24">
      <!-- 左侧基本信息 -->
      <el-col :span="16">
        <el-card class="k-card" shadow="never">
          <div slot="header" class="card-header">
            <span>基本信息</span>
            <el-tag :type="detail.status | statusFilter" class="status-tag">
              {{ detail.status | statusNameFilter }}
            </el-tag>
          </div>
          
          <el-descriptions :column="2" border>
            <el-descriptions-item label="事件标题">{{ detail.title }}</el-descriptions-item>
            <el-descriptions-item label="事件类型">
              <el-tag :type="detail.type | typeFilter">
                {{ detail.type | typeNameFilter }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="优先级">
              <el-tag :type="detail.priority | priorityFilter">
                {{ detail.priority | priorityNameFilter }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="影响范围">
              <el-tag :type="detail.impact | impactFilter">
                {{ detail.impact | impactNameFilter }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="报告人">{{ detail.reporter }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
          </el-descriptions>

          <div class="description-section">
            <div class="section-title">事件描述</div>
            <div class="description-content">{{ detail.description }}</div>
          </div>

          <div class="attachments-section" v-if="detail.attachments && detail.attachments.length > 0">
            <div class="section-title">相关附件</div>
            <div class="attachment-list">
              <div
                v-for="(file, index) in detail.attachments"
                :key="index"
                class="attachment-item"
              >
                <i class="el-icon-document" />
                <el-link type="primary" @click="handleDownload(file)">{{ file.name }}</el-link>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 处理记录 -->
        <el-card class="k-card" shadow="never">
          <div slot="header">处理记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(record, index) in detail.records"
              :key="index"
              :type="record.status | timelineTypeFilter"
              :timestamp="record.createTime"
              placement="top"
            >
              <div class="timeline-title">
                <span>{{ record.handler }}</span>
                <el-tag size="small" :type="record.status | statusFilter">
                  {{ record.status | statusNameFilter }}
                </el-tag>
              </div>
              <div class="timeline-content">{{ record.comment }}</div>
              <div class="timeline-attachments" v-if="record.attachments && record.attachments.length > 0">
                <div
                  v-for="(file, fileIndex) in record.attachments"
                  :key="fileIndex"
                  class="attachment-item"
                >
                  <i class="el-icon-document" />
                  <el-link type="primary" @click="handleDownload(file)">{{ file.name }}</el-link>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧关联信息 -->
      <el-col :span="8">
        <!-- 关联工单 -->
        <el-card class="k-card" shadow="never">
          <div slot="header" class="card-header">
            <span>关联工单</span>
            <el-button type="text" @click="handleCreateWorkOrder" v-if="canCreateWorkOrder">
              创建工单
            </el-button>
          </div>
          
          <div v-if="detail.workOrders && detail.workOrders.length > 0">
            <div
              v-for="order in detail.workOrders"
              :key="order.id"
              class="work-order-item"
            >
              <div class="order-header">
                <el-link type="primary" @click="handleViewWorkOrder(order)">{{ order.id }}</el-link>
                <el-tag size="small" :type="order.status | workOrderStatusFilter">
                  {{ order.status | workOrderStatusNameFilter }}
                </el-tag>
              </div>
              <div class="order-content">{{ order.title }}</div>
              <div class="order-footer">
                <span>处理人：{{ order.handler }}</span>
                <span>{{ order.createTime }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-block">
            <i class="el-icon-document" />
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
  name: 'EventDetail',
  filters: {
    // ... 复用之前的过滤器
    timelineTypeFilter(status) {
      const typeMap = {
        processing: 'warning',
        validating: 'success',
        completed: 'success'
      }
      return typeMap[status] || 'info'
    },
    workOrderStatusFilter(status) {
      const statusMap = {
        pending: 'info',
        processing: 'warning',
        completed: 'success'
      }
      return statusMap[status]
    },
    workOrderStatusNameFilter(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      detail: {},
      processDialogVisible: false,
      submitLoading: false,
      processForm: {
        status: '',
        comment: '',
        fileList: []
      },
      processRules: {
        status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
        comment: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
      },
      processStatusOptions: [
        { label: '处理中', value: 'processing', type: 'warning' },
        { label: '待验证', value: 'validating', type: 'success' },
        { label: '已完成', value: 'completed', type: '' }
      ]
    }
  },
  computed: {
    canProcess() {
      return ['pending', 'processing'].includes(this.detail.status)
    },
    canCreateWorkOrder() {
      return !this.detail.workOrders?.length
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      try {
        const { data } = await request({
          url: `/dev-api/it/events/${this.$route.params.id}`,
          method: 'get'
        })
        this.detail = data
      } catch (error) {
        console.error('获取事件详情失败:', error)
      }
    },
    handleProcess() {
      this.processForm = {
        status: '',
        comment: '',
        fileList: []
      }
      this.processDialogVisible = true
    },
    async submitProcess() {
      this.$refs.processForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            await request({
              url: `/dev-api/it/events/${this.detail.id}/process`,
              method: 'post',
              data: this.processForm
            })

            this.processDialogVisible = false
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success',
              duration: 2000
            })
            this.getDetail()
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
    handleCreateWorkOrder() {
      this.$router.push({
        name: 'WorkOrderCreate',
        query: { eventId: this.detail.id }
      })
    },
    handleViewWorkOrder(order) {
      this.$router.push({
        name: 'WorkOrderDetail',
        params: { id: order.id }
      })
    },
    handleDownload(file) {
      window.open(file.url)
    },
    // ... 复用之前的上传相关方法
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

    .event-id {
      font-size: 14px;
      color: $text-secondary;
    }
  }

  .right {
    .el-button + .el-button {
      margin-left: 12px;
    }
  }
}

.k-card {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status-tag {
      margin-left: 12px;
    }
  }

  .description-section,
  .attachments-section {
    margin-top: 24px;

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: $heading-color;
      margin-bottom: 16px;
    }
  }

  .description-content {
    color: $text-regular;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .attachment-list {
    .attachment-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      i {
        margin-right: 8px;
        color: $text-secondary;
      }
    }
  }

  .timeline-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .timeline-content {
    color: $text-regular;
    line-height: 1.6;
    margin-bottom: 8px;
  }

  .timeline-attachments {
    .attachment-item {
      display: flex;
      align-items: center;
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      i {
        margin-right: 8px;
        color: $text-secondary;
      }
    }
  }

  .work-order-item {
    padding: 16px;
    border-bottom: 1px solid $border-color-light;

    &:last-child {
      border-bottom: none;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .order-content {
      color: $text-regular;
      margin-bottom: 8px;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      color: $text-secondary;
      font-size: 12px;
    }
  }

  .empty-block {
    padding: 32px 0;
    text-align: center;
    color: $text-secondary;

    i {
      font-size: 24px;
      margin-bottom: 8px;
    }

    span {
      display: block;
    }
  }
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
</style> 