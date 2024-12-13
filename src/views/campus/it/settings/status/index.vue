<template>
  <div class="app-container">
    <!-- 页头区域 -->
    <div class="page-header">
      <div class="header-title">
        <span class="title">事件状态</span>
        <el-tooltip content="定义事件处理过程中的各种状态" placement="right">
          <i class="el-icon-question" />
        </el-tooltip>
      </div>
      <div class="header-action">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
          新增状态
        </el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <el-table 
        :data="list" 
        border 
        style="width: 100%"
        :header-cell-style="{
          background: '#F5F7FA',
          color: '#606266',
          height: '44px',
          padding: '0',
          fontWeight: 500
        }"
      >
        <el-table-column label="状态编码" prop="value" width="150" />
        <el-table-column label="状态名称" prop="label" width="150" />
        <el-table-column label="描述" prop="desc" min-width="200" show-overflow-tooltip />
        <el-table-column label="类型" width="100" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.type">{{ row.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80" align="center" prop="sort" />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{row}">
            <el-switch
              v-model="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleEdit(row)">
              <i class="el-icon-edit" />编辑
            </el-button>
            <el-button type="text" size="small" class="danger-text" @click="handleDelete(row)">
              <i class="el-icon-delete" />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogType === 'create' ? '新增状态' : '编辑状态'"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      custom-class="custom-dialog"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-width="100px"
        class="form-container"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">基本信息</span>
          </div>
          <el-form-item label="状态编码" prop="value">
            <el-input 
              v-model="temp.value" 
              placeholder="请输入状态编码"
              :disabled="dialogType === 'update'"
              maxlength="50"
            />
            <div class="form-tip">建议使用英文字母,作为系统内部标识</div>
          </el-form-item>
          <el-form-item label="状态名称" prop="label">
            <el-input 
              v-model="temp.label" 
              placeholder="请输入状态名称"
              maxlength="20"
            />
            <div class="form-tip">用于前端显示的名称</div>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input
              type="textarea"
              v-model="temp.desc"
              placeholder="请输入状态描述"
              :rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 配置信息 -->
        <div class="form-section">
          <div class="section-header">
            <span class="section-title">配置信息</span>
          </div>
          <el-form-item label="类型" prop="type">
            <el-select v-model="temp.type" placeholder="请选择类型" style="width: 100%">
              <el-option label="信息" value="info" />
              <el-option label="警告" value="warning" />
              <el-option label="成功" value="success" />
              <el-option label="危险" value="danger" />
            </el-select>
            <div class="form-tip">影响状态标签的显示样式</div>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number 
              v-model="temp.sort" 
              :min="0" 
              :max="99"
              controls-position="right"
            />
            <span class="form-tip">数值越小越靠前</span>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="temp.status">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogType === 'create' ? createData() : updateData()">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Status',
  data() {
    return {
      list: [
        { 
          value: 'pending', 
          label: '待处理', 
          desc: '新提交待处理的事件',
          type: 'info',
          sort: 1,
          status: true 
        },
        { 
          value: 'processing', 
          label: '处理中', 
          desc: '正在处理的事件',
          type: 'warning',
          sort: 2,
          status: true 
        },
        { 
          value: 'resolved', 
          label: '已解决', 
          desc: '处理完成待确认的事件',
          type: 'success',
          sort: 3,
          status: true 
        }
      ],
      dialogVisible: false,
      dialogType: 'create',
      temp: {
        value: '',
        label: '',
        desc: '',
        type: 'info',
        sort: 0,
        status: true
      },
      rules: {
        value: [{ required: true, message: '请输入状态编码', trigger: 'blur' }],
        label: [{ required: true, message: '请输入状态名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleAdd() {
      this.dialogType = 'create'
      this.temp = {
        value: '',
        label: '',
        desc: '',
        type: 'info',
        sort: 0,
        status: true
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.dialogType = 'update'
      this.temp = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.list.push(Object.assign({}, this.temp))
          this.dialogVisible = false
          this.$message.success('添加成功')
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const index = this.list.findIndex(v => v.value === this.temp.value)
          this.list.splice(index, 1, Object.assign({}, this.temp))
          this.dialogVisible = false
          this.$message.success('更新成功')
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.list.findIndex(v => v.value === row.value)
        this.list.splice(index, 1)
        this.$message.success('删除成功')
      })
    },
    handleStatusChange(row) {
      this.$message.success(`${row.status ? '启用' : '停用'}成功`)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);

  .header-title {
    display: flex;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      margin-right: 8px;
    }

    .el-icon-question {
      color: #909399;
      cursor: help;
    }
  }
}

.table-card {
  margin-bottom: 20px;
  
  ::v-deep .el-card__body {
    padding: 0;
  }
}

.form-container {
  padding: 20px 40px;
  
  .form-section {
    margin-bottom: 32px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .section-header {
      margin-bottom: 24px;
      padding-left: 12px;
      border-left: 4px solid #409EFF;
      
      .section-title {
        font-size: 15px;
        font-weight: 500;
        color: #303133;
      }
    }
  }
  
  .form-tip {
    margin-top: 4px;
    margin-left: 0;
    color: #909399;
    font-size: 13px;
    line-height: 1.4;
  }
}

.custom-dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  
  ::v-deep .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #EBEEF5;
    
    .el-dialog__title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }
  
  ::v-deep .el-dialog__footer {
    padding: 20px;
    border-top: 1px solid #EBEEF5;
  }

  ::v-deep .el-form-item {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .el-form-item__label {
      font-weight: normal;
      color: #606266;
      padding-right: 16px;
    }
    
    .el-form-item__content {
      line-height: 36px;
    }
  }
}

.danger-text {
  color: #F56C6C;
}
</style> 