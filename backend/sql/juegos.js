let darAlta = function({n_juego, categoria, pegi, instalador, niveles, licencia, precio}){
  return `INSERT INTO Juego (nombreJuego, Categoria, Pegi, Instalador, nivelesRecompensa, Licencia, Precio, Estado) VALUES ('${n_juego}', '${categoria}', ${pegi}, '${instalador}', '${niveles}', ${licencia}, ${precio}, 1);`
}

let darBaja = function({n_juego}){
  return `UPDATE Juego SET Estado=0 WHERE nombreJuego='${n_juego}'`
}

let listar = function({consulta}){
  console.log(consulta)
  return `SELECT * FROM Juego`
}

let comprobar = function({n_juego}){
  return `SELECT * FROM Juego WHERE nombreJuego='${n_juego}'`
}

let precio = function({n_juego}){
  return `SELECT Precio FROM Juego WHERE nombreJuego='${n_juego}'`
}

module.exports = {darAlta, darBaja, listar, comprobar, precio}
