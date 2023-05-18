const { Router } = require('express');
const { getApuntes, getApuntesDeAsignatura, getApuntesById, descargarApuntes, newApuntes } = require('../controllers/apuntes.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos');
const { validarJWT } = require('../middleware/validarJWT');

const router = Router();

//base route /api/apuntes


/* Tabla 42: Obtener todos los apuntes de la aplicación	
Tabla 43: Obtener todos los apuntes de una asignatura concreta
Tabla 44: Obtener todos los datos de unos apuntes concretos
Tabla 45: Añadir unos apuntes nuevos a la aplicación
 */

router.get('/', [
    validarJWT,
], getApuntes);

router.get('/asignatura/:id', [
    validarJWT,
], getApuntesDeAsignatura);

router.get('/:id', [
    validarJWT,
], getApuntesById);

router.get('/download/:id', [
    validarJWT,
], descargarApuntes);


router.post('/new', [
    validarJWT,
    check('filename', 'El nombre del archivo es necesario').not().isEmpty().trim(),
    check('titlename', 'El titulo del archivo es obligatorio').not().isEmpty().trim(),
    check('file', 'El archivo es obligatorio').not().isEmpty(),
    check('asignatura', 'La asignatura a la que pertenece es obligatoria').not().isEmpty().trim(),
    check('description', '').optional().trim(),
    validarCampos
], newApuntes)

module.exports = router