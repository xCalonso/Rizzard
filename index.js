'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 8080
const history = require('connect-history-api-fallback')

const biblioteca = require('./backend/sql/biblioteca')
const nube = require('./backend/sql/nube')
const usuarios = require('./backend/sql/usuarios')
const juegos = require('./backend/sql/juegos')


const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/*const pg = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

async function ConectarBD() {  
  try{
    let cliente = new pg.Client({
      user: "cjqcyjcicnlgid",
      password: "9b518c96ec8f3403b6bb2513ea813c91f70e523f4d58fe36b051dceb97fabd52",
      database: "dc97m4rbk5jl0p",
      port: 5432,
      host: "ec2-3-217-216-13.compute-1.amazonaws.com",
      ssl: true
    })
    await cliente.connect()
    console.log("Conexion establecida!!")
    
    cliente.query("CREATE TABLE Prueba", (err, res) => {
    	if (err) {
    		console.log(err)
    	} else {
    		console.log(res.rows)
    	}
    })
    
    cliente.query("DESCRIBE Prueba", (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows)
    }
})
  } catch (err) {
    console.log(err);
  }
}*/

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function ConectarBD() {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "x7160417",
      password      : "x7160417",
      connectString : "oracle0.ugr.es:1521/practbd.oracle0.ugr.es"
    });

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        console.log("Conexion establecida!!")
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

ConectarBD();

app.use(express.static('frontend/dist'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/dist/index.html')
});


app.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`)
})

process.on('error', function (err) {
  console.log(err);
});

process.on('exit', function () {
  connection.end();
});
