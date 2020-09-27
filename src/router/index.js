import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Basic from '../views/Basic.vue'
import Getters from '../views/Getters'
import Mutations from '../views/Mutations'
import Actions from '../views/Actions'
import Modules from '../views/Modules'
import FormHandling from '../views/FormHandling'

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
  },
  {
    path: '/actions',
    component: Actions
  },
  {
    path: '/modules',
    component: Modules
  },
  {
    path: '/form-handling',
    component: FormHandling
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
