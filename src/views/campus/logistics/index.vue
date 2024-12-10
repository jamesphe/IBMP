<template>
  <div class="app-container">
    <h2>后勤管理系统</h2>
    <el-card class="box-card">
      <div class="logistics-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="消费与认证" name="consumption">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>学生消费</span>
                    </div>
                    <div class="data-item">
                      <p>消费记录管理</p>
                      <p>消费统计分析</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>一卡通认证</span>
                    </div>
                    <div class="data-item">
                      <p>一卡通管理</p>
                      <p>认证记录查询</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备与环境" name="equipment">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>仪器设备</span>
                    </div>
                    <div class="data-item">
                      <p>设备基础信息</p>
                      <p>设备使用记录</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>智慧教室</span>
                    </div>
                    <div class="data-item">
                      <p>教室设备运行</p>
                      <p>设备维护记录</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Logistics',
  data() {
    return {
      activeTab: 'consumption'
    }
  }
}
</script>

<style scoped>
.logistics-content {
  padding: 20px;
}
.tab-content {
  margin-top: 20px;
}
.data-item {
  line-height: 2;
}
.el-card {
  margin-bottom: 20px;
}
</style>
