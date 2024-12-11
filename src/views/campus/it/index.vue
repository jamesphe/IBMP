<template>
  <div class="app-container">
    <div v-if="$route.path === '/campus/it/index'">
      <!-- 统计数据卡片 -->
      <el-row :gutter="24">
        <el-col :span="6" v-for="(item, index) in statsCards" :key="index">
          <div class="data-card">
            <div class="data-header">
              <div class="title">{{ item.title }}</div>
              <div class="value" :class="item.valueType">{{ item.value }}</div>
            </div>
            <div class="data-body">
              <div class="data-item" v-for="(stat, idx) in item.stats" :key="idx">
                <span>{{ stat.label }}</span>
                <span :class="['value', stat.type]">{{ stat.value }}</span>
              </div>
            </div>
            <div class="data-footer">
              <el-link type="primary" @click="$router.push(item.path)">
                查看详情 <i class="el-icon-arrow-right" />
              </el-link>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <el-button
          v-for="(action, index) in quickActions"
          :key="index"
          :type="action.type || 'primary'"
          :icon="action.icon"
          size="medium"
          @click="handleQuickAction(action)"
        >
          {{ action.name }}
        </el-button>
      </div>

      <!-- 系统状态监控 -->
      <el-row :gutter="24" style="margin-top: 24px">
        <el-col :span="16">
          <el-card class="chart-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title">事件处理趋势</span>
              <el-date-picker
                v-model="dateRange"
                style="float: right; width: 260px"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                @change="handleDateChange"
              />
            </div>
            <div ref="eventChart" style="height: 320px" />
          </el-card>

          <el-card class="chart-card" shadow="hover" style="margin-top: 24px">
            <div slot="header" class="clearfix">
              <span class="card-title">SLA达成率趋势</span>
            </div>
            <div ref="slaChart" style="height: 320px" />
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 待办事项 -->
          <el-card class="todo-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title">待办事项</span>
              <el-link type="primary" style="float: right">查看全部</el-link>
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="(todo, index) in todoList"
                :key="index"
                :type="todo.type"
                :timestamp="todo.time"
                size="normal"
              >
                <span class="todo-content">{{ todo.content }}</span>
              </el-timeline-item>
            </el-timeline>
          </el-card>

          <!-- 系统公告 -->
          <el-card class="notice-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="card-title">系统公告</span>
              <el-link type="primary" style="float: right">查看全部</el-link>
            </div>
            <div class="notice-list">
              <div v-for="(notice, index) in noticeList" :key="index" class="notice-item">
                <div class="notice-title">{{ notice.title }}</div>
                <div class="notice-time">{{ notice.time }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <router-view />
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ITManagement',
  data() {
    return {
      dateRange: [],
      statsCards: [
        {
          title: '待处理事件',
          value: '12',
          path: '/campus/it/event/register',
          stats: [
            { label: '高优先级', value: '3', type: 'danger' },
            { label: '今日新增', value: '5' }
          ]
        },
        {
          title: '进行中工单',
          value: '8',
          path: '/campus/it/workorder/process',
          stats: [
            { label: '超时工单', value: '2', type: 'danger' },
            { label: '今日完成', value: '6', type: 'success' }
          ]
        },
        {
          title: 'SLA达成率',
          value: '98.5%',
          path: '/campus/it/service/sla',
          stats: [
            { label: '响应达成', value: '99.2%' },
            { label: '解决达成', value: '97.8%' }
          ]
        },
        {
          title: '设备状态',
          value: '156',
          path: '/campus/it/device/loan',
          stats: [
            { label: '借用中', value: '23', type: 'warning' },
            { label: '库存预警', value: '5', type: 'danger' }
          ]
        }
      ],
      quickActions: [
        { name: '登记事件', icon: 'el-icon-plus', path: '/campus/it/event/register' },
        { name: '创建工单', icon: 'el-icon-document-add', path: '/campus/it/workorder/create' },
        { name: '设备借用', icon: 'el-icon-connection', path: '/campus/it/device/loan' },
        { name: '备份管理', icon: 'el-icon-refresh', path: '/campus/it/backup' }
      ],
      todoList: [
        { content: '待处理高优先级事件 IT2024001', time: '10:30', type: 'warning' },
        { content: '服务器备份计划待审批', time: '09:15', type: 'primary' },
        { content: '设备借用申请待审核', time: '昨天', type: 'info' }
      ],
      noticeList: [
        { title: '关于系统升级维护的通知', time: '2024-01-10' },
        { title: '新版服务目录发布通知', time: '2024-01-09' },
        { title: 'IT服务台春节放假安排', time: '2024-01-08' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeDestroy() {
    if (this.eventChart) {
      this.eventChart.dispose()
    }
    if (this.slaChart) {
      this.slaChart.dispose()
    }
  },
  methods: {
    handleQuickAction(action) {
      this.$router.push(action.path)
    },
    handleDateChange() {
      this.initCharts()
    },
    initCharts() {
      // 确保 DOM 元素存在
      if (!this.$refs.eventChart || !this.$refs.slaChart) {
        return
      }
      const eventChart = echarts.init(this.$refs.eventChart)
      const slaChart = echarts.init(this.$refs.slaChart)
      
      // 保存图表实例以便销毁
      this.eventChart = eventChart
      this.slaChart = slaChart
      
      // 初始化事件趋势图
      eventChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['新增事件', '处理事件'] },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '新增事件',
            type: 'line',
            smooth: true,
            data: [5, 8, 3, 9, 6, 4, 7]
          },
          {
            name: '处理事件',
            type: 'line',
            smooth: true,
            data: [4, 6, 5, 8, 5, 5, 6]
          }
        ]
      })

      // 初始化SLA达成率图
      slaChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['响应达成率', '解决达成率'] },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          axisLabel: { formatter: '{value}%' }
        },
        series: [
          {
            name: '响应达成率',
            type: 'line',
            smooth: true,
            data: [99, 98, 99.5, 98.8, 99.2, 99.6, 99]
          },
          {
            name: '解决达成率',
            type: 'line',
            smooth: true,
            data: [98, 97.5, 98.2, 97.8, 98.5, 98, 97.8]
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 使用设计规范中的颜色变量
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$border-color: #EBEEF5;

.data-card {
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  height: 100%;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }

  .data-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 14px;
      color: $text-regular;
    }

    .value {
      font-size: 28px;
      font-weight: 500;
      color: $text-primary;

      &.success { color: $success-color; }
      &.warning { color: $warning-color; }
      &.danger { color: $error-color; }
    }
  }

  .data-body {
    .data-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      color: $text-regular;
      font-size: 14px;

      .value {
        font-weight: 500;
        &.danger { color: $error-color; }
        &.warning { color: $warning-color; }
        &.success { color: $success-color; }
      }
    }
  }

  .data-footer {
    margin-top: 16px;
    text-align: right;
  }
}

.quick-actions {
  margin: 24px 0;
  .el-button {
    margin-right: 12px;
    padding: 9px 16px;
  }
}

.chart-card {
  .el-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid $border-color;
  }

  .card-title {
    font-size: 16px;
    font-weight: 500;
    color: $text-primary;
  }
}

.todo-card, .notice-card {
  margin-bottom: 24px;

  .el-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid $border-color;
  }

  .todo-content {
    color: $text-regular;
    font-size: 14px;
  }
}

.notice-list {
  .notice-item {
    padding: 12px 0;
    border-bottom: 1px solid $border-color;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .notice-title {
      color: $text-primary;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .notice-time {
      font-size: 12px;
      color: $text-secondary;
    }
  }
}

// 响应式布局
@media screen and (max-width: 1400px) {
  .data-card {
    padding: 20px;
    
    .data-header .value {
      font-size: 24px;
    }
  }
}
</style>
