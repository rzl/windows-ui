<template>
  <div class="list-page">
    <w-card header="文章管理">
      <div class="search-bar">
        <w-input v-model="store.query.keyword" placeholder="搜索标题/作者" prefix-icon="search" />
        <w-select v-model="store.query.category" :options="categoryOptions" placeholder="分类" clearable style="width:120px" />
        <w-select v-model="store.query.status" :options="statusOptions" placeholder="状态" clearable style="width:120px" />
        <w-button type="primary" @click="crud.handleSearch">查询</w-button>
        <w-button @click="crud.handleReset">重置</w-button>
      </div>

      <div class="toolbar">
        <w-button v-if="auth.hasPermission('article:create')" type="primary" @click="crud.openDialog('新增文章')">+ 新增</w-button>
        <w-button v-if="auth.hasPermission('article:delete')" type="danger" :disabled="crud.selectedIds.length===0" @click="crud.handleBatchDelete">批量删除</w-button>
      </div>

      <w-table
        :data="store.list"
        :columns="columns"
        stripe
        border
        @selection-change="crud.handleSelectionChange"
      >
        <template #status="{ row }">
          <w-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '已发布' : '草稿' }}</w-tag>
        </template>
        <template #tags="{ row }">
          <w-space wrap>
            <w-tag v-for="tag in row.tags" :key="tag" size="small" type="info">{{ tag }}</w-tag>
          </w-space>
        </template>
        <template #action="{ row }">
          <w-space>
            <w-button v-if="auth.hasPermission('article:edit')" size="small" @click="crud.openDialog('编辑文章', row)">编辑</w-button>
            <w-button v-if="auth.hasPermission('article:delete')" size="small" type="danger" @click="crud.handleDelete(row)">删除</w-button>
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

    <w-dialog v-model="crud.dialogVisible" :title="crud.dialogTitle" width="600">
      <w-form :model="crud.formModel">
        <w-form-item label="标题">
          <w-input v-model="crud.formModel.title" />
        </w-form-item>
        <w-form-item label="作者">
          <w-input v-model="crud.formModel.author" />
        </w-form-item>
        <w-form-item label="分类">
          <w-select v-model="crud.formModel.category" :options="categoryOptions.filter(o=>o.value)" />
        </w-form-item>
        <w-form-item label="标签">
          <w-input-tag v-model="crud.formModel.tags" />
        </w-form-item>
        <w-form-item label="内容">
          <w-input v-model="crud.formModel.content" type="textarea" :rows="4" />
        </w-form-item>
        <w-form-item label="状态">
          <w-switch v-model="crud.formModel.status" :active-text="'已发布'" :inactive-text="'草稿'" />
        </w-form-item>
      </w-form>
      <template #footer>
        <w-button @click="crud.closeDialog">取消</w-button>
        <w-button type="primary" @click="handleSave">确定</w-button>
      </template>
    </w-dialog>
  </div>
</template>

<script setup lang="ts">
import { useArticleStore } from '@/stores/article'
import { useAuthStore } from '@/stores/auth'
import { useCrud } from '@/composables/useCrud'

const store = useArticleStore()
const auth = useAuthStore()
const crud = useCrud(store)

const categoryOptions = [
  { label: '全部', value: '' },
  { label: '技术', value: '技术' },
  { label: '生活', value: '生活' },
  { label: '新闻', value: '新闻' },
  { label: '教程', value: '教程' },
  { label: '随笔', value: '随笔' }
]
const statusOptions = [
  { label: '全部', value: '' },
  { label: '已发布', value: '1' },
  { label: '草稿', value: '0' }
]

const columns = [
  { type: 'selection', width: 48 },
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '标题' },
  { prop: 'author', label: '作者' },
  { prop: 'category', label: '分类' },
  { prop: 'tags', label: '标签' },
  { prop: 'status', label: '状态' },
  { prop: 'publishTime', label: '发布时间' },
  { prop: 'action', label: '操作', width: 140, fixed: 'right' }
]

async function handleSave() {
  const model = JSON.parse(JSON.stringify(crud.formModel))
  model.status = model.status ? 1 : 0
  if (model.id) await store.update(model)
  else await store.create(model)
  crud.closeDialog()
}
</script>

<style scoped>
.list-page { padding: 8px; }
.search-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.toolbar { margin-bottom: 12px; display: flex; gap: 8px; }
</style>
