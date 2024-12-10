<template>
  <div class="app-container">
    <h2>人事管理系统</h2>
    <el-card class="box-card">
      <div class="personnel-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="教师画像与评价" name="portrait">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>教师画像</span>
                    </div>
                    <div class="data-item">
                      <p>教师基础画像</p>
                      <p>画像评价维度</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>教师评价</span>
                    </div>
                    <div class="data-item">
                      <p>教师评价管理</p>
                      <p>评价结果分析</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="教师进修与考核" name="training">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>教师进修</span>
                    </div>
                    <div class="data-item">
                      <p>进修计划管理</p>
                      <p>进修记录管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>教师考核</span>
                    </div>
                    <div class="data-item">
                      <p>考核标准管理</p>
                      <p>考核结果管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="教师企业实践" name="practice">
            <div class="tab-content">
              <el-card>
                <div slot="header">
                  <span>企业实践管理</span>
                </div>
                <div class="data-item">
                  <p>企业兼职信息</p>
                  <p>企业实践记录</p>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Personnel',
  data() {
    return {
      activeTab: 'portrait'
    }
  }
}
</script>

<style scoped>
.personnel-content {
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
