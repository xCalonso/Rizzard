'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 8080

const biblioteca = require('./backend/sql/biblioteca')
const nube = require('./backend/sql/nube')
const usuarios = require('./backend/sql/usuarios')
const juegos = require('./backend/sql/juegos')
const login = require('./backend/sql/login')


const app = express()
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
// ────────────────────────────────────────────────────────── I ──────
// 			              B I B L I O T E C A
// ────────────────────────────────────────────────────────────────────
//

// Juegos Disponibles
app.get('/api/biblioteca/:consulta', (req, res) => {
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

// Comprar Juego
/*
  1. Comprobar que el juego no ha sido comprado por el usuario
  2. Comprobar que el juego está en la base de datos.
  3. Comprobar que el usuario tiene suficientes puntos.
  4. Calcular los puntos conseguidos a partir del precio con el descuento.
  5. Comenzar transacción:
    5.1. Modificar los puntos del usuario con los calculado en el apartado 3.
    5.2. Calcular el numero de copia del juego comprado
    5.3. Añadir la copia del juego al usuario comprador
  6. COMMIT
*/
app.post('/api/biblioteca/comprar', (req, res) => {
  console.log(req.body)

  // 1.
  connection.query(biblioteca.comprobar({
    n_juego: req.body.n_juego,
    n_usuario: user 
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length == 1){
      return res.status(500).send("El juego ya ha sido comprado")
    }

    // 2.
    connection.query(juegos.comprobar({
      n_juego: req.body.n_juego
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows.length != 1){
        return res.status(500).send("El juego no existe en la base de datos")
      }
      
      // 3.
      connection.query(usuarios.comprobarPuntos({
        n_usuario: user
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          return res.status(500).send("Error en la consulta")
        } else if (rows[0].Puntos < req.body.puntos){
          return res.status(500).send("Cantidad de puntos excedida")
        }
        let puntos = rows[0].Puntos

        // 4.
        connection.query(juegos.precio({
          n_juego: req.body.n_juego
        }), function(err, rows, fields) {
          if (err){
            console.log(err)
            return res.status(500).send("Error en la consulta")
          }
          console.log(rows)
          let puntos_compra = (rows[0].Precio - req.body.puntos/100)*10
          console.log(puntos_compra)
          puntos += puntos_compra

          connection.beginTransaction(function(err) {
            if (err){
              return res.status(500).send("No se ha podido iniciar la transacción")
            }
            console.log(puntos)

            // 5.1.
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

              // 5.2.
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

                // 5.3.
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
})

// Devolver Juego
/*
  1. Comprobar que el juego está en la base de datos.
  2. Comprobar que el juego pertenece al usuario.
  3. Comprobar si el usuario tiene suficientes puntos.
  4. Comenzar la transacción:
    4.1. Modificar los puntos del usuario con los calculados en el apartado 2.
    4.2. Eliminar todas las copias del juego que sean compartidas.
    4.3. Eliminar las relaciones de las copias compartidas.
    4.4. Eliminar la copia del juego del usuario comprador.
  5. COMMIT.
*/
app.put('/api/biblioteca/devolver/:n_juego', (req, res) => {
  console.log(req.params.n_juego)

  // 1.
  connection.query(juegos.comprobar({
    n_juego: req.params.n_juego
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("El juego no está en la base de datos")
    }
    let precio = rows[0].Precio

    // 2.
    connection.query(biblioteca.comprobar({
      n_juego: req.params.n_juego,
      n_usuario: user
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows.length != 1){
        return res.status(500).send("El juego no fue comprado por el usuario")
      }
      let puntos_compra = (precio - rows[0].puntosGastados/100)*10
      console.log(puntos_compra)

      // 3.
      connection.query(usuarios.comprobarPuntos({
        n_usuario: user
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          return res.status(500).send("Error en la consulta")
        } else if (rows[0].Puntos < puntos_compra){
          return res.status(500).send("No son suficientes los puntos del usuario")
        }
        let puntos_user = rows[0].Puntos - puntos_compra 

        connection.beginTransaction(function(err){
          if (err){
            return res.status(500).send("No se ha podido iniciar la transacción")
          }

          // 4.1.
          connection.query(usuarios.editarPuntos({
            puntos: puntos_user,
            n_usuario: user,
          }), function(err, rows, fields) {
            if (err){
              console.log(err)
              connection.rollback(function () {
                res.status(500).send("No se ha podido insertar la tupla")
              })
              return
            }

            connection.query(biblioteca.obtenerCompartidos({
              n_juego: req.params.n_juego,
              n_usuario: user
            }), function(err, rows, fields) {
              if (err){
                console.log(err)
                connection.rollback(function () {
                  res.status(500).send("Error en la consulta")
                })
                return
              } 
              let fallo = false

              // 4.2.
              for (let i = 0; i < rows.length && !fallo; i++){
                connection.query(biblioteca.quitarCopiasCompartidas({
                  n_juego: req.params.n_juego,
                  num_copia: rows[i].num_copia
                }), function(err, rows, fields) {
                  if (err){
                    fallo = true
                    console.log(err)
                    connection.rollback(function () {
                      res.status(500).send("No se ha podido borrar la tupla")
                    })
                    return
                  }
                })
              }
              if (fallo){
                return
              }

              // 4.3.
              connection.query(biblioteca.quitarCompartidos({
                n_juego: req.params.n_juego,
                n_usuario: user
              }), function(err, rows, fields) {
                if (err){
                  console.log(err)
                  connection.rollback(function () {
                    res.status(500).send("Error en la consulta")
                  })
                  return
                }

                // 4.4.
                connection.query(biblioteca.devolverJuego({
                  n_juego: req.params.n_juego,
                  n_usuario: user
                }), function(err, rows, fields) {
                  if (err){
                    console.log(err)
                    connection.rollback(function () {
                      res.status(500).send("No se ha podido borrar la tupla")
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
})

// Actualizar Juego
/*
  1. Comprobar que el juego pertenece al usuario.
  2. Comprobar que el juego se puede actualizar.
  3. Comenzar la transacción:
    3.1. Modificar el directorio y el estado de la copia del juego.
  4. COMMIT.
*/
app.post('/api/biblioteca/actualizar', (req, res) => {
  // 1.
  connection.query(biblioteca.comprobar({
    n_juego: req.body.n_juego,
    n_usuario: user
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("El juego no pertenece al usuario")
    }

    // 2.
    connection.query(biblioteca.comprobarEstado({
      n_juego: req.body.n_juego,
      n_usuario: user
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows[0].Estado != 'actualizable'){
        return res.status(500).send("El juego no se puede actualizar")
      }

      connection.beginTransaction(function(err) {
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }
        let version = Math.floor(Math.random() * (10 - 1)) + 1;

        // 3.1
        connection.query(biblioteca.actualizarJuego({
          n_juego: req.body.n_juego,
          n_usuario: user,
          directorio: req.body.directorio,
          version: version
        }), function(err, rows, fields) {
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("No se ha podido modificar la tupla")
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

// Instalar Juego
/*
  1. Comprobar que el juego pertenece al usuario.
  2. Comprobar que el juego se puede instalar.
  3. Comenzar la transacción:
    3.1. Modificar el directorio y el estado de la copia del juego.
  4. COMMIT.
*/
app.post('/api/biblioteca/instalar', (req, res) => {
  // 1.
  connection.query(biblioteca.comprobar({
    n_juego: req.body.n_juego,
    n_usuario: user
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("El juego no pertenece al usuario")
    }

    // 2.
    connection.query(biblioteca.comprobarEstado({
      n_juego: req.body.n_juego,
      n_usuario: user
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows[0].Estado != 'instalable'){
        return res.status(500).send("El juego ya esta instalado")
      }

      connection.beginTransaction(function(err) {
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }

        // 3.1.
        connection.query(biblioteca.instalarJuego({
          n_juego: req.body.n_juego,
          n_usuario: user,
          directorio: req.body.directorio
        }), function(err, rows, fields) {
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("No se ha podido modificar la tupla")
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

// Desinstalar Juego
/*
  1. Comprobar que el juego pertenece al usuario.
  2. Comprobar que el juego está instalado.
  3. Comenzar la transacción:
    3.1. Modificar el estado de la copia del juego (El directorio se podría modificar o no).
  4. COMMIT.
*/
app.put('/api/biblioteca/desintalar/:n_juego', (req, res) => {
  // 1.
  connection.query(biblioteca.comprobar({
    n_juego: req.params.n_juego,
    n_usuario: user
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("El juego no pertenece al usuario")
    }

    // 2.
    connection.query(biblioteca.comprobarEstado({
      n_juego: req.params.n_juego,
      n_usuario: user
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows[0].Estado != 'jugable'){
        return res.status(500).send("El juego no está instalado")
      }

      connection.beginTransaction(function(err) {
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }

        // 3.1
        connection.query(biblioteca.desinstalarJuego({
          n_juego: req.params.n_juego,
          n_usuario: user,
        }), function(err, rows, fields) {
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("No se ha podido modificar la tupla")
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

// Compartir Biblioteca
/*
  1. Comprobar que los usuarios son amigos.
  2. Comprobar que las biblioteca no ha sido compartida con el amigo.
  3. Comenzar transacción:
    3.1. Añadir relación compartido entre los usuarios.
  4. COMMIT.
*/
app.put('/api/biblioteca/compartir/:n_amigo', (req, res) => {
  console.log(req.params.n_amigo)

  // 1.
  connection.query(usuarios.sonAmigos({
    n_usuario: user,
    n_amigo: req.params.n_amigo
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("Los usuarios no son amigos")
    }

    // 2.
    connection.query(biblioteca.comprobarCompartida({
      n_usuario: user,
      n_amigo: req.params.n_amigo
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows.length == 1){
        return res.status(500).send("La biblioteca ya está compartida con el usuario")
      }

      connection.beginTransaction(function(err){
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }

        // 3.1
        connection.query(biblioteca.compartirBiblioteca({
          n_usuario: user,
          n_amigo: req.params.n_amigo
        }), function(err, rows, fields) {
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

// Dejar de Compartir Biblioteca
/*
  1. Comprobar que la biblioteca ha sido compartida con el amigo.
  2. Comenzar transacción:
    2.1. Borrar relación compartido entre los usuarios.
  3. COMMIT.
*/
app.put('/api/biblioteca/dejarcompartir/:n_amigo', (req, res) => {
  console.log(req.params.n_amigo)

  // 1.
  connection.query(biblioteca.comprobarCompartida({
    n_usuario: user,
    n_amigo: req.params.n_amigo
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("La biblioteca no está compartida con este usuario")
    }

    connection.beginTransaction(function(err){
      if (err){
        return res.status(500).send("No se ha podido iniciar la transacción")
      }

      // 2.1.
      connection.query(biblioteca.dejarCompartirBiblioteca({
        n_usuario: user,
        n_amigo: req.params.n_amigo
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          connection.rollback(function () {
            res.status(500).send("No se ha podido borrar la tupla")
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

// Lista Juegos Comprados
app.get('/api/biblioteca/comprados/:consulta', (req, res) => {
  connection.query(biblioteca.listar({
    consulta: req.params.consulta,
    n_usuario: user
  }), function (err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(404).send("Error en la consulta")
    }
    console.log(rows)
    return res.send(rows)
  });
})

// Lanzar Juego
/*
  1. Comprobar que el juego pertenece al usuario.
  2. Comprobar que la copia del juego tiene su estado a jugable.
  3. Comenzar transacción:
    3.1. Establecer el estado de las copias compartidas a no jugable.
    3.2. Establecer el estado de la copia del juego a no jugable.
  4. COMMIT
*/
app.put('/api/biblioteca/lanzar/:n_juego', (req, res) => {
  console.log(req.params.n_juego)

  // 1.
  connection.query(biblioteca.comprobar({
    n_juego: req.params.n_juego,
    n_usuario: user
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("El juego no pertenece al usuario")
    } else if (rows[0].Estado != 'jugable'){
      return res.status(500).send("El juego no está instalado") // 2.
    }

    connection.query(biblioteca.obtenerCompartidos({
      n_juego: req.params.n_juego,
      n_usuario: user,
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      }
      let fallo = false
      console.log(user)
      connection.beginTransaction(function(err) {
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }

        // 3.1
        for(let i = 0; i < rows.length && !fallo; i++){
          connection.query(biblioteca.modificarCompartidos({
            estado: 'nojugable',
            num_copia: rows[i].numCopia,
            n_juego: req.params.n_juego
          }), function(err, rows, fields) {
            if (err){
              fallo = true
              console.log(err)
              connection.rollback(function () {
                res.status(500).send("No se ha podido modificar la tupla")
              })
              return
            }
          })
        }
        if (fallo){
          return
        }

        // 3.2
        connection.query(biblioteca.lanzarJuego({
          n_juego: req.params.n_juego,
          n_usuario: user
        }), function(err, rows, fields) {
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("No se ha podido modificar la tupla")
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

// Finalizar Juego
/*
  1. Comprobar que la copia del juego está en estado no jugable.
  2. Comenzar transacción:
    2.1. Establecer el estado de la copia del juego a jugable.
    2.2. Establecer el estado de las copias compartidas a jugable.
*/
app.put('/api/biblioteca/finalizar/:n_juego', (req, res) => {
  console.log(req.params.n_juego)

  // 1.
  connection.query(biblioteca.comprobar({
    n_usuario: user,
    n_juego: req.params.n_juego
  }), function(err, rows, fields) {
    if (err){
      
    } else if (rows[0].Estado == 'nojugable'){

    }

    connection.query(biblioteca.obtenerCompartidos({
      n_amigo: user,
      n_juego: req.params.n_juego
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      }
      let fallo = false
      connection.beginTransaction(function(err) {
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }

        // 2.1
        for(let i = 0; i < rows.length && !fallo; i++){
          connection.query(biblioteca.modificarCompartidos({
            estado: 'jugable',
            num_copia: rows[i].numCopia,
            n_juego: req.params.n_juego
          }), function(err, rows, fields) {
            if (err){
              fallo = true
              console.log(err)
              connection.rollback(function () {
                res.status(500).send("No se ha podido modificar la tupla")
              })
              return
            }
          })
        }
        if (fallo){
          return
        }

        // 2.2
        connection.query(biblioteca.finalizarJuego({
          n_juego: req.params.n_juego,
          n_usuario: user
        }), function(err, rows, fields) {
          if (err){
            console.log(err)
            connection.rollback(function () {
              res.status(500).send("No se ha podido modificar la tupla")
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
// ────────────────────────────────────────────────────────── II ──────
// 			                N U B E
// ────────────────────────────────────────────────────────────────────
//

// Subir Partida
/*
  1. Comenzar transacción:
    1.1. Añadir partida del usuario a la nube.
    1.2. Añadir relacion tiene entre el usuario y la partida.
    1.3. Comprueba el estado de la máquina para añadir los puntos de las recompensas.
  2. COMMIT
*/
app.post('/api/nube/subir', (req, res) => {
  console.log(req.body)
  connection.beginTransaction(function(err) {
    if (err){
      return res.status(500).send("No se ha podido iniciar la transacción")
    }
    
    // 1.1
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
      
      // 1.2
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
        
        // 1.3
        if (req.body.estado == 'estado.dat'){
          connection.query(usuarios.comprobarPuntos({
            n_usuario: user
          }), function(err, rows, fields) {
            if (err){
              console.log(err)
              connection.rollback(function () {
                res.status(500).send("Error en la consulta")
              })
              return 
            }
            let puntos = rows[0].Puntos + 2000

            connection.query(usuarios.editarPuntos({
              puntos: puntos,
              n_usuario: user
            }), function(err, rows, fields) {
              if (err){
                console.log(err)
                connection.rollback(function () {
                  res.status(500).send("No se ha podido modificar la tupla")
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
        }
        else{
          connection.commit(function (err) {
            if (err) {
              connection.rollback(function () {
                res.status(500).send("No se ha podido completar la transacción")
              })
              return
            }
            return res.sendStatus(200)
          })
        }
      })
    })
  })
})

// Descargar Partida
/*
  1. Comprobar que el usuario tiene la partida y simular su descarga
*/
app.put('/api/nube/:id_partida', (req, res) => {
  console.log(req.params.id_partida)
  
  // 1.
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
/*
  1. Comprobar si el usuario ya tiene la partida indicada.
  2. Comprobar si los usuarios son amigos.
  3. Comenzar transacción:
    3.1. Añadir relacion entre el usuario amigo y la partida.
  4. COMMIT
*/
app.post('/api/nube/compartir', (req, res) => {
  console.log(req.body)

  // 1.
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
    // 2.
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
      connection.beginTransaction(function(err) {
        if (err){
          return res.status(500).send("No se ha podido iniciar la transacción")
        }    
        // 3.1
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

let admin = {valor: -1} // 0: ERROR, 1: USUARIO, 2: ADMIN
let user = ""
let fecha_inicio = ""
let hora_inicio = ""


// Inicio de Sesion
/*
  1. Comprobar que el usuario no está eliminado.
  2. Comprobar que el usuario y la contraseña son correctas.
  3. Almacenar en variables la fecha y hora de inicio de sesión
*/
app.post('/api/login', (req, res) => {
  //console.log(req.body)
  
  // 1.
  connection.query(usuarios.eliminado({
    n_usuario: req.body.user,
  }), function(err, rows, fields){
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta");
    } else if (rows.length == 1){
      return res.status(500).send("El usuario está eliminado");
    }
    // 2.
    connection.query(login.iniciar({
      user: req.body.user,
      password: req.body.password
    }), function(err, rows, fields) {
      if (err) {
        console.log(err)
        return res.status(500).send("No coinciden las credenciales");
      }
      console.log(rows.length)
      // 3.
      if (rows.length == 1){
        user = req.body.user
        fecha_inicio = req.body.fecha
        hora_inicio = req.body.hora_inicio 
        admin.valor = 1
      } else {
        admin.valor = 0
      }
      return res.sendStatus(200)
    })
  })
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

// Cerrar Sesión
/*
  1. Comenzar transacción:
    1.1. Añadir sesión con las fechas y horas.
  2. COMMIT
*/
app.post('/api/login/logout', (req, res) => {
  console.log(req.body)
  
  connection.beginTransaction(function(err) {
    if (err) {
      return res.status(500).send("No se ha podido iniciar la transacción")
    }

    // 1.1
    connection.query(usuarios.sesion({
      n_usuario: user,
      fecha_inicio: fecha_inicio,
      fecha_fin: req.body.fecha_fin,
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
/*
  1. Comenzar transacción:
    1.1. Añadir un usuario.
    1.2. Establecer administrador si se ha marcado la casilla.
  2. COMMIT
*/
app.post('/api/register', (req, res) =>{
  console.log(req.body)

  connection.beginTransaction(function(err) {
  if (err){
    return res.status(500).send("No se ha podido iniciar la transacción")
  }
  // 1.1
  connection.query(login.registrar({
    n_usuario: req.body.user,
    correo: req.body.correo,
    password: req.body.password
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      connection.rollback(function () {
        res.status(500).send("No se ha podido insertar la tupla")
      })
      return
    }

    // 1.2
    if (req.body.admin){
      connection.query(usuarios.setAdministrador({
        n_usuario: req.body.user
      }), function(err, rows, fields) {
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
    }
    else {
      connection.commit(function (err) {
        if (err) {
          connection.rollback(function () {
            res.status(500).send("No se ha podido completar la transacción")
          })
          return
        }
        return res.sendStatus(200)
      })
    }
  })
})
})

// Eliminar Cuenta
/*
  1. Comenzar transacción:
    1.1. Modificar el nombre de usuario de 'cuenta_eliminada_{nombreUsuario}'
    1.2. Añadir la usuario a usuarios eliminados.
    1.3. Añadir sesión con las fechas y horas.
  2. COMMIT
*/
app.post('/usuarios/eliminar', (req, res) => {
  console.log(req.body)

  connection.beginTransaction(function(err){
    if (err){
      return res.status(500).send("No se ha podido iniciar la transacción")
    }

    // 1.1
    connection.query(usuarios.modificarUsuario({
      n_usuario: user
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        connection.rollback(function () {
          res.status(500).send("No se ha podido modificar la tupla")
        })
        return
      }

      // 1.2
      connection.query(usuarios.eliminarCuenta({
        n_usuario: user,
        fecha: req.body.fecha
      }), function(err, rows, fields) {
        if (err){
          console.log(err)
          connection.rollback(function () {
            res.status(500).send("No se ha podido insertar la tupla")
          })
          return
        }
        
        // 1.3
        connection.query(usuarios.sesion({
          n_usuario: req.body.user,
          fecha_inicio: fecha_inicio,
          fecha_fin: req.body.fecha,
          hora_inicio: hora_inicio,
          hora_fin: req.body.hora
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

// Agregar un Amigo
/*
  1. Comprobar si el usuario existe.
  2. Comprobar que los usuarios son amigos.
  3. Comenzar transacción:
    3.1. Añadir relacion entre los usuarios.
  4. COMMIT
*/
app.put('/api/usuarios/agregar/:n_amigo', (req, res) => {
  console.log(req.params.n_amigo)
  
  // 1.
  connection.query(usuarios.comprobar({
    n_usuario: req.params.n_amigo
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(500).send("Error en la consulta")
    } else if (rows.length != 1){
      return res.status(500).send("No existe ese usuario")
    }

    // 2.
    connection.query(usuarios.sonAmigos({
      n_usuario: user,
      n_amigo: req.params.n_amigo
    }), function(err, rows, fields) {
      if (err){
        console.log(err)
        return res.status(500).send("Error en la consulta")
      } else if (rows.length == 1) {
        console.log("Ya son amigos")
        return res.status(500).send("Ya son amigos")
      }
      connection.beginTransaction(function (err) {
        if (err) {
          return res.status(500).send("No se ha podido iniciar la transacción")
        }
    
        // 3.1
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
})

// Eliminar un Amigo
/*
  1. Comprobar que los usuarios son amigos
  2. Comenzar transacción:
    2.1. Eliminar relación entre los usuarios
  3. COMMIT 
*/
app.put('/api/usuarios/borrar/:n_amigo', (req, res) => {
  console.log(req.params.n_amigo)
  // 1.
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
    connection.beginTransaction(function (err) {
      if (err) {
        return res.status(500).send("No se ha podido iniciar la transacción")
      }
      // 2.1
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

// Ver Puntos
app.get('/api/usuarios/puntos/:consulta', (req, res) => {
  console.log(req.params.consulta)

  connection.query(usuarios.comprobarPuntos({
    n_usuario: user
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(404).send("Error en la consulta")
    }
    console.log(rows)
    return res.send(rows)
  })
})

// Listar Amigos
app.get('/api/usuarios/amigos/:consulta', (req, res) => {
  console.log(req.params.consulta)

  connection.query(usuarios.listarAmigos({
    n_usuario: user
  }), function(err, rows, fields) {
    if (err){
      console.log(err)
      return res.status(404).send("Error en la consulta")
    }
    console.log(rows)
    return res.send(rows)
  })
})

//
// ────────────────────────────────────────────────────────── IV ──────
// 				J U E G O S
// ────────────────────────────────────────────────────────────────────
//

// Dar de Alta Juego
/*
  1. Comprobar que el juego no esta en la base de datos
  2. Comenzar transacción:
    2.1. Dar de alta el juego
  3. COMMIT
*/
app.post('/api/juegos/alta', (req, res) => {
  console.log(req.body)

  // 1.
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
      // 2.1
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
/*
  1. Comprobar que el juego esta en la base de datos
  2. Comenzar transacción:
    2.1. Dar de baja el juego
  3. COMMIT
*/
app.put('/api/juegos/:n_juego', (req, res) => {
  // 1.
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
    
    // 2.1
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
/*
  1. Obtener todos los juegos que se han dado de alta en la base de datos
*/
app.get('/api/juegos/:consulta', (req, res) => {
  console.log(req.params.consulta)
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
