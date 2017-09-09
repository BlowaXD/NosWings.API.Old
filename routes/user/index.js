'use strict';
const express = require('express');
const auth_middleware = require('../../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/token', require('./token.js'));

router.use(auth_middleware);
router.get('/get_info', require('./get_info.js'));

module.exports = router;
