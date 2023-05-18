const { Router } = require('express');
const { register, getUserInfo, updateUserData, updateUserPassword, deleteUser, followUser, followAsignatura } = require('../controllers/users.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT.js');

const router = Router();

//base route /api/apuntes


/* Tabla 46: Registro de un usuario	
Tabla 47: Obtener datos de un usuario
Tabla 48: Actualizar usuario
Tabla 49: Actualizar contraseña de usuario
Tabla 50: Dar de baja a usuario
Tabla 51: Seguir a otro usuario
Tabla 52: Seguir a una asignatura

 */

router.post('/register', [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty().trim(),
    check('name', 'El nombre de la persona es obligatorio').not().isEmpty().trim(),
    check('surname', 'Los apellidos son obligatorios').not().isEmpty().trim(),
    check('email', 'El email es obligatorio y debe ser un email').not().isEmpty().isEmail().trim(),
    check('password', 'La contraseña es obligatoria').not().isEmpty().trim(),
    check('curso', 'El curso es obligatorio').not().isEmpty().trim(),
    check('uni', 'La universidad es obligatoria').not().isEmpty().trim(),
    check('grado', 'El grado es obligatorio').not().isEmpty().trim(),
    validarCampos
], register);

router.get('/:id', [
    validarJWT,
], getUserInfo);

router.put('/updateData', [
    validarJWT,
], updateUserData);

router.put('/updatePassword', [
    validarJWT,
    check('oldPassword', 'La contraseña antigua es obligatoria').not().isEmpty().trim(),
    check('newPassword', 'La contraseña nueva es obligatoria').not().isEmpty().trim(),
    validarCampos
], updateUserPassword);

router.delete('/deleteUser', [
    validarJWT,
], deleteUser);

router.post('/followUser/:id', [
    validarJWT,
], followUser);

router.post('/followAsignatura/:id', [
    validarJWT,
], followAsignatura);

module.exports = router