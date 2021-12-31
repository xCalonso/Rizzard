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


const mysql = require('mysql');
var connection
function handleDisconnect() {
  connection = mysql.createConnection('mysql://b4cc23020ae5c0:62dacd4c@eu-cdbr-west-02.cleardb.net/heroku_512342ab1505158?reconnect=true');
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

//
// ────────────────────────────────────────────────────────── IV ──────
// 				J U E G O S
// ────────────────────────────────────────────────────────────────────
//

// Dar de Alta Juego
app.post('/api/juegos/alta', (req, res) => {
  connection.query(juegos.darAlta(req.body), function(err, rows, fields) {
  if (err) {
      console.log(err)
      return res.status(412).send("Ya existe un juego con este nombre");
    }
    console.log(rows);
    return res.sendStatus(200);
  });
})

// Dar de Baja Juego
app.put('/api/juegos/:n_juego', (req, res) => {
  connection.query(juegos.darBaja({
    n_juego: req.params.n_juego
  }), function (err, rows, fields) {
    if (err){
      console.log(err)
      return res.sendStatus(404)
    }
    console.log(rows)
    return res.sendStatus(200)
  });
})

// Listar Juegos

app.get('/api/juegos/:consulta', (req, res) => {
  console.log(req.body)
  connection.query(juegos.listar({
    consulta: req.params.consulta
  }), function (err, rows, fields) {
    if (err){
      console.log(err)
      return res.sendStatus(404)
    }
    console.log(rows)
    return res.send(rows)
  });
})


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
