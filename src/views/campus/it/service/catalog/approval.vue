<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="审批状态" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="待审批" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
      />
    </div>

    <!-- 审批列表 -->
    <el-table
      v-loading="listLoading"
      :data="approvalList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="申请编号" width="120" align="center" />
      <el-table-column prop="serviceName" label="服务名称" min-width="150" />
      <el-table-column prop="type" label="变更类型" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type === '新增' ? 'success' : 'warning'">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人" width="120" align="center" />
      <el-table-column prop="applyTime" label="申请时间" width="160" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button 
            v-if="row.status === '待审批'"
            type="text" 
            @click="handleApprove(row)"
          >
            审批
          </el-button>
          <el-button type="text" @click="handleDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 审批对话框 -->
    <el-dialog 
      title="服务条目审批" 
      :visible.sync="dialogVisible"
      width="720px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      custom-class="approval-dialog"
    >
      <div class="approval-content">
        <!-- 服务信息 -->
        <div class="info-section">
          <div class="section-title">服务信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="info-item">
                <span class="label">服务名称：</span>
                <span class="value">{{ currentRow ? currentRow.serviceName : '' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">变更类型：</span>
                <span class="value">
                  <el-tag :type="currentRow && currentRow.type === '新增' ? 'success' : 'warning'">
                    {{ currentRow ? currentRow.type : '' }}
                  </el-tag>
                </span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="info-item">
                <span class="label">申请人：</span>
                <span class="value">{{ currentRow ? currentRow.applicant : '' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <span class="label">申请时间：</span>
                <span class="value">{{ currentRow ? currentRow.applyTime : '' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 审批表单 -->
        <div class="form-section">
          <div class="section-title">审批信息</div>
          <el-form 
            ref="approvalForm" 
            :model="approvalForm" 
            :rules="approvalRules"
            label-width="100px"
            class="approval-form"
          >
            <el-form-item label="审批结果" prop="result" required>
              <el-radio-group v-model="approvalForm.result">
                <el-radio label="approved">
                  <el-tag type="success" size="small">通过</el-tag>
                </el-radio>
                <el-radio label="rejected">
                  <el-tag type="danger" size="small">拒绝</el-tag>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见" prop="comment" required>
              <el-input
                type="textarea"
                v-model="approvalForm.comment"
                :rows="4"
                placeholder="请输入审批意见"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApproval">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      title="服务条目详情"
      :visible.sync="detailDialogVisible"
      width="720px"
      :close-on-click-modal="false"
      custom-class="service-dialog"
    >
      <div class="service-detail">
        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">服务名称：</span>
                <span class="value">{{ detailForm.serviceName }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">变更类型：</span>
                <span class="value">
                  <el-tag :type="detailForm.type === '新增' ? 'success' : 'warning'">
                    {{ detailForm.type }}
                  </el-tag>
                </span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">服务级别：</span>
                <span class="value">
                  <el-tag :type="getServiceLevelType(detailForm.serviceLevel)">
                    {{ getServiceLevelLabel(detailForm.serviceLevel) }}
                  </el-tag>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">适用范围：</span>
                <span class="value">{{ detailForm.scope }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">申请人：</span>
                <span class="value">{{ detailForm.applicant }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">申请时间：</span>
                <span class="value">{{ detailForm.applyTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 服务描述 -->
        <div class="detail-section">
          <div class="section-title">服务描述</div>
          <div class="detail-item">
            <div class="description">{{ detailForm.description }}</div>
          </div>
        </div>
        
        <!-- 审批记录 -->
        <div class="detail-section">
          <div class="section-title">审批记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in detailForm.approvalHistory"
              :key="index"
              :type="getTimelineItemType(activity.status)"
              :timestamp="activity.time"
            >
              {{ activity.operator }} {{ activity.action }}
              <div class="timeline-content" v-if="activity.comment">
                备注：{{ activity.comment }}
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CatalogApproval',
  data() {
    return {
      listLoading: false,
      listQuery: {
        status: '',
        dateRange: []
      },
      approvalList: [
        {
          id: 'AP2024001',
          serviceName: '系统账号申请',
          type: '新增',
          applicant: '张三',
          applyTime: '2024-01-15 10:30:00',
          status: '待审批'
        },
        {
          id: 'AP2024002',
          serviceName: '网络故障报修',
          type: '修改',
          applicant: '李四',
          applyTime: '2024-01-15 14:20:00',
          status: '已通过'
        },
        {
          id: 'AP2024003',
          serviceName: '设备借用申请',
          type: '新增',
          applicant: '王五',
          applyTime: '2024-01-15 16:45:00',
          status: '已拒绝'
        }
      ],
      dialogVisible: false,
      approvalForm: {
        result: 'approved',
        comment: ''
      },
      currentRow: null,
      detailDialogVisible: false,
      detailForm: {
        serviceName: '',
        type: '',
        serviceLevel: '',
        description: '',
        scope: '',
        applicant: '',
        applyTime: '',
        approvalHistory: []
      },
      approvalRules: {
        result: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        comment: [
          { required: true, message: '请输入审批意见', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待审批': 'warning',
        '已通过': 'success',
        '已拒绝': 'danger'
      }
      return statusMap[status]
    },
    handleApprove(row) {
      this.currentRow = row
      this.dialogVisible = true
      this.approvalForm = {
        result: 'approved',
        comment: ''
      }
    },
    handleDetail(row) {
      // 模拟获取详情数据
      this.detailForm = {
        serviceName: row.serviceName,
        type: row.type,
        serviceLevel: 'level1',
        description: '这是一个示例服务描述，详细说明了服务的内容和流程。',
        scope: '全校师生',
        applicant: row.applicant,
        applyTime: row.applyTime,
        approvalHistory: [
          {
            operator: row.applicant,
            action: '提交了服务条目' + row.type + '申请',
            status: '待审批',
            time: row.applyTime,
            comment: ''
          }
        ]
      }
      // 如果已审批，添加审批记录
      if (row.status !== '待审批') {
        this.detailForm.approvalHistory.push({
          operator: '李四',
          action: row.status === '已通过' ? '审批通过，同意服务条目' + row.type : '审批拒绝，不同意服务条目' + row.type,
          status: row.status,
          time: '2024-01-15 15:30:00',
          comment: row.status === '已通过' ? '服务条目内容完整，可以发布' : '服务条目内容需要补充完善'
        })
      }
      this.detailDialogVisible = true
    },
    submitApproval() {
      this.$refs.approvalForm.validate((valid) => {
        if (valid) {
          // 模拟审批操作
          const index = this.approvalList.findIndex(item => item.id === this.currentRow.id)
          if (index > -1) {
            this.approvalList[index].status = this.approvalForm.result === 'approved' ? '已通过' : '已拒绝'
          }
          this.dialogVisible = false
          this.$message.success('审批成功')
        }
      })
    },
    getServiceLevelLabel(level) {
      const levelMap = {
        level1: '一级服务',
        level2: '二级服务',
        level3: '三级服务'
      }
      return levelMap[level] || level
    },
    getServiceLevelType(level) {
      const typeMap = {
        level1: 'danger',
        level2: 'warning',
        level3: 'info'
      }
      return typeMap[level] || ''
    },
    getTimelineItemType(status) {
      const typeMap = {
        '通过': 'success',
        '已通过': 'success',
        '驳回': 'danger',
        '已拒绝': 'danger',
        '待审批': 'primary'
      }
      return typeMap[status] || 'info'
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 20px;
  
  .filter-item {
    margin-right: 10px;
    width: 200px;
  }
}

.service-dialog {
  .service-detail {
    padding: 0 20px;
    
    .detail-section {
      margin-bottom: 24px;
      
      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: #1f2f3d;
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid #409EFF;
      }
      
      .detail-item {
        margin-bottom: 16px;
        
        .label {
          display: inline-block;
          width: 100px;
          color: #606266;
        }
        
        .value {
          color: #303133;
        }
        
        .description {
          color: #303133;
          line-height: 1.6;
          padding: 8px 12px;
          background-color: #f5f7fa;
          border-radius: 4px;
        }
      }
    }
    
    ::v-deep .el-timeline {
      padding-left: 16px;
      
      .el-timeline-item__content {
        color: #303133;
        
        .timeline-content {
          color: #606266;
          font-size: 13px;
          margin-top: 4px;
        }
      }
    }
  }
}

.approval-dialog {
  .approval-content {
    padding: 0 20px;
  }
  
  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2f3d;
    margin-bottom: 16px;
    padding-left: 8px;
    border-left: 3px solid #409EFF;
  }
  
  .info-section {
    margin-bottom: 24px;
    
    .info-item {
      margin-bottom: 16px;
      
      .label {
        display: inline-block;
        width: 80px;
        color: #606266;
      }
      
      .value {
        color: #303133;
      }
    }
  }
  
  .form-section {
    .approval-form {
      padding: 0;
      
      ::v-deep .el-form-item {
        margin-bottom: 22px;
        
        .el-form-item__label {
          font-weight: normal;
          color: #606266;
        }
        
        .el-radio {
          margin-right: 30px;
          
          .el-tag {
            margin-left: 4px;
          }
        }
        
        .el-form-item__error {
          padding-top: 2px;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style> 