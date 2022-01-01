<template>
    <div id="juegos">
      <div class="display-1 font-weight-bold mt-6 mb-2">Dar de Alta Juego (19)</div>
        <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[field_not_empty]" v-model="DAJ_19.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="DAJ_19.categoria" placeholder="Categoria" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="DAJ_19.instalador" placeholder="Instalador" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="DAJ_19.niveles" placeholder="Niveles de Recompensas" outlined required></v-text-field>
            <v-text-field :rules="[unidades_positivas]" v-model="DAJ_19.pegi" placeholder="PEGI" type="number" outlined suffix="unidades"></v-text-field>
            <v-text-field :rules="[unidades_positivas]" v-model="DAJ_19.licencia" placeholder="Licencia" type="number" outlined suffix="unidades"></v-text-field>
            <v-text-field :rules="[precio_positivo]" v-model="DAJ_19.precio" placeholder="Precio" type="number" outlined suffix="€"></v-text-field>
        </div>
        <v-alert v-if="success.DAJ_19" text type="success" >El juego ha sido dado de alto con éxito</v-alert>
        <v-alert v-if="error.DAJ_19" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="DarAltaJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Dar de alta</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2">Dar de Baja Juego (20)</div>
        <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[field_not_empty]" v-model="DBJ_20.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.DBJ_20" text type="success" >El juego ha sido dado de baja con éxito</v-alert>
        <v-alert v-if="error.DBJ_20" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="DarBajaJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Dar de baja</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2">Listar Juegos (21)</div>
        <v-alert v-if="error.LJ_21" text type="error">Ha ocurrido un error. No existen juegos en la Base de Datos.</v-alert>
        <v-btn @click="ListarJuegos" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">ListarJuegos</v-btn>
        
      <v-simple-table v-if="lista">
        <thead>
          <tr>
            <th class="text-left">
              nombreJuego
            </th>
            <th class="text-left">
              Categoria
            </th>
            <th class="text-left">
              Pegi
            </th>
            <th class="text-left">
              Instalador
            </th>
            <th class="text-left">
              nivelesRecompensa
            </th>
            <th class="text-left">
              Licencia
            </th>
            <th class="text-left">
              Precio
            </th>
            <th class="text-left">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in lista" :key="value">
            <td>{{value.nombreJuego}}</td> 
            <td>{{value.Categoria}}</td>
            <td>{{value.Pegi}}</td>
            <td>{{value.Instalador}}</td>
            <td>{{value.nivelesRecompensa}}</td>
            <td>{{value.Licencia}}</td>
            <td>{{value.Precio}}</td>
            <td>{{value.Estado.data}}</td>
          </tr>
        </tbody>
    </v-simple-table>
    </div>
</template>



<script>
import axios from 'axios'
const url = 'http://localhost:8080'
//const url = 'https://rizzard-x.herokuapp.com'

export default {
  data: () => ({
    DAJ_19: {
      n_juego: "",
      categoria: "",
      pegi: null,
      instalador: "",
      niveles: "",
      licencia: null,
      precio: null,
    },
    
    DBJ_20: {
      n_juego: "",
    },
    
    LJ_21: {
      n_usuario: "",
      n_amigo: "",
      id_partida: null
    },
    
    lista: null,
    consulta: null,
    
    success: {
      DAJ_19: false,
      DBJ_20: false,
    },
    
    error: {
      DAJ_19: false,
      DBJ_20: false,
      LJ_21: false,
    },
  
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede ser vacío",
    precio_positivo   : (value) => value >= 0 ? true: "El precio debe ser positivo",
    unidades_positivas: (value) => value > 0 ? true: "El número de unidades debe ser positivo",
  }),
  
  methods: {
    async DarAltaJuego(){
      this.success.DAJ_19 = false
      this.error.DAJ_19 = false
      
      try{
        await axios.post(`${url}/api/juegos/alta`, this.DAJ_19)
        this.success.DAJ_19 = true
      } catch (err) {
        this.error.DAJ_19 = true
      }
    },
    
    async DarBajaJuego(){
      this.success.DBJ_20 = false
      this.error.DBJ_20 = false
      
      try{
        await axios.put(`${url}/api/juegos/${this.DBJ_20.n_juego}`, this.DBJ_20)
        this.success.DBJ_20 = true
      } catch (err) {
        this.error.DBJ_20 = true
      }
    },
    
    async ListarJuegos(){
      this.error.LJ_21 = false
      this.consulta = 0
      
      try{
        this.lista = (await axios.get(`${url}/api/juegos/${this.consulta}}`)).data
      } catch (err) {
        this.error.LJ_21 = true
      }
    }
  }
}
</script>
