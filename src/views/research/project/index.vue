<template>
  <div class="app-container">
    <h2>科研项目管理</h2>
    <el-card class="box-card">
      <div class="project-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="项目信息管理" name="info">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>项目基本信息</span>
                    </div>
                    <div class="data-item">
                      <p>项目信息管理</p>
                      <p>项目进度跟踪</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>研究活动</span>
                    </div>
                    <div class="data-item">
                      <p>研究活动记录</p>
                      <p>活动成果管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="经费管理" name="fund">
            <div class="tab-content">
              <el-card>
                <div slot="header">
                  <span>经费使用管理</span>
                </div>
                <div class="data-item">
                  <p>经费预算管理</p>
                  <p>经费支出记录</p>
                  <p>经费使用统计</p>
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
  name: 'ResearchProject',
  data() {
    return {
      activeTab: 'info'
    }
  }
}
</script>

<style scoped>
.project-content {
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
