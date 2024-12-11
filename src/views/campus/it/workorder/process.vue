<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        placeholder="工单号/标题"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="工单类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="工单状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="工单号" prop="id" align="center" width="120" />
      <el-table-column label="工单标题" prop="title" align="center" min-width="150" />
      <el-table-column label="工单类型" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">{{ row.type | typeNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.priority | priorityFilter">
            {{ row.priority | priorityNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理人" prop="handler" align="center" width="120" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleProcess(row)">
            处理
          </el-button>
          <el-button type="success" size="mini" @click="handleClose(row)">
            关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 工单处理对话框 -->
    <el-dialog title="工单处理" :visible.sync="dialogVisible">
      <el-form
        ref="processForm"
        :model="processForm"
        :rules="processRules"
        label-width="80px"
      >
        <el-form-item label="处理说明" prop="comment">
          <el-input
            v-model="processForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-select v-model="processForm.result" placeholder="请选择处���结果">
            <el-option label="已解决" value="resolved" />
            <el-option label="未解决" value="unresolved" />
            <el-option label="需要协助" value="needHelp" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitProcess">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'WorkOrderProcess',
  components: { Pagination },
  filters: {
    typeFilter(type) {
      const typeMap = {
        hardware: 'warning',
        software: 'success',
        network: 'danger',
        service: 'info',
        other: ''
      }
      return typeMap[type]
    },
    typeNameFilter(type) {
      const typeMap = {
        hardware: '硬件故障',
        software: '软件故障',
        network: '网络故障',
        service: '服务请求',
        other: '其他'
      }
      return typeMap[type]
    },
    priorityFilter(priority) {
      const priorityMap = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
      }
      return priorityMap[priority]
    },
    priorityNameFilter(priority) {
      const priorityMap = {
        high: '高',
        medium: '中',
        low: '低'
      }
      return priorityMap[priority]
    },
    statusFilter(status) {
      const statusMap = {
        pending: 'info',
        processing: 'warning',
        resolved: 'success',
        closed: ''
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已解决',
        closed: '已关闭'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search: '',
        type: '',
        status: ''
      },
      typeOptions: [
        { value: 'hardware', label: '硬件故障' },
        { value: 'software', label: '软件故障' },
        { value: 'network', label: '网络故障' },
        { value: 'service', label: '服务请求' },
        { value: 'other', label: '其他' }
      ],
      statusOptions: [
        { value: 'pending', label: '待处理' },
        { value: 'processing', label: '处理中' },
        { value: 'resolved', label: '已解决' },
        { value: 'closed', label: '已关闭' }
      ],
      dialogVisible: false,
      processForm: {
        comment: '',
        result: ''
      },
      processRules: {
        comment: [
          { required: true, message: '请输入处理说明', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '请选择处理结果', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 这里应该调用后端API获取数据
      // 模拟数据
      setTimeout(() => {
        this.list = [
          {
            id: 'WO2024001',
            title: '系统无法访问',
            type: 'network',
            priority: 'high',
            status: 'pending',
            handler: '张三',
            createTime: '2024-01-10 10:30:00'
          }
        ]
        this.total = 1
        this.listLoading = false
      }, 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleProcess(row) {
      this.processForm = {
        comment: '',
        result: ''
      }
      this.dialogVisible = true
    },
    handleClose(row) {
      this.$confirm('确认关闭该工单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里调用后端API关闭工单
        this.$notify({
          title: '成功',
          message: '工单已关闭',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    submitProcess() {
      this.$refs.processForm.validate(valid => {
        if (valid) {
          // 这里调用后端API提交处理结果
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '处理结果已提交',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
  }
}
</style>
