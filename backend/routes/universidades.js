const { Router } = require('express');
const { getUniversidades, newUniversidad, getUniversidad } = require('../controllers/universidades');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

// base route api/uni

router.get('/', [

], getUniversidades);

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('address', 'Debes poner la direccion de la universidad').not().isEmpty().trim(),
    validarCampos
], newUniversidad)

router.get('/:id', [

], getUniversidad)


module.exports = router