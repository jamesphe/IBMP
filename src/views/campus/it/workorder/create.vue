<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">创建工单</span>
      </div>
      
      <el-form
        ref="workorderForm"
        :model="workorderForm"
        :rules="rules"
        label-width="120px"
        class="workorder-form"
      >
        <!-- 工单基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <i class="el-icon-document" />
            <span>基本信息</span>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单标题" prop="title">
                <el-input v-model="workorderForm.title" placeholder="请输入工单标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单编号">
                <el-input v-model="workorderNo" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="优先级" prop="priority">
                <el-select v-model="workorderForm.priority" placeholder="请选择优先级">
                  <el-option
                    v-for="item in priorityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-tag :type="item.tagType" size="small">{{ item.label }}</el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 关联信息 -->
        <div class="form-section">
          <div class="section-header">
            <i class="el-icon-connection" />
            <span>关联信息</span>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="关联事件" prop="eventId">
                <el-input v-model="workorderForm.eventId" placeholder="请输入关联事件编号">
                  <el-button slot="append" icon="el-icon-search" @click="searchEvent" />
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望完成时间" prop="expectedTime">
                <el-date-picker
                  v-model="workorderForm.expectedTime"
                  type="datetime"
                  placeholder="请选择期望完成时间"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 工单详情 -->
        <div class="form-section">
          <div class="section-header">
            <i class="el-icon-document-copy" />
            <span>工单详情</span>
          </div>
          
          <el-form-item label="工单描述" prop="description">
            <el-input
              v-model="workorderForm.description"
              type="textarea"
              :rows="4"
              placeholder="请详细描述工单内容"
            />
          </el-form-item>

          <el-form-item label="附件">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="fileList"
              multiple
              class="upload-container"
            >
              <el-button type="primary" size="small">
                <i class="el-icon-upload2" /> 选择文件
              </el-button>
              <div slot="tip" class="el-upload__tip">支持jpg、png、doc、pdf等格式文件，单个文件不超过10MB</div>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" icon="el-icon-check" @click="submitForm">提交工单</el-button>
          <el-button icon="el-icon-edit-outline" @click="saveAsDraft">保存草稿</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 关联事件弹窗 -->
    <el-dialog title="关联事件" :visible.sync="eventDialogVisible" width="60%" append-to-body>
      <div class="dialog-search">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入事件编号或标题"
          class="search-input"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
      </div>
      
      <el-table :data="eventList" border>
        <el-table-column prop="id" label="事件编号" width="120" />
        <el-table-column prop="title" label="事件标题" />
        <el-table-column prop="type" label="事件类型" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusType">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="selectEvent(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
        expectedTime: '',
        description: ''
      },
      workorderNo: 'WO' + new Date().getTime(),
      searchKeyword: '',
      typeOptions: [
        { value: 'hardware', label: '硬件故障' },
        { value: 'software', label: '软件故障' },
        { value: 'network', label: '网络故障' },
        { value: 'service', label: '服务请求' },
        { value: 'maintenance', label: '日常维护' },
        { value: 'other', label: '其他' }
      ],
      priorityOptions: [
        { value: 'high', label: '高', tagType: 'danger' },
        { value: 'medium', label: '中', tagType: 'warning' },
        { value: 'low', label: '低', tagType: 'info' }
      ],
      rules: {
        title: [
          { required: true, message: '请输入工单标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择工单类型', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入工单描述', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        expectedTime: [
          { required: true, message: '请选择期望完成时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      fileList: [],
      eventDialogVisible: false,
      eventList: [
        {
          id: 'EV2024030001',
          title: '财务系统无法登录',
          type: '软件故障',
          status: '处理中',
          statusType: 'warning'
        },
        {
          id: 'EV2024030002',
          title: '打印机故障',
          type: '硬件故障',
          status: '待处理',
          statusType: 'info'
        }
      ]
    }
  },
  methods: {
    submitForm() {
      this.$refs.workorderForm.validate(valid => {
        if (valid) {
          // 模拟提交成功
          this.$notify({
            title: '成功',
            message: '工单创建成功',
            type: 'success',
            duration: 2000
          })
          this.resetForm()
        }
      })
    },
    resetForm() {
      this.$refs.workorderForm.resetFields()
      this.fileList = []
    },
    saveAsDraft() {
      this.$message({
        message: '工单已保存为草稿',
        type: 'success'
      })
    },
    searchEvent() {
      this.eventDialogVisible = true
    },
    selectEvent(row) {
      this.workorderForm.eventId = row.id
      this.eventDialogVisible = false
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList
    },
    handleSearch() {
      // 模拟搜索功能
      this.$message('搜索功能已触发')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  
  .box-card {
    margin-bottom: 20px;
    
    .card-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
}

.workorder-form {
  .form-section {
    margin-bottom: 30px;
    
    .section-header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      
      i {
        margin-right: 8px;
        color: #409EFF;
      }
      
      span {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
  
  .form-actions {
    margin-top: 30px;
    text-align: center;
    
    .el-button {
      margin: 0 10px;
      padding: 12px 25px;
    }
  }
}

.dialog-search {
  margin-bottom: 20px;
  
  .search-input {
    width: 300px;
  }
}

.upload-container {
  .el-upload__tip {
    margin-top: 8px;
    color: #909399;
  }
}

::v-deep .el-select {
  width: 100%;
}

::v-deep .el-date-picker {
  width: 100%;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
  background-color: #f5f7fa;
}
</style>
