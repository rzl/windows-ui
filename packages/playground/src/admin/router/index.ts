import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/views/layout/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘', permission: 'dashboard' }
      },
      {
        path: 'user',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户管理', permission: 'user:list' }
      },
      {
        path: 'article',
        name: 'ArticleList',
        component: () => import('@/views/article/ArticleList.vue'),
        meta: { title: '文章管理', permission: 'article:list' }
      },
      {
        path: 'order',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue'),
        meta: { title: '订单管理', permission: 'order:list' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/Profile.vue'),
        meta: { title: '个人中心', permission: 'dashboard' }
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('@/views/editor/EditorPage.vue'),
        meta: { title: '富文本编辑器', permission: 'dashboard' }
      },
      {
        path: 'nested',
        name: 'Nested',
        redirect: '/nested/menu1',
        meta: { title: '多级菜单示例', permission: 'dashboard' },
        children: [
          {
            path: 'menu1',
            name: 'NestedMenu1',
            component: () => import('@/views/nested/Menu1.vue'),
            meta: { title: '菜单 1', permission: 'dashboard' }
          },
          {
            path: 'menu2',
            name: 'NestedMenu2',
            redirect: '/nested/menu2/menu2-1',
            meta: { title: '菜单 2', permission: 'dashboard' },
            children: [
              {
                path: 'menu2-1',
                name: 'NestedMenu2-1',
                component: () => import('@/views/nested/Menu2-1.vue'),
                meta: { title: '菜单 2-1', permission: 'dashboard' }
              },
              {
                path: 'menu2-2',
                name: 'NestedMenu2-2',
                component: () => import('@/views/nested/Menu2-2.vue'),
                meta: { title: '菜单 2-2', permission: 'dashboard' }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('@/views/error/Error401.vue'),
    meta: { public: true }
  },
  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/views/error/Error404.vue'),
    meta: { public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/Error404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
