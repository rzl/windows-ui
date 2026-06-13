import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import * as userApi from '@/api/user'
import type { UserQuery, UserForm } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const list = ref<any[]>([])
  const total = ref(0)
  const query = reactive<UserQuery>({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 10
  })

  async function loadData() {
    const result = await userApi.getUsers(query)
    list.value = result.list
    total.value = result.total
  }

  async function create(data: UserForm) {
    await userApi.createUser(data)
    await loadData()
  }

  async function update(data: UserForm) {
    await userApi.updateUser(data.id!, data)
    await loadData()
  }

  async function remove(ids: number[]) {
    await userApi.deleteUsers(ids)
    await loadData()
  }

  return {
    list,
    total,
    query,
    loadData,
    create,
    update,
    remove
  }
})
