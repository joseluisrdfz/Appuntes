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

const getGradosByUniId = async(req, res = response) => {

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * FROM grados WHERE id_uni = ${req.params.id}`)

    await db.end();

    //console.log(resultado);

    return res.status(200).json({
        message: `Se ha recuperado los grados de la uni ${req.params.id} `,
        total: resultado.length,
        grados: resultado
    })

}

const getAnunciosDelGrado = async(req, res = response) => {

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * FROM anuncios WHERE id_grado = ${req.params.id}`)

    await db.end();

    //console.log(resultado);

    return res.status(200).json({
        message: `Se ha recuperado los anuncios del grado ${req.params.id} `,
        total: resultado.length,
        grados: resultado
    })
}

const newGrado = async(req, res = response) => {
    const db = await mysqlConnection();
    /* let resultado;

    

    resultado = await db.query(`INSERT INTO universities (name, address, logo) VALUES ('${aux1}', '${aux2}', 'none');`)

    await db.end();

    console.log(resultado['_rejectionHandler0']); */

    let gName = req.body['grado_name'];
    let gDesc = req.body['grado_description'];
    let gUni = req.body['id_uni']
    let gCursos = req.body['cursos']

    return res.status(200).json({
        ok: true,
        gName,
        gDesc,
        gUni,
        gCursos
        /*  message: `${aux1} insertada en la base de datos.`,
         filasAfectadas: resultado['_rejectionHandler0']['affectedRows'] */
    })
}

const newAnuncioDelGrado = async(req, res = response) => {

    return res.status(200).json({
        message: 'Se han recuperado los grados',
        total: req.params.id,

    })

}




module.exports = { getGrados, getGradoById, newGrado, getAnunciosDelGrado, getGradosByUniId, newAnuncioDelGrado }