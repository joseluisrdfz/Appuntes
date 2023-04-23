const { mysqlConnection } = require('../database/mysqldb');

const getGrados = async(req, res = response) => {


    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * FROM grados`)

    await db.end();

    //console.log(resultado);

    return res.status(200).json({
        message: 'Se han recuperado los grados',
        total: resultado.length,
        grados: resultado
    })

}

const getGradoById = async(req, res = response) => {
    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * FROM grados WHERE id_grado = ${req.params.id}`)

    await db.end();

    //console.log(resultado);

    return res.status(200).json({
        message: 'Se ha recuperado el grado',
        total: resultado.length,
        grados: resultado
    })

}

const newGrado = async(req, res = response) => {}

const getAnunciosDelGrado = async(req, res = response) => {

    return res.status(200).json({
        message: 'Se han recuperado los grados',
        total: req.params.id,

    })

}

module.exports = { getGrados, getGradoById, newGrado, getAnunciosDelGrado }