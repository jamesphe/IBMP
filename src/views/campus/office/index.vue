<template>
  <div class="app-container">
    <h2>办公管理系统</h2>
    <el-card class="box-card">
      <div class="office-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="信息化与基础数据" name="info">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>学校基础信息</span>
                    </div>
                    <div class="data-item">
                      <p>学校信息管理</p>
                      <p>信息化建设统计</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>系统与数据</span>
                    </div>
                    <div class="data-item">
                      <p>系统访问记录</p>
                      <p>数据集成情况</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>网络安全</span>
                    </div>
                    <div class="data-item">
                      <p>网络安全管理</p>
                      <p>统一认证登录</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图书与期刊" name="library">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>图书管理</span>
                    </div>
                    <div class="data-item">
                      <p>图书信息管理</p>
                      <p>借阅记录管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>期刊管理</span>
                    </div>
                    <div class="data-item">
                      <p>期刊信息管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="校内赛事活动" name="activity">
            <div class="tab-content">
              <el-card>
                <div slot="header">
                  <span>学生赛事活动管理</span>
                </div>
                <div class="data-item">
                  <p>校内赛事活动管理</p>
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
  name: 'Office',
  data() {
    return {
      activeTab: 'info'
    }
  }
}
</script>

<style scoped>
.office-content {
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
