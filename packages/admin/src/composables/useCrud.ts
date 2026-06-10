import { ref, reactive } from 'vue'

export function useCrud(store: any, options: { immediate?: boolean } = {}) {
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增')
  const formModel = reactive<any>({})
  const selectedIds = ref<number[]>([])

  function openDialog(title: string, row?: any) {
    dialogTitle.value = title
    Object.keys(formModel).forEach((k) => delete formModel[k])
    if (row) {
      Object.assign(formModel, JSON.parse(JSON.stringify(row)))
    }
    dialogVisible.value = true
  }

  function closeDialog() {
    dialogVisible.value = false
    Object.keys(formModel).forEach((k) => delete formModel[k])
  }

  async function handleSearch() {
    store.query.page = 1
    await store.loadData()
  }

  async function handleReset() {
    store.query.keyword = ''
    store.query.status = ''
    store.query.category = ''
    store.query.payType = ''
    store.query.page = 1
    await store.loadData()
  }

  async function handlePageChange(page: number) {
    store.query.page = page
    await store.loadData()
  }

  async function handleSizeChange(size: number) {
    store.query.pageSize = size
    store.query.page = 1
    await store.loadData()
  }

  async function handleSave() {
    const model = JSON.parse(JSON.stringify(formModel))
    if (model.id) {
      await store.update(model)
    } else {
      await store.create(model)
    }
    closeDialog()
  }

  async function handleDelete(row: any) {
    await store.remove([row.id])
  }

  async function handleBatchDelete() {
    if (selectedIds.value.length === 0) return
    await store.remove(selectedIds.value)
    selectedIds.value = []
  }

  function handleSelectionChange(rows: any[]) {
    selectedIds.value = rows.map((r) => r.id)
  }

  if (options.immediate !== false) {
    store.loadData()
  }

  return reactive({
    dialogVisible,
    dialogTitle,
    formModel,
    selectedIds,
    openDialog,
    closeDialog,
    handleSearch,
    handleReset,
    handlePageChange,
    handleSizeChange,
    handleSave,
    handleDelete,
    handleBatchDelete,
    handleSelectionChange
  })
}
