const { mysqlConnection } = require('../database/mysqldb');

const getUniversidades = async(req, res = response) => {

    const db = await mysqlConnection();
    let resultado;

    resultado = await db.query(`SELECT * FROM universities`)

    await db.end();

    //console.log(resultado);

    return res.status(200).json({
        message: 'Se han recuperado las universidades',
        total: resultado.length,
        universidades: resultado
    })
}

const newUniversidad = async(req, res = response) => {
    const db = await mysqlConnection();
    let resultado;

    let aux1 = req.body['name'];
    let aux2 = req.body['address'];

    resultado = db.query(`INSERT INTO universities (name, address, logo) VALUES ('${aux1}', '${aux2}', 'none');`)

    await db.end();

    console.log(resultado['_rejectionHandler0']);

    return res.status(200).json({
        filasAfectadas: resultado['_rejectionHandler0']['affectedRows'],
        message: `${aux1} insertada en la base de datos.`
    })
}

module.exports = { getUniversidades, newUniversidad }