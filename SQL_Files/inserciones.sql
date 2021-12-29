INSERT INTO Usuario (nombreUsuario, Correo, Passwd, Puntos) VALUES
	('Pablo', 'correoP@gmail.com', '123456', 100),
	('Carlos', 'correoC@gmail.com', '123456', 10),
	('Bece', 'correoB@gmail.com', '123456', 100),
	('Javi', 'correoJ@gmail.com', '123456', 100),
	('Mateos', 'correoM@gmail.com', '123456', 0);

INSERT INTO Juego (nombreJuego, Categoria, Pegi, Instalador, nivelesRecompensa, Licencia, Precio, Estado) VALUES
	('GTA5', 'Violencia Drogas', 18, '/usuario/partidas', '5,10,15,20', 43627819, 40, 1),
	('Battlefield 2042', 'Guerra Disparos', 18, '/usuario/partidas', '10,25,50', 39484879, 60, 1),
	('Grid 2', 'Conduccion', 8, '/usuario/partidas', '5,25,100', 4893204, 20, 1),
	('FIFA22', 'Deportes', 6, '/usuario/partidas', '10,20,30,40,50', 9867431, 60,1),
	('Far Cry 6', 'Aventura Violencia', 18, '/usuario/partidas', '20,40', 986453231, 60,1),
	('Cyberpunk 2077', 'Aventura Violencia', 18, '/usuario/partidas', '25,50,100', 7434321, 80,1);

INSERT INTO Partida (idPartida, Fecha, horaGuardado, horasJugadas, estadoMaquina, nombreJuego) VALUES
	('1', '2021-09-24', '16:23:32', 4, 'estado', 'GTA5'),
	('2', '2021-06-04', '13:12:11', 2, 'estado', 'GTA5'),
	('3', '2021-04-14', '18:25:36', 1, 'estado', 'Battlefield 2042'),
	('4', '2021-11-13', '16:46:33', 6, 'estado', 'Grid 2'),
	('5', '2021-07-25', '14:22:27', 12, 'estado', 'Far Cry 6'),
	('6', '2021-04-11', '11:56:48', 45, 'estado', 'Battlefield 2042'),
	('7', '2021-08-27', '14:31:13', 2, 'estado', 'Cyberpunk 2077'),
	('8', '2021-09-26', '12:16:06', 100, 'estado', 'FIFA22');

INSERT INTO Amigos (nombreUsuario1, nombreUsuario2) VALUES
	('Pablo', 'Bece'),
	('Pablo', 'Javi'),
	('Javi', 'Bece');

INSERT INTO Tiene (idPartida, nombreUsuario) VALUES
	('1', 'Pablo'),
	('1', 'Bece'),
	('2', 'Carlos'),
	('3', 'Bece'),
	('3', 'Javi'),
	('4', 'Javi'),
	('5', 'Pablo'),
	('6', 'Carlos'),
	('7', 'Bece'),
	('8', 'Javi'),
	('8', 'Pablo');

INSERT INTO Compartido (nombreUsuario1, nombreUsuario2) VALUES
	('Pablo', 'Bece'),
	('Bece', 'Javi'),
	('Javi', 'Bece');

INSERT INTO Administrador (nombreUsuario, idAdmin) VALUES
	('Pablo', 'admin1'),
	('Carlos', 'admin2');

INSERT INTO UsuarioEliminado (nombreUsuario, Fecha) VALUES
	('Mateos', CURDATE());

INSERT INTO Sesion (nombreUsuario, Fecha, horaInicio, horaFin) VALUES
	('Pablo', CURDATE(), '12:23:31', '15:34:12'),
	('Javi', '2021-12-24', '11:34:12', '12:12:32'),
	('Carlos', '2021-12-21', '13:12:43', '16:32:52'),
	('Bece', '2021-12-25', '16:43:32', '18:53:16');

INSERT INTO CopiaJuego (numCopia, nombreJuego, Version, directorioInstalacion, Estado, nombreUsuario) VALUES
	(1, 'GTA5', '3.2', 'C:/Usuarios/Pablo/Juegos/GTA5', 'jugable', 'Pablo'),
	(2, 'GTA5', '3.2', 'C:/Usuarios/Carlos/Juegos/GTA5', 'jugable', 'Carlos'),
	(1, 'FIFA22', '1.3', 'C:/Usuarios/Bece/Juegos/FIFA22', 'jugable', 'Bece'),
	(1, 'Battlefield 2042', '2.2', 'C:/Usuarios/Pablo/Juegos/Battlefield2042', 'jugable', 'Pablo'),
	(1, 'Cyberpunk 2077', '1.0', 'C:/Usuarios/Javi/Juegos/Cyberpunk2077', 'jugable', 'Javi'),
	(1, 'Far Cry 6', '1.1', 'C:/Usuarios/Carlos/Juegos/Farcry6', 'jugable', 'Javi'),
	(3, 'GTA5', '3.2', 'C:/Usuarios/Bece/Juegos/GTA5', 'jugable', 'Bece'),
	(2, 'Battlefield 2042', '2.2', 'C:/Usuarios/Bece/Juegos/Battlefield2042', 'jugable', 'Bece'),
	(2, 'FIFA22', '1.3', 'C:/Usuarios/Javi/Juegos/FIFA22', 'jugable', 'Javi'),
	(2, 'Cyberpunk 2077', '1.0', 'C:/Usuarios/Bece/Juegos/Cyberpunk2077', 'jugable', 'Bece'),
	(2, 'Far Cry 6', '1.1', 'C:/Usuarios/Bece/Juegos/Farcry6', 'jugable', 'Bece');

INSERT INTO JuegoCompartido (numCopia, nombreJuego, nombreAmigo) VALUES
	(3, 'GTA5', 'Pablo'),
	(2, 'Battlefield 2042', 'Pablo'),
	(2, 'FIFA22', 'Bece'),
	(2, 'Cyberpunk 2077', 'Javi'),
	(2, 'Far Cry 6', 'Javi');
