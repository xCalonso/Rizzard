<template>
  <div id="login">
    <v-content>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                             :rules="[field_not_empty]"
                             name="login"
                             label="Usuario"
                             v-model="IS_15.user"
                             type="text"
                           ></v-text-field>
                           <v-text-field
                             :rules="[field_not_empty]"
                             id="password"
                             name="password"
                             label="Contraseña"
                             v-model="IS_15.password"
                             type="password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-btn @click="$router.push({path: '/register'})" color="primary">Sign up</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn @click="InicioSesion" color="primary">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-content>
      <v-alert v-if="error.IS_15" text type="error">Ha ocurrido un error.</v-alert>
     
  </div>
</template>



<script>
import axios from 'axios'
const url = 'http://localhost:8080'
//const url = 'https://rizzard-x.herokuapp.com'

export default {
  data: () => ({
    IS_15: {
      user: "",
      password: "",
      fecha: (new Date(Date.now())).toISOString().substr(0, 10),
      hora_inicio: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds(),
    },
    
    logeado: 0,
    
    success: {
    },
    
    error: {
      IS_15: false,
    },
    
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede estar vacío",
  }),
  
  methods: {
     async InicioSesion(){
      this.error.IS_15 = false
      try{
        await axios.post(`${url}/api/login`, this.IS_15)
        this.logeado = (await axios.get(`${url}/api/login/${this.IS_15.user}`)).data.valor
      } catch (err) {
        this.error.IS_15 = true
      }
      if (this.logeado > 0){
        if (this.logeado == 2){
          localStorage.setItem('admin', this.IS_15.user)
        }
        localStorage.setItem('user', this.IS_15.user)
        this.$router.push({ path: '/'})
        this.$router.forward()
        this.$router.go()
      } else {
        this.error.IS_15 = true
      }
    },
  }
}
</script>
