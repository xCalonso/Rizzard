-- Usuario gasta más puntos de los que tiene

CREATE OR REPLACE TRIGGER gastoPuntos
	BEFORE
	UPDATE OF Puntos ON Usuario
	FOR EACH ROW
BEGIN
	IF :new.Puntos < 0 THEN
		raise_application_error(-20600, :new.Puntos || 'no se pueden gastar más puntos de los que tiene');
	END IF;
END;


-- Usuario compra un juego que ya tiene

CREATE OR REPLACE TRIGGER juegoRepetido
	BEFORE
	INSERT ON CopiaJuego
	FOR EACH ROW
DECLARE
	juego INT;
BEGIN
	SELECT count(*) INTO juego FROM CopiaJuego WHERE nombreJuego = :new.nombreJuego and nombreUsuario = :new.nombreUsuario;
	IF (juego > 0) THEN
		raise_application_error(-20600, :new.nombreJuego || ' el usuario ya dispone de este juego ');
	END IF;
END;


-- Biblioteca solo se puede compartir con un máximo de 5 amigos

CREATE OR REPLACE TRIGGER maxCompartido
	BEFORE
	INSERT ON Compartido
	FOR EACH ROW
DECLARE
	num_compartido INT;
BEGIN
	SELECT count(*) INTO num_compartido FROM Compartido WHERE nombreUsuario1 = :new.nombreUsuario1;
	IF (num_compartido > 4) THEN
		raise_application_error(-20600, :new.nombreUsuario1 || ' no se puede compartir con más de 5 amigos ');
	END IF;
END;


-- Correo electronico ya registrado

CREATE OR REPLACE TRIGGER correoExistente
	BEFORE
	INSERT ON Usuario
	FOR EACH ROW
DECLARE
	correo INT;
BEGIN
	SELECT count(*) INTO correo FROM Usuario WHERE Correo = :new.Correo;
	IF(correo > 0) THEN
		raise_application_error(-20600, :new.Correo || ' ya existe un usuario registrado con esa dirección de correo ');
	END IF;
END;

-- Nombre de usuario ya registrado

CREATE OR REPLACE TRIGGER nombreExistente
	BEFORE
	INSERT ON Usuario
	FOR EACH ROW
DECLARE
	nombre INT;
BEGIN
	SELECT count(*) INTO nombre FROM Usuario WHERE nombreUsuario = :new.nombreUsuario;
	IF(nombre > 0) THEN
		raise_application_error(-20600, :new.nombreUsuario || ' ya existe un usuario registrado con ese nombre de usuario ');
	END IF;
END;

-- Añadir amigo que ya es tu amigo

CREATE OR REPLACE TRIGGER amigoExistente
	BEFORE
	INSERT ON Amigos
	FOR EACH ROW
DECLARE
	amigo INT;
BEGIN
	SELECT count(*) INTO amigo FROM Amigos WHERE (nombreUsuario1 = :new.nombreUsuario1 and nombreUsuario2 = :new.nombreUsuario2) or (nombreUsuario1 = :new.nombreUsuario2 and nombreUsuario2 = :new.nombreUsuario1);
	IF (amigo > 0) THEN
		raise_application_error(-20600, :new.nombreUsuario2 || ' este usuario ya es tu amigo ');
	END IF;
END;

-- Eliminar amigo que no es tu amigo

CREATE OR REPLACE TRIGGER amigoExistente
	BEFORE
	DELETE ON Amigos
	FOR EACH ROW
DECLARE
	amigo INT;
BEGIN
	SELECT count(*) INTO amigo FROM Amigos WHERE (nombreUsuario1 = :old.nombreUsuario1 and nombreUsuario2 = :old.nombreUsuario2) or (nombreUsuario1 = :old.nombreUsuario2 and nombreUsuario2 = :old.nombreUsuario1);
	IF (amigo = 0) THEN
		raise_application_error(-20600, :new.nombreUsuario2 || ' este usuario no es tu amigo ');
	END IF;
END;

-- Máximo 250 amigos

CREATE OR REPLACE TRIGGER maxAmigos
	BEFORE
	INSERT ON Amigos
	FOR EACH ROW
DECLARE
	amigosUsr1 INT;
	amigosUsr2 INT;
BEGIN
	SELECT count(*) INTO amigosUsr1 FROM Amigos WHERE nombreUsuario1 = :new.nombreUsuario1 or nombreUsuario2 = :new.nombreUsuario1;
	SELECT count(*) INTO amigosUsr2 FROM Amigos WHERE nombreUsuario1 = :new.nombreUsuario2 or nombreUsuario2 = :new.nombreUsuario2;
	IF (amigosUsr1 > 249) THEN
		raise_application_error(-20600, :new.nombreUsuario1 || ' este usuario ya tiene el máximo número de amigos permitido ');
	END IF;
	IF (amigosUsr2 > 249) THEN
		raise_application_error(-20600, :new.nombreUsuario2 || ' este usuario ya tiene el máximo número de amigos permitido ');
	END IF;
END;

-- Juego ya existente		

CREATE OR REPLACE TRIGGER juegoExistente
	BEFORE
	INSERT ON Juego
	FOR EACH ROW
DECLARE
	juego INT;
BEGIN
	SELECT count(*) INTO juego FROM Juego WHERE nombreJuego = :new.nombreJuego;
	IF (juego > 0) THEN
		raise_application_error(-20600, :new.nombreJuego || ' este juego ya está registrado en la base de datos ');
	END IF;
END;

-- Reembolsar puntos por devolucion de juego y comprobar que tenga suficientes puntos para devolver el juego	

CREATE OR REPLACE TRIGGER devolverJuego
	BEFORE
	DELETE ON CopiaJuego
	FOR EACH ROW
DECLARE
	puntos_usr INT;
	puntos_jgo INT;
BEGIN
	SELECT Puntos INTO puntos_usr FROM Usuario WHERE nombreUsuario = :old.nombreUsuario;
	SELECT Precio INTO puntos_jgo FROM Juego WHERE nombreJuego = :old.nombreJuego;
	IF (puntos_usr + :old.puntosGastados < puntos_jgo*10) THEN
		raise_application_error(-20600, :old.nombreJuego || ' no dispone de puntos suficientes para devolver el juego ');
	ELSE UPDATE Usuario SET Puntos = Puntos + :old.puntosGastados WHERE nombreUsuario = :old.nombreUsuario;
	END IF;
END;



-- Puntos insuficientes para devolver juego

CREATE OR REPLACE TRIGGER noPuntosDevolverJuego
	BEFORE
	DELETE ON CopiaJuego
	FOR EACH ROW
DECLARE
	puntos_usr INT;
	puntos_jgo INT;
BEGIN
	SELECT Puntos INTO puntos_usr FROM Usuario WHERE nombreUsuario = :old.nombreUsuario;
	SELECT Precio INTO puntos_jgo FROM Juego WHERE nombreJuego = :old.nombreJuego;
	IF (puntos_usr < puntos_jgo*100) THEN
		raise_application_error(-20600, :old.nombreJuego || ' no dispone de puntos suficientes para devolver el juego ');
	END IF;
END;




