<template>
    <div id="usuarios">
      <div class="display-1 font-weight-bold mt-6 mb-2">Puntos del Usuario</div>
      <v-alert v-if="error.P" text type="error">Ha ocurrido un error.</v-alert>
      <v-btn @click="Puntos" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">PUNTOS</v-btn>

      <v-simple-table v-if="lista">
        <thead>
          <tr>
            <th class="text-left">
              Puntos
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in lista" :key="value">
            <td>{{value.Puntos}}</td> 
          </tr>
        </tbody>
    </v-simple-table>


      <div class="display-1 font-weight-bold mt-6 mb-2">Agregar Amigo (17)</div>
      <div style="max-width: 900px; margin: 0 auto">
          <v-text-field :rules="[field_not_empty]" v-model="AA_17.n_amigo" placeholder="Nombre de Usuario" outlined></v-text-field>
      </div>
      <v-alert v-if="success.AA_17" text type="success" >Se ha añadido un nuevo amigo.</v-alert>
      <v-alert v-if="error.AA_17" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
      <v-btn @click="AgregarAmigo" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Agregar</v-btn>
      
      
      <div class="display-1 font-weight-bold mt-6 mb-2">Borrar Amigo (18)</div>
      <div style="max-width: 900px; margin: 0 auto">
          <v-text-field :rules="[field_not_empty]" v-model="EA_18.n_amigo" placeholder="Nombre de Usuario" outlined></v-text-field>
      </div>
      <v-alert v-if="success.EA_18" text type="success" >Se ha borrado de la lista de amigos correctamente.</v-alert>
      <v-alert v-if="error.EA_18" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
      <v-btn @click="EliminarAmigo" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Borrar</v-btn>


      <div class="display-1 font-weight-bold mt-6 mb-2">Lista de Amigos</div>
      <v-alert v-if="error.P" text type="error">Ha ocurrido un error.</v-alert>
      <v-btn @click="Amigos" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">LISTAR</v-btn>

      <v-simple-table v-if="lista2">
        <thead>
          <tr>
            <th class="text-left">
              nombreUsuario1
            </th>
            <th class="text-left">
              nombreUsuario2
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in lista2" :key="value">
            <td>{{value.nombreUsuario1}}</td> 
            <td>{{value.nombreUsuario2}}</td>
          </tr>
        </tbody>
    </v-simple-table>


      <div class="display-1 font-weight-bold mt-6 mb-2">Eliminar Cuenta (14)</div>
      <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[field_not_empty]" type="password" v-model="EC_14.pass" placeholder="Contraseña" outlined></v-text-field>
      </div>
      <v-alert v-if="success.EC_17" text type="success" >Se ha borrado la cuenta con éxito, volviendo a la página principal.</v-alert>
      <v-alert v-if="error.EC_17" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
      <v-btn @click="EliminarCuenta" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Eliminar Cuenta</v-btn>
  </div>
</template>


<script>
import axios from 'axios'
const url = 'http://localhost:8080'
//const url = 'https://rizzard-x.herokuapp.com'

export default {
  data: () => ({ 
    lista: null,
    lista2: null,
    consulta: null,

    EC_14: {
      pass: "",
      fecha: "",
      hora: ""
    },    
    AA_17: {
      n_amigo: "",
    },
    EA_18: {
      n_amigo: "",
    },
    
    success: {
      EC_14: false,
      AA_17: false,
      EA_18: false
    },
    
    error: {
      P: false,
      A: false,
      EC_14: false,
      AA_17: false,
      EA_18: false,
    },
  
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede estar vacío",
    precio_positivo   : (value) => value > 0 ? true: "El precio debe ser positivo",
    unidades_positivas: (value) => value > 0 ? true: "El número de unidades debe ser positivo",
  }),
  
  methods: {
    async Puntos(){
      this.error.P = false

      try {
        this.lista = (await axios.get(`${url}/api/usuarios/puntos/${this.consulta}}`)).data
      } catch (err) {
        this.error.P = true
      }
    },

    async Amigos(){
      this.error.A = false

      try{
        this.lista2 = (await axios.get(`${url}/api/usuarios/amigos/${this.consulta}}`)).data
      } catch (err) {
        this.error.A = true
      }
    },

    async AgregarAmigo(){
      this.success.AA_17 = false
      this.error.AA_17 = false
      
      try{
        await axios.put(`${url}/api/usuarios/agregar/${this.AA_17.n_amigo}`, this.AA_17)
        this.success.AA_17 = true
      } catch (err) {
        this.error.AA_17 = true
      }
    },
    
    async EliminarAmigo(){
      this.success.EA_18 = false
      this.error.EA_18 = false
      
      try{
        await axios.put(`${url}/api/usuarios/borrar/${this.EA_18.n_amigo}`, this.EA_18)
        this.success.EA_18 = true
      } catch (err) {
        this.error.EA_18 = true
      }
    },
    
    async EliminarCuenta(){
      this.success.EC_14 = false
      this.error.EC_14 = false
      
      try{
        this.EC_14.fecha = (new Date(Date.now())).toISOString().substr(0, 10)
        this.EC_14.hora = new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()
        await axios.post(`${url}/usuarios/eliminar`, this.EC_14)
        this.success.EC_14 = true
      } catch (err) {
        this.error.EC_14 = true
      }
      
      if (this.success.EC_14){
        this.$router.push({ path: '/login'})
        this.$router.forward()
        this.$router.go()
      }
    },
  }
}
</script>
