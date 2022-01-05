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

function existUser() {
    return !!localStorage.getItem('user');
}

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
      delete localStorage.user;
      delete localStorage.admin;
      next();  
    } 
  },
  {
    path: '/register', 
    name: 'Sign up',
    component: Register, 
    beforeEnter: (to, from, next) => { 
      delete localStorage.user;
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


router.beforeEach((to, from, next) => {
    if (to.path == '/register') {
      next();
    } else if (to.path != '/login' && !existUser()) {
      next({ path : '/login' });
    } else {
      next();
    }
});
export default router
