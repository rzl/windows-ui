import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/types'
import { mockArticles, delay } from '@/mock/data'

export const useArticleStore = defineStore('article', () => {
  const list = ref<Article[]>([...mockArticles])
  const total = ref(mockArticles.length)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 10, keyword: '', category: '', status: '' as any })
  const current = ref<Article | null>(null)

  async function loadData() {
    loading.value = true
    await delay(null, 300)
    let data = [...mockArticles]
    if (query.value.keyword) {
      const k = query.value.keyword
      data = data.filter((a) => a.title.includes(k) || a.author.includes(k))
    }
    if (query.value.category) {
      data = data.filter((a) => a.category === query.value.category)
    }
    if (query.value.status !== '') {
      data = data.filter((a) => a.status === Number(query.value.status))
    }
    total.value = data.length
    const start = (query.value.page - 1) * query.value.pageSize
    list.value = data.slice(start, start + query.value.pageSize)
    loading.value = false
  }

  async function create(item: Omit<Article, 'id' | 'createTime'>) {
    await delay(null, 300)
    const newItem: Article = {
      ...item,
      id: Date.now(),
      createTime: new Date().toISOString().slice(0, 10)
    } as Article
    mockArticles.unshift(newItem)
    await loadData()
    return newItem
  }

  async function update(item: Article) {
    await delay(null, 300)
    const idx = mockArticles.findIndex((a) => a.id === item.id)
    if (idx > -1) {
      mockArticles[idx] = { ...mockArticles[idx], ...item }
    }
    await loadData()
  }

  async function remove(ids: number[]) {
    await delay(null, 300)
    ids.forEach((id) => {
      const idx = mockArticles.findIndex((a) => a.id === id)
      if (idx > -1) mockArticles.splice(idx, 1)
    })
    await loadData()
  }

  return { list, total, loading, query, current, loadData, create, update, remove }
})
