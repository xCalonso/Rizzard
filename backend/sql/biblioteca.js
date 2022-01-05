let comprarJuego = function({num_copia, n_juego, version, n_usuario, puntos_compra}){
  return `INSERT INTO CopiaJuego (numCopia, nombreJuego, Version, Estado, nombreUsuario) VALUES (${num_copia}, '${n_juego}, '${version}', '${n_usuario}', ${puntos_compra})`
}

let lastID = function({n_juego}){
    return `SELECT MAX(numCopia) as id FROM CopiaJuego WHERE nombreJuego='${n_juego}'`
}

let devolverJuego = function(){

}

let actualizarJuego = function(){

}

let instalarJuego = function(){

}

let desinstalarJuego = function(){

}

let compartirBiblioteca = function(){

}

let lanzarJuego = function(){

}

let finalizarJuego = function(){

}

module.exports = {comprarJuego, lastID, devolverJuego, actualizarJuego, instalarJuego, desinstalarJuego, compartirBiblioteca, lanzarJuego, finalizarJuego}
