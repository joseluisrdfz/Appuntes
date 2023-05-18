const { mysqlConnection } = require('../database/mysqldb');

const getApuntes = async(req, res = response) => {

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * FROM apuntes`)

    await db.end();

    return res.status(200).json({
        message: 'Se han recuperado los apuntes',
        total: resultado.length,
        grados: resultado
    })

}


const getApuntesDeAsignatura = async(req, res = response) => {

    let id_asignatura = req.params.id;


    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * from apuntes where asignatura = ${id_asignatura}`);

    await db.end();

    return res.status(200).json({
        ok: true,
        total: resultado.length,
        resultado: resultado
    })
}


const getApuntesById = async(req, res = response) => {

    let id_apuntes = req.params.id;

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * from apuntes where id_apuntes = ${id_apuntes}`);

    let views = resultado[0]['visualizaciones'] + 1;

    resultado[0]['visualizaciones'] = resultado[0]['visualizaciones'] + 1;

    let resultado2;

    resultado2 = await db.query(`UPDATE apuntes set visualizaciones = ${views}  where id_apuntes = ${id_apuntes}`);

    await db.end();

    return res.status(200).json({
        ok: true,
        total: resultado.length,
        resultado: resultado
    })
}

const descargarApuntes = async(req, res = response) => {
    // aqui habra que devolver el contenido del archivo para que lo pueda descargar
    let id_apuntes = req.params.id;

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT downloads from apuntes where id_apuntes = ${id_apuntes}`);

    let downloads = resultado[0]['downloads'] + 1;

    resultado = await db.query(`UPDATE apuntes set downloads = ${downloads}  where id_apuntes = ${id_apuntes}`);

    await db.end();

    return res.status(200).json({
        ok: true,
        filasAfectadas: resultado['affectedRows'],
    })
}

const newApuntes = async(req, res = response) => {
    try {
        const db = await mysqlConnection();

        console.log(req)

        let filename = req.body['filename'];
        let titlename = req.body['titlename'];
        let file = req.body['file'];
        let asignatura = req.body['asignatura'];
        let user = req.idToken;

        let description = '';
        if (req.body['description']) {
            description = req.body['description'];
        }

        let resultado;



        resultado = await db.query(`SELECT * from apuntes where filename = ${filename}`);

        if (resultado.length != 0) {

            filename = filename.split('.')[0].concat(Math.floor(Math.random() * 20000).toString()).concat('.', filename.split('.')[1])

        }

        resultado = await db.query(`INSERT INTO apuntes 
        (filename, titlename ,description, user, asignatura) VALUES 
        ('${filename}','${titlename}','${description}','${user}','${asignatura}');`)

        await db.end();

        //save file with fs

        return res.status(200).json({
            ok: true,
            message: `Los apuntes se han subido con exito`,
            filename: filename,
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })
    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la subida de los apuntes.`,
            error: e
        })
    }
}




module.exports = { getApuntes, getApuntesDeAsignatura, getApuntesById, descargarApuntes, newApuntes }