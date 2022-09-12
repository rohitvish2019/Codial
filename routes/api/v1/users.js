const express = require('express');
const router = express.Router();
const usersController = require('../../../controllers/api/v1/users_api');
router.get('/get-session', usersController.createSession);
module.exports = router;