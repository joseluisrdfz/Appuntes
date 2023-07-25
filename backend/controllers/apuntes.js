const { mysqlConnection } = require('../database/mysqldb');
const fs = require('fs')

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

    try {
        let id_apuntes = req.params.id;

        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`SELECT apuntes.*, (SELECT asignaturas.name FROM asignaturas WHERE asignaturas.id_asignatura = apuntes.asignatura) as asignatura_name,
    (SELECT grados.grado_name FROM grados WHERE grados.id_grado =
     (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = apuntes.asignatura)) as grado,
     (SELECT grados.id_grado FROM grados WHERE grados.id_grado =
        (SELECT asignaturas.grado FROM asignaturas WHERE asignaturas.id_asignatura = apuntes.asignatura)) as gradoId,
        (SELECT users.username FROM users WHERE users.user_id = apuntes.user) as user_username,
    (SELECT users.profilePic FROM users WHERE users.user_id = apuntes.user) as user_profilePic
    FROM apuntes WHERE id_apuntes =  ${id_apuntes}`);

        let views = resultado[0]['visualizaciones'] + 1;

        resultado[0]['visualizaciones'] = resultado[0]['visualizaciones'] + 1;

        let resultado2;

        resultado2 = await db.query(`UPDATE apuntes set visualizaciones = ${views}  where id_apuntes = ${id_apuntes}`);

        let resultado3;

        resultado3 = await db.query(`SELECT preguntas.*, (SELECT count(*) from respuestas where preguntas.id_pregunta = respuestas.pregunta) as respuestas,
    (SELECT users.username FROM users WHERE users.user_id = preguntas.user_id) as user_username,
    (SELECT users.profilePic FROM users WHERE users.user_id = preguntas.user_id) as user_profilePic
    
    FROM preguntas,preguntas_apuntes WHERE preguntas.id_pregunta = preguntas_apuntes.id_pregunta AND preguntas_apuntes.id_apuntes = ${id_apuntes};`);

        await db.end();

        return res.status(200).json({
            ok: true,
            message: 'apuntes recuperados',
            apuntes: resultado[0],
            preguntas: resultado3
        })
    } catch (error) {
        return res.status(400).json({
            ok: false,
            message: 'Algo ha fallado',
            error: error
        })
    }
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

    //res.headers.contentType

    return res.status(200).json({
        ok: true,
        filasAfectadas: resultado['affectedRows'],
    })
}

const newApuntes = async(req, res = response) => {
    try {
        const db = await mysqlConnection();

        //console.log(req)

        let filename = req.body['filename'];
        let titlename = req.body['titlename'];
        let asignatura = req.body['asignatura'];
        let user = req.idToken;

        let description = '';
        if (req.body['description']) {
            description = req.body['description'];
        }

        let resultado;



        resultado = await db.query(`SELECT * from apuntes where filename = '${filename}'`);

        if (resultado.length != 0) {

            filename = filename.split('.')[0].concat(Math.floor(Math.random() * 20000).toString()).concat('.', filename.split('.')[1])

        }


        const nombrePartido = filename.split('.');
        const extension = nombrePartido[nombrePartido.length - 1];

        //console.log(req.body)

        encoding = 'base64';
        archivo = req.body['file'].replace(/^.+?(;base64),/, '');
        if (extension != 'pdf') {
            return res.status(406).json({
                ok: false,
                msg: `El tipo de archivo '${extension}' no está permitido`
            });
        }
        patharchivo = process.cwd().split('backend')[0] + 'frontend/src/assets/uploads/apuntes/' + filename;

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
        console.log(e)
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la subida de los apuntes.`,
            error: e
        })
    }
}




module.exports = { getApuntes, getApuntesDeAsignatura, getApuntesById, descargarApuntes, newApuntes }