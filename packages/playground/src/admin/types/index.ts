export interface User {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  role: string
  avatar: string
  createTime: string
}

export interface Article {
  id: number
  title: string
  author: string
  category: string
  status: number
  tags: string[]
  content: string
  publishTime: string
  createTime: string
}

export interface Order {
  id: number
  orderNo: string
  customer: string
  amount: number
  status: number
  payType: string
  createTime: string
}

export interface MenuItem {
  name: string
  path: string
  label: string
  icon?: string
  children?: MenuItem[]
  permissions?: string[]
}

export interface Role {
  id: number
  name: string
  code: string
  permissions: string[]
  description: string
}

export interface CrudField {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'datetime' | 'number' | 'textarea' | 'radio' | 'checkbox' | 'switch'
  searchable?: boolean
  listable?: boolean
  editable?: boolean
  required?: boolean
  options?: { label: string; value: any }[]
  rules?: any[]
}

export interface CrudConfig {
  name: string
  fields: CrudField[]
}
