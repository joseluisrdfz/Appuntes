const jwt = require('jsonwebtoken');

const generarJWT = (id, rol) => {

    return new Promise((resolve, reject) => {

        const payload = {
            id,
            rol
        }

        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '30d'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });

    });
}

module.exports = { generarJWT }