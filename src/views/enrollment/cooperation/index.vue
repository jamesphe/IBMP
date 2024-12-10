<template>
  <div class="app-container">
    <h2>校企合作系统</h2>
    <el-card class="box-card">
      <div class="cooperation-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="课证融通管理" name="certificate">
            <div class="tab-content">
              <p>课程与证书关联管理</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产学合作项目" name="project">
            <div class="tab-content">
              <p>校企合作项目管理</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cooperation',
  data() {
    return {
      activeTab: 'certificate'
    }
  }
}
</script>

<style scoped>
.cooperation-content {
  padding: 20px;
}
.tab-content {
  margin-top: 20px;
}
</style>
