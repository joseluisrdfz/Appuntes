const { Router } = require('express');
const { getAsignaturas, getAsignaturasDelGrado, newAsignatura } = require('../controllers/asignaturas.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT.js');

const router = Router();

//base route /api/asignaturas

router.get('/', [

], getAsignaturas);

router.get('/grado/:id', [

], getAsignaturasDelGrado);

//Falta comprobar token de autorización admin
router.post('/new', [
    validarJWT,
    check('name', 'El nombre de la asignatura es obligatorio').not().isEmpty().trim(),
    check('grado', 'Debes indicar a que grado pertenece esta asignatura').not().isEmpty().trim(),
    check('curso', 'Debes asignar el curso al que pertenece esta asignatura').not().isEmpty().trim(),
    check('description', '').optional().trim(),
    validarCampos
], newAsignatura)

module.exports = router