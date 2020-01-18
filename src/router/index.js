import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/Index.vue'
import Home from '@/views/Home.vue'
import Demo from '@/views/Demo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/demo',
    name: 'demo',
    component: Home
  },
  {
    path: '/demo2',
    name: 'demo2',
    component: Demo
  }
]

const router = new VueRouter({
  routes
})

export default router
