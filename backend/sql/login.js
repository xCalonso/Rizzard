let iniciar = function({user, password}){
  return `SELECT * FROM Usuario WHERE nombreUsuario = '${user}' AND Passwd = '${password}'`
}

let admin = function({user}){
  return `SELECT * FROM Administrador WHERE nombreUsuario = '${user}'`
}

let registrar = function({n_usuario, correo, password}){
  return `INSERT INTO Usuario (nombreUsuario, Correo, Passwd, Puntos) VALUES ('${n_usuario}', '${correo}', '${password}', 100)`
}

module.exports = {iniciar, admin, registrar}
