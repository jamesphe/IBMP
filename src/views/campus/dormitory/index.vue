<template>
  <div class="app-container">
    <h2>宿舍管理系统</h2>
    <el-card class="box-card">
      <div class="dormitory-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="宿舍基础管理" name="basic">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>宿舍分配</span>
                    </div>
                    <div class="data-item">
                      <p>宿舍房间管理</p>
                      <p>学生住宿分配</p>
                      <p>宿舍调整管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>查寝记录</span>
                    </div>
                    <div class="data-item">
                      <p>查寝计划管理</p>
                      <p>查寝结果记录</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="考勤与卫生" name="daily">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>宿舍考勤</span>
                    </div>
                    <div class="data-item">
                      <p>考勤记录管理</p>
                      <p>考勤统计分析</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>卫生管理</span>
                    </div>
                    <div class="data-item">
                      <p>卫生检查记录</p>
                      <p>文明宿舍评选</p>
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
  name: 'Dormitory',
  data() {
    return {
      activeTab: 'basic'
    }
  }
}
</script>

<style scoped>
.dormitory-content {
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
