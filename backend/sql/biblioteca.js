let comprarJuego = function({num_copia, n_juego, version, n_usuario, puntos_compra}){
  return `INSERT INTO CopiaJuego (numCopia, nombreJuego, Version, nombreUsuario, Estado, puntosGastados) VALUES (${num_copia}, '${n_juego}', '${version}', '${n_usuario}', 'instalable', ${puntos_compra})`
}

let lastID = function({n_juego}){
    return `SELECT MAX(numCopia) as id FROM CopiaJuego WHERE nombreJuego='${n_juego}'`
}

let devolverJuego = function({n_juego, n_usuario}){
  return `DELETE FROM CopiaJuego WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

let comprobar = function({n_juego, n_usuario}){
  return `SELECT * FROM CopiaJuego WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

let obtenerCompartidos = function({n_juego, n_usuario}){
  return `SELECT * FROM JuegoCompartido WHERE nombreJuego='${n_juego}' AND nombreAmigo='${n_usuario}'`
}

let quitarCompartidos = function({n_juego, n_usuario}){
  return `DELETE FROM JuegoCompartido WHERE nombreJuego='${n_juego}' AND nombreAmigo='${n_usuario}'`
}

let quitarCopiasCompartidas = function({n_juego, num_copia}){
  return `DELETE FROM CopiaJuego WHERE nombreJuego='${n_juego}' AND numCopia='${num_copia}'`
}

let modificarCompartidos = function({estado, n_juego, num_copia}){
  return `UPDATE CopiaJuego SET Estado='${estado}' WHERE nombreJuego='${n_juego}' AND numCopia='${num_copia}'`
}

let actualizarJuego = function({n_juego, n_usuario, directorio, version}){
  return `UPDATE CopiaJuego SET Estado='jugable', directorioInstalacion='${directorio}', Version=${version} WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

let instalarJuego = function({n_juego, n_usuario, directorio}){
  return `UPDATE CopiaJuego SET Estado='jugable', directorioInstalacion='${directorio}' WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

let desinstalarJuego = function({n_juego, n_usuario}){
  return `UPDATE CopiaJuego SET Estado='instalable' WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

let comprobarEstado = function({n_juego, n_usuario}){
  return `SELECT * FROM CopiaJuego WHERE nombreUsuario='${n_usuario}' AND nombreJuego='${n_juego}'`
}

let comprobarCompartida = function({n_usuario, n_amigo}){
  return `SELECT * FROM Compartido WHERE nombreUsuario1='${n_usuario}' AND nombreUsuario2='${n_amigo}'`
}

let compartirBiblioteca = function({n_usuario, n_amigo}){
  return `INSERT INTO Compartido (nombreUsuario1, nombreUsuario2) VALUES ('${n_usuario}', '${n_amigo}')`
}

let dejarCompartirBiblioteca = function({n_usuario, n_amigo}){
  return `DELETE FROM Compartido WHERE nombreUsuario1='${n_usuario}' AND nombreUsuario2='${n_amigo}'`
}

let listar = function({consulta, n_usuario}){
  console.log(consulta)
  return `SELECT * FROM CopiaJuego WHERE nombreUsuario='${n_usuario}'`
}

let lanzarJuego = function({n_juego, n_usuario}){
  return `UPDATE CopiaJuego SET Estado='nojugable' WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

let finalizarJuego = function({n_juego, n_usuario}){
  return `UPDATE CopiaJuego SET Estado='jugable' WHERE nombreJuego='${n_juego}' AND nombreUsuario='${n_usuario}'`
}

module.exports = {comprarJuego, lastID, devolverJuego, comprobar, obtenerCompartidos, modificarCompartidos, quitarCopiasCompartidas, quitarCompartidos, listar, comprobarEstado, actualizarJuego, instalarJuego, desinstalarJuego, comprobarCompartida, dejarCompartirBiblioteca, compartirBiblioteca, lanzarJuego, finalizarJuego}
