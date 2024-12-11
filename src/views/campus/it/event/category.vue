<template>
  <div class="app-container">
    <el-row :gutter="20">
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
          <el-table :data="typeList" style="width: 100%">
            <el-table-column prop="label" label="类型名称" />
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
          <el-table :data="priorityList" style="width: 100%">
            <el-table-column prop="label" label="优先级名称" />
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
          <el-input v-model="typeDialog.form.label" />
        </el-form-item>
        <el-form-item label="标识值" prop="value">
          <el-input v-model="typeDialog.form.value" />
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
          <el-input v-model="priorityDialog.form.label" />
        </el-form-item>
        <el-form-item label="标识值" prop="value">
          <el-input v-model="priorityDialog.form.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="priorityDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitPriorityForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EventCategory',
  data() {
    return {
      typeList: [
        { label: '硬件故障', value: 'hardware' },
        { label: '软件故障', value: 'software' },
        { label: '网络故障', value: 'network' },
        { label: '其他', value: 'other' }
      ],
      priorityList: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ],
      typeDialog: {
        visible: false,
        title: '',
        form: {
          label: '',
          value: ''
        },
        rules: {
          label: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入标识值', trigger: 'blur' }
          ]
        }
      },
      priorityDialog: {
        visible: false,
        title: '',
        form: {
          label: '',
          value: ''
        },
        rules: {
          label: [
            { required: true, message: '请输入优先级名称', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入标识值', trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    handleAddType() {
      this.typeDialog.title = '新增事件类型'
      this.typeDialog.form = {
        label: '',
        value: ''
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
        // 这里应该调用后端API删除数据
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    submitTypeForm() {
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          // 这里应该调用后端API保存数据
          this.typeDialog.visible = false
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleAddPriority() {
      this.priorityDialog.title = '新增优先级'
      this.priorityDialog.form = {
        label: '',
        value: ''
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
        // 这里应该调用后端API删除数据
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    submitPriorityForm() {
      this.$refs.priorityForm.validate((valid) => {
        if (valid) {
          // 这里应该调用后端API保存数据
          this.priorityDialog.visible = false
          this.$notify({
            title: '成功',
            message: '保存成功',
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
</style>
