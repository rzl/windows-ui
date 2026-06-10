import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { mockUsers, delay } from '@/mock/data'

export const useUserStore = defineStore('user', () => {
  const list = ref<User[]>([...mockUsers])
  const total = ref(mockUsers.length)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 10, keyword: '', status: '' as any })
  const current = ref<User | null>(null)

  async function loadData() {
    loading.value = true
    await delay(null, 300)
    let data = [...list.value]
    if (query.value.keyword) {
      const k = query.value.keyword
      data = data.filter((u) => u.username.includes(k) || u.nickname.includes(k) || u.email.includes(k))
    }
    if (query.value.status !== '') {
      data = data.filter((u) => u.status === Number(query.value.status))
    }
    total.value = data.length
    const start = (query.value.page - 1) * query.value.pageSize
    list.value = data.slice(start, start + query.value.pageSize)
    loading.value = false
  }

  async function create(item: Omit<User, 'id' | 'createTime'>) {
    await delay(null, 300)
    const newItem: User = {
      ...item,
      id: Date.now(),
      createTime: new Date().toISOString().slice(0, 10)
    } as User
    mockUsers.unshift(newItem)
    await loadData()
    return newItem
  }

  async function update(item: User) {
    await delay(null, 300)
    const idx = mockUsers.findIndex((u) => u.id === item.id)
    if (idx > -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...item }
    }
    await loadData()
  }

  async function remove(ids: number[]) {
    await delay(null, 300)
    ids.forEach((id) => {
      const idx = mockUsers.findIndex((u) => u.id === id)
      if (idx > -1) mockUsers.splice(idx, 1)
    })
    await loadData()
  }

  return { list, total, loading, query, current, loadData, create, update, remove }
})
