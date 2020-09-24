import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Basic from '../views/Basic.vue'
import Getters from '../views/Getters'
import Mutations from '../views/Mutations'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/basic',
    name: 'Basic',
    component: Basic
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/getters',
    name: 'Getters',
    component: Getters
  },
  {
    path: '/mutations',
    component: Mutations
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
