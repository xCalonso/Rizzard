<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
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
      <v-list-item @click="$router.push({ path: '/juegos' })">
        <v-list-item-avatar>
          <v-icon> mdi-gamepad-variant </v-icon>
        </v-list-item-avatar>
        <span>Juegos</span>
      </v-list-item>
      <v-list-item @click="$router.push({ path: '/nube' })">
        <v-list-item-avatar>
          <v-icon> mdi-cloud-download </v-icon>
        </v-list-item-avatar>
        <span>Nube</span>
      </v-list-item>
    </v-navigation-drawer>

    
    <v-main>
      <v-toolbar style="position: sticky; top: 0; z-index: 20" color="primary" dark flat>
        <v-btn v-if="$route.name != 'Home'" class="mx-1" icon dark @click="$router.push({path: '/'})">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h2>{{$route.name}}</h2>
      </v-toolbar>
      <router-view class="ma-6"></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    //
  }),
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  }
};
</script>
