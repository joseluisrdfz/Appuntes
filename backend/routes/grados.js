const { Router } = require('express');
const { getGrados, getGradoById, newGrado, getAnunciosDelGrado } = require('../controllers/grados.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

router.get('/', [

], getGrados);


router.get('/:id', [

], getGradoById);


router.get('/:id/anuncios', [

], getAnunciosDelGrado);

router.post('/new', [
    check('grado_name', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('cursos', 'Debes poner la direccion de la universidad').not().isEmpty().trim(),
    check('id_uni', 'Debes asignar el grado en una universidad').not().isEmpty().trim(),
    check('grado_description', 'Debes poner una descripción del grado').optional().trim(),
    validarCampos
], newGrado)

module.exports = router