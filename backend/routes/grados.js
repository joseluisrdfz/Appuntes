const { Router } = require('express');
const { getGrados, getGradoById, newGrado, getAnunciosDelGrado, getGradosByUniId, newAnuncioDelGrado } = require('../controllers/grados.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

//base route /api/grado

router.get('/', [

], getGrados);

//falta token de autorizacion
router.get('/:id', [

], getGradoById);


router.get('/uni/:id', [

], getGradosByUniId);


router.get('/:id/anuncios', [

], getAnunciosDelGrado);

//Falta comprobar token de autorización admin
router.post('/:id/anuncios/new', [
    check('id', 'La id del grado es obligatoria').not().isEmpty().trim(),
    check('texto_anuncio', 'El texto del anuncio es obligatorio').not().isEmpty().trim(),
    validarCampos
], newAnuncioDelGrado);

//Falta comprobar token de autorización admin
router.post('/new', [
    check('grado_name', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('cursos', 'Debes añadir el numero de cursos del grado').not().isEmpty().trim(),
    check('id_uni', 'Debes asignar el grado a una universidad').not().isEmpty().trim(),
    check('grado_description', '').optional().trim(),
    validarCampos
], newGrado)

module.exports = router