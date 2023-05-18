const { Router } = require('express');
const { getPreguntasAsignatura, getPreguntasApuntes, getPregunta, postPreguntaAsignatura, postPreguntaApuntes, newRespuesta, deletePregunta, deleteRespuesta } = require('../controllers/preguntas.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();

//base route /api/preguntas


/* Tabla 55: Obtener preguntas de una asignatura	42
Tabla 56: Obtener preguntas de unos apuntes	42
Tabla 57: Añadir pregunta a una asignatura	42
Tabla 58: Añadir pregunta a uno apuntes	43
Tabla 59: Obtener respuestas de una pregunta	43
Tabla 60: Añadir una respuesta a una pregunta	44
Tabla 61: Eliminar pregunta	44
Tabla 62: Eliminar respuesta	44

 */

router.get('/asignatura/:id', [
    validarJWT,
], getPreguntasAsignatura);

router.get('/apuntes/:id', [
    validarJWT,
], getPreguntasApuntes);

//En esta peticion se devuelven todos los datos de la pregunta asi como las respuestas
router.get('/:id/respuestas', [
    validarJWT,
], getPregunta);

router.post('/asignatura/:id/new', [
    validarJWT,
    check('texto_pregunta', 'El texto de la pregunta es obligatorio').not().isEmpty().trim(),
    validarCampos
], postPreguntaAsignatura);

router.post('/apuntes/:id/new', [
    validarJWT,
    check('texto_pregunta', 'El texto de la pregunta es obligatorio').not().isEmpty().trim(),
    validarCampos
], postPreguntaApuntes);

router.post('/:id/respuestas/new', [
    validarJWT,
    check('texto_respuesta', 'El texto de la respuesta es obligatorio').not().isEmpty().trim(),
    validarCampos
], newRespuesta)

router.delete('/:id', [
    validarJWT,
], deletePregunta);

router.delete('/respuestas/:id', [
    validarJWT,
], deleteRespuesta);

module.exports = router