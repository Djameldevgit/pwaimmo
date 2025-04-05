const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middleware/auth')

router.get('/searchpost', auth, postCtrl.searchPost)
router.post('/posts', auth,postCtrl.crearPostPendiente)
router.get('/posts/pendientes', auth,postCtrl.getPostsPendientes)
router.patch('/aprovarpost/:id/aprovado', auth, postCtrl.aprobarPostPendiente);

router.get('/posts',   postCtrl.getPosts)

router.route('/post/:id')
    .patch(auth, postCtrl.updatePost)
    .get(  postCtrl.getPost)
    .delete(auth, postCtrl.deletePost)

router.patch('/post/:id/like', auth, postCtrl.likePost)

router.patch('/post/:id/unlike', auth, postCtrl.unLikePost)

router.get('/user_posts/:id', auth, postCtrl.getUserPosts)

router.get('/post_discover', auth, postCtrl.getPostsDicover)

router.patch('/savePost/:id', auth, postCtrl.savePost)

router.patch('/unSavePost/:id', auth, postCtrl.unSavePost)

router.get('/getSavePosts', auth, postCtrl.getSavePosts)

 

module.exports = router