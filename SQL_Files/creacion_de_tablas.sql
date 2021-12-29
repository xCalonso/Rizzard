CREATE TABLE Usuario(
	nombreUsuario varchar(20) PRIMARY KEY,
	Correo 	varchar(40),
	Passwd	varchar(20),
	Puntos	int
);

CREATE TABLE Juego(
	nombreJuego varchar(30) PRIMARY KEY,
	Categoria   varchar(20),
	Pegi	int,
	Instalador  varchar(40),	
	nivelesRecompensa varchar(40),
	Licencia    int,
	Precio	int,
	Estado bit
);

CREATE TABLE Partida(
	idPartida varchar(30) PRIMARY KEY,
	Fecha	DATE,
	horaGuardado  TIME,
	horasJugadas	int,
	estadoMaquina  varchar(500),
	nombreJuego varchar(30) REFERENCES Juego (nombreJuego)
);

CREATE TABLE Amigos(
	nombreUsuario1  varchar(20)  REFERENCES Usuario (nombreUsuario),
	nombreUsuario2  varchar(20)  REFERENCES Usuario (nombreUsuario),
	PRIMARY KEY (nombreUsuario1, nombreUsuario2)
);

CREATE TABLE Tiene(
	idPartida varchar(30),
	nombreUsuario varchar(20),
	PRIMARY KEY (idPartida, nombreUsuario)
);

CREATE TABLE Compartido(
	nombreUsuario1  varchar(20)  REFERENCES Usuario (nombreUsuario),
	nombreUsuario2  varchar(20)  REFERENCES Usuario (nombreUsuario),
	PRIMARY KEY (nombreUsuario1, nombreUsuario2)
);

CREATE TABLE Administrador(
	nombreUsuario varchar(20) REFERENCES Usuario (nombreUsuario),
	idAdmin  varchar(20),
    PRIMARY KEY (nombreUsuario)
);

CREATE TABLE UsuarioEliminado(
	nombreUsuario varchar(20) REFERENCES Usuario (nombreUsuario),
	Fecha DATE,
    PRIMARY KEY (nombreUsuario)
);

CREATE TABLE Sesion(
	nombreUsuario varchar(20) REFERENCES Usuario (nombreUsuario),
	Fecha DATE,
	horaInicio TIME,
	horaFin TIME,
	PRIMARY KEY (nombreUsuario, Fecha, horaInicio)
);

CREATE TABLE CopiaJuego(
	numCopia int,
	nombreJuego varchar(30) REFERENCES Juego (nombreJuego),
	Version varchar(10),
	directorioInstalacion varchar(40),
	Estado varchar(20),
	nombreUsuario varchar(20) REFERENCES Usuario (nombreUsuario),
	PRIMARY KEY (numCopia, nombreJuego)
);

CREATE TABLE JuegoCompartido(
	numCopia int,
	nombreJuego varchar(30),
	nombreAmigo varchar(20) REFERENCES Usuario (nombreUsuario),
	PRIMARY KEY (numCopia, nombreJuego),
	FOREIGN KEY (numCopia, nombreJuego) REFERENCES CopiaJuego (numCopia, nombreJuego)
);
