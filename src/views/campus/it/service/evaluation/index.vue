<template>
  <div class="service-evaluation">
    <!-- 评价统计 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div slot="header">总体满意度</div>
          <div class="satisfaction-rate">
            {{ satisfactionRate }}%
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header">评价总数</div>
          <div class="total-count">
            {{ totalCount }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评价列表 -->
    <el-table :data="evaluationList">
      <el-table-column prop="serviceId" label="服务编号"/>
      <el-table-column prop="serviceName" label="服务名称"/>
      <el-table-column prop="score" label="评分"/>
      <el-table-column prop="comment" label="评价内容"/>
      <el-table-column prop="createTime" label="评价时间"/>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      satisfactionRate: 95,
      totalCount: 128,
      evaluationList: [
        {
          id: 1,
          serviceId: 'NET_001',
          serviceName: '网络故障报修',
          score: 5,
          comment: '服务很及时',
          createTime: '2024-01-01 10:00:00'
        },
        {
          id: 2,
          serviceId: 'DEV_001',
          serviceName: '设备故障报修',
          score: 4,
          comment: '处理效果不错',
          createTime: '2024-01-02 14:30:00'
        }
      ]
    }
  },
  created() {
    // 可以在这里初始化更多模拟数据
  }
}
</script> 