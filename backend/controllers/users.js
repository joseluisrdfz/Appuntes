const { mysqlConnection } = require('../database/mysqldb');
const bcrypt = require('bcryptjs');
const fs = require('fs')

const archivosValidos = {
    fotoperfil: ['jpeg', 'jpg', 'png', 'webp'],
}

const register = async(req, res = response) => {

    let username = req.body['username'];
    let name = req.body['name'];
    let surname = req.body['surname'];
    let email = req.body['email'];
    let password = req.body['password'];
    let curso = req.body['curso'];
    let uni = req.body['uni'];
    let grado = req.body['grado'];

    let profilePic = "default.webp";

    try {

        const db = await mysqlConnection();
        let resultado;


        if (req.body['profilePicName'] && req.body['profilePicFile']) {
            profilePic = req.body['profilePicName'];

            const nombrePartido = profilePic.split('.');
            const extension = nombrePartido[nombrePartido.length - 1];

            //console.log(req.body)

            encoding = 'base64';
            archivo = req.body['profilePicFile'].replace(/^.+?(;base64),/, '');
            if (!archivosValidos.fotoperfil.includes(extension)) {
                return res.status(406).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.fotoperfil})`
                });
            }
            patharchivo = process.cwd().split('backend')[0] + 'frontend/src/assets/uploads/profilePics/' + profilePic;

            //hacer que se guarde con la fecha y el id del usuario o con lo del numero aleatorio de mas abajo pero la opcion primera no es mala

            fs.writeFile(patharchivo, archivo, encoding, err => {
                /* if (err) {
                    console.log(err);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se pudo subir el archivo`,
                    });
                } */
            })

            /* resultado = await db.query(`SELECT * from user where profilePic = ${profilePic}`);

            if (resultado.length != 0) {

                profilePic = profilePic.split('.')[0].concat(Math.floor(Math.random() * 20000).toString()).concat('.', profilePic.split('.')[1])

            }
 */
            //save image file
        }





        resultado = await db.query(`SELECT * FROM users where username = '${username}'`);

        if (resultado.length != 0) {
            await db.end();
            return res.status(400).json({
                ok: false,
                message: 'Este nombre de usuario ya existe en la base de datos',
            })
        }

        resultado = await db.query(`SELECT * FROM users where email = '${email}'`);

        if (resultado.length != 0) {
            await db.end();
            return res.status(400).json({
                ok: false,
                message: 'Este email ya existe en la base de datos',
            })
        }

        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        resultado = await db.query(`INSERT INTO users 
        (username, profilePic, name, surname, email, password, curso, uni, grado ) 
        VALUES ('${username}','${profilePic}','${name}','${surname}','${email}','${cpassword}','${curso}','${uni}','${grado}');`);

        await db.end();

        return res.status(200).json({
            ok: true,
            message: 'Se ha registrado el usuario',
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: 'Ha habido un error en el registro',
            error: e
        })
    }

}

const getUserInfo = async(req, res = response) => {

    try {
        let idUser = req.params.id;

        let idUsertoken = req.idToken;


        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`SELECT username,	
            profilePic,	rol, name, surname,	email, register_dateTime, lastConexion, curso, uni,	grado,
            (Select count(*) from preguntas as p WHERE p.user_id =  ${idUser}) as preguntas,
            (Select count(*) from respuestas as r WHERE r.user =  ${idUser}) as respuestas ,
            (Select count(*) from seguir_a_usuario as seg WHERE seg.user_followed =  ${idUser}) as seguidores,
            (Select count(*) from apuntes as ap WHERE ap.user =  ${idUser}) as apuntes,
            (SELECT grados.grado_name from grados where grados.id_grado = users.grado ) as grado_name,
            (SELECT universities.name from universities where universities.id_uni = users.uni ) as uni_name
            FROM users WHERE users.user_id = ${idUser}`);

        let apuntes;

        apuntes = await db.query(`select DISTINCT apuntes.id_apuntes,apuntes.filename,apuntes.titlename,apuntes.visualizaciones,apuntes.downloads, apuntes.description,apuntes.upload_datetime ,apuntes.user , apuntes.asignatura as asignatura_id,
         (Select asignaturas.name from asignaturas where asignaturas.id_asignatura = apuntes.asignatura) as asignatura_name, 
         (Select grados.grado_name from asignaturas, grados where asignaturas.grado = grados.id_grado and asignaturas.id_asignatura = apuntes.asignatura ) as grado_name ,
          (Select count(*) from preguntas_apuntes as p WHERE p.id_apuntes = apuntes.id_apuntes ) as preguntas,
           (SELECT users.username FROM users WHERE users.user_id = apuntes.user) as username,
            (SELECT users.profilePic FROM users WHERE users.user_id = apuntes.user) as profilePic FROM apuntes where apuntes.user = ${idUser}`);

        let preguntas;

        preguntas = await db.query(`SELECT DISTINCT preguntas.*, (SELECT COUNT(*) FROM respuestas where respuestas.pregunta = preguntas.id_pregunta ) as respuestas,

        (SELECT asignaturas.name FROM asignaturas,preguntas_asignaturas WHERE asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as asignatura_name,

        (SELECT asignaturas.id_asignatura FROM asignaturas,preguntas_asignaturas WHERE asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as asignatura_id,

        (SELECT grados.grado_name FROM grados,asignaturas, preguntas_asignaturas WHERE grados.id_grado = asignaturas.grado and asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as grado_name,

        (SELECT apuntes.titlename FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_title,

        (SELECT apuntes.id_apuntes FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_id,
        (SELECT asignaturas.name FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta)) as apuntes_asignatura,

        (SELECT grados.grado_name FROM grados WHERE grados.id_grado = (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta))) as apuntes_grado,

        (SELECT users.username FROM users WHERE users.user_id = preguntas.user_id) as username,
        (SELECT users.profilePic FROM users WHERE users.user_id = preguntas.user_id) as profilePic

        FROM preguntas WHERE preguntas.user_id = ${idUser}`);

        let respuestas;

        respuestas = await db.query(`SELECT respuestas.*, 
        (SELECT users.username from users where users.user_id = respuestas.user) as username,
        (SELECT users.profilePic from users where users.user_id = respuestas.user) as profilePic
        FROM respuestas WHERE respuestas.user = ${idUser}`);

        let seguido;

        seguido = await db.query(`Select count(*) as seguido from seguir_a_usuario WHERE seguir_a_usuario.user = ${idUsertoken} and seguir_a_usuario.user_followed = ${idUser};`);


        await db.end();

        let perfilpropio = false;
        if (idUser == idUsertoken) {
            perfilpropio = true;

        }

        return res.status(200).json({
            ok: true,
            message: 'se ha recuperado al usuario',
            datos: resultado[0],
            apuntes: apuntes,
            preguntas: preguntas,
            respuestas: respuestas,
            perfilpropio,
            seguido: seguido[0]
        })
    } catch (err) {
        return res.status(200).json({
            ok: true,
            message: 'se ha recuperado al usuario',
            datos: resultado[0]
        })
    }
}

const getUserMyInfo = async(req, res = response) => {

    let idUser = req.idToken;


    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT user_id , username,	
    profilePic,	rol, name, surname,	email, register_dateTime, lastConexion, curso, uni,	grado,
    (Select count(*) from preguntas as p WHERE p.user_id =  ${idUser}) as preguntas,
    (Select count(*) from respuestas as r WHERE r.user =  ${idUser}) as respuestas ,
    (Select count(*) from seguir_a_usuario as seg WHERE seg.user_followed =  ${idUser}) as seguidores,
    (Select count(*) from apuntes as ap WHERE ap.user =  ${idUser}) as apuntes
    FROM users WHERE users.user_id = ${idUser}`);

    await db.end();

    return res.status(200).json({
        ok: true,
        total: resultado.length,
        userinfo: resultado
    })
}

const updateUserData = async(req, res = response) => {

    let idUser = req.idToken;

    try {
        const db = await mysqlConnection();
        let resultado;


        let campos = '';

        if (req.body['username']) {
            campos = campos.concat(` username = ${req.body['username']} `);
        }

        if (req.body['name']) {
            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` name = ${req.body['name']} `);
        }
        if (req.body['surname']) {
            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` surname = ${req.body['surname']} `);
        }
        if (req.body['email']) {
            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` email = ${req.body['email']} `);
        }
        if (req.body['curso']) {
            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` curso = ${req.body['curso']} `);
        }
        if (req.body['uni']) {
            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` uni = ${req.body['uni']} `);
        }
        if (req.body['grado']) {
            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` grado = ${req.body['grado']} `);
        }


        resultado = await db.query(`SELECT * FROM users where username = '${req.body['username']}'`);

        if (resultado.length != 0) {
            await db.end();
            return res.status(400).json({
                ok: false,
                message: 'Este nombre de usuario ya existe en la base de datos',
            })
        }

        resultado = await db.query(`SELECT * FROM users where email = '${req.body['email']}'`);

        if (resultado.length != 0) {
            await db.end();
            return res.status(400).json({
                ok: false,
                message: 'Este email ya existe en la base de datos',
            })
        }

        if (req.body['profilePicName'] && req.body['profilePicFile']) {
            let profilePic = req.body['profilePicName'];

            resultado = await db.query(`SELECT * from user where profilePic = ${profilePic}`);

            if (resultado.length != 0) {

                profilePic = profilePic.split('.')[0].concat(Math.floor(Math.random() * 20000).toString()).concat('.', profilePic.split('.')[1])

            }

            if (campos.length > 0) {
                campos = campos.concat(',');
            }
            campos = campos.concat(` profilePic = ${profilePic} `);

            //save image file
        }






        resultado = await db.query(`UPDATE users SET ${campos} where user_id = ${idUser}`);

        await db.end();

        return res.status(200).json({
            ok: true,
            message: 'Se ha actualizado el usuario',
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })
    } catch (e) {
        return res.status(400).json({
            message: 'Ha habido un error en la actualizacion',
            error: e
        })
    }

}

const updateUserPassword = async(req, res = response) => {

    let user_id = req.idToken;

    let oldPassword = req.body['oldPasword'];
    let newPassword = req.body['newPassword'];


    try {
        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`SELECT * from users where user_id = '${user_id}'`);

        const validPassword = bcrypt.compareSync(oldPassword, resultado[0]['password']);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Antigua contraseña incorrecta'
            });
        }

        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(newPassword, salt);

        resultado = await db.query(`UPDATE users set password = "${cpassword}" where user_id = '${user_id}'`);

        await db.end();

        return res.status(200).json({
            ok: true,
            message: "Se ha cambiado la contraseña correectamente"
        });

    } catch (e) {
        return res.status(400).json({
            message: 'Ha habido un error en el cambio de contraseña',
            error: e
        })
    }

}

const deleteUser = async(req, res = response) => {

    let user_id = req.idToken;

    try {
        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`DELETE from users where user_id = '${user_id}'`);


        await db.end();

        return res.status(200).json({
            ok: true,
            message: "Se ha eliminado el usuario correctamente"
        });

        //Se deberian eliminar los archivos asociados al usuario

    } catch (e) {
        return res.status(400).json({
            message: 'Ha habido un error en el borrado del usuario',
            error: e
        })
    }

}


const followUser = async(req, res = response) => {

    let user_id = req.idToken;

    let user2Follow = req.params.id;

    let message = '';

    try {
        const db = await mysqlConnection();

        let seguido;

        seguido = await db.query(`SELECT count(*) from seguir_a_usuario WHERE seguir_a_usuario.user = ${user_id} and seguir_a_usuario.user_followed = ${user2Follow}`)

        let resultado;

        let seguidoBool = false;

        console.log(seguido[0]['count(*)'])


        if (seguido[0]['count(*)'] === 0) {


            resultado = await db.query(`INSERT INTO seguir_a_usuario (user, user_followed) VALUES ('${user_id}','${user2Follow}');`);

            message = `El usuario ${user_id} ahora sigue al usuario ${user2Follow}`;

            seguidoBool = true;

        } else {

            resultado = await db.query(`DELETE FROM seguir_a_usuario WHERE seguir_a_usuario.user = ${user_id} and seguir_a_usuario.user_followed = ${user2Follow};`);

            message = `El usuario ${user_id} ha dejado de seguir al usuario ${user2Follow}`;

            seguidoBool = false;
        }

        await db.end();

        return res.status(200).json({
            ok: true,
            message: message,
            seguidoBool
        });



    } catch (e) {
        return res.status(400).json({
            message: 'Ha habido un error en el seguido de un usuario',
            error: e
        })
    }

}

const followAsignatura = async(req, res = response) => {

    let user_id = req.idToken;

    let asig2Follow = req.params.id;

    try {
        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`INSERT INTO seguir_a_asignatura
        (user, asignatura) 
        VALUES ('${user_id}','${asig2Follow}');'`);


        await db.end();

        return res.status(200).json({
            ok: true,
            message: `El usuario ${user_id} ahora sigue a la asignatura ${asig2Follow}`
        });



    } catch (e) {
        return res.status(400).json({
            message: 'Ha habido un error en el seguido de una asignatura',
            error: e
        })
    }

}

const getFeed = async(req, res = response) => {

    /* asignaturas que sigues (apuntes, preguntas), comienzas siguiendo a todas las asignsturas de tu grado y curso

    usuario que sigues (apuntes, preguntas) 
    
    */

    /* consulta apuntees 
    select apuntes.* from apuntes,seguir_a_asignatura as asig, seguir_a_usuario as usr 
    where (asig.user = ${idUser} and asig.asignatura = apuntes.asignatura)
     or ( usr.user = ${idUser} and usr.user_followed = apuntes.user )

 consulta preguntas 

 select DISTINCT preguntas.* from preguntas, preguntas_asignaturas as preasig, seguir_a_asignatura as sasig, seguir_a_usuario as sus 
 where (sasig.user = 1 and preasig.id_asignatura = sasig.asignatura and preasig.id_pregunta = preguntas.id_pregunta)
  or (sus.user = 1 and sus.user_followed = preguntas.user_id);
    */


    try {


        let idUser = req.idToken;

        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`
            select DISTINCT 
            apuntes.id_apuntes,apuntes.filename,apuntes.titlename,apuntes.visualizaciones,apuntes.downloads,
            apuntes.description,apuntes.upload_datetime ,apuntes.user , apuntes.asignatura as asignatura_id,
            (Select asignaturas.name from asignaturas where asignaturas.id_asignatura = apuntes.asignatura) as asignatura_name, 
            (Select grados.grado_name from asignaturas, grados where asignaturas.grado = grados.id_grado and asignaturas.id_asignatura = apuntes.asignatura ) as grado_name ,
            (Select count(*) from preguntas_apuntes as p WHERE p.id_apuntes = apuntes.id_apuntes ) as preguntas, 
            (SELECT users.username FROM users WHERE users.user_id = apuntes.user) as username,
            (SELECT users.profilePic FROM users WHERE users.user_id = apuntes.user) as profilePic
            FROM apuntes,seguir_a_asignatura as asig, seguir_a_usuario as usr where (asig.user = ${idUser} and asig.asignatura = apuntes.asignatura) or ( usr.user = ${idUser} and usr.user_followed = apuntes.user );`);

        let resultado2;
        resultado2 = await db.query(`
        SELECT DISTINCT preguntas.*, (SELECT COUNT(*) FROM respuestas where respuestas.pregunta = preguntas.id_pregunta ) as respuestas,

        (SELECT asignaturas.name FROM asignaturas,preguntas_asignaturas WHERE asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as asignatura_name,

        (SELECT asignaturas.id_asignatura FROM asignaturas,preguntas_asignaturas WHERE asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as asignatura_id,

        (SELECT grados.grado_name FROM grados,asignaturas, preguntas_asignaturas WHERE grados.id_grado = asignaturas.grado and asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as grado_name,

        (SELECT apuntes.titlename FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_title,

        (SELECT apuntes.id_apuntes FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_id,
        (SELECT asignaturas.name FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta)) as apuntes_asignatura,

        (SELECT grados.grado_name FROM grados WHERE grados.id_grado = (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta))) as apuntes_grado,

        (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta)) as apuntes_grado_id,

        (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_asignatura_id,

        (SELECT users.username FROM users WHERE users.user_id = preguntas.user_id) as username,
        (SELECT users.profilePic FROM users WHERE users.user_id = preguntas.user_id) as profilePic

        FROM preguntas, preguntas_asignaturas as preasig, seguir_a_asignatura as sasig, seguir_a_usuario as sus 
        
        WHERE (sasig.user = ${idUser} and preasig.id_asignatura = sasig.asignatura and preasig.id_pregunta = preguntas.id_pregunta) OR (sus.user = ${idUser} and sus.user_followed = preguntas.user_id);`);

        await db.end();

        return res.status(200).json({
            ok: true,
            total: resultado.length,
            apuntes: resultado,
            preguntas: resultado2
        })
    } catch (e) {
        return res.status(400).json({
            ok: false,
            error: e,
        })
    }

}

const getBusqueda = async(req, res = response) => {
    try {
        let idUsertoken = req.idToken;

        let query = req.query.query;


        const db = await mysqlConnection();

        let usuarios;

        usuarios = await db.query(`SELECT username,	
            profilePic,	rol, name, surname,	email, register_dateTime, lastConexion, curso, uni,	grado,
            (Select count(*) from preguntas as p WHERE p.user_id = users.user_id) as preguntas,
            (Select count(*) from respuestas as r WHERE r.user =  users.user_id) as respuestas ,
            (Select count(*) from seguir_a_usuario as seg WHERE seg.user_followed = users.user_id) as seguidores,
            (Select count(*) from apuntes as ap WHERE ap.user = users.user_id) as apuntes,
            (SELECT grados.grado_name from grados where grados.id_grado = users.grado ) as grado_name,
            (SELECT universities.name from universities where universities.id_uni = users.uni ) as uni_name
            FROM users WHERE users.username LIKE '%${query}%'`);

        let grados;

        grados = await db.query(`SELECT grados.*, 
            (SELECT universities.name FROM universities WHERE universities.id_uni = grados.id_uni) as uni_name
            FROM grados WHERE grado_name LIKE '%${query}%'`);

        let universidades;

        universidades = await db.query(`SELECT * FROM universities where name LIKE '%${query}%' `);

        let apuntes;

        apuntes = await db.query(`SELECT apuntes.*, (SELECT asignaturas.name FROM asignaturas WHERE asignaturas.id_asignatura = apuntes.asignatura) as asignatura_name,
            (SELECT grados.grado_name FROM grados WHERE grados.id_grado =
            (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = apuntes.asignatura)) as grado,
            (SELECT grados.id_grado FROM grados WHERE grados.id_grado =
            (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = apuntes.asignatura)) as gradoId,
            (SELECT users.username FROM users WHERE users.user_id = apuntes.user) as user_username,
            (SELECT users.profilePic FROM users WHERE users.user_id = apuntes.user) as user_profilePic,
            (SELECT count(*) FROM preguntas_apuntes WHERE preguntas_apuntes.id_apuntes = apuntes.id_apuntes) as preguntas
            FROM apuntes WHERE titlename LIKE '%${query}%'`);

        let preguntas;

        preguntas = await db.query(`SELECT preguntas.*, 
        preguntas.*, (SELECT COUNT(*) FROM respuestas where respuestas.pregunta = preguntas.id_pregunta ) as respuestas,

        (SELECT asignaturas.name FROM asignaturas,preguntas_asignaturas WHERE asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as asignatura_name,

        (SELECT asignaturas.id_asignatura FROM asignaturas,preguntas_asignaturas WHERE asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as asignatura_id,

        (SELECT grados.grado_name FROM grados,asignaturas, preguntas_asignaturas WHERE grados.id_grado = asignaturas.grado and asignaturas.id_asignatura = preguntas_asignaturas.id_asignatura and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta) as grado_name,

        (SELECT apuntes.titlename FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_title,

        (SELECT apuntes.id_apuntes FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_id,
        (SELECT asignaturas.name FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta)) as apuntes_asignatura,

        (SELECT grados.grado_name FROM grados WHERE grados.id_grado = (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta))) as apuntes_grado,

        (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta)) as apuntes_grado_id,

        (SELECT apuntes.asignatura FROM apuntes, preguntas_apuntes WHERE apuntes.id_apuntes = preguntas_apuntes.id_apuntes and preguntas_apuntes.id_pregunta = preguntas.id_pregunta) as apuntes_asignatura_id,

        (SELECT users.username FROM users WHERE users.user_id = preguntas.user_id) as username,
        (SELECT users.profilePic FROM users WHERE users.user_id = preguntas.user_id) as profilePic
        FROM preguntas WHERE preguntas.texto_pregunta LIKE '%${query}%'`);

        let respuestas;

        respuestas = await db.query(`SELECT respuestas.*, 
            (SELECT users.username from users where users.user_id = respuestas.user) as username,
            (SELECT users.profilePic from users where users.user_id = respuestas.user) as profilePic
            FROM respuestas WHERE respuestas.texto_respuesta LIKE '%${query}%'`);

        let asignaturas;

        asignaturas = await db.query(`SELECT asignaturas.*,
            (SELECT grados.grado_name FROM grados WHERE asignaturas.grado = grados.id_grado) as grado_name,
            (SELECT universities.id_uni FROM universities WHERE universities.id_uni = (SELECT grados.id_uni FROM grados WHERE asignaturas.grado = grados.id_grado)) as uni_id,
            (SELECT universities.name FROM universities WHERE universities.id_uni = (SELECT grados.id_uni FROM grados WHERE asignaturas.grado = grados.id_grado)) as uni_name,
            (SELECT count(*) FROM seguir_a_asignatura WHERE seguir_a_asignatura.asignatura = asignaturas.id_asignatura) as seguidores
            FROM asignaturas WHERE asignaturas.name LIKE '%${query}%'`);

        return res.status(200).json({
            ok: true,
            message: 'Se ha recuperado el resultado de la búsqueda',
            query,
            usuarios,
            grados,
            universidades,
            apuntes,
            respuestas,
            preguntas,
            asignaturas
        })
    } catch (e) {
        return res.status(400).json({
            ok: false,
            error: e,
        })
    }

}



module.exports = { register, getUserInfo, getUserMyInfo, updateUserData, updateUserPassword, deleteUser, followUser, followAsignatura, getFeed, getBusqueda }