<template>
  <div class="app-container">
    <h2>思政教育管理</h2>
    <el-card class="box-card">
      <div class="ideology-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="思政活动" name="activity">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>活动管理</span>
                    </div>
                    <div class="data-item">
                      <p>思政活动计划</p>
                      <p>活动开展记录</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>教职工管理</span>
                    </div>
                    <div class="data-item">
                      <p>思政教职工信息</p>
                      <p>工作考核管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="思想动态" name="dynamic">
            <div class="tab-content">
              <el-card>
                <div slot="header">
                  <span>思想动态分析</span>
                </div>
                <div class="data-item">
                  <p>学生思想动态采集</p>
                  <p>思想动态分析报告</p>
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
  name: 'PartyIdeology',
  data() {
    return {
      activeTab: 'activity'
    }
  }
}
</script>

<style scoped>
.ideology-content {
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
