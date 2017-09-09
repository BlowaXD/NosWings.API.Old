'use strict';
const router = require('express').Router();
const auth_middleware = require('../../middlewares/authMiddleware.js');

router.get('/token', require('./token.js'));

router.use(auth_middleware);
router.get('/get_info', require('./get_info.js'));

module.exports = router;
