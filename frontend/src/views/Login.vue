<template>
  <div id="login">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field label="Login" name="login"></v-text-field>
                  
                  <v-text-field id="password" label="Password" name="password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="handleLogin">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>



<script>
// eslint-disable-next-line no-unused-vars
const url = 'https://rizzard-x.herokuapp.com/#'

export default {
  data: function () {
      return {
        name:'',
        token:''
      }
    },
    
    created(){
      // Cuando se carga la página, el valor del token almacenado se obtiene localmente a través de localstorage
      this.token =  localStorage.getItem('token')
    },
    mounted() {
      this.$axios({
        method: 'get',
        url: '${url}/api/user',
        headers: {
          'Content-Type': "application/json;charset=UTF-8",
          // Coloque el token en el encabezado de la solicitud para solicitar. El 'Portador' aquí significa que el backend espera ser más seguro. Según la información proporcionada por el backend, puede ver si se agrega o no.
          'Authorization': 'Bearer ' + this.token,
        }
      })
      .then(res=>{       // Ejecuta la función después de que la solicitud sea exitosa
        if(res.data.code === 0){
          // Asignar un nombre de usuario después de que la solicitud sea exitosa
          this.name=res.data.data.username
          console.log("Inicio de sesión correcto")
        }else{
          console.log("Error de inicio de sesion")
        }
      })
      .catch (()=> {                 // Carta de ejecución tras error de solicitud
        console.log("Solicitud de error")
      })
    },
    
    handleLogin() {
      this.$axios({
        method: 'post',
        url: '/api/v1/login',
        headers: {
          'Content-Type': "application/json;charset=UTF-8",
        },
        data: {
          name: this.loginForm.username,
          password: this.loginForm.password
        }
      })
      .then(res=>{                    // Ejecuta la función después de que la solicitud sea exitosa
        if(res.data.code === 0){
          // Use localstorage para almacenar localmente
          localStorage.setItem("token",res.data.data.token)
          this.$router.push('/me')	// Verificación de inicio de sesión enrutamiento exitoso para lograr el salto
          console.log("Inicio de sesión correcto")
        }else{
          console.log("Error de inicio de sesion")
        }
      })
      .catch(()=>{                   // Carta de ejecución tras error de solicitud
        console.log("Solicitud de error")
      })
    },
}
</script>
