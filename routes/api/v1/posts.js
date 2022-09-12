const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsController = require('../../../controllers/api/v1/posts');
console.log('in last route');
router.get('/get', postsController.getPosts);
router.delete('/delete/:id', passport.authenticate('jwt',{session: false}), postsController.deletePost);
module.exports = router;