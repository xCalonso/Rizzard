let darAlta = function({nombreJuego, categoria, pegi, instalador, nivelesRecompensa, licencia, precio}){
  return `INSERT INTO Juego (nombreJuego, Categoria, Pegi, Instalador, nivelesRecompensa, Licencia, Precio, Estado) values ('${nombreJuego}', '${categoria}', ${pegi}, '${instalador}', '${nivelesRecompensa}', ${licencia}, ${precio}, 1);`
}

let darBaja = function(){

}

let listar = function(){

}

module.exports = {darAlta, darBaja, listar}
