const { Router } = require('express');
const { getUniversidades, newUniversidad } = require('../controllers/universidades');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

router.get('/', [

], getUniversidades);

router.post('/new', [

], newUniversidad)

module.exports = router