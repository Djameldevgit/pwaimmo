const router = require('express').Router();
const auth = require('../middleware/auth');
const notifyCtrl = require('../controllers/notifyCtrl');
 
// Obtener clave pública VAPID
// Cambia de GET a POST para coincidir con el frontend
router.get('/vapid-public-key', auth, notifyCtrl.getVapidPublicKey);

// Guardar suscripción push
router.post('/save-subscription', auth, notifyCtrl.savePushSubscription);

module.exports = router;