<template>
  <div class="device-loan-apply">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-title">
        <h2>设备借用申请</h2>
      </div>
      <div class="header-extra">
        <button class="btn" @click="resetForm">重置</button>
        <button class="btn btn-primary" @click="handleSubmit">提交申请</button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="page-content">
      <div class="form-card">
        <div class="card-title">基本信息</div>
        <div class="form-group">
          <!-- 借用设备 -->
          <div class="form-item required">
            <label class="form-label">借用设备</label>
            <div class="form-content">
              <select v-model="formState.deviceId" class="form-select" @change="handleDeviceChange">
                <option value="">请选择借用设备</option>
                <option v-for="item in deviceOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
              <div class="form-error" v-if="errors.deviceId">{{ errors.deviceId }}</div>
            </div>
          </div>

          <!-- 借用数量 -->
          <div class="form-item required">
            <label class="form-label">借用数量</label>
            <div class="form-content">
              <input
                type="number"
                v-model="formState.quantity"
                :min="1"
                :max="selectedDeviceStock"
                class="form-input"
              />
              <div class="form-error" v-if="errors.quantity">{{ errors.quantity }}</div>
            </div>
          </div>

          <!-- 借用时间 -->
          <div class="form-item required">
            <label class="form-label">借用时间</label>
            <div class="form-content">
              <div class="date-range">
                <input type="datetime-local" v-model="formState.startTime" class="form-input" />
                <span class="date-separator">至</span>
                <input type="datetime-local" v-model="formState.endTime" class="form-input" />
              </div>
              <div class="form-error" v-if="errors.time">{{ errors.time }}</div>
            </div>
          </div>

          <!-- 借用用途 -->
          <div class="form-item required">
            <label class="form-label">借用用途</label>
            <div class="form-content">
              <textarea
                v-model="formState.purpose"
                class="form-textarea"
                rows="3"
                placeholder="请详细说明借用用途"
              ></textarea>
              <div class="form-error" v-if="errors.purpose">{{ errors.purpose }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceLoanApply',
  data() {
    return {
      formState: {
        deviceId: '',
        quantity: 1,
        startTime: '',
        endTime: '',
        purpose: '',
        remark: ''
      },
      errors: {
        deviceId: '',
        quantity: '',
        time: '',
        purpose: ''
      },
      deviceOptions: [
        { 
          value: '1', 
          label: '笔记本电脑', 
          stock: 10,
          models: ['ThinkPad X1 Carbon', 'MacBook Pro', 'Dell XPS 13'],
          department: '信息技术部',
          location: 'A栋501机房'
        },
        { 
          value: '2', 
          label: '投影仪', 
          stock: 5,
          models: ['爱普生CB-X05', '明基MW550', '松下PT-UX363C'],
          department: '教学设备部',
          location: 'B栋教学楼'
        }
      ],
      selectedDeviceStock: 0
    }
  },
  methods: {
    handleDeviceChange(e) {
      const value = e.target.value
      const device = this.deviceOptions.find(item => item.value === value)
      this.selectedDeviceStock = device ? device.stock : 0
      this.formState.quantity = 1
    },
    handleSubmit() {
      if (this.validateForm()) {
        console.log('提交表单:', this.formState)
      }
    },
    resetForm() {
      Object.assign(this.formState, {
        deviceId: '',
        quantity: 1,
        startTime: '',
        endTime: '',
        purpose: '',
        remark: ''
      })
      this.selectedDeviceStock = 0
      Object.keys(this.errors).forEach(key => this.errors[key] = '')
    },
    validateForm() {
      let isValid = true
      // 基本验证逻辑...
      return isValid
    }
  }
}
</script>

<style scoped>
.device-loan-apply {
  padding: 24px;
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-card {
  background: #fff;
  border-radius: 2px;
  padding: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 24px;
  display: flex;
}

.form-label {
  width: 120px;
  text-align: right;
  padding-right: 12px;
  line-height: 32px;
}

.form-content {
  flex: 1;
  max-width: 560px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
}

.form-textarea {
  height: auto;
  padding: 8px 12px;
}

.form-error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.btn {
  padding: 0 16px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-left: 8px;
  cursor: pointer;
}

.btn-primary {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style> 