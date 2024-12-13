<template>
  <div class="app-container">
    <h2>资产管理系统</h2>
    <el-card class="box-card">
      <div class="asset-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="资产生命周期" name="lifecycle">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>资产登记采购</span>
                    </div>
                    <div class="data-item">
                      <p>资产登记管理</p>
                      <p>资产采购管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>资产使用维护</span>
                    </div>
                    <div class="data-item">
                      <p>资产领用调拨</p>
                      <p>资产维护记录</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>资产处置</span>
                    </div>
                    <div class="data-item">
                      <p>资产报废管理</p>
                      <p>处置记录管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="资产台账" name="account">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>固定资产</span>
                    </div>
                    <div class="data-item">
                      <p>固定资产台账</p>
                      <p>资产分类管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>教学设备</span>
                    </div>
                    <div class="data-item">
                      <p>教学设备台账</p>
                      <p>设备分类管理</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card>
                    <div slot="header">
                      <span>办公设备</span>
                    </div>
                    <div class="data-item">
                      <p>办公设备台账</p>
                      <p>设备分类管理</p>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="资产分析" name="analysis">
            <div class="tab-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>使用分析</span>
                    </div>
                    <div class="data-item">
                      <p>资产使用统计</p>
                      <p>维护成本分析</p>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card>
                    <div slot="header">
                      <span>资产共享</span>
                    </div>
                    <div class="data-item">
                      <p>校内资产共享</p>
                      <p>资产租赁管理</p>
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
  name: 'Asset',
  data() {
    return {
      activeTab: 'lifecycle'
    }
  }
}
</script>

<style scoped>
.asset-content {
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
