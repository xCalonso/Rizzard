import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Biblioteca from '../views/Biblioteca.vue'
import Usuarios from '../views/Usuarios.vue'
import Juegos from '../views/Juegos.vue'
import Nube from '../views/Nube.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/biblioteca',
    name: 'Biblioteca',
    component: Biblioteca
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios
  },
  {
    path: '/juegos',
    name: 'Juegos',
    component: Juegos
  },
  {
    path: '/nube',
    name: 'Nube',
    component: Nube
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
