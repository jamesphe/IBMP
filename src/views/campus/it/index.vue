<template>
  <div class="app-container">
    <!-- 事件与工单管理 -->
    <h4 class="module-title">事件与工单管理</h4>
    <el-row :gutter="20" class="module-row">
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/event/register')">
          <div class="card-item">
            <i class="el-icon-warning" />
            <div class="card-title">事件管理</div>
            <div class="card-desc">事件登记、分类、处理记录与统计</div>
            <div class="card-tags">
              <el-tag size="mini">事件登记</el-tag>
              <el-tag size="mini" type="success">优先级分配</el-tag>
              <el-tag size="mini" type="warning">状态跟踪</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/workorder')">
          <div class="card-item">
            <i class="el-icon-document" />
            <div class="card-title">工单管理</div>
            <div class="card-desc">工单创建、分配、处理与统计</div>
            <div class="card-tags">
              <el-tag size="mini">工单创建</el-tag>
              <el-tag size="mini" type="success">处理跟踪</el-tag>
              <el-tag size="mini" type="warning">审批流程</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 服务管理 -->
    <h4 class="module-title">服务管理</h4>
    <el-row :gutter="20" class="module-row">
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/service/sla')">
          <div class="card-item">
            <i class="el-icon-s-data" />
            <div class="card-title">服务级别管理</div>
            <div class="card-desc">SLA定义、监控与统计分析</div>
            <div class="card-tags">
              <el-tag size="mini">SLA指标</el-tag>
              <el-tag size="mini" type="success">实时监控</el-tag>
              <el-tag size="mini" type="warning">达成统计</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/service/catalog')">
          <div class="card-item">
            <i class="el-icon-s-operation" />
            <div class="card-title">服务目录管理</div>
            <div class="card-desc">服务条目创建、审批与统计</div>
            <div class="card-tags">
              <el-tag size="mini">目录维护</el-tag>
              <el-tag size="mini" type="success">条目审批</el-tag>
              <el-tag size="mini" type="warning">使用统计</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资产与设备管理 -->
    <h4 class="module-title">资产与设备管理</h4>
    <el-row :gutter="20" class="module-row">
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/device/loan')">
          <div class="card-item">
            <i class="el-icon-monitor" />
            <div class="card-title">设备借用管理</div>
            <div class="card-desc">设备借用申请、审批与归还</div>
            <div class="card-tags">
              <el-tag size="mini">借用申请</el-tag>
              <el-tag size="mini" type="success">状态跟踪</el-tag>
              <el-tag size="mini" type="warning">归还管理</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/device/asset')">
          <div class="card-item">
            <i class="el-icon-box" />
            <div class="card-title">资产专项管理</div>
            <div class="card-desc">耗材、库存、合同与供应商管理</div>
            <div class="card-tags">
              <el-tag size="mini">耗材管理</el-tag>
              <el-tag size="mini" type="success">库存管理</el-tag>
              <el-tag size="mini" type="warning">合同管理</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 配置与备份管理 -->
    <h4 class="module-title">配置与备份管理</h4>
    <el-row :gutter="20" class="module-row">
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/config')">
          <div class="card-item">
            <i class="el-icon-setting" />
            <div class="card-title">配置变更管理</div>
            <div class="card-desc">配置变更记录与审批管理</div>
            <div class="card-tags">
              <el-tag size="mini">变更记录</el-tag>
              <el-tag size="mini" type="success">硬件配置</el-tag>
              <el-tag size="mini" type="warning">网络拓扑</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="grid-content" shadow="hover" @click.native="$router.push('/campus/it/backup')">
          <div class="card-item">
            <i class="el-icon-refresh" />
            <div class="card-title">备份恢复管理</div>
            <div class="card-desc">数据备份计划与系统恢复</div>
            <div class="card-tags">
              <el-tag size="mini">备份计划</el-tag>
              <el-tag size="mini" type="success">执行记录</el-tag>
              <el-tag size="mini" type="warning">恢复管理</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ITManagement'
}
</script>

<style lang="scss" scoped>
.module-title {
  margin: 20px 0;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
  color: #303133;
}

.module-row {
  margin-bottom: 20px;
}

.grid-content {
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    transition: all 0.3s;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
}

.card-item {
  text-align: center;
  padding: 20px;

  i {
    font-size: 32px;
    color: #409EFF;
    margin-bottom: 10px;
  }

  .card-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .card-desc {
    font-size: 12px;
    color: #909399;
    margin-bottom: 12px;
    height: 34px;
  }

  .card-tags {
    .el-tag {
      margin: 0 4px;
    }
  }
}
</style>
