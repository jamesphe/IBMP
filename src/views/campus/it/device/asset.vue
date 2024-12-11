<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <!-- 耗材管理 -->
      <el-tab-pane label="耗材管理" name="consumables">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>耗材库存</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddConsumable"
            >
              入库登记
            </el-button>
          </div>
          <el-table :data="consumablesList" style="width: 100%">
            <el-table-column prop="name" label="耗材名称" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="quantity" label="当前库存" width="120" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="warning" label="库存预警" width="120">
              <template slot-scope="{row}">
                <el-tag :type="row.quantity <= row.warning ? 'danger' : 'success'">
                  {{ row.warning }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleOutbound(row)">出库</el-button>
                <el-button type="success" size="mini" @click="handleInbound(row)">入库</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 合同管理 -->
      <el-tab-pane label="合同管理" name="contracts">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>合同列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddContract"
            >
              新增合同
            </el-button>
          </div>
          <el-table :data="contractsList" style="width: 100%">
            <el-table-column prop="id" label="合同编号" width="120" />
            <el-table-column prop="name" label="合同名称" />
            <el-table-column prop="supplier" label="供应商" width="150" />
            <el-table-column prop="startDate" label="开始日期" width="120" />
            <el-table-column prop="endDate" label="到期日期" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status | contractStatusFilter">
                  {{ row.status | contractStatusNameFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="handleViewContract(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 供应商管理 -->
      <el-tab-pane label="供应商管理" name="suppliers">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>供应商列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleAddSupplier"
            >
              新增供应商
            </el-button>
          </div>
          <el-table :data="suppliersList" style="width: 100%">
            <el-table-column prop="name" label="供应商名称" />
            <el-table-column prop="contact" label="联系人" width="120" />
            <el-table-column prop="phone" label="联系电话" width="150" />
            <el-table-column prop="rating" label="评分" width="120">
              <template slot-scope="{row}">
                <el-rate v-model="row.rating" disabled />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="handleEditSupplier(row)">编辑</el-button>
                <el-button type="text" style="color: #F56C6C" @click="handleDeleteSupplier(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'AssetManagement',
  filters: {
    contractStatusFilter(status) {
      const statusMap = {
        active: 'success',
        expiring: 'warning',
        expired: 'danger'
      }
      return statusMap[status]
    },
    contractStatusNameFilter(status) {
      const statusMap = {
        active: '生效中',
        expiring: '即将到期',
        expired: '已过期'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      activeTab: 'consumables',
      consumablesList: [
        {
          name: '打印纸',
          type: '办公用品',
          quantity: 50,
          unit: '包',
          warning: 20
        },
        {
          name: '硒鼓',
          type: '打印耗材',
          quantity: 5,
          unit: '个',
          warning: 10
        }
      ],
      contractsList: [
        {
          id: 'CT2024001',
          name: '打印机维保合同',
          supplier: '某某科技有限公司',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'active'
        }
      ],
      suppliersList: [
        {
          name: '某某科技有限公司',
          contact: '李四',
          phone: '13800138000',
          rating: 4
        }
      ]
    }
  },
  methods: {
    handleAddConsumable() {
      // 实现耗材入库登记
    },
    handleOutbound(row) {
      // 实现耗材出库
    },
    handleInbound(row) {
      // 实现耗材入库
    },
    handleAddContract() {
      // 实现新增合同
    },
    handleViewContract(row) {
      // 实现查看合同
    },
    handleAddSupplier() {
      // 实现新增供应商
    },
    handleEditSupplier(row) {
      // 实现编辑供应商
    },
    handleDeleteSupplier(row) {
      // 实现删除供应商
    }
  }
}
</script>
