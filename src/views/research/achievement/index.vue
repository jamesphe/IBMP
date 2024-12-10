<template>
  <div class="app-container">
    <h2>科研成果管理</h2>
    <el-card class="box-card">
      <div class="achievement-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="成果发表管理" name="publish">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>论文管理</span>
                    </div>
                    <div class="data-item">
                      <p>论文发表记录</p>
                      <p>论文引用统计</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>专利管理</span>
                    </div>
                    <div class="data-item">
                      <p>专利申请记录</p>
                      <p>专利授权管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>专著管理</span>
                    </div>
                    <div class="data-item">
                      <p>专著出版记录</p>
                      <p>专著引用统计</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="学术交流" name="exchange">
            <div class="tab-content">
              <el-card>
                <div slot="header">
                  <span>学术讲座管理</span>
                </div>
                <div class="data-item">
                  <p>讲座信息管理</p>
                  <p>讲座记录统计</p>
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
  name: 'ResearchAchievement',
  data() {
    return {
      activeTab: 'publish'
    }
  }
}
</script>

<style scoped>
.achievement-content {
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
