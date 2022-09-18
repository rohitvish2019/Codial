const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/post_controller');
router.post('/create', passport.checkAuthentication ,postController.addPost);
router.get('/delete/:id', passport.checkAuthentication, postController.deletePost);
router.delete('/delete', passport.checkAuthentication, postController.deletePostViaAjax);
router.get('/like/:id', passport.checkAuthentication, postController.addLikeToPost);
module.exports = router;