let iniciar = function({user, password}){
  return `SELECT * FROM Usuario WHERE nombreUsuario = '${user}' AND Passwd = '${password}'`
}

let admin = function({user}){
  return `SELECT * FROM Administrador WHERE nombreUsuario = '${user}'`
}

module.exports = {iniciar, admin}
