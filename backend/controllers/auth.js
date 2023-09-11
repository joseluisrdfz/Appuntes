const { mysqlConnection } = require('../database/mysqldb');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { infoToken } = require('../helpers/infotoken');

const login = async(req, res = response) => {

    const { username, password } = req.body;

    try {

        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`SELECT * from users where username = '${username}'`);

        if (resultado.length == 0) {
            await db.end();
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, resultado[0]['password']);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        const user_id = resultado[0]['user_id']
        const rol = resultado[0]['rol'];
        const token = await generarJWT(user_id, rol);

        resultado = await db.query(`UPDATE users set lastConexion = ${Date.now()} where user_id = '${user_id}'`);

        await db.end();

        return res.status(200).json({
            ok: true,
            msg: 'login correcto',
            id: user_id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}


const renovarToken = async(req, res = response) => {

    const token = req.header('x-token') || req.query.token;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Falta el token de autorización'
        });
    }

    try {
        const infotoken = infoToken(token);
        return res.status(200).json({
            ok: true,
            msg: 'El token es válido'
        })
    } catch (err) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
}




module.exports = { login, renovarToken }