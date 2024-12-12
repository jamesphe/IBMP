<template>
  <div class="app-container">
    <!-- 筛选条件 -->
    <div class="filter-container">
      <el-select v-model="listQuery.status" placeholder="审批状态" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="待审批" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
      />
    </div>

    <!-- 审批列表 -->
    <el-table
      v-loading="listLoading"
      :data="approvalList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="申请编号" width="120" align="center" />
      <el-table-column prop="serviceName" label="服务名称" min-width="150" />
      <el-table-column prop="type" label="变更类型" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type === '新增' ? 'success' : 'warning'">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人" width="120" align="center" />
      <el-table-column prop="applyTime" label="申请时间" width="160" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-button 
            v-if="row.status === '待审批'"
            type="text" 
            @click="handleApprove(row)"
          >
            审批
          </el-button>
          <el-button type="text" @click="handleDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 审批对话框 -->
    <el-dialog 
      title="服务条目审批" 
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="approvalForm" :model="approvalForm" label-width="100px">
        <el-form-item label="审批结果">
          <el-radio-group v-model="approvalForm.result">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input
            type="textarea"
            v-model="approvalForm.comment"
            :rows="4"
            placeholder="请输入审批意见"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApproval">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CatalogApproval',
  data() {
    return {
      listLoading: false,
      listQuery: {
        status: '',
        dateRange: []
      },
      approvalList: [
        {
          id: 'AP2024001',
          serviceName: '系统账号申请',
          type: '新增',
          applicant: '张三',
          applyTime: '2024-01-15 10:30:00',
          status: '待审批'
        },
        {
          id: 'AP2024002',
          serviceName: '网络故障报修',
          type: '修改',
          applicant: '李四',
          applyTime: '2024-01-15 14:20:00',
          status: '已通过'
        },
        {
          id: 'AP2024003',
          serviceName: '设备借用申请',
          type: '新增',
          applicant: '王五',
          applyTime: '2024-01-15 16:45:00',
          status: '已拒绝'
        }
      ],
      dialogVisible: false,
      approvalForm: {
        result: 'approved',
        comment: ''
      },
      currentRow: null
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待审批': 'warning',
        '已通过': 'success',
        '已拒绝': 'danger'
      }
      return statusMap[status]
    },
    handleApprove(row) {
      this.currentRow = row
      this.dialogVisible = true
      this.approvalForm = {
        result: 'approved',
        comment: ''
      }
    },
    handleDetail(row) {
      this.$message.info('查看详情：' + row.serviceName)
    },
    submitApproval() {
      if (!this.approvalForm.comment) {
        this.$message.warning('请输入审批意见')
        return
      }
      // 模拟审批操作
      const index = this.approvalList.findIndex(item => item.id === this.currentRow.id)
      if (index > -1) {
        this.approvalList[index].status = this.approvalForm.result === 'approved' ? '已通过' : '已拒绝'
      }
      this.dialogVisible = false
      this.$message.success('审批成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 20px;
  
  .filter-item {
    margin-right: 10px;
    width: 200px;
  }
}
</style> 