const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require('../controllers/userCtrl');
 

router.get('/users/counttotal', auth, userCtrl.getUsersCount); // Para el total de usuarios
router.get('/users/active-last-24h', auth, userCtrl.getActiveUsersLast24h); // Para usuarios activos en las últimas 24 horas
router.get('/users/active-last-3h', auth, userCtrl.getActiveUsersLast3h); // Para usuarios activos en las últimas 3 horas
 
router.get('/users',auth,   userCtrl.getUsers)
 
router.get('/search', auth, userCtrl.searchUser)

router.get('/user/:id', auth, userCtrl.getUser)
router.patch('/user', auth, userCtrl.updateUser)
 
router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)
   
router.patch('/user/:id/follow', auth, userCtrl.follow)
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)


router.patch('/user/:id/roleusernoidantificado', auth, userCtrl.UserRoleNoIdentificado);
router.patch('/user/:id/roleuser', auth, userCtrl.assignUserRole);
router.patch('/user/:id/rolesuperuser', auth, userCtrl.assignSuperUserRole);
router.patch('/user/:id/rolemoderador', auth, userCtrl.assignModeratorRole);
router.patch('/user/:id/roleadmin', auth, userCtrl.assignAdminRole);
 
  
module.exports = router