<template>
  <div class="app-container">
    <div class="k-page-header">
      <div class="left">
        <div class="title">事件登记</div>
        <div class="description">记录和分类IT系统中发生的各类事件</div>
      </div>
      <div class="right">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </div>

    <el-card class="k-form-card" shadow="never">
      <el-form
        ref="eventForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
        size="medium"
      >
        <!-- 基本信息 -->
        <div class="k-form-section">
          <div class="section-header">
            <div class="section-line" />
            <div class="section-title">基本信息</div>
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
        <div class="k-form-section">
          <div class="section-header">
            <div class="section-line" />
            <div class="section-title">影响评估</div>
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
        <div class="k-form-section">
          <div class="section-header">
            <div class="section-line" />
            <div class="section-title">详细描述</div>
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
        <div class="k-form-section">
          <div class="section-header">
            <div class="section-line" />
            <div class="section-title">附件信息</div>
          </div>

          <el-form-item label="相关附件">
            <el-upload
              class="k-uploader"
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

.k-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .left {
    .title {
      font-size: 20px;
      font-weight: 500;
      color: $heading-color;
      margin-bottom: 8px;
    }

    .description {
      font-size: 14px;
      color: $text-secondary;
    }
  }

  .right {
    .el-button + .el-button {
      margin-left: 12px;
    }
  }
}

.k-form-card {
  .k-form-section {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .section-line {
        width: 4px;
        height: 16px;
        background-color: $primary-color;
        border-radius: 2px;
        margin-right: 8px;
      }

      .section-title {
        font-size: 16px;
        font-weight: 500;
        color: $heading-color;
      }
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: $text-primary;
  }

  :deep(.el-input__inner) {
    border-radius: 2px;
  }

  :deep(.el-select .el-input__inner:focus) {
    border-color: $primary-color;
  }

  .k-uploader {
    :deep(.el-upload-dragger) {
      width: 100%;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .el-icon-upload {
        font-size: 48px;
        color: $primary-color;
        margin-bottom: 16px;
      }

      .el-upload__text {
        font-size: 14px;
        color: $text-regular;

        em {
          color: $primary-color;
          font-style: normal;
        }
      }
    }

    :deep(.el-upload__tip) {
      margin-top: 8px;
      color: $text-secondary;
    }
  }
}

.el-select-dropdown__item {
  i {
    margin-right: 8px;
  }
}
</style>
