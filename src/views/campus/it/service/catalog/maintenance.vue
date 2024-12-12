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
      width="50%"
    >
      <el-form 
        ref="addForm" 
        :model="addForm" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="服务类别" prop="category">
          <el-select v-model="addForm.category" placeholder="请选择">
            <el-option label="IT支持" value="it" />
            <el-option label="系统维护" value="system" />
            <el-option label="设备管理" value="device" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="addForm.description"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="适用范围" prop="scope">
          <el-input v-model="addForm.scope" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-rate v-model="addForm.priority" :max="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
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
        priority: 1
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
        ]
      },
      dialogVisible: false
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
        priority: 1
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
</style> 