const { mysqlConnection } = require('../database/mysqldb');

const getAsignaturas = async(req, res = response) => {

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(`SELECT * FROM asignaturas`)

    await db.end();

    return res.status(200).json({
        message: 'Se han recuperado las asignaturas',
        total: resultado.length,
        grados: resultado
    })

}


const getAsignaturaId = async(req, res = response) => {

    try {

        let idAsig = req.params.id;

        let idUsertoken = req.idToken;

        const db = await mysqlConnection();

        let resultado;

        resultado = await db.query(`SELECT asignaturas.*,
        (SELECT grados.grado_name FROM grados WHERE asignaturas.grado = grados.id_grado) as grado_name,
        (SELECT universities.id_uni FROM universities WHERE universities.id_uni = (SELECT grados.id_uni FROM grados WHERE asignaturas.grado = grados.id_grado)) as uni_id,
        (SELECT universities.name FROM universities WHERE universities.id_uni = (SELECT grados.id_uni FROM grados WHERE asignaturas.grado = grados.id_grado)) as uni_name,
        (SELECT count(*) FROM seguir_a_asignatura WHERE seguir_a_asignatura.asignatura = asignaturas.id_asignatura) as seguidores
        FROM asignaturas WHERE asignaturas.id_asignatura = ${idAsig}`);

        let seguido;

        seguido = await db.query(`Select count(*) as seguido from seguir_a_asignatura WHERE seguir_a_asignatura.user = ${idUsertoken} and seguir_a_asignatura.asignatura = ${idAsig} = 1;`);

        let apuntes;

        apuntes = await db.query(`select DISTINCT apuntes.id_apuntes,apuntes.filename,apuntes.titlename,apuntes.visualizaciones,apuntes.downloads, apuntes.description,apuntes.upload_datetime ,apuntes.user , apuntes.asignatura as asignatura_id,

        (Select count(*) from preguntas_apuntes as p WHERE p.id_apuntes = apuntes.id_apuntes ) as preguntas,
        (SELECT users.username FROM users WHERE users.user_id = apuntes.user) as username,
        (SELECT users.profilePic FROM users WHERE users.user_id = apuntes.user) as profilePic,
        (SELECT count(*) FROM preguntas_apuntes WHERE preguntas_apuntes.id_apuntes = apuntes.id_apuntes) as preguntas 
        FROM apuntes where apuntes.asignatura = ${idAsig};`);

        let preguntas;

        preguntas = await db.query(`SELECT DISTINCT preguntas.*, (SELECT COUNT(*) FROM respuestas where respuestas.pregunta = preguntas.id_pregunta ) as respuestas,

        (SELECT users.username FROM users WHERE users.user_id = preguntas.user_id) as username,
        (SELECT users.profilePic FROM users WHERE users.user_id = preguntas.user_id) as profilePic
        
                FROM preguntas, preguntas_asignaturas WHERE preguntas_asignaturas.id_asignatura = ${idAsig} and preguntas.id_pregunta = preguntas_asignaturas.id_pregunta;`)

        await db.end();

        return res.status(200).json({
            message: 'Se ha recuperado la asignatura',
            asigData: resultado[0],
            preguntas,
            apuntes,
            seguido: seguido[0].seguido
        })
    } catch (err) {
        return res.status(400).json({
            message: 'Ha habido un error',
            error: err
        })
    }

}


const getAsignaturasDelGrado = async(req, res = response) => {

    let id_grado = req.params.id;
    let query = `SELECT * from asignaturas where grado = ${id_grado}`
    if (req.query.curso) {
        query = `SELECT * from asignaturas where grado = ${id_grado} and curso = ${req.query.curso}`;
    }

    const db = await mysqlConnection();

    let resultado;

    resultado = await db.query(query);

    await db.end();

    return res.status(200).json({
        ok: true,
        total: resultado.length,
        resultado: resultado
    })
}

const newAsignatura = async(req, res = response) => {
    try {

        if (req.rolToken != 'admin') {
            return res.status(400).json({
                ok: false,
                message: `Ha habido un problema en la creacion de la asignatura. No tienes permiso.`,

            })
        }

        const db = await mysqlConnection();

        let name = req.body['name'];
        let grado = req.body['grado'];
        let curso = req.body['curso'];
        let description = '';
        if (req.body['description']) {
            description = req.body['description'];
        }

        let resultado;

        resultado = await db.query(`INSERT INTO asignaturas (name,grado,curso,description) VALUES ('${name}','${grado}','${curso}','${description}');`)

        await db.end();

        console.log(resultado);

        return res.status(200).json({
            ok: true,
            message: `Asignatura: '${name}' de la carrera '${grado}' insertada en la base de datos.`,
            filasAfectadas: resultado['affectedRows'],
            insertID: resultado['insertId']
        })
    } catch (e) {
        return res.status(400).json({
            ok: false,
            message: `Ha habido un problema en la creacion de la asignatura.`,
            error: e
        })
    }
}

const followAsig = async(req, res = response) => {

    let user_id = req.idToken;

    let asig2Follow = req.params.id;

    let message = '';

    try {
        const db = await mysqlConnection();

        let seguido;

        seguido = await db.query(`SELECT count(*) from seguir_a_asignatura WHERE seguir_a_asignatura.user = ${user_id} and seguir_a_asignatura.asignatura = ${asig2Follow}`)

        let resultado;

        let seguidoBool = false;

        console.log(seguido[0]['count(*)'])


        if (seguido[0]['count(*)'] === 0) {


            resultado = await db.query(`INSERT INTO seguir_a_asignatura (user, asignatura) VALUES ('${user_id}','${asig2Follow}');`);

            message = `El usuario ${user_id} ahora sigue a la asig ${asig2Follow}`;

            seguidoBool = true;

        } else {

            resultado = await db.query(`DELETE FROM seguir_a_asignatura WHERE seguir_a_asignatura.user = ${user_id} and seguir_a_asignatura.asignatura = ${asig2Follow};`);

            message = `El usuario ${user_id} ha dejado de seguir a la asig ${asig2Follow}`;

            seguidoBool = false;
        }

        await db.end();

        return res.status(200).json({
            ok: true,
            message: message,
            seguidoBool
        });



    } catch (e) {
        return res.status(400).json({
            message: 'Ha habido un error en el seguido de una asignatura',
            error: e
        })
    }

}


module.exports = { getAsignaturas, getAsignaturaId, getAsignaturasDelGrado, newAsignatura, followAsig }