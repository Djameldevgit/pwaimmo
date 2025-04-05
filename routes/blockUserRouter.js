const router = require('express').Router()
const auth = require("../middleware/auth")

const blockUserCtrl = require('../controllers/blockUserCtrl');



router.patch('/user/:id/block', auth, blockUserCtrl.blockUser)//;authMiddleware,
router.get('/users/block', auth, blockUserCtrl.getBlockedUsers)
router.patch('/user/:id/unblock', auth, blockUserCtrl.unblockUser)
module.exports = router