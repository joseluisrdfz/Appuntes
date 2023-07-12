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
    try {
        const idGrado = req.params.id;

        const db = await mysqlConnection();

        let grado_data;

        grado_data = await db.query(`SELECT grados.*, 
        (SELECT universities.name FROM universities WHERE universities.id_uni = grados.id_uni) as uni_name
        FROM grados WHERE id_grado = ${idGrado}`);

        let asignaturas;

        asignaturas = await db.query(`SELECT * FROM asignaturas WHERE grado = ${idGrado}`);

        await db.end();

        //console.log(resultado);

        return res.status(200).json({
            message: 'Se ha recuperado el grado',
            grado_data: grado_data[0],
            asignaturas
        })
    } catch (e) {
        return res.status(404).json({
            message: 'Ha habido un problema',
            error: e
        })
    }

}

const getGradosByUniId = async(req, res = response) => {
    try {
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

    } catch (e) {
        return res.status(404).json({
            message: 'Ha habido un problema',
            error: e
        })
    }

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
        anuncios: resultado
    })
}

const newGrado = async(req, res = response) => {
    const db = await mysqlConnection();

    let gName = req.body['grado_name'];
    let gDesc = req.body['grado_description'];
    let gUni = req.body['id_uni']
    let gCursos = req.body['cursos']

    let resultado;

    resultado = await db.query(`INSERT INTO grados (grado_name, grado_description, cursos, id_uni) VALUES ('${gName}','${gDesc}','${gCursos}','${gUni}');`)

    await db.end();

    console.log(resultado);

    return res.status(200).json({
        ok: true,
        message: `${gName} insertada en la base de datos.`,
        filasAfectadas: resultado['affectedRows'],
        insertID: resultado['insertId']
    })
}

const newAnuncioDelGrado = async(req, res = response) => {
    const db = await mysqlConnection();

    let idGrado = req.params.id;
    let aText = req.body['texto_anuncio'];

    let resultado;

    resultado = await db.query(`INSERT INTO anuncios (id_grado,texto_anuncio) VALUES ('${idGrado}','${aText}');`)

    await db.end();

    console.log(resultado);

    return res.status(200).json({
        ok: true,
        message: `Anuncio: '${aText}' de la carrera '${idGrado}' insertado en la base de datos.`,
        filasAfectadas: resultado['affectedRows'],
        insertID: resultado['insertId']
    })

}




module.exports = { getGrados, getGradoById, newGrado, getAnunciosDelGrado, getGradosByUniId, newAnuncioDelGrado }