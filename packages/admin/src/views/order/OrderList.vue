<template>
  <div class="list-page">
    <w-card header="订单管理">
      <div class="search-bar">
        <w-input v-model="store.query.keyword" placeholder="搜索订单号/客户" prefix-icon="search" />
        <w-select v-model="store.query.status" :options="statusOptions" placeholder="状态" clearable style="width:120px" />
        <w-select v-model="store.query.payType" :options="payTypeOptions" placeholder="支付方式" clearable style="width:120px" />
        <w-button type="primary" @click="crud.handleSearch">查询</w-button>
        <w-button @click="crud.handleReset">重置</w-button>
      </div>

      <div class="toolbar">
        <w-button v-if="auth.hasPermission('order:create')" type="primary" @click="crud.openDialog('新增订单')">+ 新增</w-button>
        <w-button v-if="auth.hasPermission('order:delete')" type="danger" :disabled="crud.selectedIds.length===0" @click="crud.handleBatchDelete">批量删除</w-button>
      </div>

      <w-table
        :data="store.list"
        :columns="columns"
        stripe
        border
        @selection-change="crud.handleSelectionChange"
      >
        <template #amount="{ row }">
          <span style="color:#d92b2b;font-weight:bold">¥{{ row.amount }}</span>
        </template>
        <template #status="{ row }">
          <w-tag :type="statusType(row.status)">{{ statusText(row.status) }}</w-tag>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('order:edit')" size="small" @click="crud.openDialog('编辑订单', row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('order:delete')" size="small" type="danger" @click="crud.handleDelete(row)">删除</w-button>
          </w-space>
        </template>
      </w-table>

      <w-pagination
        :current-page="store.query.page"
        :page-size="store.query.pageSize"
        :total="store.total"
        @update:current-page="crud.handlePageChange"
      />
    </w-card>

    <w-dialog v-model="crud.dialogVisible" :title="crud.dialogTitle" width="520">
      <w-form :model="crud.formModel">
        <w-form-item label="订单号">
          <w-input v-model="crud.formModel.orderNo" />
        </w-form-item>
        <w-form-item label="客户">
          <w-input v-model="crud.formModel.customer" />
        </w-form-item>
        <w-form-item label="金额">
          <w-input-number v-model="crud.formModel.amount" :min="0" :step="0.01" />
        </w-form-item>
        <w-form-item label="支付方式">
          <w-select v-model="crud.formModel.payType" :options="payTypeOptions.filter(o=>o.value)" />
        </w-form-item>
        <w-form-item label="状态">
          <w-select v-model="crud.formModel.status" :options="statusOptions.filter(o=>o.value!=='')" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="crud.closeDialog">取消</w-button>
        <w-button type="primary" @click="crud.handleSave">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '@/stores/order'
import { useAuthStore } from '@/stores/auth'
import { useCrud } from '@/composables/useCrud'

const store = useOrderStore()
const auth = useAuthStore()
const crud = useCrud(store)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '待付款', value: 0 },
  { label: '已付款', value: 1 },
  { label: '已发货', value: 2 },
  { label: '已完成', value: 3 }
]
const payTypeOptions = [
  { label: '全部', value: '' },
  { label: '支付宝', value: '支付宝' },
  { label: '微信', value: '微信' },
  { label: '银行卡', value: '银行卡' }
]

const columns = [
  { type: 'selection', width: 48 },
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'orderNo', label: '订单号' },
  { prop: 'customer', label: '客户' },
  { prop: 'amount', label: '金额' },
  { prop: 'payType', label: '支付方式' },
  { prop: 'status', label: '状态' },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

function statusText(status: number) {
  return ['待付款', '已付款', '已发货', '已完成'][status] || '未知'
}
function statusType(status: number) {
  return ['warning', 'success', 'primary', 'info'][status] || 'default'
}
</script>

<style scoped>
.list-page { padding: 8px; }
.search-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
