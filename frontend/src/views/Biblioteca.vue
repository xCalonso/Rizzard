<template>
    <div id="biblioteca">
        <div class="display-1 font-weight-bold mt-6 mb-2"> Listar Juegos Disponibles</div>
        <v-alert v-if="error.JC" text type="error">Ha ocurrido un error.</v-alert>
        <v-btn @click="JuegosComprar" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">LISTAR JUEGOS</v-btn>

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
                Precio
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="value in lista" :key="value">
              <td v-if="value.Estado.data == 1">{{value.nombreJuego}}</td> 
              <td v-if="value.Estado.data == 1">{{value.Categoria}}</td>
              <td v-if="value.Estado.data == 1">{{value.Pegi}}</td>
              <td v-if="value.Estado.data == 1">{{value.Precio}}€</td>
            </tr>
          </tbody>
        </v-simple-table>


        <div class="display-1 font-weight-bold mt-6 mb-2"> Comprar Juego (1)</div>
        <div style="max-width: 900px; margin: 0 auto">
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.nombre" placeholder="Nombre" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.apellidos" placeholder="Apellidos" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.direccion" placeholder="Dirección" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.telefono" placeholder="Número de teléfono" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.tarjeta" placeholder="Tarjeta de Crédito/Débito" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.caducidad" placeholder="Fecha de Caducidad" outlined required></v-text-field>
            <v-text-field :rules="[unidades_positivas]" v-model="CJ_1.cvv" placeholder="CVV" type="number" outlined required></v-text-field>
            <v-text-field :rules="[field_not_empty]" v-model="CJ_1.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
            <v-text-field :rules="[puntos_positivas]" v-model="CJ_1.puntos" placeholder="Puntos" type="number" outlined suffix="puntos"></v-text-field>
        </div>
        <v-alert v-if="success.CJ_1" text type="success" >El juego se ha comprado con éxito</v-alert>
        <v-alert v-if="error.CJ_1" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="ComprarJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">COMPRAR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Devolver Juego (2)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="DJ_2.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.DJ_2" text type="success" >El juego se ha devuelto con éxito</v-alert>
        <v-alert v-if="error.DJ_2" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="DevolverJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">DEVOLVER</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Actualizar Juego (3)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="AJ_3.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
           <v-text-field :rules="[field_not_empty]" v-model="AJ_3.directorio" placeholder="Directorio de Instalación" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.AJ_3" text type="success" >Se ha actualizado el juego con éxito</v-alert>
        <v-alert v-if="error.AJ_3" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="ActualizarJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">ACTUALIZAR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Instalar Juego (4)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="IJ_4.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
           <v-text-field :rules="[field_not_empty]" v-model="IJ_4.directorio" placeholder="Directorio de Instalación" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.IJ_4" text type="success" >Se ha instalado el juego con éxito</v-alert>
        <v-alert v-if="error.IJ_4" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="InstalarJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">INSTALAR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Desinstalar Juego (5)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="DIJ_5.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.DIJ_5" text type="success" >Se ha desinstalado el juego con éxito</v-alert>
        <v-alert v-if="error.DIJ_5" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="DesinstalarJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">DESINSTALAR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Compartir Biblioteca (6)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="CB_6.n_amigo" placeholder="Nombre del Amigo" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.CB_6" text type="success" >La biblioteca se ha compartido con éxito</v-alert>
        <v-alert v-if="error.CB_6" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="CompartirBiblioteca" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">COMPARTIR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Dejar de Compartir Biblioteca (7)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="DCB_7.n_amigo" placeholder="Nombre del Amigo" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.DCB_7" text type="success" >La biblioteca ha dejado de ser compartida</v-alert>
        <v-alert v-if="error.DCB_7" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="DejarCompartirBiblioteca" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">DEJAR DE COMPARTIR</v-btn>
        

        <div class="display-1 font-weight-bold mt-6 mb-2"> Juegos Comprados</div>
        <v-alert v-if="error.JC2" text type="error">Ha ocurrido un error.</v-alert>
        <v-btn @click="JuegosComprados" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">LISTAR JUEGOS</v-btn>

        <v-simple-table v-if="lista2">
          <thead>
            <tr>
              <th class="text-left">
                nombreJuego
              </th>
              <th class="text-left">
                Version
              </th>
              <th class="text-left">
                directorioInstalacion
              </th>
              <th class="text-left">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="value in lista2" :key="value">
              <td>{{value.nombreJuego}}</td> 
              <td>{{value.Version}}</td>
              <td>{{value.directorioInstalacion}}</td>
              <td>{{value.Estado}}</td>
            </tr>
          </tbody>
        </v-simple-table>

        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Lanzar Juego (8)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="LJ_8.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.LJ_8" text type="success" >Se ha iniciado el juego con éxito</v-alert>
        <v-alert v-if="error.LJ_8" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="LanzarJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">LANZAR</v-btn>
        
        
        <div class="display-1 font-weight-bold mt-6 mb-2"> Finalizar Juego (9)</div>
        <div style="max-width: 900px; margin: 0 auto">
           <v-text-field :rules="[field_not_empty]" v-model="FJ_9.n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
        </div>
        <v-alert v-if="success.FJ_9" text type="success" >Se ha finalizado el juego con éxito</v-alert>
        <v-alert v-if="error.FJ_9" text type="error">Ha ocurrido un error. Comprueba que los campos anteriores son correctos.</v-alert>
        <v-btn @click="FinalizarJuego" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">FINALIZAR</v-btn>
        
    </div>
</template>


<script>
import axios from 'axios'
//const url = 'http://localhost:8080'
const url = 'https://rizzard-x.herokuapp.com'

export default {
  data: () => ({
    lista: null,
    lista2: null,
    consulta: null,

    CJ_1: {
      n_juego: "",
      nombre: "",
      apellidos: "",
      direccion: "",
      telefono: "",
      puntos: 0,
      tarjeta: "",
      caducidad: "",
      cvv: "",
    },

    DJ_2: {
      n_juego: "",
    },

    AJ_3: {
      n_juego: "",
      directorio: "",
    },

    IJ_4: {
      n_juego: "",
      directorio: "",
    },

    DIJ_5: {
      n_juego: "",
    },

    CB_6: {
      n_amigo: "",
    },

    DCB_7:{
      n_amigo: "",
    },

    LJ_8: {
      n_juego: "",
    },

    FJ_9: {
      n_juego: "",
    },
    
    success: {
      CJ_1: false,
      DJ_2: false,
      AJ_3: false,
      IJ_4: false,
      DIJ_5: false,
      CB_6: false,
      DCB_7: false,
      LJ_8: false,
      FJ_9: false
    },
    
    error: {
      JC: false,
      JC2: false,
      CJ_1: false,
      DJ_2: false,
      AJ_3: false,
      IJ_4: false,
      DIJ_5: false,
      CB_6: false,
      DCB_7: false,
      LJ_8: false,
      FJ_9: false
    },
  
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede ser vacío",
    precio_positivo   : (value) => value > 0 ? true: "El precio debe ser positivo",
    unidades_positivas: (value) => value > 0 ? true: "El número de unidades debe ser positivo",
    puntos_positivas: (value) => value >= 0 ? true: "El número de puntos debe ser mayor o igual que 0",
  }),
  
  methods: {
    async JuegosComprar(){
      this.error.JC = false
      this.consulta = 0
      
      try{
        this.lista = (await axios.get(`${url}/api/biblioteca/${this.consulta}}`)).data
      } catch (err) {
        this.error.JC = true
      }
    },

    async JuegosComprados(){
      this.error.JC2 = false
      this.consulta = 0
      
      try{
        this.lista2 = (await axios.get(`${url}/api/biblioteca/comprados/${this.consulta}}`)).data
      } catch (err) {
        this.error.JC2 = true
      }
    },

    async ComprarJuego(){
      this.success.CJ_1 = false
      this.error.CJ_1 = false

      try{
        await axios.post(`${url}/api/biblioteca/comprar`, this.CJ_1)
        this.success.CJ_1 = true
      } catch (err){
        this.error.CJ_1 = true
      }
    },

    async DevolverJuego(){
      this.success.DJ_2 = false
      this.error.DJ_2 = false

      try{
        await axios.put(`${url}/api/biblioteca/devolver/${this.DJ_2.n_juego}`, this.DJ_2)
        this.success.DJ_2 = true
      } catch (err){
        this.error.DJ_2 = true
      }
    },

    async ActualizarJuego(){
      this.success.AJ_3 = false
      this.error.AJ_3 = false

      try{
        await axios.post(`${url}/api/biblioteca/actualizar`, this.AJ_3)
        this.success.AJ_3 = true
      } catch (err){
        this.error.AJ_3 = true
      }
    },

    async InstalarJuego(){
      this.success.IJ_4 = false
      this.error.IJ_4 = false

      try{
        await axios.post(`${url}/api/biblioteca/instalar`, this.IJ_4)
        this.success.IJ_4 = true
      } catch (err){
        this.error.IJ_4 = true
      }
    },

    async DesinstalarJuego(){
      this.success.DIJ_5 = false
      this.error.DIJ_5 = false

      try{
        await axios.put(`${url}/api/biblioteca/desintalar/${this.DIJ_5.n_juego}`, this.DIJ_5)
        this.success.DIJ_5 = true
      } catch (err){
        this.error.DIJ_5 = true
      }
    },

    async CompartirBiblioteca(){
      this.success.CB_6 = false
      this.error.CB_6 = false

      try{
        await axios.put(`${url}/api/biblioteca/compartir/${this.CB_6.n_amigo}`, this.CB_6)
        this.success.CB_6 = true
      } catch (err){
        this.error.CB_6 = true
      }
    },

    async DejarCompartirBiblioteca(){
      this.success.DCB_7 = false
      this.error.DCB_7 = false

      try{
        await axios.put(`${url}/api/biblioteca/dejarcompartir/${this.DCB_7.n_amigo}`, this.DCB_7)
        this.success.DCB_7 = true
      } catch (err){
        this.error.DCB_7 = true
      }
    },

    async LanzarJuego(){
      this.success.LJ_8 = false
      this.error.LJ_8 = false

      try{
        await axios.put(`${url}/api/biblioteca/lanzar/${this.LJ_8.n_juego}`, this.LJ_8)
        this.success.LJ_8 = true
      } catch (err){
        this.error.LJ_8 = true
      }
    },

    async FinalizarJuego(){
      this.success.FJ_9 = false
      this.error.FJ_9 = false

      try{
        await axios.put(`${url}/api/biblioteca/finalizar/${this.FJ_9.n_juego}`, this.FJ_9)
        this.success.FJ_9 = true
      } catch (err){
        this.error.FJ_9 = true
      }
    },
  }
}

</script>
