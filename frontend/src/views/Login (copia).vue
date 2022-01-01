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
                              name="login"
                              label="Login"
                              type="text"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              name="password"
                              label="Password"
                              type="password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="InicioSesion" color="primary">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-content>
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
      password: ""
    },
    
    success: {
      IS_15: false
    },
    
    error: {
      IS_15: false,
    },
  }),
  
  methods: {
    async InicioSesion(){
      this.success.IS_15 = false
      this.error.IS_15 = false
      
      try{
        await axios.post(`${url}/api/login`, this.IS_15)
        localStorage.user = this.IS_15.user
        this.success.IS_15 = true
      } catch (err) {
        this.error.IS_15 = true
      }
      this.$router.push({ path: '/'})
      this.$router.go(1)
    },
  }
}
</script>
