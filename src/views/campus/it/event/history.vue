<template>
  <div class="app-container">
    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="listQuery" size="medium">
        <!-- 搜索表单 -->
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
      >
        <!-- 表格列配置 -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'EventHistory',
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        dateRange: [],
        type: '',
        status: ''
      }
    }
  }
}
</script> 