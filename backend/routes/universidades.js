const { Router } = require('express');
const { getUniversidades, newUniversidad } = require('../controllers/universidades');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

router.get('/', [

], getUniversidades);

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty().trim(),
    check('address', 'Debes poner la direccion de la universidad').not().isEmpty().trim(),
    validarCampos
], newUniversidad)

module.exports = router