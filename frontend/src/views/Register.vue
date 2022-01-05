<template>
  <div id="register">
    <v-content>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Sign up</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                             :rules="[field_not_empty]"
                             name="username"
                             label="Usuario"
                             v-model="R_13.user"
                             type="text"
                             required
                           ></v-text-field>
                           <v-text-field
                             :rules="[field_not_empty]"
                             id="password"
                             name="password"
                             label="Contraseña"
                             v-model="R_13.password"
                             type="password"
                             required
                           ></v-text-field>
                           <v-text-field
                             :rules="[field_not_empty]"
                             id="password"
                             name="conf_password"
                             label="Confirmar Contraseña"
                             v-model="R_13.conf_password"
                             type="password"
                             required
                           ></v-text-field>
                           <input type="checkbox" :checked="admin" v-model="admin">
                             Es una cuenta de administrador
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                       <v-btn @click="$router.push({path: '/login'})" color="primary">Login</v-btn>
                       <v-spacer></v-spacer>
                       <v-btn @click="SignUp" color="primary">Sign up</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-content>
      <v-alert v-if="error.R_13" text type="error">Compruebe que ha introducido correctamente sus datos.</v-alert>
     
  </div>
</template>



<script>
import axios from 'axios'
//const url = 'http://localhost:8080'
const url = 'https://rizzard-x.herokuapp.com'

export default {
  data: () => ({
    R_13: {
      user: "",
      password: "",
      conf_password: "",
    },
    
    admin: false,
    
    success: {
    },
    
    error: {
      R_13: false,
    },
    
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede estar vacío",
  }),
  
  methods: {
     async SignUp(){
      this.error.R_13 = false
      
      if (this.password == this.conf_password){
        try{
          if (this.admin){
            await axios.post(`${url}/api/register-admin`, this.R_13)   
            localStorage.setItem('admin', this.R_13.user)
          } else {
            await axios.post(`${url}/api/register`, this.R_13)
          }
          localStorage.setItem('user', this.R_13.user)
          this.$router.push({ path: '/'})
          this.$router.forward()
          this.$router.go()
        } catch (err) {
          this.error.R_13 = true
        }
      } else {
        this.error.R_13 = true
      }
    },
  }
}
</script>
