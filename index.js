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
const login = require('./backend/sql/login')


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
const { version } = require('os')
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
// ────────────────────────────────────────────────────────── I ──────
// 			    B I B L I O T E C A
// ────────────────────────────────────────────────────────────────────
//

// Comprar Juego
app.post('/api/biblioteca/comprar', (req, res) => {
  console.log(req.body)
  
  connection.query(juegos.comprobar({
    n_juego: req.body.n_juego
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("El juego no existe en la base de datos")
    }
    
    connection.query(usuario.comprobarPuntos({
      n_usuario: user
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows[0].Puntos < req.body.puntos){
        return res.status(500).send("Cantidad de puntos excedida")
      }
      let puntos = rows[0].puntos

      connection.query(juegos.precio({
        n_juego: req.params.n_juego
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          return res.status(500).send("Error en la consulta")
        }
        let puntos_compra = (rows[0].Precio - req.body.puntos/100)*10
        console.log(puntos_compra)
        puntos = puntos + puntos_compra

        connection.beginTransaction(function(err) {
          if (err){
            return res.status(500).send("No se ha podido iniciar la transacción")
          }

          connection.query(usuarios.editarPuntos({
            puntos: puntos,
            n_usuario: user
          }), function(err, rows, fields) {
            if (err) {
              console.log(err)
              connection.rollback(function () {
                res.status(500).send("No se ha podido insertar la tupla")
              })
              return
            }

            connection.query(biblioteca.lastID({
              n_juego: req.body.n_juego
            }), function(err, rows, fields) {
              if (err) {
                console.log(err)
                connection.rollback(function () {
                  res.status(500).send("No se ha podido insertar la tupla")
                })
                return
              }
              let id = rows[0].id+1
              let version = Math.floor(Math.random() * (10 - 1)) + 1;

              connection.query(biblioteca.comprarJuego({
                num_copia: id,
                n_juego: req.body.n_juego,
                version: version,
                n_usuario: user,
                puntos_compra: req.body.puntos
              }), function(err, rows, fields) {
                if (err) {
                  console.log(err)
                  connection.rollback(function () {
                    res.status(500).send("No se ha podido insertar la tupla")
                  })
                  return
                }

                connection.commit(function (err) {
                  if (err) {
                    connection.rollback(function () {
                      res.status(500).send("No se ha podido completar la transacción")
                    })
                    return
                  }
                  return res.sendStatus(200)
                })
              })
            })
          })
        })
      })
    })
  })
})

// Devolver Juego

// Actualizar Juego

// Instalar Juego

// Desinstalar Juego

// Compartir Biblioteca

// Dejar de Compartir Biblioteca

// Lanzar Juego

// Finalizar Juego


//
// ────────────────────────────────────────────────────────── II ──────
// 			          N U B E
// ────────────────────────────────────────────────────────────────────
//

// Subir Partida
app.post('/api/nube/subir', (req, res) => {
  console.log(req.body)
  connection.beginTransaction(function(err) {
    if (err){
      return res.status(500).send("No se ha podido iniciar la transacción")
    }
    
    connection.query(nube.subirPartida({
      id_partida: req.body.id_partida, 
      fecha: req.body.fecha, 
      hora_guardado: req.body.hora_guardado, 
      horas_jugadas: req.body.horas_jugadas, 
      estado: req.body.estado,
      n_juego: req.body.n_juego, 
      n_usuario: user,
    }), function(err, rows, fields){
      if (err){
        console.log(err)
        connection.rollback(function () {
          res.status(500).send("No se ha podido insertar la tupla")
        })
        return 
      }
      
      connection.query(nube.tienePartida({
        n_usuario: user,
        id_partida: req.body.id_partida
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          connection.rollback(function () {
            res.status(500).send("No se ha podido insertar la tupla")
          })
          return 
        }
        console.log("TODO sumar puntos")
      
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              res.status(500).send("No se ha podido completar la transacción")
            })
            return
          }
          return res.sendStatus(200)
        })
      })
    })
  })
})

// Descargar Partida 
app.put('/api/nube/:id_partida', (req, res) => {
  console.log(req.params.id_partida)
  
  connection.query(nube.comprobarPartida({
    n_usuario: user,
    id_partida: req.params.id_partida
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("Usuario no tiene partida")
    }
    console.log("Usuario tiene partida")
    return res.sendStatus(200)
  })
})

// Compartir Partida
app.post('/api/nube/compartir', (req, res) => {
  console.log(req.body)
  connection.beginTransaction(function(err) {
    if (err){
      return res.status(500).send("No se ha podido iniciar la transacción")
    }
    connection.query(nube.comprobarPartida({
      n_usuario: user,
      id_partida: req.body.id_partida
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows.length != 1){
        return res.status(500).send("Usuario no tiene partida")
      }
      console.log("Usuario tiene partida")
      connection.query(usuarios.sonAmigos({
        n_usuario: user,
        n_amigo: req.body.n_amigo
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          return res.status(500).send("Error en la consulta")
        } else if (rows.length != 1){
          return res.status(500).send("No sois amigos")
        }
        console.log("Sois amigos")
        connection.query(nube.tienePartida({
          n_usuario: req.body.n_amigo,
          id_partida: req.body.id_partida
        }), function(err, rows, fields){
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("No se ha podido insertar la tupla")
            })
            return 
          }
          connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              res.status(500).send("No se ha podido completar la transacción")
            })
            return
          }
          return res.sendStatus(200)
          })
        })
      })
    })	
  })
})

//
// ────────────────────────────────────────────────────────── III ──────
// 			      U S U A R I O S
// ────────────────────────────────────────────────────────────────────
//

let admin = {valor: -1}
let user = ""
let fecha = ""
let hora_inicio = ""


// Inicio de Sesion
app.post('/api/login', (req, res) => {
  //console.log(req.body)
  
  connection.query(login.iniciar({
    user: req.body.user,
    password: req.body.password
  }), function(err, rows, fields) {
    if (err) {
      console.log(err)
      return res.status(500).send("No coinciden las credenciales");
    }
    console.log(rows.length)
    if (rows.length == 1){
      user = req.body.user
      fecha = req.body.fecha
      hora_inicio = req.body.hora_inicio 
      admin.valor = 1
    } else {
      admin.valor = 0
    }
    return res.sendStatus(200)
  });
})

// Comprobar que es Administrador
app.get('/api/login/:user', (req, res) => {
  console.log(req.params.user)
  connection.query(login.admin({
    user: req.params.user
  }), function(err, rows, fields) {
    if (err) {
      console.log(err)
      return res.status(500).send("Error en la consulta");
    }
    console.log(rows.length)
    if (rows.length == 1 && admin.valor != 0){
      admin.valor = 2
    }
    return res.send(admin)
  });
})

app.post('/api/login/logout', (req, res) => {
  console.log(req.body)
  
  connection.beginTransaction(function(err) {
    if (err) {
      return res.status(500).send("No se ha podido iniciar la transacción")
    }

    connection.query(usuarios.sesion({
      n_usuario: user,
      fecha: fecha,
      hora_inicio: hora_inicio,
      hora_fin: req.body.hora_fin
    }), function(err, rows, fields) {
      if (err) {
        console.log(err)
        connection.rollback(function () {
          res.status(500).send("No se ha podido insertar la tupla")
        })
        return
      }
      console.log(rows)
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            res.status(500).send("No se ha podido completar la transacción")
          })
          return
        }
        return res.sendStatus(200)
      })
    })
  })
})

let sesion = {buena: false}

app.get('/api/login/comprobar/:user', (req, res) => {
  console.log(req.params.user)

  sesion.buena = user == req.params.user

  return res.send(sesion)
})

// Registrar un Usuario


// Agregar un Amigo
app.put('/api/usuarios/agregar/:n_amigo', (req, res) => {
  console.log(req.params.n_amigo)
  
  connection.query(usuarios.sonAmigos({
    n_usuario: user,
    n_amigo: req.params.n_amigo
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length == 1) {
      console.log("Ya son amigos")
      return res.sendstatus(500).send("Ya son amigos")
    }
    connection.beginTransaction(function (err) {
      if (err) {
        return res.status(500).send("No se ha podido iniciar la transacción")
      }
  
      connection.query(usuarios.añadirAmigo({
        n_usuario: user,
        n_amigo: req.params.n_amigo
      }), function (err, rows, fields) {
        if (err){
          console.log(err)
          connection.rollback(function () {
            res.status(500).send("No se ha podido insertar la tupla")
          })
          return
        }
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              res.status(500).send("No se ha podido completar la transacción")
            })
            return
          }
          return res.sendStatus(200)
        })
      })
    })
  })
})

// Eliminar un Amigo
app.put('/api/usuarios/borrar/:n_amigo', (req, res) => {
  console.log(req.params.n_amigo)
  connection.beginTransaction(function (err) {
    if (err) {
      return res.status(500).send("No se ha podido iniciar la transacción")
    }
  
    connection.query(usuarios.sonAmigos({
      n_usuario: user,
      n_amigo: req.params.n_amigo
    }), function (err, rows, fields) {
       if (err) {
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows.length != 1) {
        return res.status(500).send("No sois amigos")
      }
      connection.query(usuarios.eliminarAmigo({
        n_usuario: user,
        n_amigo: req.params.n_amigo
      }), function (err, rows, fields) {
        if (err){
          console.log(err)
          connection.rollback(function () {
            res.status(500).send("Error al insertar tupla")
          })
          return
        }
        connection.commit(function (err) {
          if (err) {
            connection.rollback(function () {
              res.status(500).send("Error al finalizar la transacción")
            })
            return
          }
          return res.sendStatus(200);
        })
      })
    })
  })
})

//
// ────────────────────────────────────────────────────────── IV ──────
// 				J U E G O S
// ────────────────────────────────────────────────────────────────────
//

// Dar de Alta Juego
app.post('/api/juegos/alta', (req, res) => {
  console.log(req.body)

  connection.query(juegos.comprobar({
    n_juego: req.body.n_juego
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length == 1){
      console.log("Ya existe este juego")
      return res.status(500).send("Ya existe este juego")
    }

    connection.beginTransaction( function(err) {
      if (err){
        console.log(err)
        return res.status(500).send("No se ha podido iniciar la transacción")
      }
      connection.query(juegos.darAlta(req.body), function(err, rows, fields) {
        if (err) {
          console.log(err)
          connection.rollback(function () {
            res.status(500).send("Ya existe un juego con este nombre")
          })
          return
        }
        
        connection.commit(function (err){
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("Error al finalizar la transacción")
            })
          }
          return res.sendStatus(200)
        })
      })
    })
  })
})

// Dar de Baja Juego
app.put('/api/juegos/:n_juego', (req, res) => {
  connection.query(juegos.comprobar({
    n_juego: req.params.n_juego
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      console.log("No existe este juego")
      return res.status(500).send("No existe este juego")
    }
    
    connection.beginTransaction(function(err) {
      if (err){
        console.log(err)
        return res.status(500).send("No se ha podido iniciar la transacción")
      }

      connection.query(juegos.darBaja({
        n_juego: req.params.n_juego
      }), function (err, rows, fields) {
        if (err){
          console.log(err)
          connection.rollback(function () {
             res.status(500).send("No se ha podido eliminar la tupla")
          })
          return
        }
        connection.commit(function (err){
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("Error al finalizar la transacción")
            })
          }
          return res.sendStatus(200)
        })
      })
    })
  })
})

// Listar Juegos
app.get('/api/juegos/:consulta', (req, res) => {
  console.log(req.body)
  connection.query(juegos.listar({
    consulta: req.params.consulta
  }), function (err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(404).send("Error en la consulta")
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
