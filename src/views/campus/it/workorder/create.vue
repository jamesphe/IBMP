<template>
  <div class="app-container">
    <el-form
      ref="workorderForm"
      :model="workorderForm"
      :rules="rules"
      label-width="120px"
      class="workorder-form"
    >
      <el-form-item label="工单标题" prop="title">
        <el-input v-model="workorderForm.title" placeholder="请输入工单标题" />
      </el-form-item>

      <el-form-item label="工单类型" prop="type">
        <el-select v-model="workorderForm.type" placeholder="请选择工单类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="workorderForm.priority" placeholder="请选择优先级">
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="关联事件" prop="eventId">
        <el-input v-model="workorderForm.eventId" placeholder="请输入关联事件编号">
          <el-button slot="append" icon="el-icon-search" @click="searchEvent" />
        </el-input>
      </el-form-item>

      <el-form-item label="工单描述" prop="description">
        <el-input
          v-model="workorderForm.description"
          type="textarea"
          :rows="4"
          placeholder="请详细描述工单内容"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交工单</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'WorkOrderCreate',
  data() {
    return {
      workorderForm: {
        title: '',
        type: '',
        priority: '',
        eventId: '',
        description: ''
      },
      typeOptions: [
        { value: 'hardware', label: '硬件故障' },
        { value: 'software', label: '软件故障' },
        { value: 'network', label: '网络故障' },
        { value: 'service', label: '服务请求' },
        { value: 'other', label: '其他' }
      ],
      priorityOptions: [
        { value: 'high', label: '高' },
        { value: 'medium', label: '中' },
        { value: 'low', label: '低' }
      ],
      rules: {
        title: [
          { required: true, message: '请输入工单标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择工单类型', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入工单描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.workorderForm.validate(valid => {
        if (valid) {
          // 这里调用后端API提交工单
          this.$notify({
            title: '成功',
            message: '工单创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    resetForm() {
      this.$refs.workorderForm.resetFields()
    },
    searchEvent() {
      // 这里实现事件搜索功能
      this.$message('搜索事件功能待实现')
    }
  }
}
</script>

<style lang="scss" scoped>
.workorder-form {
  max-width: 600px;
  margin: 20px auto;
}
</style>
