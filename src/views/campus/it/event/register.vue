<template>
  <div class="app-container">
    <div class="kd-page-header">
      <div class="kd-page-header__title">
        <i class="el-icon-edit-outline" />
        <span>事件登记</span>
      </div>
      <div class="kd-page-header__actions">
        <el-button size="small" @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" size="small" :loading="submitLoading" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </div>

    <el-card class="kd-form-card">
      <el-form
        ref="eventForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
        size="medium"
      >
        <!-- 基本信息 -->
        <div class="kd-form-section">
          <div class="kd-form-section__header">
            <span class="kd-form-section__title">基本信息</span>
          </div>
          
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="事件标题" prop="title">
                <el-input
                  v-model="formData.title"
                  placeholder="请输入事件标题"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="事件类型" prop="type">
                <el-select
                  v-model="formData.type"
                  placeholder="请选择事件类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <i :class="item.icon" :style="{ color: item.color }" />
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 影响评估 -->
        <div class="kd-form-section">
          <div class="kd-form-section__header">
            <span class="kd-form-section__title">影响评估</span>
          </div>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="优先级" prop="priority">
                <el-select
                  v-model="formData.priority"
                  placeholder="请选择优先级"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in priorityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-tag :type="item.type" size="small">{{ item.label }}</el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="影响范围" prop="impact">
                <el-select
                  v-model="formData.impact"
                  placeholder="请选择影响范围"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in impactOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-tag :type="item.type" size="small">{{ item.label }}</el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 详细描述 -->
        <div class="kd-form-section">
          <div class="kd-form-section__header">
            <span class="kd-form-section__title">详细描述</span>
          </div>

          <el-form-item label="事件描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="请详细描述事件的具体情况，包括：发生时间、现象表现、影响程度等"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </div>

        <!-- 附件信息 -->
        <div class="kd-form-section">
          <div class="kd-form-section__header">
            <span class="kd-form-section__title">附件信息</span>
          </div>

          <el-form-item label="相关附件">
            <el-upload
              class="kd-uploader"
              action="/dev-api/it/events/upload"
              :file-list="fileList"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              multiple
              :limit="5"
              drag
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                支持格式：.jpg、.png、.pdf、.doc、.docx、.xls、.xlsx，单个文件不超过10MB
              </div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'EventRegister',
  data() {
    return {
      submitLoading: false,
      fileList: [],
      formData: {
        title: '',
        type: '',
        priority: '',
        impact: '',
        description: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入事件标题', trigger: 'blur' },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请选择优先级', trigger: 'change' }
        ],
        impact: [
          { required: true, message: '请选择影响范围', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入事件描述', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ]
      },
      typeOptions: [
        { label: '硬件故障', value: 'hardware', icon: 'el-icon-cpu', color: '#E6A23C' },
        { label: '软件故障', value: 'software', icon: 'el-icon-monitor', color: '#409EFF' },
        { label: '网络故障', value: 'network', icon: 'el-icon-connection', color: '#F56C6C' },
        { label: '其他', value: 'other', icon: 'el-icon-more', color: '#909399' }
      ],
      priorityOptions: [
        { label: '高', value: 'high', type: 'danger' },
        { label: '中', value: 'medium', type: 'warning' },
        { label: '低', value: 'low', type: 'info' }
      ],
      impactOptions: [
        { label: '全校', value: 'school', type: 'danger' },
        { label: '部门', value: 'department', type: 'warning' },
        { label: '个人', value: 'personal', type: 'info' }
      ]
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.eventForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            const formData = {
              ...this.formData,
              attachments: this.fileList.map(file => ({
                name: file.name,
                url: file.url
              }))
            }
            
            await request({
              url: '/dev-api/it/events',
              method: 'post',
              data: formData
            })

            this.$notify({
              title: '成功',
              message: '事件登记成功',
              type: 'success',
              duration: 2000
            })

            this.$router.push('/campus/it/event/process')
          } catch (error) {
            this.$notify({
              title: '错误',
              message: '事件登记失败',
              type: 'error',
              duration: 2000
            })
          } finally {
            this.submitLoading = false
          }
        }
      })
    },
    beforeUpload(file) {
      const isValidType = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isValidType) {
        this.$message.error('文件格式不正确!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('文件大小不能超过10MB!')
        return false
      }
      return true
    },
    handlePreview(file) {
      window.open(file.url)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.kd-page-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 16px;

  &__title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #1f2633;

    i {
      margin-right: 8px;
      font-size: 18px;
    }
  }

  &__actions {
    margin-top: 16px;
    
    .el-button + .el-button {
      margin-left: 8px;
    }
  }
}

.kd-form-card {
  margin: 16px;
  
  :deep(.el-card__body) {
    padding: 24px;
  }
}

.kd-form-section {
  margin-bottom: 24px;

  &__header {
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 4px solid #1890ff;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: #1f2633;
  }
}

:deep(.el-form-item) {
  margin-bottom: 24px;
  
  .el-form-item__label {
    font-size: 14px;
    color: #4c5664;
  }

  .el-input__inner {
    border-radius: 2px;
  }

  .el-select .el-input__inner:focus {
    border-color: #1890ff;
  }
}

.kd-uploader {
  :deep(.el-upload-dragger) {
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    
    &:hover {
      border-color: #1890ff;
    }
  }
}
</style>
