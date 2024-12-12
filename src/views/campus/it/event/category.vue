<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 事件类型管理卡片 -->
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>事件类型管理</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddType"
            >
              新增类型
            </el-button>
          </div>
          <el-table 
            :data="typeList" 
            style="width: 100%"
            v-loading="typeLoading"
          >
            <el-table-column prop="label" label="类型名称" />
            <el-table-column prop="value" label="标识值" width="120" />
            <el-table-column prop="count" label="事件数量" width="100" align="center" />
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEditType(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click="handleDeleteType(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 优先级管理卡片 -->
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>优先级管理</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddPriority"
            >
              新增优先级
            </el-button>
          </div>
          <el-table 
            :data="priorityList" 
            style="width: 100%"
            v-loading="priorityLoading"
          >
            <el-table-column prop="label" label="优先级名称" />
            <el-table-column prop="value" label="标识值" width="120" />
            <el-table-column prop="count" label="事件数量" width="100" align="center" />
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEditPriority(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click="handleDeletePriority(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 状态管理卡片 -->
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>状态管理</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddStatus"
            >
              新增状态
            </el-button>
          </div>
          <el-table 
            :data="statusList" 
            style="width: 100%"
            v-loading="statusLoading"
          >
            <el-table-column prop="label" label="状态名称" />
            <el-table-column prop="value" label="标识值" width="120" />
            <el-table-column prop="count" label="事件数量" width="100" align="center" />
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="{row}">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEditStatus(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56c6c"
                  @click="handleDeleteStatus(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 类型编辑对话框 -->
    <el-dialog :title="typeDialog.title" :visible.sync="typeDialog.visible">
      <el-form
        ref="typeForm"
        :model="typeDialog.form"
        :rules="typeDialog.rules"
        label-width="80px"
      >
        <el-form-item label="类型名称" prop="label">
          <el-input v-model="typeDialog.form.label" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="标识值" prop="value">
          <el-input v-model="typeDialog.form.value" placeholder="请输入标识值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea"
            v-model="typeDialog.form.description" 
            placeholder="请输入类型描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="typeDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitTypeForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 优先级编辑对话框 -->
    <el-dialog :title="priorityDialog.title" :visible.sync="priorityDialog.visible">
      <el-form
        ref="priorityForm"
        :model="priorityDialog.form"
        :rules="priorityDialog.rules"
        label-width="80px"
      >
        <el-form-item label="优先级" prop="label">
          <el-input v-model="priorityDialog.form.label" placeholder="请输入优先级名称" />
        </el-form-item>
        <el-form-item label="标识值" prop="value">
          <el-input v-model="priorityDialog.form.value" placeholder="请输入标识值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea"
            v-model="priorityDialog.form.description" 
            placeholder="请输入优先级描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="priorityDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitPriorityForm">确定</el-button>
      </div>
    </el-dialog>

    <!-- 状态编辑对话框 -->
    <el-dialog :title="statusDialog.title" :visible.sync="statusDialog.visible">
      <el-form
        ref="statusForm"
        :model="statusDialog.form"
        :rules="statusDialog.rules"
        label-width="80px"
      >
        <el-form-item label="状态名称" prop="label">
          <el-input v-model="statusDialog.form.label" placeholder="请输入状态名称" />
        </el-form-item>
        <el-form-item label="标识值" prop="value">
          <el-input v-model="statusDialog.form.value" placeholder="请输入标识值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea"
            v-model="statusDialog.form.description" 
            placeholder="请输入状态描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitStatusForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EventCategory',
  data() {
    return {
      // 事件类型列表
      typeList: [
        { label: '硬件故障', value: 'hardware', count: 15, description: '服务器、网络设备等硬件相关故障' },
        { label: '软件故障', value: 'software', count: 23, description: '操作系统、应用软件等故障' },
        { label: '网络故障', value: 'network', count: 18, description: '网络连接、访问等相关故障' },
        { label: '安全事件', value: 'security', count: 8, description: '安全漏洞、攻击等安全相关事件' },
        { label: '其他', value: 'other', count: 5, description: '其他类型故障' }
      ],
      typeLoading: false,

      // 优先级列表
      priorityList: [
        { label: '紧急', value: 'urgent', count: 12, description: '需要立即处理的紧急事件' },
        { label: '高', value: 'high', count: 18, description: '重要且需要优先处理的事件' },
        { label: '中', value: 'medium', count: 25, description: '正常优先级的事件' },
        { label: '低', value: 'low', count: 14, description: '可延后处理的事件' }
      ],
      priorityLoading: false,

      // 状态列表
      statusList: [
        { label: '待处理', value: 'pending', count: 8, description: '新创建待处理的事件' },
        { label: '处理中', value: 'processing', count: 15, description: '正在处理的事件' },
        { label: '已解决', value: 'resolved', count: 42, description: '已解决的事件' },
        { label: '已关闭', value: 'closed', count: 35, description: '已关闭的事件' },
        { label: '已取消', value: 'cancelled', count: 5, description: '已取消的事件' }
      ],
      statusLoading: false,

      // 类型对话框
      typeDialog: {
        visible: false,
        title: '',
        form: {
          label: '',
          value: '',
          description: ''
        },
        rules: {
          label: [
            { required: true, message: '请输入类型名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入标识值', trigger: 'blur' },
            { pattern: /^[a-z][a-z0-9_]*$/, message: '标识值只能包含小写字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
          ]
        }
      },

      // 优先级对话框
      priorityDialog: {
        visible: false,
        title: '',
        form: {
          label: '',
          value: '',
          description: ''
        },
        rules: {
          label: [
            { required: true, message: '请输入优先级名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入标识值', trigger: 'blur' },
            { pattern: /^[a-z][a-z0-9_]*$/, message: '标识值只能包含小写字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
          ]
        }
      },

      // 状态对话框
      statusDialog: {
        visible: false,
        title: '',
        form: {
          label: '',
          value: '',
          description: ''
        },
        rules: {
          label: [
            { required: true, message: '请输入状态名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入标识值', trigger: 'blur' },
            { pattern: /^[a-z][a-z0-9_]*$/, message: '标识值只能包含小写字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    // 类型相关方法
    handleAddType() {
      this.typeDialog.title = '新增事件类型'
      this.typeDialog.form = {
        label: '',
        value: '',
        description: ''
      }
      this.typeDialog.visible = true
    },
    handleEditType(row) {
      this.typeDialog.title = '编辑事件类型'
      this.typeDialog.form = Object.assign({}, row)
      this.typeDialog.visible = true
    },
    handleDeleteType(row) {
      this.$confirm('确认删除该事件类型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.typeList.findIndex(item => item.value === row.value)
        if (index > -1) {
          this.typeList.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    submitTypeForm() {
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          const isEdit = this.typeList.some(item => item.value === this.typeDialog.form.value)
          if (isEdit) {
            const index = this.typeList.findIndex(item => item.value === this.typeDialog.form.value)
            this.typeList.splice(index, 1, {
              ...this.typeDialog.form,
              count: this.typeList[index].count
            })
          } else {
            this.typeList.push({
              ...this.typeDialog.form,
              count: 0
            })
          }
          this.typeDialog.visible = false
          this.$notify({
            title: '成功',
            message: isEdit ? '更新成功' : '添加成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    // 优先级相关方法
    handleAddPriority() {
      this.priorityDialog.title = '新增优先级'
      this.priorityDialog.form = {
        label: '',
        value: '',
        description: ''
      }
      this.priorityDialog.visible = true
    },
    handleEditPriority(row) {
      this.priorityDialog.title = '编辑优先级'
      this.priorityDialog.form = Object.assign({}, row)
      this.priorityDialog.visible = true
    },
    handleDeletePriority(row) {
      this.$confirm('确认删除该优先级?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.priorityList.findIndex(item => item.value === row.value)
        if (index > -1) {
          this.priorityList.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    submitPriorityForm() {
      this.$refs.priorityForm.validate((valid) => {
        if (valid) {
          const isEdit = this.priorityList.some(item => item.value === this.priorityDialog.form.value)
          if (isEdit) {
            const index = this.priorityList.findIndex(item => item.value === this.priorityDialog.form.value)
            this.priorityList.splice(index, 1, {
              ...this.priorityDialog.form,
              count: this.priorityList[index].count
            })
          } else {
            this.priorityList.push({
              ...this.priorityDialog.form,
              count: 0
            })
          }
          this.priorityDialog.visible = false
          this.$notify({
            title: '成功',
            message: isEdit ? '更新成功' : '添加成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    // 状态相关方法
    handleAddStatus() {
      this.statusDialog.title = '新增状态'
      this.statusDialog.form = {
        label: '',
        value: '',
        description: ''
      }
      this.statusDialog.visible = true
    },
    handleEditStatus(row) {
      this.statusDialog.title = '编辑状态'
      this.statusDialog.form = Object.assign({}, row)
      this.statusDialog.visible = true
    },
    handleDeleteStatus(row) {
      this.$confirm('确认删除该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.statusList.findIndex(item => item.value === row.value)
        if (index > -1) {
          this.statusList.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    submitStatusForm() {
      this.$refs.statusForm.validate((valid) => {
        if (valid) {
          const isEdit = this.statusList.some(item => item.value === this.statusDialog.form.value)
          if (isEdit) {
            const index = this.statusList.findIndex(item => item.value === this.statusDialog.form.value)
            this.statusList.splice(index, 1, {
              ...this.statusDialog.form,
              count: this.statusList[index].count
            })
          } else {
            this.statusList.push({
              ...this.statusDialog.form,
              count: 0
            })
          }
          this.statusDialog.visible = false
          this.$notify({
            title: '成功',
            message: isEdit ? '更新成功' : '添加成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
.el-table {
  margin: 15px 0;
}
.dialog-footer {
  text-align: right;
}
</style>
