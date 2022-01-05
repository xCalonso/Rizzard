let sonAmigos = function({n_usuario, n_amigo}){
  return `SELECT * FROM Amigos WHERE (nombreUsuario1 = '${n_usuario}' AND nombreUsuario2 = '${n_amigo}') OR (nombreUsuario1 = '${n_amigo}' AND nombreUsuario2 = '${n_usuario}')`
}

let añadirAmigo = function({n_usuario, n_amigo}){
  return `INSERT INTO Amigos (nombreUsuario1, nombreUsuario2) VALUES ('${n_usuario}', '${n_amigo}');`
}

let eliminarAmigo = function({n_usuario, n_amigo}){
  return `DELETE FROM Amigos WHERE (nombreUsuario1='${n_usuario}' AND nombreUsuario2='${n_amigo}') OR (nombreUsuario1='${n_amigo}' AND nombreUsuario2='${n_usuario}')`
}

let comprobarPuntos = function({n_usuario}){
  return `SELECT Puntos FROM Usuario WHERE nombreUsuario='${n_usuario}'`
}

let editarPuntos = function({puntos, n_usuario}){
  return `UPDATE Usuario SET Puntos=${puntos} WHERE nombreUsuario='${n_usuario}'`
}

let sesion = function({n_usuario, fecha, hora_inicio, hora_fin}){
  return `INSERT INTO Sesion (nombreUsuario, Fecha, horaInicio, horaFin) VALUES ('${n_usuario}', '${fecha}', '${hora_inicio}', '${hora_fin}')`
}

module.exports = {sonAmigos, añadirAmigo, eliminarAmigo, comprobarPuntos, editarPuntos, sesion}
