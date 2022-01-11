let comprobar = function({n_usuario}){
  return `SELECT * FROM Usuario WHERE nombreUsuario='${n_usuario}'`
}

let sonAmigos = function({n_usuario, n_amigo}){
  return `SELECT * FROM Amigos WHERE (nombreUsuario1 = '${n_usuario}' AND nombreUsuario2 = '${n_amigo}') OR (nombreUsuario1 = '${n_amigo}' AND nombreUsuario2 = '${n_usuario}')`
}

let añadirAmigo = function({n_usuario, n_amigo}){
  return `INSERT INTO Amigos (nombreUsuario1, nombreUsuario2) VALUES ('${n_usuario}', '${n_amigo}');`
}

let eliminarAmigo = function({n_usuario, n_amigo}){
  return `DELETE FROM Amigos WHERE (nombreUsuario1='${n_usuario}' AND nombreUsuario2='${n_amigo}') OR (nombreUsuario1='${n_amigo}' AND nombreUsuario2='${n_usuario}')`
}

let listarAmigos = function({n_usuario}){
  return `SELECT * FROM Amigos WHERE nombreUsuario1='${n_usuario}' OR nombreUsuario2='${n_usuario}'`
}

let comprobarPuntos = function({n_usuario}){
  return `SELECT Puntos FROM Usuario WHERE nombreUsuario='${n_usuario}'`
}

let editarPuntos = function({puntos, n_usuario}){
  return `UPDATE Usuario SET Puntos=${puntos} WHERE nombreUsuario='${n_usuario}'`
}

let sesion = function({n_usuario, fecha_inicio, fecha_fin, hora_inicio, hora_fin}){
  return `INSERT INTO Sesion (nombreUsuario, fechaInicio, fechaFin, horaInicio, horaFin) VALUES ('${n_usuario}', '${fecha_inicio}', '${fecha_fin}', '${hora_inicio}', '${hora_fin}')`
}

let eliminado = function({n_usuario}){
  return `SELECT * FROM UsuarioEliminado WHERE nombreUsuario='${n_usuario}'`
}

let habilitar = function({n_usuario}){
  return `DELETE FROM UsuarioEliminado WHERE nombreUsuario='${n_usuario}'`
}

let setAdministrador = function({n_usuario}){
  return `INSERT INTO Administrador (nombreUsuario, idAdmin) VALUES ('${n_usuario}', 'admin')`
}

let modificarUsuario = function({n_usuario}){
  return `UPDATE Usuario SET nombreUsuario='cuenta_eliminada_${n_usuario}' WHERE nombreUsuario='${n_usuario}'`
}

let eliminarCuenta = function({n_usuario, fecha}){
  return `INSERT INTO UsuarioEliminado (nombreUsuario, Fecha) VALUES ('${n_usuario}', '${fecha}')`
}

module.exports = {comprobar, sonAmigos, añadirAmigo, eliminarAmigo, listarAmigos, comprobarPuntos, editarPuntos, sesion, eliminado, habilitar, setAdministrador, modificarUsuario, eliminarCuenta}
