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




module.exports = { getAsignaturas, getAsignaturasDelGrado, newAsignatura }