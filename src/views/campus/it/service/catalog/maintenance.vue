<template>
  <div class="app-container">
    <!-- 左侧目录树 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务目录</span>
            <el-button 
              type="text" 
              icon="el-icon-plus"
              style="float: right; padding: 3px 0" 
              @click="handleAddService"
            >
              新增服务
            </el-button>
          </div>
          <el-tree
            :data="catalogTree"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => handleView(data)"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => handleEdit(data)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  class="danger-button"
                  @click.stop="() => handleDelete(node, data)"
                >
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      
      <!-- 右侧服务详情 -->
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务详情</span>
          </div>
          <el-form 
            ref="serviceForm" 
            :model="serviceForm" 
            :rules="rules" 
            label-width="100px"
            v-if="currentService"
          >
            <el-form-item label="服务名称" prop="name">
              <el-input v-model="serviceForm.name" />
            </el-form-item>
            <el-form-item label="服务类别" prop="category">
              <el-select v-model="serviceForm.category" placeholder="请选择">
                <el-option label="IT支持" value="it" />
                <el-option label="系统维护" value="system" />
                <el-option label="设备管理" value="device" />
              </el-select>
            </el-form-item>
            <el-form-item label="服务描述" prop="description">
              <el-input 
                type="textarea" 
                v-model="serviceForm.description"
                :rows="4"
              />
            </el-form-item>
            <el-form-item label="适用范围" prop="scope">
              <el-input v-model="serviceForm.scope" />
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-rate v-model="serviceForm.priority" :max="3" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">保存</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增服务对话框 -->
    <el-dialog 
      title="新增服务" 
      :visible.sync="dialogVisible"
      width="720px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      custom-class="service-dialog"
    >
      <el-form 
        ref="addForm" 
        :model="addForm" 
        :rules="rules" 
        label-width="120px"
        class="service-form"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="服务名称" prop="name">
                <el-input 
                  v-model="addForm.name" 
                  placeholder="请输入服务名称"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务类别" prop="category">
                <el-select v-model="addForm.category" placeholder="请选择服务类别" class="full-width">
                  <el-option label="IT支持" value="it" />
                  <el-option label="系统维护" value="system" />
                  <el-option label="设备管理" value="device" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="服务级别" prop="serviceLevel">
                <el-select 
                  v-model="addForm.serviceLevel" 
                  placeholder="请选择服务级别"
                  class="full-width"
                >
                  <el-option 
                    label="一级服务" 
                    value="level1"
                  >
                    <span style="float: left">一级服务</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      响应时间:10分钟
                    </span>
                  </el-option>
                  <el-option 
                    label="二级服务" 
                    value="level2"
                  >
                    <span style="float: left">二级服务</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      响应时间:30分钟
                    </span>
                  </el-option>
                  <el-option 
                    label="三级服务" 
                    value="level3"
                  >
                    <span style="float: left">三级服务</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      响应时间:60分钟
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用范围" prop="scope">
                <el-input 
                  v-model="addForm.scope" 
                  placeholder="请输入适用范围"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优先级" prop="priority">
                <el-rate 
                  v-model="addForm.priority" 
                  :max="3"
                  :texts="['低', '中', '高']"
                  show-text
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 服务描述 -->
        <div class="form-section">
          <div class="section-title">服务描述</div>
          <el-form-item label="详细描述" prop="description">
            <el-input
              v-model="addForm.description"
              type="textarea"
              :rows="4"
              placeholder="请输入服务详细描述"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      title="服务详情"
      :visible.sync="viewDialogVisible"
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
                <span class="value">{{ viewForm.name }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">服务类别：</span>
                <span class="value">{{ getCategoryLabel(viewForm.category) }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">服务级别：</span>
                <span class="value">
                  <el-tag :type="getServiceLevelType(viewForm.serviceLevel)">
                    {{ getServiceLevelLabel(viewForm.serviceLevel) }}
                  </el-tag>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">适用范围：</span>
                <span class="value">{{ viewForm.scope }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">优先级：</span>
                <span class="value">
                  <el-rate
                    v-model="viewForm.priority"
                    :max="3"
                    disabled
                    :texts="['低', '中', '高']"
                    show-text
                  />
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 服务描述 -->
        <div class="detail-section">
          <div class="section-title">服务描述</div>
          <div class="detail-item">
            <div class="description">{{ viewForm.description }}</div>
          </div>
        </div>
        
        <!-- 审批信息 -->
        <div class="detail-section">
          <div class="section-title">审批信息</div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in viewForm.approvalHistory"
              :key="index"
              :type="activity.status === '通过' ? 'success' : activity.status === '驳回' ? 'danger' : 'primary'"
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
        <el-button @click="viewDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CatalogMaintenance',
  data() {
    return {
      catalogTree: [{
        id: 1,
        label: 'IT支持服务',
        children: [{
          id: 4,
          label: '故障报修'
        }, {
          id: 5,
          label: '系统账号申请'
        }]
      }, {
        id: 2,
        label: '系统维护服务',
        children: [{
          id: 6,
          label: '系统升级'
        }, {
          id: 7,
          label: '数据备份'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentService: null,
      serviceForm: {
        name: '',
        category: '',
        description: '',
        scope: '',
        priority: 1
      },
      addForm: {
        name: '',
        category: '',
        description: '',
        scope: '',
        priority: 1,
        serviceLevel: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择服务类别', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入服务描述', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请输入适用范围', trigger: 'blur' }
        ],
        serviceLevel: [
          { required: true, message: '请选择服务级别', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      viewDialogVisible: false,
      viewForm: {
        name: '',
        category: '',
        serviceLevel: '',
        description: '',
        scope: '',
        priority: 1,
        approvalHistory: []
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      this.currentService = data
      this.serviceForm = {
        name: data.label,
        category: 'it', // 示例数据
        description: '示例描述',
        scope: '全校师生',
        priority: 2
      }
    },
    handleAddService() {
      this.dialogVisible = true
      this.addForm = {
        name: '',
        category: '',
        description: '',
        scope: '',
        priority: 1,
        serviceLevel: ''
      }
    },
    handleEdit(data) {
      console.log('编辑', data)
    },
    handleDelete(node, data) {
      this.$confirm('确认删除该服务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('删除', node, data)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    submitForm() {
      this.$refs.serviceForm.validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        }
      })
    },
    submitAddForm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        }
      })
    },
    resetForm() {
      this.$refs.serviceForm.resetFields()
    },
    handleView(data) {
      // 模拟获取服务详情数据
      this.viewForm = {
        name: data.label,
        category: 'it',
        serviceLevel: 'level1',
        description: '这是一个示例服务描述，详细说明了服务的内容和流程。',
        scope: '全校师生',
        priority: 2,
        approvalHistory: [
          {
            operator: '张三',
            action: '提交了服务申请',
            status: '待审批',
            time: '2024-01-15 10:00:00',
            comment: ''
          },
          {
            operator: '李四',
            action: '审批通过',
            status: '通过',
            time: '2024-01-15 11:30:00',
            comment: '服务内容完整，同意发布'
          }
        ]
      }
      this.viewDialogVisible = true
    },
    getCategoryLabel(category) {
      const categoryMap = {
        it: 'IT支持',
        system: '系统维护',
        device: '设备管理'
      }
      return categoryMap[category] || category
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
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.danger-button {
  color: #F56C6C;
  margin-left: 10px;
}

.el-tree {
  margin-top: -10px;
}

::v-deep .el-tree-node__content {
  height: 40px;
}

.service-dialog {
  .service-form {
    padding: 0;
    
    .form-section {
      margin-bottom: 24px;
      
      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: #1f2f3d;
        margin-bottom: 16px;
        padding-left: 8px;
        border-left: 3px solid #409EFF;
      }
    }

    .el-row {
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
    }

    ::v-deep .el-form-item {
      margin-bottom: 18px;
      
      .el-form-item__label {
        font-weight: normal;
        color: #606266;
      }
      
      .el-form-item__error {
        padding-top: 2px;
      }
    }

    ::v-deep .el-rate {
      height: 32px;
      line-height: 32px;
    }
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

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
</style> 