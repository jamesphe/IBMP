<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">
        新增事件
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
      <el-table-column label="事件编号" prop="id" align="center" width="120" />
      <el-table-column label="事件标题" prop="title" align="center" min-width="150" />
      <el-table-column label="事件类型" align="center" width="120">
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
      <el-table-column label="报告人" prop="reporter" align="center" width="120" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="temp.priority" class="filter-item">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述事件"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'EventRegister',
  components: { Pagination },
  filters: {
    typeFilter(type) {
      const typeMap = {
        hardware: 'warning',
        software: 'success',
        network: 'danger',
        other: 'info'
      }
      return typeMap[type]
    },
    typeNameFilter(type) {
      const typeMap = {
        hardware: '硬件故障',
        software: '软件故障',
        network: '网络故障',
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
        limit: 10
      },
      typeOptions: [
        { label: '硬件故障', value: 'hardware' },
        { label: '软件故障', value: 'software' },
        { label: '网络故障', value: 'network' },
        { label: '其他', value: 'other' }
      ],
      priorityOptions: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ],
      temp: {
        id: undefined,
        title: '',
        type: '',
        priority: '',
        status: 'pending',
        description: '',
        reporter: '',
        createTime: new Date()
      },
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑事件',
        create: '新增事件'
      },
      rules: {
        title: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
        priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
        description: [{ required: true, message: '请输入事件描述', trigger: 'blur' }]
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
            id: 'IT2024001',
            title: '无法访问内网系统',
            type: 'network',
            priority: 'high',
            status: 'pending',
            reporter: '张三',
            createTime: '2024-01-10 10:30:00'
          }
        ]
        this.total = 1
        this.listLoading = false
      }, 1000)
    },
    handleCreate() {
      this.temp = {
        id: undefined,
        title: '',
        type: '',
        priority: '',
        status: 'pending',
        description: '',
        reporter: '',
        createTime: new Date()
      }
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 这里应该调用后端API创建数据
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 这里应该调用后端API更新数据
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该事件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里应该调用后端API删除数据
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
