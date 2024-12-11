<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务分类</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddCategory"
            >
              新增分类
            </el-button>
          </div>
          <el-tree
            :data="categoryTree"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddService"
            >
              新增服务
            </el-button>
          </div>
          <el-table :data="serviceList" style="width: 100%">
            <el-table-column prop="name" label="服务名称" />
            <el-table-column prop="category" label="所属分类" width="120" />
            <el-table-column prop="sla" label="SLA级别" width="120">
              <template slot-scope="{row}">
                <el-tag :type="row.sla | slaFilter">{{ row.sla }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status === '启用' ? 'success' : 'info'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{row}">
                <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="text" size="small" style="color: #F56C6C" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ServiceCatalog',
  filters: {
    slaFilter(sla) {
      const slaMap = {
        '一级': 'danger',
        '二级': 'warning',
        '三级': 'info'
      }
      return slaMap[sla]
    }
  },
  data() {
    return {
      categoryTree: [{
        label: '基础服务',
        children: [{
          label: '网络服务'
        }, {
          label: '系统服务'
        }]
      }, {
        label: '应用服务',
        children: [{
          label: '业务系统'
        }, {
          label: '办公软件'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      serviceList: [
        {
          name: '网络故障报修',
          category: '网络服务',
          sla: '一级',
          status: '启用'
        },
        {
          name: '系统账号申请',
          category: '系统服务',
          sla: '二级',
          status: '启用'
        }
      ]
    }
  },
  methods: {
    handleNodeClick(data) {
      // 实现节点点击逻辑
    },
    handleAddCategory() {
      // 实现新增分类逻辑
    },
    handleAddService() {
      // 实现新增服务逻辑
    },
    handleEdit(row) {
      // 实现编辑服务逻辑
    },
    handleDelete(row) {
      // 实现删除服务逻辑
    }
  }
}
</script>
