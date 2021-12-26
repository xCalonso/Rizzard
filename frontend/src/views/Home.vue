<template>
  <div class="home">
    <div class="display-2">Dashboard de RIZZARD X</div>
    <v-layout wrap class="mt-8">
      <v-card class="pa-6 mr-3" hover @click="$router.push({ name: 'Biblioteca' })">
        <v-layout justify-center>
          <v-icon size="100" color="black">
            mdi-bookshelf
          </v-icon>
        </v-layout>
        <v-card-title>Biblioteca</v-card-title>
      </v-card>
      <v-card class="pa-6 mr-3" hover @click="$router.push({ name: 'Usuarios' })">
        <v-layout justify-center>
          <v-icon size="100" color="black">
            mdi-account-check
          </v-icon>
        </v-layout>
        <v-card-title>Usuarios</v-card-title>
      </v-card>
      <v-card class="pa-6 mr-3" hover @click="$router.push({ name: 'Juegos' })">
        <v-layout justify-center>
          <v-icon size="100" color="black">
            mdi-gamepad-variant
          </v-icon>
        </v-layout>
        <v-card-title>Juegos</v-card-title>
      </v-card>
      <v-card class="pa-6 mr-3" hover @click="$router.push({ name: 'Nube' })">
        <v-layout justify-center>
          <v-icon size="100" color="black">
            mdi-cloud-download
          </v-icon>
        </v-layout>
        <v-card-title>Nube</v-card-title>
      </v-card>
    </v-layout>
  </div>
</template>

<script>

export default {
  name: 'Home',
}
</script>
