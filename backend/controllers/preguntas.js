const { mysqlConnection } = require('../database/mysqldb');

const getPreguntasAsignatura = async(req, res = response) => {

    const id_asig = req.params.id

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT preguntas.* FROM preguntas,preguntas_asignaturas where preguntas.id_pregunta = preguntas_asignaturas.id_pregunta and id_asignatura = ${id_asig}`)

    await db.end();

    return res.status(200).json({
        message: `Se han recuperado las preguntas de la asignatura ${id_asig}`,
        total: resultado.length,
        preguntas: resultado
    })

}

const getPreguntasApuntes = async(req, res = response) => {

    const id_apuntes = req.params.id

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT preguntas.* FROM preguntas,preguntas_apuntes where preguntas.id_pregunta = preguntas_apuntes.id_pregunta and id_apuntes = ${id_apuntes}`)

    await db.end();

    return res.status(200).json({
        message: `Se han recuperado las preguntas de los apuntes ${id_apuntes}`,
        total: resultado.length,
        preguntas: resultado
    })

}
const getPregunta = async(req, res = response) => {

    const id_preg = req.params.id;

    const db = await mysqlConnection();

    let resultado;

    let resultado2;

    resultado = await db.query(`SELECT * FROM preguntas where id_pregunta = ${id_preg}`);

    resultado2 = await db.query(`SELECT * FROM respuestas where pregunta = ${id_preg}`);

    await db.end();

    return res.status(200).json({
        message: 'Se han recuperado los datos de la pregunta',
        pregunta: resultado,
        respuestas: resultado2
    })

}
const postPreguntaAsignatura = async(req, res = response) => {
    try {

        const db = await mysqlConnection();

        let user_id = req.idToken;
        let id_asig = req.params.id;
        let texto = req.body['texto_pregunta'];

        let resultado;

        resultado = await db.query(`INSERT INTO preguntas 
        (user_id,texto_pregunta) VALUES ('${user_id}','${texto}');`)


        let aux;
        aux = await db.query(`INSERT INTO preguntas_asignaturas (id_pregunta,id_asignatura) VALUES ('${resultado['insertId']}','${id_asig}');`)

        await db.end();

        console.log(resultado);

        return res.status(200).json({
            ok: true,
            message: `Pregunta añadida.`,
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })

    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la creacion de la pregunta.`,
            error: e
        })
    }

}
const postPreguntaApuntes = async(req, res = response) => {
    try {

        const db = await mysqlConnection();

        let user_id = req.idToken;
        let id_apuntes = req.params.id;
        let texto = req.body['texto_pregunta'];

        let resultado;

        resultado = await db.query(`INSERT INTO preguntas 
        (user_id,texto_pregunta) VALUES ('${user_id}','${texto}');`)


        let aux;
        aux = await db.query(`INSERT INTO preguntas_apuntes 
        (id_pregunta,id_apuntes) VALUES ('${resultado['insertId']}','${id_apuntes}');`)

        await db.end();

        console.log(resultado);

        return res.status(200).json({
            ok: true,
            message: `Pregunta añadida.`,
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })

    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la creacion de la pregunta.`,
            error: e
        })
    }

}
const newRespuesta = async(req, res = response) => {
    try {

        const db = await mysqlConnection();

        let user_id = req.idToken;
        let id_preg = req.params.id;
        let texto = req.body['texto_respuesta'];

        let resultado;

        resultado = await db.query(`INSERT INTO respuestas
        (user,texto_respuesta, pregunta) VALUES ('${user_id}','${texto}', '${id_preg}');`)

        await db.end();

        return res.status(200).json({
            ok: true,
            message: `Respuesta añadida.`,
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })

    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la creacion de la respuesta.`,
            error: e
        })
    }


}
const deletePregunta = async(req, res = response) => {

    try {

        let resultado;

        const db = await mysqlConnection();

        let user_id = req.idToken;
        let id_preg = req.params.id;


        resultado = await db.query(`SELECT * from preguntas where id_pregunta = ${id_preg} and user_id = ${user_id}`);

        if (resultado.length > 0) {
            resultado = await db.query(`DELETE from preguntas where id_pregunta = ${id_preg}`);
            await db.end();

            return res.status(200).json({
                ok: true,
                message: `Pregunta eliminada.`,

            })
        } else {
            await db.end();

            return res.status(200).json({
                ok: true,
                message: `Pregunta no eliminada. No pertenece a este user.`

            })
        }




    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la eliminacion de la pregunta.`,
            error: e
        })
    }

}
const deleteRespuesta = async(req, res = response) => {
    try {

        let resultado;

        const db = await mysqlConnection();

        let user_id = req.idToken;
        let id_res = req.params.id;


        resultado = await db.query(`SELECT * from respuestas where id_respuesta = ${id_res} and user = ${user_id}`);

        if (resultado.length > 0) {
            resultado = await db.query(`DELETE from respuestas where id_respuesta = ${id_res}`);
            await db.end();

            return res.status(200).json({
                ok: true,
                message: `respuesta eliminada.`

            })
        } else {
            await db.end();

            return res.status(200).json({
                ok: true,
                message: `respuesta no eliminada. No pertenece a este user.`

            })
        }

    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la eliminacion de la respuesta.`,
            error: e
        })
    }

}







module.exports = { getPreguntasAsignatura, getPreguntasApuntes, getPregunta, postPreguntaAsignatura, postPreguntaApuntes, newRespuesta, deletePregunta, deleteRespuesta }