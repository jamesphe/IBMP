<template>
  <div class="app-container">
    <h2>党建教育管理</h2>
    <el-card class="box-card">
      <div class="education-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="党课管理" name="course">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>党课计划</span>
                    </div>
                    <div class="data-item">
                      <p>党课计划制定</p>
                      <p>党课安排管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>党课记录</span>
                    </div>
                    <div class="data-item">
                      <p>党课考勤记录</p>
                      <p>党课效果评估</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="党员活动" name="activity">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>活动管理</span>
                    </div>
                    <div class="data-item">
                      <p>活动计划管理</p>
                      <p>活动开展记录</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>活动评估</span>
                    </div>
                    <div class="data-item">
                      <p>活动参与统计</p>
                      <p>活动效果评估</p>
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
  name: 'PartyEducation',
  data() {
    return {
      activeTab: 'course'
    }
  }
}
</script>

<style scoped>
.education-content {
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
