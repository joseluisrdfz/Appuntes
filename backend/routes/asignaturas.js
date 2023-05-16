const { Router } = require('express');
const { getAsignaturas, getAsignaturasDelGrado, newAsignatura } = require('../controllers/asignaturas.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

//base route /api/asignaturas

router.get('/', [

], getAsignaturas);

router.get('/grado/:id', [

], getAsignaturasDelGrado);

//Falta comprobar token de autorización admin
router.post('/new', [
    check('grado_name', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('cursos', 'Debes añadir el numero de cursos del grado').not().isEmpty().trim(),
    check('id_uni', 'Debes asignar el grado a una universidad').not().isEmpty().trim(),
    check('grado_description', '').optional().trim(),
    validarCampos
], newAsignatura)

module.exports = router