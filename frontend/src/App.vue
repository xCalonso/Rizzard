<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <div v-if="!!user">
    <v-navigation-drawer app color="primary" dark>
      <v-layout class="my-6 mx-4" style="cursor: pointer;" align-center @click="$router.push({path: '/'})">
        <img src="./assets/rizzardx.png" alt="Rizzard" style="width: 40px; height: 40px; margin-right: 8px">
        <h1 style="font-weight: 800; color:white">RIZZARD X</h1>
      </v-layout>
      <v-list-item @click="$router.push({ path: '/biblioteca' })">
        <v-list-item-avatar>
          <v-icon> mdi-bookshelf </v-icon>
        </v-list-item-avatar>
        <span>Biblioteca</span>
      </v-list-item>
      <v-list-item @click="$router.push({ path: '/usuarios' })">
        <v-list-item-avatar>
          <v-icon> mdi-account-check </v-icon>
        </v-list-item-avatar>
        <span>Usuarios</span>
      </v-list-item>
    <div v-if="!!admin">
      <v-list-item @click="$router.push({ path: '/juegos' })">
        <v-list-item-avatar>
          <v-icon> mdi-gamepad-variant </v-icon>
        </v-list-item-avatar>
        <span>Juegos</span>
      </v-list-item>
    </div>
      <v-list-item @click="$router.push({ path: '/nube' })">
        <v-list-item-avatar>
          <v-icon> mdi-cloud-download </v-icon>
        </v-list-item-avatar>
        <span>Nube</span>
      </v-list-item>
    </v-navigation-drawer>
    </div>
    
    <v-main>
      <v-toolbar style="position: sticky; top: 0; z-index: 20" color="primary" dark flat>
        <v-btn v-if="$route.name != 'Home' && $route.name != 'Login' && $route.name != 'Sign up'" class="mx-1" icon dark @click="$router.back()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>      
        <h2>{{$route.name}}</h2>
        
        
        
        <v-spacer></v-spacer>
        <v-btn v-if="$route.name != 'Login' && $route.name != 'Sign up'" @click="Logout" color="secondary">Logout</v-btn>
        
      </v-toolbar>
      <router-view class="ma-6"></router-view>
      <v-btn v-if="$route.path == '/reset' && !!admin" @click="Reset" color="secondary" :style="{left: '50%', transform:'translateX(-50%)'}">Reset</v-btn>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
//const url = 'http://localhost:8080'
const url = 'https://rizzard-x.herokuapp.com'

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    user: "",
    admin: "",

    buena:false,

    logout: {
      user: "",
      fecha_fin: "",
      hora_fin: "",
    }
  }),
  
  created(){
    this.user = localStorage.getItem('user')
    this.admin = localStorage.admin

    if (this.user)
      this.ComprobarUser()
  },
  
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },

  methods: {
    async Logout() {
      try{
        this.logout.fecha_fin = (new Date(Date.now())).toISOString().substr(0, 10)
        this.logout.hora_fin = new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()
        this.logout.user = this.user
        await axios.post(`${url}/api/login/logout`, this.logout)
        this.$router.push({path: '/login'})
        this.$router.forward()
        this.$router.go()
      } catch (err){
        console.log(err)
      }
    },

    async ComprobarUser(){
      try {
        this.buena = (await axios.get(`${url}/api/login/comprobar/${this.user}`, this.user)).data.buena
        if (!this.buena){
          this.$router.push({path: '/login'})
          this.$router.forward()
          this.$router.go()
        }
      } catch (err){
        console.log(err)
      }
    } 
  }
};
</script>
