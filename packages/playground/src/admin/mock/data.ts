import type { User, Article, Order, Role, MenuItem } from '@/types'

export const mockUsers: User[] = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  nickname: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `138${String(10000000 + i).slice(1)}`,
  status: i % 5 === 0 ? 0 : 1,
  role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'editor' : 'viewer',
  avatar: '',
  createTime: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
}))

export const mockArticles: Article[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  title: `文章标题 ${i + 1}`,
  author: `作者${(i % 5) + 1}`,
  category: ['技术', '生活', '新闻', '教程', '随笔'][i % 5],
  status: i % 4 === 0 ? 0 : 1,
  tags: ['Vue', 'React', 'Node.js'].slice(0, (i % 3) + 1),
  content: `这是文章 ${i + 1} 的内容...`,
  publishTime: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  createTime: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
}))

export const mockOrders: Order[] = Array.from({ length: 38 }, (_, i) => ({
  id: i + 1,
  orderNo: `ORD${String(100000 + i)}`,
  customer: `客户${(i % 8) + 1}`,
  amount: +(Math.random() * 1000 + 50).toFixed(2),
  status: [0, 1, 2, 3][i % 4],
  payType: ['支付宝', '微信', '银行卡'][i % 3],
  createTime: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
}))

export const mockRoles: Role[] = [
  { id: 1, name: '超级管理员', code: 'admin', permissions: ['*'], description: '全部权限' },
  { id: 2, name: '编辑', code: 'editor', permissions: ['dashboard', 'user:list', 'article:list', 'article:create', 'article:edit', 'order:list'], description: '内容管理' },
  { id: 3, name: '访客', code: 'viewer', permissions: ['dashboard', 'user:list', 'article:list', 'order:list'], description: '只读权限' }
]

export const mockMenus: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', label: '仪表盘', icon: 'home', permissions: ['dashboard'] },
  { name: 'UserList', path: '/user', label: '用户管理', icon: 'user', permissions: ['user:list'] },
  { name: 'ArticleList', path: '/article', label: '文章管理', icon: 'file', permissions: ['article:list'] },
  { name: 'OrderList', path: '/order', label: '订单管理', icon: 'cart', permissions: ['order:list'] },
  {
    name: 'Nested',
    path: '/nested',
    label: '多级菜单示例',
    icon: 'folder',
    permissions: ['dashboard'],
    children: [
      { name: 'NestedMenu1', path: '/nested/menu1', label: '菜单 1', permissions: ['dashboard'] },
      {
        name: 'NestedMenu2',
        path: '/nested/menu2',
        label: '菜单 2',
        permissions: ['dashboard'],
        children: [
          { name: 'NestedMenu2-1', path: '/nested/menu2/menu2-1', label: '菜单 2-1', permissions: ['dashboard'] },
          { name: 'NestedMenu2-2', path: '/nested/menu2/menu2-2', label: '菜单 2-2', permissions: ['dashboard'] }
        ]
      }
    ]
  },
  { name: 'Editor', path: '/editor', label: '富文本编辑器', icon: 'edit', permissions: ['dashboard'] }
]

export function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
