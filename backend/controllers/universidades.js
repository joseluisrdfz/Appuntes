const { mysqlConnection } = require('../database/mysqldb');

const getUniversidades = async(req, res = response) => {

    const db = await mysqlConnection();
    let resultado;

    resultado = await db.query(`SELECT * FROM universities`)

    await db.end();

    //console.log(resultado);

    return res.status(200).json({
        ok: true,
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

    resultado = await db.query(`INSERT INTO universities (name, address, logo) VALUES ('${aux1}', '${aux2}', 'none');`)

    await db.end();

    console.log(resultado['_rejectionHandler0']);

    return res.status(200).json({
        ok: true,
        message: `${aux1} insertada en la base de datos.`,
        filasAfectadas: resultado['_rejectionHandler0']['affectedRows']
    })
}


const getUniversidad = async(req, res = response) => {
    const idUni = req.params.id;
    const db = await mysqlConnection();
    let resultado;

    resultado = await db.query(`SELECT * FROM universities where id_uni = ${idUni} `)

    await db.end();

    console.log(resultado);
    let messageAux = 'Se ha encontrado una universidad con ese id';
    if (resultado.length == 0) {
        messageAux = 'No se ha encontrado ninguna universidad con ese id';
    }

    return res.status(200).json({
        ok: true,
        message: messageAux,
        id: idUni,
        universidades: resultado
    })
}


module.exports = { getUniversidades, newUniversidad, getUniversidad }