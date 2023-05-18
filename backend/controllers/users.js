const { mysqlConnection } = require('../database/mysqldb');
const bcrypt = require('bcryptjs');

const register = async(req, res = response) => {

    let username = req.body['username'];
    let name = req.body['name'];
    let surname = req.body['surname'];
    let email = req.body['email'];
    let password = req.body['password'];
    let curso = req.body['curso'];
    let uni = req.body['uni'];
    let grado = req.body['grado'];

    let profilePic = "default.jpg";

    try {

        const db = await mysqlConnection();
        let resultado;


        if (req.body['profilePicName'] && req.body['profilePicFile']) {
            profilePic = req.body['profilePicName'];

            resultado = await db.query(`SELECT * from user where profilePic = ${profilePic}`);

            if (resultado.length != 0) {

                profilePic = profilePic.split('.')[0].concat(Math.floor(Math.random() * 20000).toString()).concat('.', profilePic.split('.')[1])

            }

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
        return res.status(400).json({
            message: 'Ha habido un error en el registro',
            error: e
        })
    }

}

const getUserInfo = async(req, res = response) => {

    let idUser = req.params.id;


    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * from user where user_id = ${idUser}`);

    await db.end();

    return res.status(200).json({
        ok: true,
        total: resultado.length,
        resultado: resultado
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

        resultado = await db.query(`UPDATE users set password = ${cpassword} where user_id = '${user_id}'`);

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

    try {
        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`INSERT INTO seguir_a_usuario 
        (user, user_followed) 
        VALUES ('${user_id}','${user2Follow}');'`);


        await db.end();

        return res.status(200).json({
            ok: true,
            message: `El usuario ${user_id} ahora sigue al usuario ${user2Follow}`
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



module.exports = { register, getUserInfo, updateUserData, updateUserPassword, deleteUser, followUser, followAsignatura }