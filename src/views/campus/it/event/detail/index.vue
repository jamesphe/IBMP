<template>
  <div class="app-container">
    <!-- 页头区域 -->
    <div class="page-header">
      <div class="header-left">
        <el-page-header @back="goBack" content="事件详情" />
      </div>
      <div class="header-right">
        <el-button-group class="action-group">
          <el-button 
            type="warning" 
            icon="el-icon-top"
            v-if="checkPermission(['admin', 'handler']) && eventDetail.status !== '已完成'"
            @click="handleEscalate"
          >
            升级事件
          </el-button>
          <el-button 
            type="info" 
            icon="el-icon-share"
            v-if="checkPermission(['admin', 'handler']) && eventDetail.status !== '已完成'"
            @click="handleTransfer"
          >
            转交处理
          </el-button>
          <el-button 
            type="success" 
            icon="el-icon-user"
            v-if="checkPermission(['admin', 'handler']) && eventDetail.status !== '已完成'"
            @click="handleCollaborate"
          >
            添加协作
          </el-button>
        </el-button-group>
        <el-button 
          type="primary" 
          icon="el-icon-edit"
          v-if="checkPermission(['admin', 'handler'])"
          @click="handleEdit"
        >
          编辑事件
        </el-button>
      </div>
    </div>

    <!-- 状态进度区域 -->
    <el-card class="detail-card status-card">
      <div slot="header" class="card-header">
        <span class="card-title">处理进度</span>
      </div>
      <el-steps :active="getStatusStep()" finish-status="success" align-center>
        <el-step title="已提交" :description="getStepTime('提交事件')" />
        <el-step title="处理中" :description="getStepTime('开始处理')" />
        <el-step title="已完成" :description="getStepTime('处理完成')" />
      </el-steps>
    </el-card>

    <!-- 基本信息区域 -->
    <el-card class="detail-card">
      <div slot="header" class="card-header">
        <span class="card-title">基本信息</span>
        <div class="info-tags">
          <el-tag 
            v-if="eventDetail.isEscalated"
            type="danger" 
            effect="dark" 
            size="small"
          >已升级</el-tag>
          <el-tag 
            v-if="eventDetail.collaborators && eventDetail.collaborators.length"
            type="success" 
            effect="dark" 
            size="small"
          >协作处理</el-tag>
        </div>
      </div>
      
      <div class="info-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <span class="info-label">事件编号：</span>
              <span class="event-id">{{ eventDetail.id }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="info-label">当前状态：</span>
              <el-tag :type="eventDetail.status | statusFilter">{{ eventDetail.status }}</el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="info-label">处理人：</span>
              <span>{{ eventDetail.handler || '待分配' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <div class="info-item">
              <span class="info-label">事件标题：</span>
              <span>{{ eventDetail.title }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <div class="info-item">
              <span class="info-label">事件描述：</span>
              <div class="description-content">{{ eventDetail.description }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="eventDetail.collaborators && eventDetail.collaborators.length" style="margin-top: 20px">
          <el-col :span="24">
            <div class="info-item">
              <span class="info-label">协作人员：</span>
              <div class="collaborators">
                <el-tag 
                  v-for="collaborator in eventDetail.collaborators" 
                  :key="collaborator.id"
                  size="small"
                  style="margin-right: 8px"
                >
                  {{ collaborator.name }} ({{ collaborator.role }})
                </el-tag>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 提交信息区域 -->
    <el-card class="detail-card">
      <div slot="header" class="card-header">
        <span class="card-title">提交信息</span>
      </div>
      
      <div class="info-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <span class="info-label">提交人：</span>
              <span>{{ eventDetail.creator }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="info-label">提交人身份：</span>
              <span>{{ eventDetail.creatorRole }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <span class="info-label">提交时间：</span>
              <span>{{ eventDetail.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <div class="info-item">
              <span class="info-label">所属部门：</span>
              <span>{{ eventDetail.creatorDept.join(' / ') }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 处理记录区域 -->
    <el-card class="detail-card">
      <div slot="header" class="card-header">
        <span class="card-title">处理记录</span>
        <div class="header-actions" v-if="checkPermission(['admin', 'handler'])">
          <el-button type="primary" plain size="small" icon="el-icon-plus" @click="handleAddRecord">
            ���加记录
          </el-button>
        </div>
      </div>

      <div class="timeline-wrapper">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in eventDetail.records"
            :key="index"
            :type="record.type"
            :timestamp="record.time | parseTime('{y}-{m}-{d} {h}:{i}')"
            :color="getTimelineColor(record.action)"
          >
            <el-card class="record-card" shadow="hover">
              <div class="record-header">
                <span class="operator">{{ record.operator }}</span>
                <el-tag size="small" :type="record.type" effect="plain">{{ record.action }}</el-tag>
              </div>
              <div class="record-content">{{ record.content }}</div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <!-- 添加处理记录对话框 -->
    <el-dialog
      title="添加处理记录"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      custom-class="record-dialog"
    >
      <el-form ref="recordForm" :model="recordForm" :rules="recordRules" label-width="100px">
        <el-form-item label="处理动作" prop="action" required>
          <el-select v-model="recordForm.action" placeholder="请选择处理动作" style="width: 100%">
            <el-option
              v-for="item in actionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :type="getRecordType(item.value)" size="small" effect="plain" style="margin-right: 8px">
                {{ item.label }}
              </el-tag>
              <span class="action-desc">{{ item.desc }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明" prop="content" required>
          <el-input
            type="textarea"
            v-model="recordForm.content"
            :rows="4"
            placeholder="请输入处理说明"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRecord">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 事件升级对话框 -->
    <el-dialog
      title="事件升级"
      :visible.sync="escalateDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="escalateForm" :model="escalateForm" :rules="escalateRules" label-width="100px">
        <el-form-item label="升级原因" prop="reason" required>
          <el-input
            type="textarea"
            v-model="escalateForm.reason"
            :rows="4"
            placeholder="请说明事件升级的原因"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="升级处理人" prop="handler" required>
          <el-select v-model="escalateForm.handler" placeholder="请选择升级后的处理人" style="width: 100%">
            <el-option
              v-for="item in seniorHandlers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="escalateDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="submitEscalate">确认升级</el-button>
      </div>
    </el-dialog>

    <!-- 转交处理对话框 -->
    <el-dialog
      title="转交处理"
      :visible.sync="transferDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="transferForm" :model="transferForm" :rules="transferRules" label-width="100px">
        <el-form-item label="转交给" prop="handler" required>
          <el-select v-model="transferForm.handler" placeholder="请选择转交处理人" style="width: 100%">
            <el-option
              v-for="item in handlerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转交说明" prop="reason" required>
          <el-input
            type="textarea"
            v-model="transferForm.reason"
            :rows="4"
            placeholder="请说明转交原因"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transferDialogVisible = false">取 消</el-button>
        <el-button type="info" @click="submitTransfer">确认转交</el-button>
      </div>
    </el-dialog>

    <!-- 添加协作对话框 -->
    <el-dialog
      title="添加协作人员"
      :visible.sync="collaborateDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="collaborateForm" :model="collaborateForm" :rules="collaborateRules" label-width="100px">
        <el-form-item label="协作人员" prop="collaborators" required>
          <el-select
            v-model="collaborateForm.collaborators"
            multiple
            placeholder="请选择协作人员"
            style="width: 100%"
          >
            <el-option
              v-for="item in handlerOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="协作说明" prop="reason" required>
          <el-input
            type="textarea"
            v-model="collaborateForm.reason"
            :rows="4"
            placeholder="请说明需要协作的内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="collaborateDialogVisible = false">取 消</el-button>
        <el-button type="success" @click="submitCollaborate">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkPermission } from '@/utils/permission'

// 模拟事件详情数据
const mockEventDetail = {
  id: 'EV2024030001',
  title: '教务系统无法登录',
  description: '信息系教师反映无法登录教务系统,影正常教学',
  priority: '紧急',
  status: '处理中',
  handler: '张工',
  createTime: '2024-03-01 09:30:00',
  creator: '王明',
  creatorRole: '教师',
  creatorDept: ['信息工程学院', '计算机系'],
  records: [
    {
      time: '2024-03-01 09:30:00',
      operator: '王明',
      action: '提交事件',
      content: '教务系统无法登录，请尽快处理',
      type: 'info'
    },
    {
      time: '2024-03-01 09:35:00',
      operator: '系统',
      action: '分派处理',
      content: '事件已分给张工处理',
      type: 'warning'
    },
    {
      time: '2024-03-01 10:00:00',
      operator: '张工',
      action: '开始处理',
      content: '正在检查系统日志，排查问题原因',
      type: 'primary'
    }
  ],
  isEscalated: false,
  collaborators: []
}

// 处理动作选项
const actionOptions = [
  { value: '开始处理', label: '开始处理', desc: '接手处理事件' },
  { value: '处理中', label: '处理中', desc: '记录处理进展' },
  { value: '转交处理', label: '转交处理', desc: '转交给其他人处理' },
  { value: '处理完成', label: '处理完成', desc: '事件处理完成' }
]

// 高级处理人选项
const seniorHandlers = [
  { label: '张主管', value: '张主管' },
  { label: '王经理', value: '王经理' },
  { label: '李总监', value: '李总监' }
]

// 处理人选项
const handlerOptions = [
  { label: '张工', value: '张工' },
  { label: '王工', value: '王工' },
  { label: '李工', value: '李工' },
  { label: '赵工', value: '赵工' },
  { label: '孙工', value: '孙工' }
]

export default {
  name: 'EventDetail',
  created() {
    const id = this.$route.params.id
    // TODO: 根据 ID 获取事件详情
    // 目前使用模拟数据，实际应该根据 ID 获取
    this.eventDetail = mockEventDetail
  },
  data() {
    return {
      eventDetail: mockEventDetail,
      dialogVisible: false,
      escalateDialogVisible: false,
      transferDialogVisible: false,
      collaborateDialogVisible: false,
      seniorHandlers,
      handlerOptions,
      recordForm: {
        action: '',
        content: ''
      },
      recordRules: {
        action: [{ required: true, message: '请选择处理动作', trigger: 'change' }],
        content: [{ required: true, message: '请输入处理说明', trigger: 'blur' }]
      },
      actionOptions,
      escalateForm: {
        reason: '',
        handler: ''
      },
      escalateRules: {
        reason: [{ required: true, message: '请输入升级原因', trigger: 'blur' }],
        handler: [{ required: true, message: '请选择升级处理人', trigger: 'change' }]
      },
      transferForm: {
        handler: '',
        reason: ''
      },
      transferRules: {
        handler: [{ required: true, message: '请选择转交处理人', trigger: 'change' }],
        reason: [{ required: true, message: '请输入转交说明', trigger: 'blur' }]
      },
      collaborateForm: {
        collaborators: [],
        reason: ''
      },
      collaborateRules: {
        collaborators: [{ required: true, message: '请选择协作人员', trigger: 'change' }],
        reason: [{ required: true, message: '请输入协作说明', trigger: 'blur' }]
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '待处理': 'info',
        '处理中': 'warning',
        '已完成': 'success',
        '已关闭': 'info'
      }
      return statusMap[status]
    },
    priorityFilter(priority) {
      const priorityMap = {
        '紧急': 'danger',
        '高': 'warning',
        '中': '',
        '低': 'info'
      }
      return priorityMap[priority]
    }
  },
  methods: {
    checkPermission,
    handleEdit() {
      this.$router.push(`/campus/it/event/edit/${this.eventDetail.id}`)
    },
    handleAddRecord() {
      this.dialogVisible = true
      this.recordForm = {
        action: '',
        content: ''
      }
    },
    submitRecord() {
      this.$refs.recordForm.validate(valid => {
        if (valid) {
          const record = {
            time: new Date().toISOString(),
            operator: '张工', // 当前登录用户
            action: this.recordForm.action,
            content: this.recordForm.content,
            type: this.getRecordType(this.recordForm.action)
          }
          this.eventDetail.records.push(record)
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '处理记录已添加'
          })
        }
      })
    },
    getRecordType(action) {
      const typeMap = {
        '开始处理': 'primary',
        '处理中': 'warning',
        '转交处理': 'info',
        '处理完成': 'success'
      }
      return typeMap[action] || 'info'
    },
    goBack() {
      this.$router.push('/campus/it/event/search')
    },
    getStatusStep() {
      const statusMap = {
        '待处理': 0,
        '处理中': 1,
        '已完成': 2
      }
      return statusMap[this.eventDetail.status] || 0
    },
    getStepTime(action) {
      const record = this.eventDetail.records.find(r => r.action === action)
      return record ? this.$options.filters.parseTime(record.time, '{m}-{d} {h}:{i}') : ''
    },
    getTimelineColor(action) {
      const colorMap = {
        '提交事件': '#909399',
        '开始处理': '#409EFF',
        '处理中': '#E6A23C',
        '转交处理': '#909399',
        '处理完成': '#67C23A'
      }
      return colorMap[action] || '#909399'
    },
    handleEscalate() {
      this.escalateDialogVisible = true
      this.escalateForm = {
        reason: '',
        handler: ''
      }
    },
    submitEscalate() {
      this.$refs.escalateForm.validate(valid => {
        if (valid) {
          // 添加升级记录
          const record = {
            time: new Date().toISOString(),
            operator: '张工',
            action: '事件升级',
            content: `升级原因：${this.escalateForm.reason}\n升级给：${this.escalateForm.handler}`,
            type: 'danger'
          }
          this.eventDetail.records.push(record)
          this.eventDetail.isEscalated = true
          this.eventDetail.handler = this.escalateForm.handler
          this.escalateDialogVisible = false
          this.$message({
            type: 'success',
            message: '事件已升级'
          })
        }
      })
    },
    handleTransfer() {
      this.transferDialogVisible = true
      this.transferForm = {
        handler: '',
        reason: ''
      }
    },
    submitTransfer() {
      this.$refs.transferForm.validate(valid => {
        if (valid) {
          // 添加转交记录
          const record = {
            time: new Date().toISOString(),
            operator: '张工',
            action: '转交处理',
            content: `转交给：${this.transferForm.handler}\n转交说明：${this.transferForm.reason}`,
            type: 'info'
          }
          this.eventDetail.records.push(record)
          this.eventDetail.handler = this.transferForm.handler
          this.transferDialogVisible = false
          this.$message({
            type: 'success',
            message: '事件已转交'
          })
        }
      })
    },
    handleCollaborate() {
      this.collaborateDialogVisible = true
      this.collaborateForm = {
        collaborators: [],
        reason: ''
      }
    },
    submitCollaborate() {
      this.$refs.collaborateForm.validate(valid => {
        if (valid) {
          // 添加协作记录
          const record = {
            time: new Date().toISOString(),
            operator: '张工',
            action: '添加协作',
            content: `协作人员：${this.collaborateForm.collaborators.join('、')}\n协作说明：${this.collaborateForm.reason}`,
            type: 'success'
          }
          this.eventDetail.records.push(record)
          this.eventDetail.collaborators = this.collaborateForm.collaborators.map(name => ({
            id: Date.now(),
            name,
            role: '协作处理'
          }))
          this.collaborateDialogVisible = false
          this.$message({
            type: 'success',
            message: '已添加协作人员'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);

  ::v-deep .el-page-header__title {
    font-size: 14px;
    color: #8c8c8c;
  }

  ::v-deep .el-page-header__content {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
}

.detail-card {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #EBEEF5;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      position: relative;
      padding-left: 12px;
    }
  }

  .info-content {
    padding: 24px;
    
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
       
      .info-label {
        width: 120px;
        color: rgba(0, 0, 0, 0.45);
        flex-shrink: 0;
        text-align: right;
        padding-right: 16px;
        font-size: 13px;
      }

      .info-value {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.65);
      }

      span {
        font-size: 13px;
      }

      .event-id {
        font-family: Monaco, monospace;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}

.description-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.timeline-wrapper {
  padding: 20px;

  .record-card {
    .record-header {
      margin-bottom: 8px;
      
      .operator {
        margin-right: 12px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
      }
    }
    
    .record-content {
      color: rgba(0, 0, 0, 0.65);
      line-height: 1.6;
      font-size: 14px;
    }
  }
}

.action-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}

::v-deep {
  .el-timeline-item__timestamp {
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
  }

  .el-step__title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    &.is-process {
      font-weight: 500;
    }
  }

  .el-step__description {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }

  .el-tag {
    &--success {
      background: #f6ffed;
      border-color: #b7eb8f;
      color: #52c41a;
    }
    &--warning {
      background: #fffbe6;
      border-color: #ffe58f;
      color: #faad14;
    }
    &--danger {
      background: #fff1f0;
      border-color: #ffa39e;
      color: #f5222d;
    }
    &--info {
      background: #f4f4f5;
      border-color: #e9e9eb;
      color: #909399;
    }
  }
}

.action-group {
  margin-right: 16px;
}

.info-tags {
  display: flex;
  gap: 8px;
}
</style> 