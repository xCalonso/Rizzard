<template>
    <div id="nube">
        <div class="display-1 font-weight-bold mt-6 mb-2"> Subir Partida (10) </div>
        <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[field_not_empty]" v-model="SP_10.n_juego" placeholder="Nombre del Juego" outlined></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="SP_10.n_partida" placeholder="Nombre de la Partida" outlined></v-text-field>
            <v-text-field :rules="[unidades_positivas]" v-model="SP_10.horas_jugadas" placeholder="Horas Jugadas" type="number" outlined suffix="unidades"></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="SP_10.estado" placeholder="Estado" outlined></v-text-field>
        </div>
        <v-alert v-if="success.SP_10" text type="success" >La partida se ha subido con éxito</v-alert>
        <v-alert v-if="error.SP_10" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="SubirPartida" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">SUBIR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Descargar Partida (11) </div>
        <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[unidades_positivas]" v-model="DP_11.id_partida" placeholder="Identificador de Partida" type="number" outlined suffix="unidades"></v-text-field>
        </div>
        <v-alert v-if="success.DP_11" text type="success" >La partida se descargará en breves instantes</v-alert>
        <v-alert v-if="error.DP_11" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="DescargarPartida" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">DESCARGAR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Compartir Partida (12) </div>
        <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[field_not_empty]" v-model="CP_12.n_amigo" placeholder="Nombre del Usuario Amigo" outlined required></v-text-field>
            <v-text-field :rules="[unidades_positivas]" v-model="CP_12.id_partida" placeholder="Identificador de Partida" type="number" outlined suffix="unidades"></v-text-field>
        </div>
        <v-alert v-if="success.CP_12" text type="success" >La partida se compartió con éxito</v-alert>
        <v-alert v-if="error.CP_12" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="CompartirPartida" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">COMPARTIR</v-btn>
    </div>
</template>


// <v-row justify="space-around" align="center"><v-date-picker v-model="SP_10.fecha"></v-date-picker><v-time-picker v-model="SP_10.hora_guardado" use-seconds></v-time-picker></v-row>


<script>
import axios from 'axios'
// eslint-disable-next-line no-unused-vars
const url = 'https://rizzard-x.herokuapp.com/#'

export default {
  data: () => ({
    SP_10: {
      n_usuario: "",
      n_juego: "",
      n_partida: "",
      fecha: (new Date(Date.now())).toISOString().substr(0, 10),
      hora_guardado: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds(),
      horas_jugadas: null,
      estado: "",
    },
    
    DP_11: {
      n_usuario: "",
      id_partida: null,
    },
    
    CP_12: {
      n_usuario: "",
      n_amigo: "",
      id_partida: null
    },
    
    success: {
      SP_10: false,
      DP_11: false,
      CP_12: false,
    },
    
    error: {
      SP_10: false,
      DP_11: false,
      CP_12: false,
    },
  
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede ser vacío",
    precio_positivo   : (value) => value > 0 ? true: "El precio debe ser positivo",
    unidades_positivas: (value) => value > 0 ? true: "El número de unidades debe ser positivo",
  }),
  
  methods: {
    async SubirPartida(){
      this.success.SP_10 = false
      this.error.SP_10 = false
      
      try {
        await axios.post('${url}/api/nube/subir', this.SP_10)
        this.succes.SP_10 = true
      } catch (err) {
        this.error.SP_10 = true
      }
    },
    
    async DescargarPartida(){
      this.success.DP_11 = false
      this.error.DP_11 = false
      
      try{
        await axios.post('${url}/api/nube/descargar', this.DP_11)
        this.succes.DP_11 = true
      } catch (err) {
        this.error.DP_11 = true
      }
    },
    
    async CompartirPartida(){
      this.succes.CP_12 = false
      this.error.CP_12 = false
      
      try{
        await axios.post('${url}/api/nube/compartir', this.CP_12)
        this.success.CP_12 = true
      } catch (err) {
        this.error.CP_12 = true
      }
    },
  }
}
</script>
