import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../views/Layout.vue'
import Home from '../pages/Home.vue'
import BasicPage from '../pages/BasicPage.vue'
import FormPage from '../pages/FormPage.vue'
import DataPage from '../pages/DataPage.vue'
import NavPage from '../pages/NavPage.vue'
import FeedbackPage from '../pages/FeedbackPage.vue'
import OthersPage from '../pages/OthersPage.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'basic', name: 'Basic', component: BasicPage },
      { path: 'form', name: 'Form', component: FormPage },
      { path: 'data', name: 'Data', component: DataPage },
      { path: 'nav', name: 'Nav', component: NavPage },
      { path: 'feedback', name: 'Feedback', component: FeedbackPage },
      { path: 'others', name: 'Others', component: OthersPage },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
