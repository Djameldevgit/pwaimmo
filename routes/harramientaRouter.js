const router = require('express').Router()
 
 
const harramientaCtrl = require('../controllers/harramientaCtrl');
const auth = require("../middleware/auth")

router.patch('/user/:id', auth, harramientaCtrl.rien);
router.patch('/user/:id', auth, harramientaCtrl.telefono);
router.patch('/user/:id', auth, harramientaCtrl.camara);
router.patch('/user/:id', auth, harramientaCtrl.telefonocamara);
router.patch('/user/:id', auth, harramientaCtrl.images);
router.patch('/user/:id', auth, harramientaCtrl.efecto1);
router.patch('/user/:id', auth, harramientaCtrl.efecto2);
module.exports = router