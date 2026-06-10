import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '@/types'
import { mockOrders, delay } from '@/mock/data'

export const useOrderStore = defineStore('order', () => {
  const list = ref<Order[]>([...mockOrders])
  const total = ref(mockOrders.length)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 10, keyword: '', status: '' as any, payType: '' })
  const current = ref<Order | null>(null)

  async function loadData() {
    loading.value = true
    await delay(null, 300)
    let data = [...mockOrders]
    if (query.value.keyword) {
      const k = query.value.keyword
      data = data.filter((o) => o.orderNo.includes(k) || o.customer.includes(k))
    }
    if (query.value.status !== '') {
      data = data.filter((o) => o.status === Number(query.value.status))
    }
    if (query.value.payType) {
      data = data.filter((o) => o.payType === query.value.payType)
    }
    total.value = data.length
    const start = (query.value.page - 1) * query.value.pageSize
    list.value = data.slice(start, start + query.value.pageSize)
    loading.value = false
  }

  async function create(item: Omit<Order, 'id' | 'createTime'>) {
    await delay(null, 300)
    const newItem: Order = {
      ...item,
      id: Date.now(),
      createTime: new Date().toISOString().slice(0, 10)
    } as Order
    mockOrders.unshift(newItem)
    await loadData()
    return newItem
  }

  async function update(item: Order) {
    await delay(null, 300)
    const idx = mockOrders.findIndex((o) => o.id === item.id)
    if (idx > -1) {
      mockOrders[idx] = { ...mockOrders[idx], ...item }
    }
    await loadData()
  }

  async function remove(ids: number[]) {
    await delay(null, 300)
    ids.forEach((id) => {
      const idx = mockOrders.findIndex((o) => o.id === id)
      if (idx > -1) mockOrders.splice(idx, 1)
    })
    await loadData()
  }

  return { list, total, loading, query, current, loadData, create, update, remove }
})
