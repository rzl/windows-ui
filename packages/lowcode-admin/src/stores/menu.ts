import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as menuApi from '@/api/menu'

export interface MenuItem {
  id: number
  parent_id: number
  name: string
  path: string
  component?: string
  title: string
  icon?: string
  sort: number
  status: number
  permission?: string
  children?: MenuItem[]
}

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuItem[]>([])

  async function loadMenus() {
    const result = await menuApi.getMenuTree()
    menus.value = result || []
  }

  return {
    menus,
    loadMenus
  }
})
