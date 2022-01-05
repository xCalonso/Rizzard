let subirPartida = function({id_partida, fecha, hora_guardado, horas_jugadas, estado, n_juego, n_usuario}){
  return `INSERT INTO Partida (idPartida, Fecha, horaGuardado, horasJugadas, estadoMaquina, nombreJuego, Creador) VALUES ('${id_partida}', '${fecha}', '${hora_guardado}', ${horas_jugadas}, '${estado}', '${n_juego}', '${n_usuario}')`
}
 
let tienePartida = function({n_usuario, id_partida}){
  return `INSERT INTO Tiene (idPartida, nombreUsuario) VALUES ('${id_partida}', '${n_usuario}')`
}

let comprobarPartida = function({n_usuario, id_partida}){
  return `SELECT * FROM Tiene WHERE idPartida='${id_partida}' AND nombreUsuario='${n_usuario}'`
}

module.exports = {subirPartida, tienePartida, comprobarPartida}
