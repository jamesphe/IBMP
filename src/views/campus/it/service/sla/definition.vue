<template>
  <div class="app-container">
    <!-- 顶部操作栏 -->
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreateSLA">
        新增SLA指标
      </el-button>
    </div>

    <!-- SLA指标列表 -->
    <el-table
      v-loading="listLoading"
      :data="slaList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="name" label="SLA名称" min-width="150" align="center" />
      <el-table-column prop="level" label="服务级别" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.level | levelTagType">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="responseTime" label="响应时间" width="120" align="center">
        <template slot-scope="{row}">{{ row.responseTime }}分钟</template>
      </el-table-column>
      <el-table-column prop="resolveTime" label="解决时间" width="120" align="center">
        <template slot-scope="{row}">{{ row.resolveTime }}��时</template>
      </el-table-column>
      <el-table-column prop="availability" label="可用性" width="120" align="center">
        <template slot-scope="{row}">{{ row.availability }}%</template>
      </el-table-column>
      <el-table-column prop="description" label="指标描述" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            active-value="生效"
            inactive-value="未生效"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" size="mini" class="danger-button" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- SLA编辑对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      :visible.sync="dialogVisible"
      width="720px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      custom-class="sla-dialog"
    >
      <el-form 
        ref="slaForm" 
        :model="slaForm" 
        :rules="rules" 
        label-width="120px"
        class="sla-form"
        :validate-on-rule-change="false"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="SLA名称" prop="name">
                <el-input 
                  v-model="slaForm.name" 
                  placeholder="请输入SLA名称"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务级别" prop="level">
                <el-select 
                  v-model="slaForm.level" 
                  placeholder="请选择服务级别" 
                  class="full-width"
                >
                  <el-option label="一级" value="一级"/>
                  <el-option label="二级" value="二级"/>
                  <el-option label="三级" value="三级"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 时效指标 -->
        <div class="form-section">
          <div class="section-title">时效指标</div>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="响应时间" prop="responseTime">
                <el-input-number 
                  v-model="slaForm.responseTime"
                  :min="1"
                  :max="1440"
                  controls-position="right"
                  class="number-input"
                />
                <span class="unit-label">分钟</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="解决时间" prop="resolveTime">
                <el-input-number
                  v-model="slaForm.resolveTime"
                  :min="1"
                  :max="168"
                  controls-position="right"
                  class="number-input"
                />
                <span class="unit-label">小时</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="可用性" prop="availability">
                <el-input-number
                  v-model="slaForm.availability"
                  :min="0"
                  :max="100"
                  :precision="2"
                  controls-position="right"
                  class="number-input"
                />
                <span class="unit-label">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch
                  v-model="slaForm.status"
                  active-value="生效"
                  inactive-value="未生效"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
                <span class="status-text">{{ slaForm.status }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 描述信息 -->
        <div class="form-section">
          <div class="section-title">描述信息</div>
          <el-form-item label="指标描述" prop="description">
            <el-input
              v-model="slaForm.description"
              type="textarea"
              :rows="4"
              placeholder="请输入指标描述"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSLA">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SLADefinition',
  filters: {
    levelTagType(level) {
      const levelMap = {
        '一级': 'danger',
        '二级': 'warning',
        '三级': 'info'
      }
      return levelMap[level]
    }
  },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      dialogTitle: '',
      // 模拟数据
      slaList: [
        {
          id: 1,
          name: '关键业务SLA',
          level: '一级',
          responseTime: 10,
          resolveTime: 2,
          availability: 99.9,
          description: '适用于核心业务系统的服务级别协议',
          status: '生效'
        },
        {
          id: 2,
          name: '重要业务SLA',
          level: '二级',
          responseTime: 30,
          resolveTime: 4,
          availability: 99.5,
          description: '适用于重要业务系统的服务级别协议',
          status: '生效'
        },
        {
          id: 3,
          name: '一般业务SLA',
          level: '三级',
          responseTime: 60,
          resolveTime: 8,
          availability: 99.0,
          description: '适用于一般业务系统的服务级别协议',
          status: '未生效'
        }
      ],
      slaForm: {
        name: '',
        level: '',
        responseTime: '',
        resolveTime: '',
        availability: '',
        description: '',
        status: '生效'
      },
      rules: {
        name: [
          { required: true, message: '请输入SLA名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择服务级别', trigger: 'change' }
        ],
        responseTime: [
          { required: true, message: '请输入响应时间', trigger: 'blur' }
        ],
        resolveTime: [
          { required: true, message: '请输入解决时间', trigger: 'blur' }
        ],
        availability: [
          { required: true, message: '请输入可用性', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入指标描述', trigger: 'blur' },
          { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCreateSLA() {
      this.dialogTitle = '新增SLA指标'
      this.slaForm = {
        name: '',
        level: '',
        responseTime: '',
        resolveTime: '',
        availability: '',
        description: '',
        status: '生效'
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑SLA指标'
      this.slaForm = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认删除该SLA指标?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.slaList.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.slaList.splice(index, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    handleStatusChange(row) {
      this.$message({
        type: 'success',
        message: `状态已更新为: ${row.status}`
      })
    },
    submitSLA() {
      this.$refs.slaForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增SLA指标') {
            const newSLA = {
              ...this.slaForm,
              id: this.slaList.length + 1
            }
            this.slaList.push(newSLA)
          } else {
            const index = this.slaList.findIndex(item => item.id === this.slaForm.id)
            if (index > -1) {
              this.slaList.splice(index, 1, { ...this.slaForm })
            }
          }
          this.$message({
            type: 'success',
            message: this.dialogTitle === '新增SLA指标' ? '创建成功!' : '更新成功!'
          })
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 20px;
}

.sla-form {
  padding: 20px 20px 0;
  
  .el-input-number {
    width: 180px;
  }
  
  .unit-label {
    margin-left: 10px;
    color: #606266;
  }
}

.danger-button {
  color: #F56C6C;
  margin-left: 10px;
  
  &:hover {
    color: #f78989;
  }
}

::v-deep .el-table {
  th {
    background-color: #f5f7fa;
  }
  
  .el-tag {
    &.el-tag--danger {
      background-color: rgba(245,108,108,0.1);
      border-color: rgba(245,108,108,0.2);
      color: #f56c6c;
    }
    
    &.el-tag--warning {
      background-color: rgba(230,162,60,0.1);
      border-color: rgba(230,162,60,0.2);
      color: #e6a23c;
    }
    
    &.el-tag--info {
      background-color: rgba(144,147,153,0.1);
      border-color: rgba(144,147,153,0.2);
      color: #909399;
    }
  }
}

.sla-dialog {
  .sla-form {
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

    .number-input {
      width: 160px;
    }

    .unit-label {
      margin-left: 8px;
      color: #606266;
      font-size: 14px;
    }

    .status-text {
      margin-left: 8px;
      font-size: 14px;
      color: #606266;
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

    ::v-deep .el-input-number {
      .el-input__inner {
        text-align: left;
      }
    }
  }
}

.dialog-footer {
  text-align: right;
  padding-top: 16px;
}
</style> 