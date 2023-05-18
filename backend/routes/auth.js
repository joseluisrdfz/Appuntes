const { Router } = require('express');
const { login, renovarToken } = require('../controllers/auth.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');

const router = Router();

//base route /api/auth


/* Tabla 53: Login	41
Tabla 54: Renovar Token
 */

router.post('/login', [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty().trim(),
    check('password', 'La contraseña es obligatoria').not().isEmpty().trim(),
    validarCampos
], login);

router.get('/renovar/', [

], renovarToken);

module.exports = router