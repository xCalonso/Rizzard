import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Biblioteca from '../views/Biblioteca.vue'
import Usuarios from '../views/Usuarios.vue'
import Juegos from '../views/Juegos.vue'
import Nube from '../views/Nube.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

Vue.use(VueRouter)

/*function existToken() {
    return !!localStorage.token;
}

VueRouter.beforeEach((to, from, next) => {
    if (to.path != '/login' && existToken()) {
        next();
    } else {
        next('/login');
    }
});*/



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login', 
    name: 'Login',
    component: Login, 
    beforeEnter: (to, from, next) => { 
      delete localStorage.token;
      next();  
    } 
  },
  {
    path: '/register', 
    name: 'Register',
    component: Register, 
    beforeEnter: (to, from, next) => { 
      delete localStorage.token;
      next();  
    } 
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
