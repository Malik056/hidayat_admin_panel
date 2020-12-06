import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../pages/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/category',
    name: 'Category',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Category.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import(/* webpackChunkName: "about" */ '../pages/Playlist.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/bayan',
    name: 'Bayan',
    component: () => import(/* webpackChunkName: "about" */ '../pages/Bayan.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    if (to.name == "Login" && auth.currentUser) {
      next("/dashboard")
    }
    else next()
  }
})

export default router
